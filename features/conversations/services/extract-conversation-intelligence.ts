import type { AIEmployeeSettings, Workspace } from "@prisma/client";
import type { ActionItemPriority, Urgency } from "@prisma/client";

export type ExtractedActionItem = {
  title: string;
  description: string;
  priority: ActionItemPriority;
};

export type ConversationIntelligence = {
  customerName: string | null;
  customerPhone: string | null;
  summary: string;
  urgency: Urgency;
  keyDetails: string[];
  customerIntent: string | null;
  recommendedActions: ExtractedActionItem[];
};

const URGENCY_VALUES = new Set(["LOW", "MEDIUM", "HIGH", "URGENT", "UNKNOWN"]);
const PRIORITY_VALUES = new Set(["LOW", "MEDIUM", "HIGH", "URGENT"]);

function buildBusinessTypeGuidance(businessType: string): string {
  const normalized = businessType.toLowerCase();

  if (
    normalized.includes("auto") ||
    normalized.includes("repair") ||
    normalized.includes("mechanic") ||
    normalized.includes("service shop")
  ) {
    return `Focus on vehicle details, reported issues, appointment requests, service urgency, and repair concerns for this ${businessType} business.`;
  }

  if (
    normalized.includes("apparel") ||
    normalized.includes("retail") ||
    normalized.includes("shopify") ||
    normalized.includes("fashion") ||
    normalized.includes("store")
  ) {
    return `Focus on order status, product availability, sizing, returns/exchanges, delivery concerns, and purchase intent for this ${businessType} business.`;
  }

  return `Focus on customer intent, the core request or issue, urgency, and whether follow-up is needed for this ${businessType} business.`;
}

function buildExtractionPrompt(input: {
  workspace: Workspace;
  aiSettings: AIEmployeeSettings | null;
  transcript: string;
}): { system: string; user: string } {
  const businessContext =
    input.aiSettings?.businessContext?.trim() ||
    `${input.workspace.name} is a ${input.workspace.businessType} business.`;

  const system = `You extract structured operational intelligence from customer phone conversations for ZOL, a business-aware AI employee platform.

Return ONLY valid JSON with this exact shape:
{
  "customerName": string | null,
  "summary": string,
  "urgency": "LOW" | "MEDIUM" | "HIGH" | "URGENT" | "UNKNOWN",
  "keyDetails": string[],
  "customerIntent": string | null,
  "recommendedActions": [
    {
      "title": string,
      "description": string,
      "priority": "LOW" | "MEDIUM" | "HIGH" | "URGENT"
    }
  ]
}

Rules:
- Write concise, operational summaries a business owner can scan quickly.
- recommendedActions should be concrete follow-ups, not generic advice.
- Use urgency based on customer tone, deadlines, safety, or revenue impact.
- If information is missing, use null or UNKNOWN rather than guessing.
- Do not extract phone numbers; caller phone is captured separately from the telephony provider.
- Do not mention AI, providers, or internal systems.`;

  const user = `Business name: ${input.workspace.name}
Business type: ${input.workspace.businessType}
Business context: ${businessContext}
${input.aiSettings ? `AI employee tone: ${input.aiSettings.communicationTone}` : ""}

Extraction guidance:
${buildBusinessTypeGuidance(input.workspace.businessType)}

Transcript:
${input.transcript}`;

  return { system, user };
}

function normalizeUrgency(value: unknown): Urgency {
  if (typeof value === "string" && URGENCY_VALUES.has(value)) {
    return value as Urgency;
  }

  return "UNKNOWN";
}

function normalizePriority(value: unknown): ActionItemPriority {
  if (typeof value === "string" && PRIORITY_VALUES.has(value)) {
    return value as ActionItemPriority;
  }

  return "MEDIUM";
}

function parseModelJson(content: string): Partial<ConversationIntelligence> | null {
  try {
    return JSON.parse(content) as Partial<ConversationIntelligence>;
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]) as Partial<ConversationIntelligence>;
    } catch {
      return null;
    }
  }
}

function buildFallbackIntelligence(
  transcript: string,
  customerPhone: string | null,
): ConversationIntelligence {
  const cleaned = transcript.replace(/\s+/g, " ").trim();
  const preview = cleaned.length > 280 ? `${cleaned.slice(0, 277)}...` : cleaned;

  return {
    customerName: null,
    customerPhone: customerPhone?.trim() || null,
    summary: preview || "Customer call completed. Review the transcript for details.",
    urgency: "UNKNOWN",
    keyDetails: preview ? [preview] : [],
    customerIntent: null,
    recommendedActions: [],
  };
}

async function callOpenAI(system: string, user: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `OpenAI request failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  return data.choices?.[0]?.message?.content ?? null;
}

export async function extractConversationIntelligence(input: {
  transcript: string | null;
  workspace: Workspace;
  aiSettings: AIEmployeeSettings | null;
  fallbackCustomerPhone?: string | null;
}): Promise<ConversationIntelligence> {
  const transcript = input.transcript?.trim();

  if (!transcript) {
    return buildFallbackIntelligence("", input.fallbackCustomerPhone ?? null);
  }

  try {
    const prompts = buildExtractionPrompt({
      workspace: input.workspace,
      aiSettings: input.aiSettings,
      transcript,
    });

    const modelContent = await callOpenAI(prompts.system, prompts.user);

    if (!modelContent) {
      return buildFallbackIntelligence(transcript, input.fallbackCustomerPhone ?? null);
    }

    const parsed = parseModelJson(modelContent);

    if (!parsed) {
      return buildFallbackIntelligence(transcript, input.fallbackCustomerPhone ?? null);
    }

    return {
      customerName:
        typeof parsed.customerName === "string" ? parsed.customerName.trim() || null : null,
      customerPhone: input.fallbackCustomerPhone ?? null,
      summary:
        typeof parsed.summary === "string" && parsed.summary.trim()
          ? parsed.summary.trim()
          : buildFallbackIntelligence(transcript, input.fallbackCustomerPhone ?? null).summary,
      urgency: normalizeUrgency(parsed.urgency),
      keyDetails: Array.isArray(parsed.keyDetails)
        ? parsed.keyDetails
            .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
            .map((item) => item.trim())
        : [],
      customerIntent:
        typeof parsed.customerIntent === "string"
          ? parsed.customerIntent.trim() || null
          : null,
      recommendedActions: Array.isArray(parsed.recommendedActions)
        ? parsed.recommendedActions
            .filter(
              (item): item is ExtractedActionItem =>
                Boolean(item) &&
                typeof item === "object" &&
                typeof (item as ExtractedActionItem).title === "string" &&
                (item as ExtractedActionItem).title.trim().length > 0,
            )
            .map((item) => ({
              title: item.title.trim(),
              description:
                typeof item.description === "string" ? item.description.trim() : "",
              priority: normalizePriority(item.priority),
            }))
        : [],
    };
  } catch (error) {
    console.error("Failed to extract conversation intelligence:", error);
    return buildFallbackIntelligence(transcript, input.fallbackCustomerPhone ?? null);
  }
}
