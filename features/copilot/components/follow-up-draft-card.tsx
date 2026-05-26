import type { CopilotRecommendation } from "@prisma/client";

import { RecommendationCard } from "@/features/copilot/components/recommendation-card";

type FollowUpDraftCardProps = {
  recommendation: CopilotRecommendation;
};

export function FollowUpDraftCard({ recommendation }: FollowUpDraftCardProps) {
  return <RecommendationCard recommendation={recommendation} showCopy />;
}
