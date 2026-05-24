"use client";

import { useActionState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  syncTekmetricNow,
  type TekmetricSyncActionState,
} from "@/features/integrations/actions/sync-tekmetric-now";
import { SyncSummary } from "@/features/integrations/components/sync-summary";
import type { TekmetricSyncStatusSummary } from "@/features/integrations/queries/get-tekmetric-sync-status";
import { getLatestSyncRecordCounts } from "@/features/integrations/utils/tekmetric-sync-records";
import { shouldShowTekmetricMockBadge } from "@/features/integrations/utils/tekmetric-mock-mode";

type TekmetricSyncControlsProps = {
  syncStatus: TekmetricSyncStatusSummary;
  canManage: boolean;
  showViewDataLink?: boolean;
};

const initialState: TekmetricSyncActionState = {};

function formatTimestamp(value: Date | null | undefined): string {
  if (!value) {
    return "Not synced yet";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function TekmetricSyncControls({
  syncStatus,
  canManage,
  showViewDataLink = true,
}: TekmetricSyncControlsProps) {
  const [state, formAction, isPending] = useActionState(syncTekmetricNow, initialState);
  const latestCounts = getLatestSyncRecordCounts(syncStatus.latestLog);
  const displayCounts =
    syncStatus.recordCounts.customers > 0 ? syncStatus.recordCounts : latestCounts;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {shouldShowTekmetricMockBadge() ? (
          <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-800">
            Mock mode
          </span>
        ) : null}
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Last synced</dt>
          <dd className="mt-1 text-sm font-semibold text-zinc-950">
            {formatTimestamp(syncStatus.lastSyncAt)}
          </dd>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Latest sync result</dt>
          <dd className="mt-1 text-sm font-semibold text-zinc-950">
            {syncStatus.latestLog?.status === "SUCCESS"
              ? "Successful"
              : syncStatus.latestLog?.status === "FAILED"
                ? "Failed"
                : syncStatus.latestLog?.status === "RUNNING"
                  ? "Running"
                  : "No sync yet"}
          </dd>
        </div>
      </dl>

      <div>
        <p className="mb-3 text-sm font-medium text-zinc-700">Synced business context</p>
        <SyncSummary records={displayCounts} compact />
      </div>

      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      {state.success && state.message ? (
        <p className="text-sm text-emerald-700">{state.message}</p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        {canManage ? (
          <form action={formAction}>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Syncing..." : "Sync Now"}
            </Button>
          </form>
        ) : (
          <p className="text-sm text-zinc-600">
            Only workspace owners and admins can trigger a sync.
          </p>
        )}
        {showViewDataLink ? (
          <Button variant="secondary" asChild>
            <Link href="/integrations/tekmetric">View Synced Data</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
