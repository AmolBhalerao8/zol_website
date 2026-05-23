export type ParsedVapiPhoneError = {
  isAvailabilityError: boolean;
  userMessage: string;
  suggestedAreaCodes: string[];
};

function extractMessage(body: string): string {
  try {
    const parsed = JSON.parse(body) as { message?: string | string[] };

    if (Array.isArray(parsed.message)) {
      return parsed.message.join(" ");
    }

    if (typeof parsed.message === "string") {
      return parsed.message;
    }
  } catch {
    return body;
  }

  return body;
}

export function parseVapiPhoneProvisionError(errorBody: string): ParsedVapiPhoneError {
  const message = extractMessage(errorBody);
  const isAvailabilityError = /not available/i.test(message);

  const hintMatch = message.match(/Try one of ([0-9,\s]+)/i);
  const suggestedAreaCodes = hintMatch
    ? hintMatch[1]
        .split(",")
        .map((code) => code.trim())
        .filter((code) => /^\d{3}$/.test(code))
    : [];

  if (isAvailabilityError) {
    const suggestionText =
      suggestedAreaCodes.length > 0
        ? ` Try ${suggestedAreaCodes.join(", ")} instead.`
        : " Please try a different area code.";

    return {
      isAvailabilityError: true,
      userMessage: `This area code isn't available right now.${suggestionText}`,
      suggestedAreaCodes,
    };
  }

  return {
    isAvailabilityError: false,
    userMessage: message || "Unable to assign a business communication number.",
    suggestedAreaCodes: [],
  };
}

export function extractSuggestedAreaCodesFromError(errorMessage?: string): string[] {
  if (!errorMessage) {
    return [];
  }

  const match = errorMessage.match(/Try\s+([0-9,\s]+)\s+instead/i);
  if (!match?.[1]) {
    return [];
  }

  return match[1]
    .split(",")
    .map((code) => code.trim())
    .filter((code) => /^\d{3}$/.test(code));
}
