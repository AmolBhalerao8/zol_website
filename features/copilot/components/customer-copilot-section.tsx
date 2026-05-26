import { CopilotSuggestionsSection } from "@/features/copilot/components/copilot-suggestions-section";
import { getCopilotRecommendations } from "@/features/copilot/queries/get-copilot-recommendations";

type CustomerCopilotSectionProps = {
  workspaceId: string;
  customerId: string;
};

export async function CustomerCopilotSection({
  workspaceId,
  customerId,
}: CustomerCopilotSectionProps) {
  const recommendations = await getCopilotRecommendations(workspaceId, {
    scope: "customer",
    customerId,
  });

  return (
    <CopilotSuggestionsSection
      title="Operational Suggestions"
      description="Customer insights, follow-up drafts, and operational recommendations based on conversation history and memory."
      recommendations={recommendations}
      scope={{ scope: "customer", customerId }}
    />
  );
}
