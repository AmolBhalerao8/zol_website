import type { Prisma } from "@prisma/client";

import { buildOperationalContext } from "@/features/copilot/services/build-operational-context";
import { generateOperationalRecommendations } from "@/features/copilot/services/generate-operational-recommendations";
import type { CopilotScope } from "@/features/copilot/types/copilot-types";
import { getScopeKey } from "@/features/copilot/types/copilot-types";
import { prisma } from "@/lib/prisma";

const CACHE_MS = 2 * 60 * 60 * 1000;

function scopeFilter(workspaceId: string, scope: CopilotScope): Prisma.CopilotRecommendationWhereInput {
  switch (scope.scope) {
    case "workspace":
      return {
        workspaceId,
        sourceConversationId: null,
        sourceCustomerId: null,
        sourceWorkflowId: null,
      };
    case "conversation":
      return { workspaceId, sourceConversationId: scope.conversationId };
    case "customer":
      return { workspaceId, sourceCustomerId: scope.customerId };
    case "workflow":
      return { workspaceId, sourceWorkflowId: scope.workflowId };
  }
}

export async function ensureCopilotRecommendations(
  workspaceId: string,
  scope: CopilotScope,
  options?: { force?: boolean },
) {
  const where = scopeFilter(workspaceId, scope);
  const scopeKey = getScopeKey(scope);

  if (!options?.force) {
    const latest = await prisma.copilotRecommendation.findFirst({
      where,
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });

    if (latest && Date.now() - latest.createdAt.getTime() < CACHE_MS) {
      return prisma.copilotRecommendation.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 10,
      });
    }
  }

  const context = await buildOperationalContext(workspaceId, scope);
  const suggestions = await generateOperationalRecommendations({ context, scope });

  if (suggestions.length === 0) {
    return prisma.copilotRecommendation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  }

  await prisma.copilotRecommendation.deleteMany({ where });

  await prisma.copilotRecommendation.createMany({
    data: suggestions.map((suggestion) => ({
      workspaceId,
      type: suggestion.type,
      title: suggestion.title,
      content: suggestion.content,
      sourceConversationId: suggestion.sourceConversationId ?? null,
      sourceCustomerId: suggestion.sourceCustomerId ?? null,
      sourceWorkflowId: suggestion.sourceWorkflowId ?? null,
      metadata: { scopeKey } as Prisma.InputJsonValue,
    })),
  });

  return prisma.copilotRecommendation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}
