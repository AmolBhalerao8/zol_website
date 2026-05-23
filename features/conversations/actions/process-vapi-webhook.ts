"use server";

import type { Prisma } from "@prisma/client";

import { processVapiWebhookEvent } from "@/features/conversations/services/conversation-processing";
import { parseVapiWebhookPayload } from "@/features/conversations/utils/parse-vapi-webhook";
import { verifyVapiWebhookSecret } from "@/features/conversations/utils/verify-vapi-webhook";

export type ProcessVapiWebhookActionResult =
  | { ok: true; status: number; body: Record<string, unknown> }
  | { ok: false; status: number; body: Record<string, unknown> };

export async function processVapiWebhook(
  rawBody: string,
  headers: Headers,
): Promise<ProcessVapiWebhookActionResult> {
  const verification = verifyVapiWebhookSecret(headers);

  if (!verification.valid) {
    return {
      ok: false,
      status: 401,
      body: { error: "Invalid webhook secret" },
    };
  }

  let payload: unknown;

  try {
    payload = JSON.parse(rawBody) as unknown;
  } catch {
    return {
      ok: false,
      status: 400,
      body: { error: "Invalid JSON payload" },
    };
  }

  const parsed = parseVapiWebhookPayload(payload);

  if (!parsed) {
    return {
      ok: false,
      status: 400,
      body: { error: "Malformed webhook payload" },
    };
  }

  try {
    const result = await processVapiWebhookEvent(parsed, payload as Prisma.InputJsonValue);

    if (result.status === "ignored") {
      return {
        ok: true,
        status: 200,
        body: { received: true, ignored: true, reason: result.reason },
      };
    }

    if (result.status === "invalid" || result.status === "not_found") {
      console.warn("Vapi webhook not processed:", result.reason, {
        eventType: parsed.eventType,
        callId: parsed.callId,
        assistantId: parsed.assistantId,
        phoneNumberId: parsed.phoneNumberId,
      });

      return {
        ok: true,
        status: 200,
        body: { received: true, processed: false, reason: result.reason },
      };
    }

    return {
      ok: true,
      status: 200,
      body: {
        received: true,
        processed: true,
        conversationId: result.conversationId,
        vapiCallId: result.vapiCallId,
      },
    };
  } catch (error) {
    console.error("Failed to process Vapi webhook:", error);

    return {
      ok: false,
      status: 500,
      body: { error: "Failed to process webhook" },
    };
  }
}
