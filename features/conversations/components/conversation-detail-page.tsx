import { notFound } from "next/navigation";

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
    <div className="mx-auto max-w-5xl">
      <ConversationDetail conversation={conversation} />
    </div>
  );
}
