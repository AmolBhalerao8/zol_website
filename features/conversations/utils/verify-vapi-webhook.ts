import { timingSafeEqual } from "crypto";

function safeCompare(expected: string, received: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export type WebhookVerificationResult =
  | { valid: true; mode: "secret" | "development" }
  | { valid: false; reason: "missing_secret" | "invalid_secret" };

export function verifyVapiWebhookSecret(headers: Headers): WebhookVerificationResult {
  const configuredSecret = process.env.VAPI_WEBHOOK_SECRET?.trim();

  if (!configuredSecret) {
    if (process.env.NODE_ENV === "production") {
      console.warn("VAPI_WEBHOOK_SECRET is not configured in production.");
    } else {
      console.warn("VAPI_WEBHOOK_SECRET is not configured. Allowing webhook in development.");
    }

    return { valid: true, mode: "development" };
  }

  const receivedSecret =
    headers.get("x-vapi-secret") ??
    headers.get("x-vapi-signature") ??
    headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";

  if (!receivedSecret) {
    return { valid: false, reason: "missing_secret" };
  }

  if (!safeCompare(configuredSecret, receivedSecret)) {
    return { valid: false, reason: "invalid_secret" };
  }

  return { valid: true, mode: "secret" };
}
