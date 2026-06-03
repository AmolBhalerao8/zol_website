"use client";

import { useState, useTransition } from "react";
import { Mail, MessageSquare, Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { updateMessageDraft } from "@/features/messages/actions/update-message-draft";
import { ApprovalActions } from "@/features/messages/components/approval-actions";
import { MessageEditor } from "@/features/messages/components/message-editor";
import type { OutboundMessageWithRelations } from "@/features/messages/types/message-types";
import {
  MESSAGE_CHANNEL_LABELS,
  MESSAGE_TYPE_LABELS,
} from "@/features/messages/types/message-types";
import { getCustomerDisplayName } from "@/features/customers/utils/normalize-customer-identity";

type DraftCardProps = {
  message: OutboundMessageWithRelations;
  canManage: boolean;
};

function formatTimestamp(value: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function DraftCard({ message, canManage }: DraftCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const customerLabel = message.customer
    ? getCustomerDisplayName(message.customer)
    : message.conversation?.customerName ?? message.recipient;

  const handleSave = (values: { content: string; subject?: string | null; recipient?: string }) => {
    startTransition(async () => {
      await updateMessageDraft({
        messageId: message.id,
        content: values.content,
        subject: values.subject,
        recipient: values.recipient,
      });
      setIsEditing(false);
    });
  };

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-500">{customerLabel}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-700">
              {message.channel === "EMAIL" ? (
                <Mail className="h-3.5 w-3.5" />
              ) : (
                <MessageSquare className="h-3.5 w-3.5" />
              )}
              {MESSAGE_CHANNEL_LABELS[message.channel]}
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
              {MESSAGE_TYPE_LABELS[message.type]}
            </span>
          </div>
        </div>
        <p className="text-xs text-zinc-500">{formatTimestamp(message.createdAt)}</p>
      </div>

      {message.generatedReason ? (
        <p className="mt-4 text-sm font-medium text-zinc-700">{message.generatedReason}</p>
      ) : null}

      {isEditing ? (
        <div className="mt-4 space-y-4">
          <MessageEditor
            channel={message.channel}
            initialContent={message.content}
            initialSubject={message.subject}
            initialRecipient={message.recipient}
            onSubmit={handleSave}
            submitLabel="Save draft"
            disabled={isPending}
          />
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={isPending}>
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      ) : (
        <>
          {message.channel === "EMAIL" && message.subject ? (
            <p className="mt-4 text-sm font-semibold text-zinc-900">{message.subject}</p>
          ) : null}
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-600">{message.content}</p>
          <p className="mt-3 text-xs text-zinc-500">To: {message.recipient}</p>
        </>
      )}

      {!isEditing ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {canManage ? (
            <>
              <ApprovalActions messageId={message.id} />
              <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </>
          ) : (
            <p className="text-sm text-zinc-500">
              Draft ready for admin review. Nothing sends automatically.
            </p>
          )}
        </div>
      ) : null}
    </Card>
  );
}
