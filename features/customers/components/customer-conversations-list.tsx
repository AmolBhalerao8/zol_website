import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ActionItem, Conversation, Urgency } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrgencyBadge } from "@/features/conversations/components/urgency-badge";

type CustomerConversationItem = {
  conversation: Conversation & {
    actionItems: ActionItem[];
  };
};

function formatTimestamp(value: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

type CustomerConversationsListProps = {
  conversationLinks: CustomerConversationItem[];
};

export function CustomerConversationsList({ conversationLinks }: CustomerConversationsListProps) {
  if (conversationLinks.length === 0) {
    return (
      <Card className="border-zinc-200 bg-white shadow-card">
        <CardContent className="p-8 text-center">
          <p className="text-sm leading-7 text-zinc-600">
            No linked conversations yet. Conversations appear here once ZOL connects them to this
            customer.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {conversationLinks.map(({ conversation }) => (
        <Card key={conversation.id} className="border-zinc-200 bg-white shadow-card">
          <CardHeader className="border-b border-zinc-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-lg">{formatTimestamp(conversation.createdAt)}</CardTitle>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
                  {conversation.summary ?? "Conversation captured without summary."}
                </p>
              </div>
              <UrgencyBadge urgency={conversation.urgency as Urgency} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {conversation.actionItems.length > 0 ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Action items
                </p>
                <ul className="mt-3 space-y-2">
                  {conversation.actionItems.slice(0, 3).map((item) => (
                    <li
                      key={item.id}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
                    >
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Link
              href={`/conversations/${conversation.id}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View conversation detail
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
