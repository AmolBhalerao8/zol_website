import { WorkspaceRole } from "@prisma/client";

const MANAGE_ROLES: WorkspaceRole[] = ["OWNER", "ADMIN"];

export function canManageMessages(role: WorkspaceRole): boolean {
  return MANAGE_ROLES.includes(role);
}

export function canSendMessages(role: WorkspaceRole): boolean {
  return MANAGE_ROLES.includes(role);
}
