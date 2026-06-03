import { sendEmail } from "@/features/messages/services/email/send-email";
import { sendSms } from "@/features/messages/services/sms/send-sms";
import { prisma } from "@/lib/prisma";

export async function sendOutboundMessage(input: {
  messageId: string;
  workspaceId: string;
  approverUserId: string;
}): Promise<{ success: boolean; error?: string }> {
  const message = await prisma.outboundMessage.findFirst({
    where: {
      id: input.messageId,
      workspaceId: input.workspaceId,
      status: "APPROVED",
    },
  });

  if (!message) {
    return { success: false, error: "Approved message not found." };
  }

  if (!message.recipient.trim()) {
    await prisma.outboundMessage.update({
      where: { id: message.id },
      data: { status: "FAILED" },
    });
    return { success: false, error: "Recipient is missing." };
  }

  let result: { success: boolean; error?: string };

  if (message.channel === "EMAIL") {
    result = await sendEmail({
      to: message.recipient,
      subject: message.subject ?? "Message from your service team",
      content: message.content,
    });
  } else {
    result = await sendSms({
      to: message.recipient,
      content: message.content,
    });
  }

  if (!result.success) {
    await prisma.outboundMessage.update({
      where: { id: message.id },
      data: { status: "FAILED" },
    });
    return { success: false, error: result.error ?? "Send failed." };
  }

  await prisma.outboundMessage.update({
    where: { id: message.id },
    data: {
      status: "SENT",
      sentAt: new Date(),
      approvedBy: input.approverUserId,
    },
  });

  return { success: true };
}
