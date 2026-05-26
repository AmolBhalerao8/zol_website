import type { CopilotRecommendation } from "@prisma/client";

import { RecommendationCard } from "@/features/copilot/components/recommendation-card";

type OperationalInsightCardProps = {
  recommendation: CopilotRecommendation;
};

export function OperationalInsightCard({ recommendation }: OperationalInsightCardProps) {
  return <RecommendationCard recommendation={recommendation} />;
}
