"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getAIEmployeeSettings } from "@/features/ai-employee/queries/get-ai-employee-settings";
import { assignPhoneNumber } from "@/features/voice-channel/services/assign-phone-number";
import { syncVapiAssistant } from "@/features/voice-channel/services/create-vapi-assistant";
import { hasVapiConfigured, VapiServiceError } from "@/features/voice-channel/services/vapi";
import { isUsAreaCodeFormat } from "@/features/voice-channel/utils/area-code-options";
import { parseVapiPhoneProvisionError } from "@/features/voice-channel/utils/parse-vapi-phone-error";
import { canManageVoiceChannel } from "@/features/voice-channel/utils/can-manage-voice-channel";
import {
  getVapiVoice,
  isValidVapiVoiceId,
} from "@/features/voice-channel/utils/vapi-voices-catalog";
import { getCurrentWorkspace } from "@/features/workspace/queries/get-current-workspace";
import { prisma } from "@/lib/prisma";

export type ActivateVoiceChannelState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

const activationSchema = z.object({
  voiceId: z
    .string()
    .refine(isValidVapiVoiceId, { message: "Select a voice for your AI employee." }),
  areaCode: z
    .string()
    .optional()
    .refine((value) => !value || isUsAreaCodeFormat(value), {
      message: "Enter a valid 3-digit US area code.",
    }),
});

export async function activateVoiceChannel(
  _prevState: ActivateVoiceChannelState,
  formData: FormData,
): Promise<ActivateVoiceChannelState> {
  const currentWorkspace = await getCurrentWorkspace();

  if (!currentWorkspace) {
    redirect("/onboarding");
  }

  if (!canManageVoiceChannel(currentWorkspace.role)) {
    return { error: "You do not have permission to activate the communication channel." };
  }

  if (!hasVapiConfigured()) {
    return {
      error:
        "Voice channel activation is temporarily unavailable. Please contact support if this continues.",
    };
  }

  const parsed = activationSchema.safeParse({
    voiceId: formData.get("voiceId"),
    areaCode: String(formData.get("areaCode") ?? "").trim() || undefined,
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const aiSettings = await getAIEmployeeSettings(currentWorkspace.workspace.id);

  if (!aiSettings) {
    return { error: "Configure your AI employee before activating voice communication." };
  }

  const { workspace } = currentWorkspace;
  const voiceId = parsed.data.voiceId;
  const selectedVoice = getVapiVoice(voiceId);

  if (!selectedVoice) {
    return { error: "Select a valid voice for your AI employee." };
  }

  const existingChannel = await prisma.communicationChannel.findUnique({
    where: { workspaceId: workspace.id },
  });

  const hasAssignedNumber = Boolean(existingChannel?.vapiPhoneNumberId);
  const selectedAreaCode = hasAssignedNumber
    ? existingChannel?.phoneAreaCode
    : parsed.data.areaCode;

  if (!hasAssignedNumber && !selectedAreaCode) {
    return {
      fieldErrors: {
        areaCode: ["Enter an area code for your business communication line."],
      },
    };
  }

  if (!hasAssignedNumber && selectedAreaCode && !isUsAreaCodeFormat(selectedAreaCode)) {
    return {
      fieldErrors: {
        areaCode: ["Enter a valid 3-digit US area code."],
      },
    };
  }

  if (
    existingChannel?.status === "ACTIVE" &&
    existingChannel.voiceId === voiceId &&
    existingChannel.phoneNumber &&
    hasAssignedNumber
  ) {
    redirect("/dashboard");
  }

  await prisma.communicationChannel.upsert({
    where: { workspaceId: workspace.id },
    create: {
      workspaceId: workspace.id,
      provider: "VAPI",
      voiceId: selectedVoice.id,
      voiceName: selectedVoice.name,
      voiceProvider: selectedVoice.provider,
      phoneAreaCode: selectedAreaCode ?? null,
      status: "PENDING",
    },
    update: {
      voiceId: selectedVoice.id,
      voiceName: selectedVoice.name,
      voiceProvider: selectedVoice.provider,
      phoneAreaCode: selectedAreaCode ?? undefined,
      status: "PENDING",
    },
  });

  try {
    const assistant = await syncVapiAssistant({
      workspace,
      aiSettings,
      voiceId: selectedVoice.id,
      existingAssistantId: existingChannel?.vapiAssistantId,
    });

    await prisma.communicationChannel.update({
      where: { workspaceId: workspace.id },
      data: { vapiAssistantId: assistant.id },
    });

    let phoneNumber = existingChannel?.phoneNumber ?? null;
    let vapiPhoneNumberId = existingChannel?.vapiPhoneNumberId ?? null;

    if (!vapiPhoneNumberId && selectedAreaCode) {
      const assignedNumber = await assignPhoneNumber({
        assistantId: assistant.id,
        workspaceName: workspace.name,
        areaCode: selectedAreaCode,
      });

      vapiPhoneNumberId = assignedNumber.id;
      phoneNumber = assignedNumber.number ?? null;
    }

    await prisma.communicationChannel.update({
      where: { workspaceId: workspace.id },
      data: {
        provider: "VAPI",
        phoneNumber,
        phoneAreaCode: selectedAreaCode ?? null,
        vapiAssistantId: assistant.id,
        vapiPhoneNumberId,
        voiceId: selectedVoice.id,
        voiceName: selectedVoice.name,
        voiceProvider: selectedVoice.provider,
        status: "ACTIVE",
      },
    });
  } catch (error) {
    console.error("Failed to activate voice channel:", error);

    const parsedPhoneError =
      error instanceof VapiServiceError
        ? parseVapiPhoneProvisionError(error.message)
        : null;

    await prisma.communicationChannel.update({
      where: { workspaceId: workspace.id },
      data: {
        status: parsedPhoneError?.isAvailabilityError ? "PENDING" : "FAILED",
      },
    });

    if (parsedPhoneError?.isAvailabilityError) {
      return {
        fieldErrors: {
          areaCode: [parsedPhoneError.userMessage],
        },
      };
    }

    if (error instanceof VapiServiceError) {
      return {
        error:
          "We couldn't activate your AI employee right now. Please try again in a moment.",
      };
    }

    return {
      error: "Unable to activate your AI employee. Please try again.",
    };
  }

  redirect("/dashboard");
}
