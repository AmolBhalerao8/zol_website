"use client";

import { useTransition } from "react";
import { Check, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { approveAndSendMessage, approveMessage } from "@/features/messages/actions/approve-message";
import { rejectMessage } from "@/features/messages/actions/reject-message";
import { sendMessage } from "@/features/messages/actions/send-message";

type ApprovalActionsProps = {
  messageId: string;
  mode?: "draft" | "approved";
};

export function ApprovalActions({ messageId, mode = "draft" }: ApprovalActionsProps) {
  const [isPending, startTransition] = useTransition();

  const run = (action: () => Promise<void>) => {
    startTransition(async () => {
      await action();
    });
  };

  if (mode === "approved") {
    return (
      <Button size="sm" disabled={isPending} onClick={() => run(() => sendMessage(messageId))}>
        <Send className="h-4 w-4" />
        Send
      </Button>
    );
  }

  return (
    <>
      <Button size="sm" disabled={isPending} onClick={() => run(() => approveAndSendMessage(messageId))}>
        <Send className="h-4 w-4" />
        Approve &amp; send
      </Button>
      <Button
        variant="secondary"
        size="sm"
        disabled={isPending}
        onClick={() => run(() => approveMessage(messageId))}
      >
        <Check className="h-4 w-4" />
        Approve
      </Button>
      <Button variant="ghost" size="sm" disabled={isPending} onClick={() => run(() => rejectMessage(messageId))}>
        <X className="h-4 w-4" />
        Reject
      </Button>
    </>
  );
}
