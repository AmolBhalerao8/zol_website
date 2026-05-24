import type { ClassifiedIntelligenceQuery, IntelligenceRetrievalResult } from "@/features/intelligence/types/intelligence-types";
import { MEMORY_CATEGORY_LABELS } from "@/features/memory/utils/memory-category-labels";
import { prisma } from "@/lib/prisma";

export async function retrieveOperationalTrends(
  workspaceId: string,
  classified: ClassifiedIntelligenceQuery,
): Promise<IntelligenceRetrievalResult> {
  const createdAtFilter =
    classified.timeframe?.start || classified.timeframe?.end
      ? {
          gte: classified.timeframe.start,
          lte: classified.timeframe.end,
        }
      : undefined;

  const [conversations, openActionItems, urgentConversations, memories] = await Promise.all([
    prisma.conversation.findMany({
      where: {
        workspaceId,
        ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        customerName: true,
        summary: true,
        urgency: true,
        createdAt: true,
      },
    }),
    prisma.actionItem.count({
      where: { workspaceId, status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    prisma.conversation.count({
      where: {
        workspaceId,
        urgency: { in: ["HIGH", "URGENT"] },
        ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
      },
    }),
    prisma.customerMemory.findMany({
      where: {
        workspaceId,
        ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
      },
      orderBy: [{ importanceScore: "desc" }, { createdAt: "desc" }],
      take: 15,
      select: {
        id: true,
        content: true,
        category: true,
        customerId: true,
      },
    }),
  ]);

  const issueKeywords = ["brake", "appointment", "repair", "noise", "shipment", "delay", "estimate"];
  const issueCounts = issueKeywords
    .map((keyword) => ({
      keyword,
      count: conversations.filter((conversation) =>
        conversation.summary?.toLowerCase().includes(keyword),
      ).length,
    }))
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count);

  return {
    queryType: "operational_trends",
    recordCount: conversations.length,
    payload: {
      conversationCount: conversations.length,
      openActionItems,
      urgentConversations,
      topIssueThemes: issueCounts,
      recentSummaries: conversations.slice(0, 8).map((conversation) => ({
        id: conversation.id,
        customerName: conversation.customerName,
        summary: conversation.summary,
        urgency: conversation.urgency,
      })),
      notableMemories: memories.slice(0, 8).map((memory) => ({
        id: memory.id,
        category: MEMORY_CATEGORY_LABELS[memory.category],
        content: memory.content,
        customerId: memory.customerId,
      })),
    },
    sources: [
      ...conversations.slice(0, 6).map((conversation) => ({
        id: conversation.id,
        type: "conversation" as const,
        title: conversation.customerName ?? "Conversation",
        summary: conversation.summary ?? "Recent customer conversation",
        href: `/conversations/${conversation.id}`,
      })),
      ...memories.slice(0, 4).map((memory) => ({
        id: memory.id,
        type: "memory" as const,
        title: MEMORY_CATEGORY_LABELS[memory.category],
        summary: memory.content,
        href: `/customers/${memory.customerId}`,
      })),
    ],
  };
}

export async function retrieveMemories(
  workspaceId: string,
  classified: ClassifiedIntelligenceQuery,
): Promise<IntelligenceRetrievalResult> {
  const createdAtFilter =
    classified.timeframe?.start || classified.timeframe?.end
      ? {
          gte: classified.timeframe.start,
          lte: classified.timeframe.end,
        }
      : undefined;

  const where: {
    workspaceId: string;
    createdAt?: { gte?: Date; lte?: Date };
    OR?: Array<{ content: { contains: string; mode: "insensitive" } }>;
  } = {
    workspaceId,
    ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
  };

  if (classified.entities.length > 0) {
    where.OR = classified.entities.map((entity) => ({
      content: { contains: entity, mode: "insensitive" as const },
    }));
  }

  const memories = await prisma.customerMemory.findMany({
    where,
    orderBy: [{ importanceScore: "desc" }, { createdAt: "desc" }],
    take: 20,
    select: {
      id: true,
      content: true,
      category: true,
      customerId: true,
      createdAt: true,
    },
  });

  return {
    queryType: "memory",
    recordCount: memories.length,
    payload: {
      memories: memories.map((memory) => ({
        id: memory.id,
        category: MEMORY_CATEGORY_LABELS[memory.category],
        content: memory.content,
        customerId: memory.customerId,
        createdAt: memory.createdAt.toISOString(),
      })),
    },
    sources: memories.map((memory) => ({
      id: memory.id,
      type: "memory" as const,
      title: MEMORY_CATEGORY_LABELS[memory.category],
      summary: memory.content,
      href: `/customers/${memory.customerId}`,
    })),
  };
}
