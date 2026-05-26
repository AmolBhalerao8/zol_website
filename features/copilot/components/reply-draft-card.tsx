import type { CopilotRecommendation } from "@prisma/client";

import { RecommendationCard } from "@/features/copilot/components/recommendation-card";

type ReplyDraftCardProps = {
  recommendation: CopilotRecommendation;
};

export function ReplyDraftCard({ recommendation }: ReplyDraftCardProps) {
  return <RecommendationCard recommendation={recommendation} showCopy />;
}
