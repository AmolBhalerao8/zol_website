import { canManageIntegrations } from "@/features/integrations/utils/can-manage-integrations";
import { getCurrentWorkspace } from "@/features/workspace/queries/get-current-workspace";

export async function requireManageAccess() {
  const currentWorkspace = await getCurrentWorkspace();

  if (!currentWorkspace) {
    throw new Error("Workspace required");
  }

  if (!canManageIntegrations(currentWorkspace.role)) {
    throw new Error("You do not have permission to manage integrations.");
  }

  return currentWorkspace;
}
