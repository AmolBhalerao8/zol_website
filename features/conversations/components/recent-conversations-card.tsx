import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Conversation } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ConversationCard,
  getSummaryPreview,
} from "@/features/conversations/components/conversation-card";

type ConversationListItem = Conversation & {
  _count: {
    actionItems: number;
  };
};

type RecentConversationsCardProps = {
  conversations: ConversationListItem[];
  conversationCount: number;
  openActionItemsCount: number;
  urgentItemsCount: number;
};

export function RecentConversationsCard({
  conversations,
  conversationCount,
  openActionItemsCount,
  urgentItemsCount,
}: RecentConversationsCardProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className="overflow-hidden border-zinc-200 bg-white p-6 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-500">Recent conversations</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
              {conversationCount > 0 ? `${conversationCount} captured` : "Waiting for first call"}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-7 text-zinc-600">
              {conversationCount > 0
                ? "The latest calls ZOL answered for your business."
                : "Calls will show up here once your phone line is active."}
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/conversations">
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {conversations.length > 0 ? (
          <div className="mt-6 space-y-3">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                href={`/conversations/${conversation.id}`}
                className="block rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:border-zinc-300 hover:bg-white"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-950">
                      {conversation.customerName ||
                        conversation.customerPhone ||
                        "Unknown caller"}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-600">
                      {getSummaryPreview(conversation)}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    {conversation._count.actionItems} items
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-8 text-center">
            <p className="text-sm leading-7 text-zinc-600">
              No conversations yet. Activate your voice channel to start capturing customer calls.
            </p>
            <Button variant="accent" className="mt-4" asChild>
              <Link href="/setup/voice-channel">Activate Voice Channel</Link>
            </Button>
          </div>
        )}
      </Card>

      <div className="grid gap-4">
        <Card className="p-6">
          <p className="text-sm font-semibold text-zinc-500">Open action items</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
            {openActionItemsCount}
          </h3>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            Follow-ups extracted from customer conversations that still need attention.
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-semibold text-zinc-500">Urgent conversations</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
            {urgentItemsCount}
          </h3>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            Conversations flagged as high urgency based on customer tone, timing, or issue severity.
          </p>
        </Card>
      </div>
    </section>
  );
}
