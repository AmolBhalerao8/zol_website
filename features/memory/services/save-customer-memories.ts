import type { MemoryCategory } from "@prisma/client";

import {
  embeddingToSqlVector,
  generateEmbedding,
  hasEmbeddingConfigured,
} from "@/features/memory/services/generate-embedding";
import type { GeneratedCustomerMemory } from "@/features/memory/services/generate-customer-memories";
import { prisma } from "@/lib/prisma";

export async function saveCustomerMemories(input: {
  workspaceId: string;
  customerId: string;
  conversationId: string;
  memories: GeneratedCustomerMemory[];
}): Promise<number> {
  if (input.memories.length === 0) {
    return 0;
  }

  const existingCount = await prisma.customerMemory.count({
    where: { conversationId: input.conversationId },
  });

  if (existingCount > 0) {
    return 0;
  }

  let savedCount = 0;

  for (const memory of input.memories) {
    const created = await prisma.customerMemory.create({
      data: {
        workspaceId: input.workspaceId,
        customerId: input.customerId,
        conversationId: input.conversationId,
        content: memory.content,
        category: memory.category,
        importanceScore: memory.importanceScore,
      },
      select: { id: true },
    });

    if (hasEmbeddingConfigured()) {
      try {
        const embedding = await generateEmbedding(memory.content);

        if (embedding) {
          await prisma.$executeRawUnsafe(
            `UPDATE "CustomerMemory" SET "embedding" = $1::vector WHERE "id" = $2`,
            embeddingToSqlVector(embedding),
            created.id,
          );
        }
      } catch (error) {
        console.error("Failed to save memory embedding:", error);
      }
    }

    savedCount += 1;
  }

  return savedCount;
}

export async function getExistingMemoriesForCustomer(
  workspaceId: string,
  customerId: string,
  limit = 20,
): Promise<Array<{ content: string; category: MemoryCategory }>> {
  return prisma.customerMemory.findMany({
    where: { workspaceId, customerId },
    orderBy: [{ importanceScore: "desc" }, { createdAt: "desc" }],
    take: limit,
    select: {
      content: true,
      category: true,
    },
  });
}
