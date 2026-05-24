import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TekmetricDataPreview } from "@/features/integrations/components/tekmetric-data-preview";
import { TekmetricSyncControls } from "@/features/integrations/components/tekmetric-sync-controls";
import { getTekmetricDataOverview } from "@/features/integrations/queries/get-tekmetric-data";
import { getTekmetricSyncLogs } from "@/features/integrations/queries/get-tekmetric-sync-logs";
import { getTekmetricSyncStatus } from "@/features/integrations/queries/get-tekmetric-sync-status";
import { canManageIntegrations } from "@/features/integrations/utils/can-manage-integrations";
import { shouldShowTekmetricMockBadge } from "@/features/integrations/utils/tekmetric-mock-mode";
import { requireWorkspace } from "@/features/workspace";

export async function TekmetricDataPage() {
  const currentWorkspace = await requireWorkspace();
  const workspaceId = currentWorkspace.workspace.id;
  const canManage = canManageIntegrations(currentWorkspace.role);

  const [syncStatus, syncLogs, dataOverview] = await Promise.all([
    getTekmetricSyncStatus(workspaceId),
    getTekmetricSyncLogs(workspaceId),
    getTekmetricDataOverview(workspaceId),
  ]);

  const [customers, vehicles, appointments, repairOrders] = dataOverview;

  if (!syncStatus.integrationConnected) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Button variant="secondary" asChild>
          <Link href="/integrations">
            <ArrowLeft className="h-4 w-4" />
            Back to integrations
          </Link>
        </Button>
        <div className="rounded-[1.75rem] border border-dashed border-zinc-300 bg-white/70 px-6 py-10 text-center">
          <p className="text-sm font-medium text-zinc-700">Tekmetric is not connected</p>
          <p className="mt-2 text-sm leading-7 text-zinc-500">
            Connect your shop system from Integrations before viewing synced operational data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Button variant="secondary" asChild>
        <Link href="/integrations">
          <ArrowLeft className="h-4 w-4" />
          Back to integrations
        </Link>
      </Button>

      <section>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700">
            Connected shop system
          </div>
          {shouldShowTekmetricMockBadge() ? (
            <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-800">
              Mock mode
            </span>
          ) : null}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Tekmetric operational data
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-zinc-600">
          Synced customer, vehicle, appointment, and repair order context from your connected shop
          system. This view is read-only.
        </p>
      </section>

      <section className="space-y-4 rounded-[1.75rem] border border-zinc-200 bg-white p-6 shadow-card">
        <div>
          <h2 className="text-xl font-semibold text-zinc-950">Sync overview</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-600">
            Current sync health and record counts for this workspace.
          </p>
        </div>
        <TekmetricSyncControls syncStatus={syncStatus} canManage={canManage} showViewDataLink={false} />
      </section>

      <TekmetricDataPreview
        customers={customers}
        vehicles={vehicles}
        appointments={appointments}
        repairOrders={repairOrders}
        syncLogs={syncLogs}
      />
    </div>
  );
}
