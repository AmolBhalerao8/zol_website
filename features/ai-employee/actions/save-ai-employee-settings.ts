"use server";

import { redirect } from "next/navigation";

import {
  aiEmployeeSettingsSchema,
  commonScenariosToJson,
} from "@/features/ai-employee/schemas/ai-employee-settings-schema";
import { canManageAIEmployee } from "@/features/ai-employee/utils/can-manage-ai-employee";
import { syncActiveVoiceChannelAssistant } from "@/features/voice-channel/services/sync-active-assistant";
import { getCurrentWorkspace } from "@/features/workspace/queries/get-current-workspace";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type SaveAIEmployeeSettingsState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

function parseFormData(formData: FormData) {
  const enabledCapabilities = formData.getAll("enabledCapabilities").map(String);
  const businessHoursRaw = formData.get("businessHours");

  let businessHours: unknown = {};

  if (typeof businessHoursRaw === "string" && businessHoursRaw.trim()) {
    businessHours = JSON.parse(businessHoursRaw);
  }

  return {
    displayName: formData.get("displayName"),
    greetingMessage: formData.get("greetingMessage"),
    businessContext: formData.get("businessContext") || undefined,
    commonScenarios: formData.get("commonScenarios") || undefined,
    businessHours,
    escalationPhone: formData.get("escalationPhone") || undefined,
    escalationEmail: formData.get("escalationEmail") || undefined,
    enabledCapabilities,
  };
}

export async function saveAIEmployeeSettings(
  _prevState: SaveAIEmployeeSettingsState,
  formData: FormData,
): Promise<SaveAIEmployeeSettingsState> {
  const currentWorkspace = await getCurrentWorkspace();

  if (!currentWorkspace) {
    redirect("/onboarding");
  }

  if (!canManageAIEmployee(currentWorkspace.role)) {
    return { error: "You do not have permission to update AI employee settings." };
  }

  let raw;

  try {
    raw = parseFormData(formData);
  } catch {
    return { error: "Invalid form data. Please try again." };
  }

  const parsed = aiEmployeeSettingsSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const commonScenariosJson = commonScenariosToJson(parsed.data.commonScenarios);

  const existingSettings = await prisma.aIEmployeeSettings.findUnique({
    where: { workspaceId: currentWorkspace.workspace.id },
    select: { communicationTone: true },
  });

  const data = {
    displayName: parsed.data.displayName,
    greetingMessage: parsed.data.greetingMessage,
    communicationTone: existingSettings?.communicationTone ?? parsed.data.communicationTone,
    businessContext: parsed.data.businessContext ?? null,
    commonScenarios: commonScenariosJson ?? Prisma.DbNull,
    businessHours: parsed.data.businessHours as Prisma.InputJsonValue,
    escalationPhone: parsed.data.escalationPhone,
    escalationEmail: parsed.data.escalationEmail,
    enabledCapabilities: parsed.data.enabledCapabilities as Prisma.InputJsonValue,
  };

  try {
    await prisma.aIEmployeeSettings.upsert({
      where: { workspaceId: currentWorkspace.workspace.id },
      create: {
        workspaceId: currentWorkspace.workspace.id,
        ...data,
      },
      update: data,
    });
  } catch (error) {
    console.error("Failed to save AI employee settings:", error);
    return { error: "Unable to save AI employee settings. Please try again." };
  }

  let assistantSync = "skipped";

  try {
    const syncResult = await syncActiveVoiceChannelAssistant(currentWorkspace.workspace.id);
    assistantSync = syncResult.synced ? "synced" : "skipped";
  } catch (error) {
    console.error("Failed to sync active voice channel assistant:", error);
    assistantSync = "failed";
  }

  redirect(`/dashboard?aiEmployeeUpdated=1&assistantSync=${assistantSync}`);
}
