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
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Connections
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-8 text-zinc-600">
          Connect your shop software so ZOL can see appointments, customers, and jobs.
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
