const VAPI_BASE_URL = "https://api.vapi.ai";

export class VapiServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "VapiServiceError";
    this.status = status;
  }
}

export type VapiAssistant = {
  id: string;
  name?: string;
};

export type VapiPhoneNumber = {
  id: string;
  number?: string;
};

export type AssignPhoneNumberInput = {
  assistantId: string;
  name: string;
  areaCode: string;
};

export type CreateVapiAssistantInput = {
  name: string;
  firstMessage: string;
  systemPrompt: string;
  voice: {
    provider: string;
    voiceId: string;
    stability?: number;
    similarityBoost?: number;
  };
};

export type UpdateVapiAssistantInput = {
  name?: string;
  firstMessage?: string;
  systemPrompt?: string;
  voice?: CreateVapiAssistantInput["voice"];
};

function getVapiApiKey(): string | undefined {
  return process.env.VAPI_PRIVATE_KEY || process.env.VAPI_API_KEY;
}

export function hasVapiConfigured(): boolean {
  return Boolean(getVapiApiKey());
}

async function vapiRequest<T>(path: string, init: RequestInit): Promise<T> {
  const apiKey = getVapiApiKey();

  if (!apiKey) {
    throw new VapiServiceError("Vapi is not configured.", 503);
  }

  const response = await fetch(`${VAPI_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new VapiServiceError(
      body || `Vapi request failed with status ${response.status}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

function buildAssistantPayload(input: CreateVapiAssistantInput | UpdateVapiAssistantInput) {
  const payload: Record<string, unknown> = {};

  if ("name" in input && input.name) {
    payload.name = input.name;
  }

  if ("firstMessage" in input && input.firstMessage) {
    payload.firstMessage = input.firstMessage;
  }

  if ("systemPrompt" in input && input.systemPrompt) {
    payload.model = {
      provider: "openai",
      model: "gpt-4o",
      messages: [{ role: "system", content: input.systemPrompt }],
    };
  }

  if ("voice" in input && input.voice) {
    payload.voice = input.voice;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (appUrl) {
    const server: Record<string, string> = {
      url: `${appUrl.replace(/\/$/, "")}/api/webhooks/vapi`,
    };

    const webhookSecret = process.env.VAPI_WEBHOOK_SECRET?.trim();

    if (webhookSecret) {
      server.secret = webhookSecret;
    }

    payload.server = server;
  }

  return payload;
}

export async function createVapiAssistant(
  input: CreateVapiAssistantInput,
): Promise<VapiAssistant> {
  return vapiRequest<VapiAssistant>("/assistant", {
    method: "POST",
    body: JSON.stringify(buildAssistantPayload(input)),
  });
}

export async function updateVapiAssistant(
  assistantId: string,
  input: UpdateVapiAssistantInput,
): Promise<VapiAssistant> {
  return vapiRequest<VapiAssistant>(`/assistant/${assistantId}`, {
    method: "PATCH",
    body: JSON.stringify(buildAssistantPayload(input)),
  });
}

export async function assignVapiPhoneNumber(
  input: AssignPhoneNumberInput,
): Promise<VapiPhoneNumber> {
  return vapiRequest<VapiPhoneNumber>("/phone-number", {
    method: "POST",
    body: JSON.stringify({
      provider: "vapi",
      name: input.name,
      assistantId: input.assistantId,
      numberDesiredAreaCode: input.areaCode,
    }),
  });
}

export async function createVapiPhoneNumberProbe(areaCode: string): Promise<VapiPhoneNumber> {
  return vapiRequest<VapiPhoneNumber>("/phone-number", {
    method: "POST",
    body: JSON.stringify({
      provider: "vapi",
      name: `ZOL area code check ${areaCode}`,
      numberDesiredAreaCode: areaCode,
    }),
  });
}

export async function deleteVapiPhoneNumber(phoneNumberId: string): Promise<void> {
  await vapiRequest(`/phone-number/${phoneNumberId}`, {
    method: "DELETE",
  });
}
