import { VoiceChannelSetupForm } from "@/features/voice-channel/components/voice-channel-setup-form";
import { getCommunicationChannel } from "@/features/voice-channel/queries/get-communication-channel";
import { syncActiveVoiceChannelAssistant } from "@/features/voice-channel/services/sync-active-assistant";
import { canManageVoiceChannel } from "@/features/voice-channel/utils/can-manage-voice-channel";
import { requireAIEmployeeSettings } from "@/features/voice-channel/utils/require-ai-employee";
import { getDefaultAreaCode } from "@/features/voice-channel/utils/area-code-options";
import { VAPI_VOICES } from "@/features/voice-channel/utils/vapi-voices-catalog";

export async function VoiceChannelSetupPage() {
  const currentWorkspace = await requireAIEmployeeSettings();
  const channel = await getCommunicationChannel(currentWorkspace.workspace.id);
  const canManage = canManageVoiceChannel(currentWorkspace.role);

  if (channel?.status === "ACTIVE" && channel.vapiAssistantId && canManage) {
    await syncActiveVoiceChannelAssistant(currentWorkspace.workspace.id);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section>
        <div className="mb-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Voice channel setup
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Activate your AI employee
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-zinc-600">
          Pick your area code and voice, then activate the phone number customers will call.
        </p>
      </section>

      <VoiceChannelSetupForm
        channel={channel}
        canManage={canManage}
        voices={VAPI_VOICES}
        defaultAreaCode={getDefaultAreaCode(currentWorkspace.workspace.phone)}
      />
    </div>
  );
}
