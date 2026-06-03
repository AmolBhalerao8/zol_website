"use server";

import { revalidatePath } from "next/cache";

import { canManageMessages } from "@/features/messages/utils/can-manage-messages";
import { requireWorkspace } from "@/features/workspace";
import { prisma } from "@/lib/prisma";

export async function rejectMessage(messageId: string): Promise<void> {
  const currentWorkspace = await requireWorkspace();

  if (!canManageMessages(currentWorkspace.role)) {
    throw new Error("Only workspace admins can reject customer communications.");
  }

  const message = await prisma.outboundMessage.findFirst({
    where: {
      id: messageId,
      workspaceId: currentWorkspace.workspace.id,
      status: "DRAFT",
    },
  });

  if (!message) {
    throw new Error("Draft not found.");
  }

  await prisma.outboundMessage.update({
    where: { id: message.id },
    data: { status: "REJECTED" },
  });

  revalidatePath("/messages");
  revalidatePath("/messages/drafts");
  revalidatePath("/messages/history");
  revalidatePath("/dashboard");
}
