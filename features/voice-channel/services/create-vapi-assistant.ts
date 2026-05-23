import type { AIEmployeeSettings, Workspace } from "@prisma/client";

import { buildAssistantSystemPrompt } from "@/features/voice-channel/utils/build-assistant-system-prompt";
import { getVapiVoiceConfig } from "@/features/voice-channel/utils/vapi-voices-catalog";

import {
  createVapiAssistant,
  updateVapiAssistant,
  type VapiAssistant,
} from "./vapi";

type SyncVapiAssistantInput = {
  workspace: Workspace;
  aiSettings: AIEmployeeSettings;
  voiceId: string;
  existingAssistantId?: string | null;
};

export async function syncVapiAssistant({
  workspace,
  aiSettings,
  voiceId,
  existingAssistantId,
}: SyncVapiAssistantInput): Promise<VapiAssistant> {
  const systemPrompt = buildAssistantSystemPrompt({ workspace, aiSettings });
  const voice = getVapiVoiceConfig(voiceId);
  const assistantName = `${workspace.name} — ${aiSettings.displayName}`;

  const payload = {
    name: assistantName,
    firstMessage: aiSettings.greetingMessage,
    systemPrompt,
    voice,
  };

  if (existingAssistantId) {
    return updateVapiAssistant(existingAssistantId, payload);
  }

  return createVapiAssistant(payload);
}
