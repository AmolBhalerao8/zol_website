import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatAreaCodeLabel } from "@/features/voice-channel/utils/area-code-options";
import type { CommunicationChannel } from "@prisma/client";

type CommunicationChannelStatusProps = {
  channel: CommunicationChannel | null;
  isAIConfigured: boolean;
  compact?: boolean;
};

export function CommunicationChannelStatus({
  channel,
  isAIConfigured,
  compact = false,
}: CommunicationChannelStatusProps) {
  const isActive = channel?.status === "ACTIVE";

  if (compact && isActive && channel) {
    return (
      <Card className="overflow-hidden border-zinc-200 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-500">Your business line</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
              {channel.phoneNumber ?? "Assigned number"}
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              Voice: {channel.voiceName}
              {channel.phoneAreaCode
                ? ` · Area code ${formatAreaCodeLabel(channel.phoneAreaCode)}`
                : null}
            </p>
          </div>
          <Button variant="secondary" asChild className="shrink-0">
            <Link href="/setup/voice-channel">Manage phone line</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-zinc-200 bg-white p-6 shadow-card">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-500">Phone line status</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
            {isActive ? "Live" : "Not activated yet"}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-7 text-zinc-600">
            {isActive
              ? "ZOL is answering customer calls on your assigned business number."
              : "Activate a business phone number so ZOL can answer customer calls for you."}
          </p>
        </div>

        {!isActive && isAIConfigured ? (
          <Button variant="accent" size="lg" asChild className="shrink-0">
            <Link href="/setup/voice-channel">Activate phone line</Link>
          </Button>
        ) : isActive ? (
          <Button variant="secondary" size="lg" asChild className="shrink-0">
            <Link href="/setup/voice-channel">Manage phone line</Link>
          </Button>
        ) : null}
      </div>

      {isActive && channel ? (
        <dl className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Status</dt>
            <dd className="mt-1 text-sm font-semibold text-emerald-700">Live</dd>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Assigned number</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-950">
              {channel.phoneNumber ?? "Assigned"}
            </dd>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Voice</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-950">{channel.voiceName}</dd>
          </div>
        </dl>
      ) : null}
    </Card>
  );
}
