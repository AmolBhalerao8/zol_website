import { WorkflowList } from "@/features/workflows/components/workflow-list";
import { getActiveWorkflows } from "@/features/workflows/queries/get-workflows";
import { runOperationalWorkflowScan } from "@/features/workflows/services/run-operational-workflow-scan";
import { canManageWorkflows } from "@/features/workflows/utils/can-manage-workflows";
import { requireWorkspace } from "@/features/workspace";

export async function WorkflowsPage() {
  const currentWorkspace = await requireWorkspace();
  const workspaceId = currentWorkspace.workspace.id;

  await runOperationalWorkflowScan(workspaceId);

  const workflows = await getActiveWorkflows(workspaceId);
  const canDismiss = canManageWorkflows(currentWorkspace.role);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Follow-ups
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-8 text-zinc-600">
          Customers and tasks that need a call back, confirmation, or check-in from your team.
        </p>
      </section>

      <WorkflowList workflows={workflows} canDismiss={canDismiss} />
    </div>
  );
}
