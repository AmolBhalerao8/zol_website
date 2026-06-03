"use client";

import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { generateMessageDraft } from "@/features/messages/actions/generate-message-draft";

type ConversationFollowUpSectionProps = {
  conversationId: string;
  customerId?: string | null;
};

export function ConversationFollowUpSection({
  conversationId,
  customerId,
}: ConversationFollowUpSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleGenerate = () => {
    startTransition(async () => {
      try {
        await generateMessageDraft({
          conversationId,
          customerId: customerId ?? undefined,
        });
        setFeedback("Draft created. Review it in Customer Communications.");
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "Could not generate draft.");
      }
    });
  };

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Suggested follow-up</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
            Generate an operational follow-up draft for this customer. ZOL prepares the message —
            your team reviews and approves before anything sends.
          </p>
        </div>
        <Button size="sm" disabled={isPending} onClick={handleGenerate}>
          <Sparkles className="h-4 w-4" />
          Generate draft
        </Button>
      </div>
      {feedback ? <p className="mt-4 text-sm text-zinc-600">{feedback}</p> : null}
    </Card>
  );
}
