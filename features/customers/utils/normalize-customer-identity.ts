export function normalizeEmailForMatch(email: string | null | undefined): string | null {
  if (typeof email !== "string") {
    return null;
  }

  const trimmed = email.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}

export function normalizePhoneForMatch(phone: string | null | undefined): string | null {
  if (typeof phone !== "string") {
    return null;
  }

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return digits;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.slice(1);
  }

  return digits.length >= 7 ? digits : null;
}

export function formatPhoneForStorage(phone: string | null | undefined): string | null {
  if (typeof phone !== "string") {
    return null;
  }

  const trimmed = phone.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function getCustomerDisplayName(input: {
  name?: string | null;
  primaryPhone?: string | null;
  primaryEmail?: string | null;
}): string {
  return (
    input.name?.trim() ||
    input.primaryPhone?.trim() ||
    input.primaryEmail?.trim() ||
    "Unknown customer"
  );
}
