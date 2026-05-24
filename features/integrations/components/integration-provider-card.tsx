"use client";

import type { IntegrationProvider, IntegrationStatus } from "@prisma/client";

import { IntegrationStatusBadge } from "@/features/integrations/components/integration-status-badge";
import type { IntegrationProviderDefinition } from "@/features/integrations/utils/integration-providers";
import { cn } from "@/lib/utils";

type IntegrationProviderCardProps = {
  provider: IntegrationProviderDefinition;
  status: IntegrationStatus;
  selected: boolean;
  onSelect: (provider: IntegrationProvider) => void;
};

export function IntegrationProviderCard({
  provider,
  status,
  selected,
  onSelect,
}: IntegrationProviderCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(provider.id)}
      className={cn(
        "flex h-full w-full flex-col rounded-[1.75rem] border bg-white p-5 text-left shadow-card transition-all hover:border-zinc-300 hover:shadow-md",
        selected ? "border-emerald-300 ring-2 ring-emerald-100" : "border-zinc-200",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
            provider.accentClassName,
          )}
        >
          <provider.icon className="h-6 w-6" />
        </div>
        <IntegrationStatusBadge status={status} />
      </div>

      <div className="mt-5">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-950">{provider.name}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{provider.description}</p>
      </div>

      <p className="mt-5 text-sm font-semibold text-emerald-700">
        {selected ? "Selected" : "Connect →"}
      </p>
    </button>
  );
}
