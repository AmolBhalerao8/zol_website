"use server";

import { revalidatePath } from "next/cache";

import { generateFollowUpMessage } from "@/features/messages/services/generate-follow-up-message";
import type { GenerateMessageDraftInput } from "@/features/messages/types/message-types";
import { requireWorkspace } from "@/features/workspace";
import { prisma } from "@/lib/prisma";

export async function generateMessageDraft(
  input: GenerateMessageDraftInput,
): Promise<{ messageId: string }> {
  const currentWorkspace = await requireWorkspace();
  const workspaceId = currentWorkspace.workspace.id;

  const generated = await generateFollowUpMessage({
    workspaceId,
    customerId: input.customerId,
    conversationId: input.conversationId,
    workflowId: input.workflowId,
    type: input.type,
  });

  if (!generated) {
    throw new Error(
      "Could not generate a follow-up draft. Add a phone number or email for this customer first.",
    );
  }

  let customerId = input.customerId ?? null;
  if (!customerId && input.conversationId) {
    const link = await prisma.conversationCustomerLink.findUnique({
      where: { conversationId: input.conversationId },
      select: { customerId: true },
    });
    customerId = link?.customerId ?? null;
  }

  const message = await prisma.outboundMessage.create({
    data: {
      workspaceId,
      customerId,
      conversationId: input.conversationId ?? null,
      workflowId: input.workflowId ?? null,
      type: generated.type,
      channel: generated.channel,
      status: "DRAFT",
      recipient: generated.recipient,
      subject: generated.subject,
      content: generated.content,
      generatedBy: input.generatedBy ?? "AI",
      generatedReason: generated.generatedReason,
    },
  });

  revalidatePath("/messages");
  revalidatePath("/messages/drafts");
  revalidatePath("/dashboard");

  if (input.conversationId) {
    revalidatePath(`/conversations/${input.conversationId}`);
  }

  if (customerId) {
    revalidatePath(`/customers/${customerId}`);
  }

  return { messageId: message.id };
}
