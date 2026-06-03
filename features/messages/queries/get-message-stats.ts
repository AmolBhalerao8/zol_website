import type { MessageStats } from "@/features/messages/types/message-types";
import { prisma } from "@/lib/prisma";

function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function getMessageStats(workspaceId: string): Promise<MessageStats> {
  const todayStart = startOfToday();

  const [pendingDrafts, awaitingApproval, sentToday] = await Promise.all([
    prisma.outboundMessage.count({
      where: { workspaceId, status: "DRAFT" },
    }),
    prisma.outboundMessage.count({
      where: { workspaceId, status: "APPROVED" },
    }),
    prisma.outboundMessage.count({
      where: {
        workspaceId,
        status: "SENT",
        sentAt: { gte: todayStart },
      },
    }),
  ]);

  return {
    pendingDrafts,
    awaitingApproval,
    sentToday,
  };
}
