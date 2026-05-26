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
      title="Suggestions for this customer"
      description="Follow-up ideas and notes based on past calls and what ZOL remembers."
      recommendations={recommendations}
      scope={{ scope: "customer", customerId }}
    />
  );
}
