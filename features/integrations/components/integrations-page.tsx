import { IntegrationsWorkspace } from "@/features/integrations/components/integrations-workspace";
import { getIntegrationsByProvider } from "@/features/integrations/queries/get-integrations";
import { getTekmetricSyncStatus } from "@/features/integrations/queries/get-tekmetric-sync-status";
import { canManageIntegrations } from "@/features/integrations/utils/can-manage-integrations";
import { requireWorkspace } from "@/features/workspace";

export async function IntegrationsPage() {
  const currentWorkspace = await requireWorkspace();
  const workspaceId = currentWorkspace.workspace.id;
  const [integrations, tekmetricSyncStatus] = await Promise.all([
    getIntegrationsByProvider(workspaceId),
    getTekmetricSyncStatus(workspaceId),
  ]);
  const canManage = canManageIntegrations(currentWorkspace.role);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section>
        <div className="mb-3 inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700">
          Connected systems
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Business Integrations
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-zinc-600">
          Connect ZOL to the systems your business already uses, then sync operational customer and
          workflow data into your workspace.
        </p>
      </section>

      <IntegrationsWorkspace
        integrations={integrations}
        canManage={canManage}
        tekmetricSyncStatus={tekmetricSyncStatus}
      />
    </div>
  );
}
