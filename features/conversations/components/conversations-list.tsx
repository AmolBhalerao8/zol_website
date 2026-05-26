import Link from "next/link";
import { MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConversationCard } from "@/features/conversations/components/conversation-card";
import type { Conversation } from "@prisma/client";

type ConversationListItem = Conversation & {
  _count: {
    actionItems: number;
  };
};

type ConversationsListProps = {
  conversations: ConversationListItem[];
  hasCommunicationChannel: boolean;
};

export function ConversationsList({
  conversations,
  hasCommunicationChannel,
}: ConversationsListProps) {
  if (conversations.length === 0) {
    return (
      <Card className="overflow-hidden border-zinc-200 bg-white p-8 text-center shadow-card sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-600">
          <MessageSquareText className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-950">No calls yet</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-600">
          Once ZOL starts answering your phone, each call will appear here with a summary and any
          follow-ups for your team.
        </p>
        {!hasCommunicationChannel ? (
          <Button variant="accent" size="lg" className="mt-6" asChild>
            <Link href="/setup/voice-channel">Set up phone line</Link>
          </Button>
        ) : null}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <ConversationCard key={conversation.id} conversation={conversation} />
      ))}
    </div>
  );
}
