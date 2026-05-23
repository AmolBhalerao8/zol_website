import { ConversationDetailPage } from "@/features/conversations";

type ConversationDetailRouteProps = {
  params: Promise<{ conversationId: string }>;
};

export default async function ConversationDetailRoute({ params }: ConversationDetailRouteProps) {
  const { conversationId } = await params;

  return <ConversationDetailPage conversationId={conversationId} />;
}
