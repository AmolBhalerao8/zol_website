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
    <div className="mx-auto max-w-5xl space-y-8">
      <section>
        <div className="mb-3 inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700">
          Proactive operational intelligence
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Operational Workflows
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-zinc-600">
          ZOL proactively detects operational tasks, customer follow-ups, and business issues from
          your conversations and synced shop data.
        </p>
      </section>

      <WorkflowList workflows={workflows} canDismiss={canDismiss} />
    </div>
  );
}
