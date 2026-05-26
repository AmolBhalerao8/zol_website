import type { CopilotRecommendation } from "@prisma/client";

import { CopilotPanel } from "@/features/copilot/components/copilot-panel";
import type { CopilotScope } from "@/features/copilot/types/copilot-types";

type CopilotSuggestionsSectionProps = {
  title?: string;
  description?: string;
  recommendations: CopilotRecommendation[];
  scope: CopilotScope;
};

export function CopilotSuggestionsSection({
  title = "ZOL Suggestions",
  description = "Context-aware operational assistance grounded in your workspace data.",
  recommendations,
  scope,
}: CopilotSuggestionsSectionProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <CopilotPanel
      title={title}
      description={description}
      recommendations={recommendations}
      scope={scope}
      showRefresh
    />
  );
}
