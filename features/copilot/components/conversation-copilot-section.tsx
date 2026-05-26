import { CopilotSuggestionsSection } from "@/features/copilot/components/copilot-suggestions-section";
import { getCopilotRecommendations } from "@/features/copilot/queries/get-copilot-recommendations";

type ConversationCopilotSectionProps = {
  workspaceId: string;
  conversationId: string;
};

export async function ConversationCopilotSection({
  workspaceId,
  conversationId,
}: ConversationCopilotSectionProps) {
  const recommendations = await getCopilotRecommendations(workspaceId, {
    scope: "conversation",
    conversationId,
  });

  return (
    <CopilotSuggestionsSection
      title="ZOL Suggestions"
      description="Suggested messages and next steps for this call. Copy any draft — nothing sends automatically."
      recommendations={recommendations}
      scope={{ scope: "conversation", conversationId }}
    />
  );
}
