const PLACEHOLDER_PHONES = new Set([
  "unknown",
  "n/a",
  "na",
  "none",
  "null",
  "undefined",
  "not provided",
  "not available",
  "unavailable",
]);

export function normalizeCustomerPhone(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed || PLACEHOLDER_PHONES.has(trimmed.toLowerCase())) {
    return null;
  }

  return trimmed;
}
