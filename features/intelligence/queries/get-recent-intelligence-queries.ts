import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";

export async function getRecentIntelligenceQueries(workspaceId: string, limit = 8) {
  return withDbRetry(() =>
    prisma.intelligenceQuery.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        query: true,
        createdAt: true,
      },
    }),
  );
}
