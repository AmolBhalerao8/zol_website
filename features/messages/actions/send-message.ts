"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { sendOutboundMessage } from "@/features/messages/services/send-outbound-message";
import { canSendMessages } from "@/features/messages/utils/can-manage-messages";
import { getUserByClerkId } from "@/features/users/queries/get-user-by-clerk-id";
import { requireWorkspace } from "@/features/workspace";

export async function sendMessage(messageId: string): Promise<void> {
  const currentWorkspace = await requireWorkspace();

  if (!canSendMessages(currentWorkspace.role)) {
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

  const result = await sendOutboundMessage({
    messageId,
    workspaceId: currentWorkspace.workspace.id,
    approverUserId: user.id,
  });

  if (!result.success) {
    throw new Error(result.error ?? "Failed to send message.");
  }

  revalidatePath("/messages");
  revalidatePath("/messages/drafts");
  revalidatePath("/messages/history");
  revalidatePath("/dashboard");
  revalidatePath("/customers", "layout");
  revalidatePath("/conversations", "layout");
}
