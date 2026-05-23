import Link from "next/link";
import Image from "next/image";

import { VoiceChannelSetupForm } from "@/features/voice-channel/components/voice-channel-setup-form";
import { getCommunicationChannel } from "@/features/voice-channel/queries/get-communication-channel";
import { canManageVoiceChannel } from "@/features/voice-channel/utils/can-manage-voice-channel";
import { requireAIEmployeeSettings } from "@/features/voice-channel/utils/require-ai-employee";
import { getDefaultAreaCode } from "@/features/voice-channel/utils/area-code-options";
import { VAPI_VOICES } from "@/features/voice-channel/utils/vapi-voices-catalog";

export async function VoiceChannelSetupPage() {
  const currentWorkspace = await requireAIEmployeeSettings();
  const channel = await getCommunicationChannel(currentWorkspace.workspace.id);
  const canManage = canManageVoiceChannel(currentWorkspace.role);

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-zinc-950">
      <div className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/zol-logo.png"
              alt=""
              width={36}
              height={36}
              className="rounded-full ring-1 ring-zinc-200"
            />
            <span className="text-lg font-bold tracking-tight">ZOL</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
          >
            Back to dashboard
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8">
          <div className="mb-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Voice channel setup
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Activate your AI employee
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-8 text-zinc-600">
            Enter your business line area code, choose how ZOL should sound, and activate your
            communication channel.
          </p>
        </div>

        <VoiceChannelSetupForm
          channel={channel}
          canManage={canManage}
          voices={VAPI_VOICES}
          defaultAreaCode={getDefaultAreaCode(currentWorkspace.workspace.phone)}
        />
      </div>
    </main>
  );
}
