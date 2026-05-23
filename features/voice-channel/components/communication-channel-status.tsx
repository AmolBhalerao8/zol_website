import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatAreaCodeLabel } from "@/features/voice-channel/utils/area-code-options";
import type { CommunicationChannel } from "@prisma/client";

type CommunicationChannelStatusProps = {
  channel: CommunicationChannel | null;
  isAIConfigured: boolean;
};

function formatTimestamp(value: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function CommunicationChannelStatus({
  channel,
  isAIConfigured,
}: CommunicationChannelStatusProps) {
  const isActive = channel?.status === "ACTIVE";

  return (
    <Card className="overflow-hidden border-zinc-200 bg-white p-6 shadow-card">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-500">AI Employee Status</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
            {isActive ? "Active" : "Voice channel setup pending"}
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-7 text-zinc-600">
            {isActive
              ? "Your AI employee is ready to handle customer communication through your assigned business line."
              : "Activate your AI employee to assign a business communication number and bring your voice channel online."}
          </p>
        </div>

        {!isActive && isAIConfigured ? (
          <Button variant="accent" size="lg" asChild className="shrink-0">
            <Link href="/setup/voice-channel">Activate AI Employee</Link>
          </Button>
        ) : isActive ? (
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button variant="secondary" size="lg" asChild>
              <Link href="/setup/ai-employee">Edit AI Employee</Link>
            </Button>
            <Button variant="accent" size="lg" asChild>
              <Link href="/setup/voice-channel">Manage Voice Channel</Link>
            </Button>
          </div>
        ) : null}
      </div>

      {isActive && channel ? (
        <dl className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Status</dt>
            <dd className="mt-1 text-sm font-semibold text-emerald-700">Active</dd>
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
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Line area code</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-950">
              {channel.phoneAreaCode ? formatAreaCodeLabel(channel.phoneAreaCode) : "Assigned"}
            </dd>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:col-span-2 xl:col-span-4">
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Setup timestamp</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-950">
              {formatTimestamp(channel.updatedAt)}
            </dd>
          </div>
        </dl>
      ) : null}
    </Card>
  );
}
