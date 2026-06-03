"use server";

import { revalidatePath } from "next/cache";

import { canManageMessages } from "@/features/messages/utils/can-manage-messages";
import { requireWorkspace } from "@/features/workspace";
import { prisma } from "@/lib/prisma";

export async function updateMessageDraft(input: {
  messageId: string;
  content: string;
  subject?: string | null;
  recipient?: string;
}): Promise<void> {
  const currentWorkspace = await requireWorkspace();

  if (!canManageMessages(currentWorkspace.role)) {
    throw new Error("Only workspace admins can edit follow-up drafts.");
  }

  const message = await prisma.outboundMessage.findFirst({
    where: {
      id: input.messageId,
      workspaceId: currentWorkspace.workspace.id,
      status: "DRAFT",
    },
  });

  if (!message) {
    throw new Error("Draft not found.");
  }

  await prisma.outboundMessage.update({
    where: { id: message.id },
    data: {
      content: input.content.trim(),
      subject: input.subject?.trim() || null,
      recipient: input.recipient?.trim() || message.recipient,
    },
  });

  revalidatePath("/messages");
  revalidatePath("/messages/drafts");
}
