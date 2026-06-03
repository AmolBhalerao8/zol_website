import Link from "next/link";

import { Card } from "@/components/ui/card";
import { MessageHistoryTable } from "@/features/messages/components/message-history-table";
import type { OutboundMessageWithRelations } from "@/features/messages/types/message-types";
import {
  MESSAGE_STATUS_LABELS,
} from "@/features/messages/types/message-types";

type CustomerCommunicationHistoryProps = {
  messages: OutboundMessageWithRelations[];
};

export function CustomerCommunicationHistory({ messages }: CustomerCommunicationHistoryProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-zinc-950">Communication history</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Follow-up drafts and sent customer communications for this customer.
          </p>
        </div>
        <Link href="/messages" className="text-sm font-semibold text-emerald-700">
          Open communications
        </Link>
      </div>

      {messages.length === 0 ? (
        <Card className="p-6 text-sm text-zinc-500">
          No customer communications yet. Generate a follow-up draft from a call or the communications page.
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.slice(0, 5).map((message) => (
            <Card key={message.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-zinc-900">
                  {MESSAGE_STATUS_LABELS[message.status]}
                </p>
                <p className="text-xs text-zinc-500">
                  {new Intl.DateTimeFormat("en-US", {
                    month: "short",
                    day: "numeric",
                  }).format(new Date(message.createdAt))}
                </p>
              </div>
              <p className="mt-3 text-sm leading-7 text-zinc-600">{message.content}</p>
            </Card>
          ))}
        </div>
      )}

      {messages.length > 5 ? (
        <MessageHistoryTable messages={messages} />
      ) : null}
    </section>
  );
}
