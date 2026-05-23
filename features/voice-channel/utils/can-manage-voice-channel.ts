import { WorkspaceRole } from "@prisma/client";

const MANAGE_ROLES: WorkspaceRole[] = ["OWNER", "ADMIN"];

export function canManageVoiceChannel(role: WorkspaceRole): boolean {
  return MANAGE_ROLES.includes(role);
}
