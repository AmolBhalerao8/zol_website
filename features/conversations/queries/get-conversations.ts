import { prisma } from "@/lib/prisma";

export async function getConversations(workspaceId: string) {
  return prisma.conversation.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { actionItems: true },
      },
    },
  });
}

export async function getConversationById(workspaceId: string, conversationId: string) {
  return prisma.conversation.findFirst({
    where: {
      id: conversationId,
      workspaceId,
    },
    include: {
      actionItems: {
        orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
      },
      communicationChannel: {
        select: {
          phoneNumber: true,
          voiceName: true,
        },
      },
    },
  });
}

export async function getRecentConversations(workspaceId: string, limit = 5) {
  return prisma.conversation.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      _count: {
        select: { actionItems: true },
      },
    },
  });
}

export async function getConversationStats(workspaceId: string) {
  const [conversationCount, openActionItemsCount, urgentItemsCount] = await Promise.all([
    prisma.conversation.count({ where: { workspaceId } }),
    prisma.actionItem.count({
      where: {
        workspaceId,
        status: { in: ["OPEN", "IN_PROGRESS"] },
      },
    }),
    prisma.conversation.count({
      where: {
        workspaceId,
        urgency: { in: ["HIGH", "URGENT"] },
      },
    }),
  ]);

  return {
    conversationCount,
    openActionItemsCount,
    urgentItemsCount,
  };
}
