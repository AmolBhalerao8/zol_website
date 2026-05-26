import { WorkspaceRole } from "@prisma/client";

const MANAGE_ROLES: WorkspaceRole[] = ["OWNER", "ADMIN"];

export function canManageWorkflows(role: WorkspaceRole): boolean {
  return MANAGE_ROLES.includes(role);
}

export function canUpdateWorkflowStatus(role: WorkspaceRole): boolean {
  return true;
}
