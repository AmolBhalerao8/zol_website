import type { WorkflowType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function workflowAlreadyExists(input: {
  workspaceId: string;
  type: WorkflowType;
  dedupKey: string;
  sourceConversationId?: string;
  sourceCustomerId?: string;
}): Promise<boolean> {
  const openWorkflows = await prisma.workflow.findMany({
    where: {
      workspaceId: input.workspaceId,
      status: { in: ["OPEN", "IN_PROGRESS"] },
      type: input.type,
    },
    select: {
      sourceConversationId: true,
      sourceCustomerId: true,
      metadata: true,
    },
  });

  return openWorkflows.some((workflow) => {
    const metadata = workflow.metadata as { dedupKey?: string } | null;
    if (metadata?.dedupKey === input.dedupKey) {
      return true;
    }

    if (
      input.sourceConversationId &&
      workflow.sourceConversationId === input.sourceConversationId
    ) {
      return true;
    }

    if (input.sourceCustomerId && workflow.sourceCustomerId === input.sourceCustomerId) {
      return true;
    }

    return false;
  });
}
