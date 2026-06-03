import { Card } from "@/components/ui/card";
import { MessageHistoryTable } from "@/features/messages/components/message-history-table";
import { MessagesTabs } from "@/features/messages/components/messages-tabs";
import type { OutboundMessageWithRelations } from "@/features/messages/types/message-types";

type MessagesHistoryPageProps = {
  messages: OutboundMessageWithRelations[];
};

export function MessagesHistoryPage({ messages }: MessagesHistoryPageProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Communication history
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-8 text-zinc-600">
          Sent, failed, and rejected customer communications from your approval workflow.
        </p>
      </section>

      <MessagesTabs activeHref="/messages/history" />

      {messages.length === 0 ? (
        <Card className="p-10 text-center text-sm text-zinc-500">
          No sent communications yet. Approved messages will appear here after your team sends them.
        </Card>
      ) : (
        <MessageHistoryTable messages={messages} />
      )}
    </div>
  );
}
