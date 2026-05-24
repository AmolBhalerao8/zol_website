import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SyncStatusCard } from "@/features/integrations/components/sync-status-card";
import { SyncSummary } from "@/features/integrations/components/sync-summary";
import type { TekmetricSyncStatusSummary } from "@/features/integrations/queries/get-tekmetric-sync-status";

type TekmetricSyncDashboardCardProps = {
  syncStatus: TekmetricSyncStatusSummary;
  canManage: boolean;
};

export function TekmetricSyncDashboardCard({
  syncStatus,
  canManage,
}: TekmetricSyncDashboardCardProps) {
  if (!syncStatus.integrationConnected) {
    return (
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <SyncStatusCard status={syncStatus} />
        <div className="rounded-[1.75rem] border border-dashed border-zinc-300 bg-white/70 px-6 py-8">
          <p className="text-sm font-medium text-zinc-700">Connect your shop system</p>
          <p className="mt-2 text-sm leading-7 text-zinc-500">
            Link Tekmetric from Integrations to sync customer, vehicle, and workflow data into ZOL.
          </p>
          <Button className="mt-5" asChild>
            <Link href="/integrations">Go to Integrations</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <SyncStatusCard status={syncStatus} />
        <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-card">
          <p className="text-sm font-semibold text-zinc-500">Synced business context</p>
          <div className="mt-4">
            <SyncSummary records={syncStatus.recordCounts} compact />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {canManage ? (
              <Button asChild>
                <Link href="/integrations">Sync Tekmetric</Link>
              </Button>
            ) : null}
            <Button variant="secondary" asChild>
              <Link href="/integrations/tekmetric">View synced data</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
