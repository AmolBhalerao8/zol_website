import { AlertCircle, CheckCircle2, Clock3, RefreshCw } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { TekmetricSyncStatusSummary } from "@/features/integrations/queries/get-tekmetric-sync-status";
import { cn } from "@/lib/utils";

type SyncStatusCardProps = {
  status: TekmetricSyncStatusSummary;
  title?: string;
  className?: string;
};

function formatTimestamp(value: Date | null | undefined): string {
  if (!value) {
    return "Not synced yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function getHealthLabel(health: TekmetricSyncStatusSummary["syncHealth"]): string {
  switch (health) {
    case "healthy":
      return "Synced";
    case "needs_sync":
      return "Connected, not synced yet";
    case "failed":
      return "Last sync failed";
    default:
      return "Not connected";
  }
}

function getHealthStyles(health: TekmetricSyncStatusSummary["syncHealth"]): string {
  switch (health) {
    case "healthy":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "needs_sync":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "failed":
      return "border-red-200 bg-red-50 text-red-800";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-700";
  }
}

export function SyncStatusCard({ status, title = "Tekmetric Sync", className }: SyncStatusCardProps) {
  const healthLabel = getHealthLabel(status.syncHealth);
  const HealthIcon =
    status.syncHealth === "healthy"
      ? CheckCircle2
      : status.syncHealth === "failed"
        ? AlertCircle
        : Clock3;

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-500">{title}</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
            {status.integrationConnected ? "Connected shop system" : "Not connected"}
          </h3>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
          <RefreshCw className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
            getHealthStyles(status.syncHealth),
          )}
        >
          <HealthIcon className="h-3.5 w-3.5" />
          {healthLabel}
        </span>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Last synced</dt>
          <dd className="mt-1 text-sm font-semibold text-zinc-950">
            {formatTimestamp(status.lastSyncAt)}
          </dd>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Linked customers</dt>
          <dd className="mt-1 text-sm font-semibold text-zinc-950">
            {status.recordCounts.linkedCustomers}
          </dd>
        </div>
      </dl>

      {status.latestLog?.errorMessage ? (
        <p className="mt-4 text-sm leading-7 text-red-700">{status.latestLog.errorMessage}</p>
      ) : null}
    </Card>
  );
}
