import { getAIEmployeeSettings } from "@/features/ai-employee/queries/get-ai-employee-settings";
import { prisma } from "@/lib/prisma";

import { syncVapiAssistant } from "./create-vapi-assistant";
import { hasVapiConfigured } from "./vapi";

export type SyncActiveAssistantResult =
  | { synced: false; reason: "no_active_channel" | "vapi_not_configured" | "missing_data" }
  | { synced: true; assistantId: string };

export async function syncActiveVoiceChannelAssistant(
  workspaceId: string,
): Promise<SyncActiveAssistantResult> {
  if (!hasVapiConfigured()) {
    return { synced: false, reason: "vapi_not_configured" };
  }

  const [channel, workspace, aiSettings] = await Promise.all([
    prisma.communicationChannel.findUnique({ where: { workspaceId } }),
    prisma.workspace.findUnique({ where: { id: workspaceId } }),
    getAIEmployeeSettings(workspaceId),
  ]);

  if (!channel || channel.status !== "ACTIVE" || !channel.vapiAssistantId) {
    return { synced: false, reason: "no_active_channel" };
  }

  if (!workspace || !aiSettings) {
    return { synced: false, reason: "missing_data" };
  }

  await syncVapiAssistant({
    workspace,
    aiSettings,
    voiceId: channel.voiceId,
    existingAssistantId: channel.vapiAssistantId,
  });

  return { synced: true, assistantId: channel.vapiAssistantId };
}
