import type { MessageStatus } from "@prisma/client";

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

export async function getMessagesByStatus(
  workspaceId: string,
  status: MessageStatus | MessageStatus[],
): Promise<OutboundMessageWithRelations[]> {
  return prisma.outboundMessage.findMany({
    where: {
      workspaceId,
      status: Array.isArray(status) ? { in: status } : status,
    },
    include: messageInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getMessageDrafts(
  workspaceId: string,
): Promise<OutboundMessageWithRelations[]> {
  return getMessagesByStatus(workspaceId, "DRAFT");
}

export async function getMessageById(
  workspaceId: string,
  messageId: string,
): Promise<OutboundMessageWithRelations | null> {
  return prisma.outboundMessage.findFirst({
    where: { id: messageId, workspaceId },
    include: messageInclude,
  });
}

export async function getCustomerMessages(
  workspaceId: string,
  customerId: string,
): Promise<OutboundMessageWithRelations[]> {
  return prisma.outboundMessage.findMany({
    where: { workspaceId, customerId },
    include: messageInclude,
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}
