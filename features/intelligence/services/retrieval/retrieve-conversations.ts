import type { ClassifiedIntelligenceQuery, IntelligenceRetrievalResult } from "@/features/intelligence/types/intelligence-types";
import { prisma } from "@/lib/prisma";

export async function retrieveConversations(
  workspaceId: string,
  classified: ClassifiedIntelligenceQuery,
): Promise<IntelligenceRetrievalResult> {
  const where: {
    workspaceId: string;
    createdAt?: { gte?: Date; lte?: Date };
    urgency?: { in: Array<"HIGH" | "URGENT"> };
    OR?: Array<{ summary?: { contains: string; mode: "insensitive" }; transcript?: { contains: string; mode: "insensitive" } }>;
  } = { workspaceId };

  if (classified.timeframe?.start || classified.timeframe?.end) {
    where.createdAt = {};
    if (classified.timeframe.start) {
      where.createdAt.gte = classified.timeframe.start;
    }
    if (classified.timeframe.end) {
      where.createdAt.lte = classified.timeframe.end;
    }
  }

  if (classified.filters.urgency === "high") {
    where.urgency = { in: ["HIGH", "URGENT"] };
  }

  if (classified.entities.length > 0) {
    where.OR = classified.entities.flatMap((entity) => [
      { summary: { contains: entity, mode: "insensitive" as const } },
      { transcript: { contains: entity, mode: "insensitive" as const } },
    ]);
  }

  const conversations = await prisma.conversation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      customerName: true,
      customerPhone: true,
      summary: true,
      urgency: true,
      createdAt: true,
      _count: { select: { actionItems: true } },
    },
  });

  return {
    queryType: "conversations",
    recordCount: conversations.length,
    payload: {
      conversations: conversations.map((conversation) => ({
        id: conversation.id,
        customerName: conversation.customerName,
        customerPhone: conversation.customerPhone,
        summary: conversation.summary,
        urgency: conversation.urgency,
        createdAt: conversation.createdAt.toISOString(),
        actionItemCount: conversation._count.actionItems,
      })),
    },
    sources: conversations.map((conversation) => ({
      id: conversation.id,
      type: "conversation" as const,
      title: conversation.customerName ?? conversation.customerPhone ?? "Customer conversation",
      summary: conversation.summary ?? "Conversation captured by ZOL",
      href: `/conversations/${conversation.id}`,
      metadata: {
        urgency: conversation.urgency,
      },
    })),
  };
}
