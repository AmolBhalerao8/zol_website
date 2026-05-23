const COMPLETED_CALL_EVENTS = new Set([
  "end-of-call-report",
  "call-ended",
  "call.end",
  "call.completed",
]);

export function isCompletedCallEvent(eventType: string | undefined): boolean {
  if (!eventType) {
    return false;
  }

  const normalized = eventType.toLowerCase();

  if (COMPLETED_CALL_EVENTS.has(normalized)) {
    return true;
  }

  return normalized.includes("end-of-call") || normalized.includes("call-end");
}

export function shouldIgnoreWebhookEvent(eventType: string | undefined): boolean {
  if (!eventType) {
    return false;
  }

  return !isCompletedCallEvent(eventType);
}
