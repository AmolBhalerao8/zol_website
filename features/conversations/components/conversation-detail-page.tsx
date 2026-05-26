import { notFound } from "next/navigation";

import { CopilotSuggestionsSection } from "@/features/copilot/components/copilot-suggestions-section";
import { getCopilotRecommendations } from "@/features/copilot/queries/get-copilot-recommendations";
import { ConversationDetail } from "@/features/conversations/components/conversation-detail";
import { getConversationById } from "@/features/conversations/queries/get-conversations";
import { requireWorkspace } from "@/features/workspace";
import { withDbRetry } from "@/lib/db-retry";

type ConversationDetailPageProps = {
  conversationId: string;
};

export async function ConversationDetailPage({ conversationId }: ConversationDetailPageProps) {
  const currentWorkspace = await requireWorkspace();
  const conversation = await withDbRetry(() =>
    getConversationById(currentWorkspace.workspace.id, conversationId),
  );

  if (!conversation) {
    notFound();
  }

  const copilotRecommendations = await withDbRetry(() =>
    getCopilotRecommendations(currentWorkspace.workspace.id, {
      scope: "conversation",
      conversationId,
    }),
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <ConversationDetail conversation={conversation} />
      <CopilotSuggestionsSection
        title="ZOL Suggestions"
        description="Suggested replies, follow-ups, and operational next steps for this conversation."
        recommendations={copilotRecommendations}
        scope={{ scope: "conversation", conversationId }}
      />
    </div>
  );
}
