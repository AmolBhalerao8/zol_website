import { auth } from "@clerk/nextjs/server";

import { ensureLocalUser } from "@/features/users";
import { prisma } from "@/lib/prisma";
import type { Workspace, WorkspaceMember, WorkspaceRole } from "@prisma/client";

export type CurrentWorkspace = {
  workspace: Workspace;
  membership: WorkspaceMember;
  role: WorkspaceRole;
};

export async function getCurrentWorkspace(): Promise<CurrentWorkspace | null> {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await ensureLocalUser();

  const membership = await prisma.workspaceMember.findFirst({
    where: { userId: user.id },
    include: { workspace: true },
    orderBy: { createdAt: "asc" },
  });

  if (!membership) {
    return null;
  }

  return {
    workspace: membership.workspace,
    membership,
    role: membership.role,
  };
}

export async function userHasWorkspace(): Promise<boolean> {
  const currentWorkspace = await getCurrentWorkspace();
  return currentWorkspace !== null;
}
