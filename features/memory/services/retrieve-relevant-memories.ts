import type { MemoryCategory } from "@prisma/client";

import {
  embeddingToSqlVector,
  generateEmbedding,
  hasEmbeddingConfigured,
} from "@/features/memory/services/generate-embedding";
import { prisma } from "@/lib/prisma";

export type RetrievedCustomerMemory = {
  id: string;
  content: string;
  category: MemoryCategory;
  importanceScore: number | null;
  conversationId: string | null;
  createdAt: Date;
  similarity: number | null;
};

type RawMemoryRow = {
  id: string;
  content: string;
  category: MemoryCategory;
  importanceScore: number | null;
  conversationId: string | null;
  createdAt: Date;
  similarity: number | null;
};

function rankFallbackMemories(
  memories: Array<{
    id: string;
    content: string;
    category: MemoryCategory;
    importanceScore: number | null;
    conversationId: string | null;
    createdAt: Date;
  }>,
  limit: number,
): RetrievedCustomerMemory[] {
  return memories.slice(0, limit).map((memory) => ({
    ...memory,
    similarity: null,
  }));
}

export async function getRelevantCustomerMemories(input: {
  workspaceId: string;
  customerId: string;
  queryText?: string | null;
  limit?: number;
}): Promise<RetrievedCustomerMemory[]> {
  const limit = input.limit ?? 8;
  const queryText = input.queryText?.trim();

  if (queryText && hasEmbeddingConfigured()) {
    try {
      const queryEmbedding = await generateEmbedding(queryText);

      if (queryEmbedding) {
        const rows = await prisma.$queryRawUnsafe<RawMemoryRow[]>(
          `
          SELECT
            "id",
            "content",
            "category",
            "importanceScore",
            "conversationId",
            "createdAt",
            (1 - ("embedding" <=> $1::vector)) AS "similarity"
          FROM "CustomerMemory"
          WHERE "workspaceId" = $2
            AND "customerId" = $3
            AND "embedding" IS NOT NULL
          ORDER BY "embedding" <=> $1::vector
          LIMIT $4
          `,
          embeddingToSqlVector(queryEmbedding),
          input.workspaceId,
          input.customerId,
          limit,
        );

        if (rows.length > 0) {
          return rows.map((row) => ({
            id: row.id,
            content: row.content,
            category: row.category,
            importanceScore: row.importanceScore,
            conversationId: row.conversationId,
            createdAt: row.createdAt,
            similarity: row.similarity,
          }));
        }
      }
    } catch (error) {
      console.error("Vector memory retrieval failed, falling back:", error);
    }
  }

  const memories = await prisma.customerMemory.findMany({
    where: {
      workspaceId: input.workspaceId,
      customerId: input.customerId,
    },
    orderBy: [{ importanceScore: "desc" }, { createdAt: "desc" }],
    take: Math.max(limit, 12),
    select: {
      id: true,
      content: true,
      category: true,
      importanceScore: true,
      conversationId: true,
      createdAt: true,
    },
  });

  return rankFallbackMemories(memories, limit);
}
