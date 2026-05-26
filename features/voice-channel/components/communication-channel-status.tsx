import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
            <p className="mt-2 text-sm text-zinc-600">ZOL is answering calls on this number.</p>
          </div>
          <Button variant="secondary" asChild className="shrink-0">
            <Link href="/setup/voice-channel">Manage phone line</Link>
          </Button>
        </div>
      </Card>
    );
  }

  if (isActive) {
    return null;
  }

  return (
    <Card className="overflow-hidden border-zinc-200 bg-white p-6 shadow-card">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-500">Phone line</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
            Not set up yet
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-7 text-zinc-600">
            Turn on a business phone number so ZOL can answer customer calls for you.
          </p>
        </div>

        {isAIConfigured ? (
          <Button variant="accent" size="lg" asChild className="shrink-0">
            <Link href="/setup/voice-channel">Set up phone line</Link>
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
