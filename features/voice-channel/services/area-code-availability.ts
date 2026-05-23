import {
  parseVapiPhoneProvisionError,
  type ParsedVapiPhoneError,
} from "@/features/voice-channel/utils/parse-vapi-phone-error";

import {
  createVapiPhoneNumberProbe,
  deleteVapiPhoneNumber,
  VapiServiceError,
} from "./vapi";

export type AreaCodeAvailabilityResult = {
  available: boolean;
  message: string;
  suggestedAreaCodes: string[];
};

export async function probeAreaCodeAvailability(
  areaCode: string,
): Promise<AreaCodeAvailabilityResult> {
  try {
    const probeNumber = await createVapiPhoneNumberProbe(areaCode);

    try {
      await deleteVapiPhoneNumber(probeNumber.id);
    } catch (cleanupError) {
      console.error("Failed to clean up area code probe number:", cleanupError);
    }

    return {
      available: true,
      message: `A phone number is available with area code ${areaCode}. Please proceed to activate below.`,
      suggestedAreaCodes: [],
    };
  } catch (error) {
    if (error instanceof VapiServiceError) {
      const parsed = parseVapiPhoneProvisionError(error.message);
      return toAvailabilityResult(parsed);
    }

    throw error;
  }
}

function toAvailabilityResult(parsed: ParsedVapiPhoneError): AreaCodeAvailabilityResult {
  return {
    available: false,
    message: parsed.userMessage,
    suggestedAreaCodes: parsed.suggestedAreaCodes,
  };
}
