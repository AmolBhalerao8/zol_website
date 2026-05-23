"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  activateVoiceChannel,
  type ActivateVoiceChannelState,
} from "@/features/voice-channel/actions/activate-voice-channel";
import { AreaCodeInput } from "@/features/voice-channel/components/area-code-input";
import { VoiceSelectionGrid } from "@/features/voice-channel/components/voice-selection-grid";
import { formatAreaCodeLabel } from "@/features/voice-channel/utils/area-code-options";
import type { VapiVoiceOption } from "@/features/voice-channel/utils/vapi-voices-catalog";
import type { CommunicationChannel } from "@prisma/client";

const initialActionState: ActivateVoiceChannelState = {};

type VoiceChannelSetupFormProps = {
  channel: CommunicationChannel | null;
  canManage: boolean;
  voices: VapiVoiceOption[];
  defaultAreaCode: string;
};

export function VoiceChannelSetupForm({
  channel,
  canManage,
  voices,
  defaultAreaCode,
}: VoiceChannelSetupFormProps) {
  const [state, formAction, pending] = useActionState(activateVoiceChannel, initialActionState);
  const isActive = channel?.status === "ACTIVE";
  const isFailed = channel?.status === "FAILED";
  const hasAssignedNumber = Boolean(channel?.vapiPhoneNumberId && channel?.phoneNumber);
  const lockedAreaCode = channel?.phoneAreaCode ?? undefined;

  return (
    <form action={formAction} className="space-y-6">
      {!canManage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          You can review communication channel settings, but only workspace owners and admins can
          activate or update them.
        </div>
      ) : null}

      {isActive && channel ? (
        <Card className="border-emerald-200 bg-emerald-50/60">
          <CardHeader>
            <CardTitle className="text-emerald-950">AI employee active</CardTitle>
            <p className="text-sm leading-6 text-emerald-900/80">
              Your communication channel is live. Update the voice below to refresh how ZOL sounds
              with customers.
            </p>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200/80 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">Assigned number</p>
              <p className="mt-1 text-sm font-semibold text-emerald-950">
                {channel.phoneNumber ?? "Provisioning complete"}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-white/70 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">Current voice</p>
              <p className="mt-1 text-sm font-semibold text-emerald-950">{channel.voiceName}</p>
            </div>
            {channel.phoneAreaCode ? (
              <div className="rounded-2xl border border-emerald-200/80 bg-white/70 p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">Business line area code</p>
                <p className="mt-1 text-sm font-semibold text-emerald-950">
                  {formatAreaCodeLabel(channel.phoneAreaCode)}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {isFailed ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Activation did not complete successfully. Verify your area code, choose a voice, and try
          again.
        </div>
      ) : null}

      {!hasAssignedNumber ? (
        <Card>
          <CardHeader>
            <CardTitle>Assign your business line area code</CardTitle>
            <p className="text-sm leading-6 text-zinc-600">
              Enter the US area code where ZOL should assign your AI employee&apos;s communication
              number. Verify availability before activating.
            </p>
          </CardHeader>
          <CardContent>
            <AreaCodeInput
              defaultValue={lockedAreaCode ?? channel?.phoneAreaCode ?? defaultAreaCode}
              disabled={!canManage || pending}
              activationError={state.fieldErrors?.areaCode?.[0]}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Choose your AI employee voice</CardTitle>
          <p className="text-sm leading-6 text-zinc-600">
            Browse available voices and choose how ZOL should sound when communicating with your
            customers.
          </p>
        </CardHeader>
        <CardContent>
          <VoiceSelectionGrid
            voices={voices}
            defaultValue={channel?.voiceId}
            disabled={!canManage || pending}
          />
          {state.fieldErrors?.voiceId?.[0] ? (
            <p className="mt-3 text-sm text-red-600">{state.fieldErrors.voiceId[0]}</p>
          ) : null}
        </CardContent>
      </Card>

      {hasAssignedNumber && lockedAreaCode ? (
        <input type="hidden" name="areaCode" value={lockedAreaCode} />
      ) : null}

      {state.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {state.error}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="secondary" asChild>
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
        <Button
          type="submit"
          variant="accent"
          size="lg"
          disabled={!canManage || pending}
          className="sm:min-w-56"
        >
          {pending
            ? "Activating..."
            : isActive
              ? "Update AI Employee Voice"
              : "Activate AI Employee"}
        </Button>
      </div>
    </form>
  );
}
