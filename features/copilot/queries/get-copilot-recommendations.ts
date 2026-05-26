import type { CopilotRecommendation } from "@prisma/client";

import { ensureCopilotRecommendations } from "@/features/copilot/services/ensure-copilot-recommendations";
import type { CopilotScope } from "@/features/copilot/types/copilot-types";
import { prisma } from "@/lib/prisma";

export async function getCopilotRecommendations(
  workspaceId: string,
  scope: CopilotScope,
): Promise<CopilotRecommendation[]> {
  return ensureCopilotRecommendations(workspaceId, scope);
}

export async function getRecentCopilotRecommendations(
  workspaceId: string,
  limit = 12,
): Promise<CopilotRecommendation[]> {
  return prisma.copilotRecommendation.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getDailyInsightRecommendations(
  workspaceId: string,
): Promise<CopilotRecommendation[]> {
  return getCopilotRecommendations(workspaceId, { scope: "workspace" });
}
