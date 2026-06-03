import type { Workflow } from "@prisma/client";

import { generateFollowUpMessage } from "@/features/messages/services/generate-follow-up-message";
import {
  getGeneratedReasonForWorkflow,
  mapWorkflowToMessageType,
  shouldGenerateDraftForWorkflow,
} from "@/features/messages/utils/map-workflow-to-message-type";
import { prisma } from "@/lib/prisma";

export async function generateWorkflowMessageDraft(
  workspaceId: string,
  workflow: Pick<
    Workflow,
    "id" | "type" | "title" | "sourceConversationId" | "sourceCustomerId"
  >,
): Promise<boolean> {
  if (!shouldGenerateDraftForWorkflow(workflow.type)) {
    return false;
  }

  const existingDraft = await prisma.outboundMessage.findFirst({
    where: {
      workspaceId,
      workflowId: workflow.id,
      status: { in: ["DRAFT", "APPROVED"] },
    },
    select: { id: true },
  });

  if (existingDraft) {
    return false;
  }

  const messageType = mapWorkflowToMessageType(workflow.type);
  if (!messageType) {
    return false;
  }

  const generatedReason = getGeneratedReasonForWorkflow(workflow.type, workflow.title);

  const generated = await generateFollowUpMessage({
    workspaceId,
    customerId: workflow.sourceCustomerId ?? undefined,
    conversationId: workflow.sourceConversationId ?? undefined,
    workflowId: workflow.id,
    type: messageType,
    generatedReason,
  });

  if (!generated) {
    return false;
  }

  await prisma.outboundMessage.create({
    data: {
      workspaceId,
      customerId: workflow.sourceCustomerId,
      conversationId: workflow.sourceConversationId,
      workflowId: workflow.id,
      type: generated.type,
      channel: generated.channel,
      status: "DRAFT",
      recipient: generated.recipient,
      subject: generated.subject,
      content: generated.content,
      generatedBy: "AI",
      generatedReason: generated.generatedReason,
    },
  });

  return true;
}

export async function generateWorkflowMessageDraftsForWorkspace(
  workspaceId: string,
): Promise<number> {
  const workflows = await prisma.workflow.findMany({
    where: {
      workspaceId,
      status: { in: ["OPEN", "IN_PROGRESS"] },
      type: {
        in: [
          "FOLLOW_UP",
          "MISSED_CALLBACK",
          "APPOINTMENT_REMINDER",
          "URGENT_ISSUE",
          "REPEATED_ISSUE",
          "CUSTOMER_ESCALATION",
          "OPERATIONAL_ALERT",
        ],
      },
    },
    select: {
      id: true,
      type: true,
      title: true,
      sourceConversationId: true,
      sourceCustomerId: true,
    },
  });

  let created = 0;
  for (const workflow of workflows) {
    const didCreate = await generateWorkflowMessageDraft(workspaceId, workflow);
    if (didCreate) {
      created += 1;
    }
  }

  return created;
}
