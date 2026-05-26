"use server";

import type { WorkflowStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { canManageWorkflows } from "@/features/workflows/utils/can-manage-workflows";
import { requireWorkspace } from "@/features/workspace";
import { prisma } from "@/lib/prisma";

export async function updateWorkflowStatus(workflowId: string, status: WorkflowStatus) {
  const currentWorkspace = await requireWorkspace();

  if (status === "DISMISSED" && !canManageWorkflows(currentWorkspace.role)) {
    throw new Error("Only workspace admins can dismiss operational workflows.");
  }

  const workflow = await prisma.workflow.findFirst({
    where: {
      id: workflowId,
      workspaceId: currentWorkspace.workspace.id,
    },
    select: { id: true },
  });

  if (!workflow) {
    throw new Error("Workflow not found.");
  }

  await prisma.workflow.update({
    where: { id: workflowId },
    data: { status },
  });

  revalidatePath("/workflows");
  revalidatePath("/dashboard");
}
