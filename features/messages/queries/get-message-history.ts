import type { OutboundMessageWithRelations } from "@/features/messages/types/message-types";
import { prisma } from "@/lib/prisma";

const messageInclude = {
  customer: {
    select: {
      id: true,
      name: true,
      primaryPhone: true,
      primaryEmail: true,
    },
  },
  conversation: {
    select: {
      id: true,
      customerName: true,
      summary: true,
    },
  },
  workflow: {
    select: {
      id: true,
      title: true,
      type: true,
    },
  },
} as const;

export async function getMessageHistory(
  workspaceId: string,
): Promise<OutboundMessageWithRelations[]> {
  return prisma.outboundMessage.findMany({
    where: {
      workspaceId,
      status: { in: ["SENT", "FAILED", "REJECTED", "APPROVED"] },
    },
    include: messageInclude,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function getAllMessages(
  workspaceId: string,
): Promise<OutboundMessageWithRelations[]> {
  return prisma.outboundMessage.findMany({
    where: { workspaceId },
    include: messageInclude,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
