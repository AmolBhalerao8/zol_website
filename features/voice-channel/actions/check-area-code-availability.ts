"use server";

import { auth } from "@clerk/nextjs/server";

import { probeAreaCodeAvailability } from "@/features/voice-channel/services/area-code-availability";
import { hasVapiConfigured, VapiServiceError } from "@/features/voice-channel/services/vapi";
import { isUsAreaCodeFormat } from "@/features/voice-channel/utils/area-code-options";

export type CheckAreaCodeAvailabilityState = {
  checkedAreaCode?: string;
  available?: boolean;
  message?: string;
  suggestedAreaCodes?: string[];
  error?: string;
};

export async function checkAreaCodeAvailability(
  _prevState: CheckAreaCodeAvailabilityState,
  formData: FormData,
): Promise<CheckAreaCodeAvailabilityState> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Sign in to verify area code availability." };
  }

  if (!hasVapiConfigured()) {
    return { error: "Area code verification is temporarily unavailable." };
  }

  const areaCode = String(formData.get("areaCode") ?? "").trim();

  if (!isUsAreaCodeFormat(areaCode)) {
    return { error: "Enter a valid 3-digit US area code." };
  }

  try {
    const result = await probeAreaCodeAvailability(areaCode);

    return {
      checkedAreaCode: areaCode,
      available: result.available,
      message: result.message,
      suggestedAreaCodes: result.suggestedAreaCodes,
    };
  } catch (error) {
    console.error("Failed to verify area code availability:", error);

    if (error instanceof VapiServiceError) {
      return { error: "Unable to verify this area code right now. Please try again." };
    }

    return { error: "Unable to verify this area code right now. Please try again." };
  }
}
