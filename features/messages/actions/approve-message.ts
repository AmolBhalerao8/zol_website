"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { sendOutboundMessage } from "@/features/messages/services/send-outbound-message";
import { canManageMessages } from "@/features/messages/utils/can-manage-messages";
import { getUserByClerkId } from "@/features/users/queries/get-user-by-clerk-id";
import { requireWorkspace } from "@/features/workspace";
import { prisma } from "@/lib/prisma";

export async function approveMessage(messageId: string): Promise<void> {
  const currentWorkspace = await requireWorkspace();

  if (!canManageMessages(currentWorkspace.role)) {
    throw new Error("Only workspace admins can approve customer communications.");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Authentication required.");
  }

  const user = await getUserByClerkId(userId);
  if (!user) {
    throw new Error("User profile not found.");
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
    data: {
      status: "APPROVED",
      approvedBy: user.id,
    },
  });

  revalidateMessages();
}

export async function approveAndSendMessage(messageId: string): Promise<void> {
  const currentWorkspace = await requireWorkspace();

  if (!canManageMessages(currentWorkspace.role)) {
    throw new Error("Only workspace admins can send customer communications.");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Authentication required.");
  }

  const user = await getUserByClerkId(userId);
  if (!user) {
    throw new Error("User profile not found.");
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
    data: {
      status: "APPROVED",
      approvedBy: user.id,
    },
  });

  const result = await sendOutboundMessage({
    messageId,
    workspaceId: currentWorkspace.workspace.id,
    approverUserId: user.id,
  });

  if (!result.success) {
    throw new Error(result.error ?? "Failed to send message.");
  }

  revalidateMessages();
}

function revalidateMessages() {
  revalidatePath("/messages");
  revalidatePath("/messages/drafts");
  revalidatePath("/messages/history");
  revalidatePath("/dashboard");
  revalidatePath("/customers", "layout");
  revalidatePath("/conversations", "layout");
}
