import { WorkspaceRole } from "@prisma/client";

const MANAGE_ROLES: WorkspaceRole[] = ["OWNER", "ADMIN"];

export function canManageIntegrations(role: WorkspaceRole): boolean {
  return MANAGE_ROLES.includes(role);
}
