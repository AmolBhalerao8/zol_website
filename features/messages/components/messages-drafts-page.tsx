import { Card } from "@/components/ui/card";
import { DraftCard } from "@/features/messages/components/draft-card";
import { MessagesTabs } from "@/features/messages/components/messages-tabs";
import type { OutboundMessageWithRelations } from "@/features/messages/types/message-types";

type MessagesDraftsPageProps = {
  drafts: OutboundMessageWithRelations[];
  canManage: boolean;
};

export function MessagesDraftsPage({ drafts, canManage }: MessagesDraftsPageProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Follow-up drafts
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-8 text-zinc-600">
          Review AI-generated follow-up drafts before anything sends to customers.
        </p>
      </section>

      <MessagesTabs activeHref="/messages/drafts" />

      {drafts.length === 0 ? (
        <Card className="p-10 text-center text-sm text-zinc-500">
          No follow-up drafts waiting for review. ZOL will create drafts from operational workflows and call follow-ups.
        </Card>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <DraftCard key={draft.id} message={draft} canManage={canManage} />
          ))}
        </div>
      )}
    </div>
  );
}
