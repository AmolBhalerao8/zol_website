"use client";

import Link from "next/link";
import { ArrowRight, PencilLine } from "lucide-react";
import type { AIEmployeeSettings } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  parseEnabledCapabilitiesJson,
} from "@/features/ai-employee/schemas/ai-employee-settings-schema";

type AIEmployeeConfigCardProps = {
  settings: AIEmployeeSettings;
  hasBusinessContext: boolean;
  isVoiceChannelActive: boolean;
};

export function AIEmployeeConfigCard({
  settings,
  hasBusinessContext,
  isVoiceChannelActive,
}: AIEmployeeConfigCardProps) {
  const capabilitiesCount = parseEnabledCapabilitiesJson(settings.enabledCapabilities).length;

  return (
    <Card className="overflow-hidden border-zinc-200 bg-white shadow-card">
      <div className="flex flex-col gap-6 border-b border-zinc-200 px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-8">
        <div>
          <p className="text-sm font-semibold text-zinc-500">AI employee configuration</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
            {settings.displayName}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
            Update business context, hours, and capabilities. Changes apply to how ZOL handles
            customer communication.
          </p>
        </div>
        <Button variant="secondary" size="lg" asChild className="shrink-0">
          <Link href="/setup/ai-employee">
            <PencilLine className="h-4 w-4" />
            Edit AI Employee
          </Link>
        </Button>
      </div>

      {!hasBusinessContext ? (
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-4 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-950">Business context is missing</p>
              <p className="mt-1 text-sm leading-6 text-amber-900/90">
                Add a short description of your business so ZOL can respond with operational
                intelligence instead of generic answers.
              </p>
            </div>
            <Button variant="accent" asChild className="shrink-0">
              <Link href="/setup/ai-employee">
                Add business context
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ) : null}

      <dl className="grid gap-3 p-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Capabilities</dt>
          <dd className="mt-1 text-sm font-semibold text-zinc-950">{capabilitiesCount} enabled</dd>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Business context</dt>
          <dd className="mt-1 text-sm font-semibold text-zinc-950">
            {hasBusinessContext ? "Added" : "Missing"}
          </dd>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Live channel</dt>
          <dd className="mt-1 text-sm font-semibold text-zinc-950">
            {isVoiceChannelActive ? "Connected" : "Not activated"}
          </dd>
        </div>
      </dl>
    </Card>
  );
}
