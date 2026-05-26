import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ConversationCopilotSection } from "@/features/copilot/components/conversation-copilot-section";
import { CopilotSuggestionsSkeleton } from "@/features/copilot/components/copilot-suggestions-skeleton";
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

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <ConversationDetail conversation={conversation} />
      <Suspense fallback={<CopilotSuggestionsSkeleton />}>
        <ConversationCopilotSection
          workspaceId={currentWorkspace.workspace.id}
          conversationId={conversationId}
        />
      </Suspense>
    </div>
  );
}
