import type { IntelligenceQueryResult } from "@/features/intelligence/types/intelligence-types";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function createIntelligenceSession(workspaceId: string): Promise<string> {
  const session = await prisma.intelligenceSession.create({
    data: { workspaceId },
    select: { id: true },
  });

  return session.id;
}

export async function saveIntelligenceExchange(input: {
  sessionId: string;
  query: string;
  result: IntelligenceQueryResult;
}): Promise<void> {
  await prisma.intelligenceMessage.createMany({
    data: [
      {
        sessionId: input.sessionId,
        role: "USER",
        content: input.query,
      },
      {
        sessionId: input.sessionId,
        role: "ASSISTANT",
        content: input.result.answer,
        payload: {
          summary: input.result.summary,
          followUpInsights: input.result.followUpInsights,
          sources: input.result.sources,
          queryType: input.result.queryType,
          dataAvailable: input.result.dataAvailable,
        } as Prisma.InputJsonValue,
      },
    ],
  });
}

export async function ensureIntelligenceSession(
  workspaceId: string,
  sessionId?: string | null,
): Promise<string> {
  if (sessionId) {
    const existing = await prisma.intelligenceSession.findFirst({
      where: { id: sessionId, workspaceId },
      select: { id: true },
    });

    if (existing) {
      return existing.id;
    }
  }

  return createIntelligenceSession(workspaceId);
}
