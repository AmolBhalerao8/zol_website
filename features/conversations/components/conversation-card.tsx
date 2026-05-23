import Link from "next/link";
import { ArrowRight, Clock3, Phone, UserRound } from "lucide-react";
import type { Conversation, Urgency } from "@prisma/client";

import { Card } from "@/components/ui/card";
import { ConversationStatusBadge } from "@/features/conversations/components/conversation-status-badge";
import { UrgencyBadge } from "@/features/conversations/components/urgency-badge";

type ConversationListItem = Conversation & {
  _count: {
    actionItems: number;
  };
};

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) {
    return "—";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

function formatTimestamp(value: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function getCustomerLabel(conversation: Pick<Conversation, "customerName" | "customerPhone">): string {
  return conversation.customerName?.trim() || conversation.customerPhone?.trim() || "Unknown caller";
}

function getSummaryPreview(conversation: ConversationListItem): string {
  if (conversation.summary?.trim()) {
    return conversation.summary.trim();
  }

  if (conversation.transcript?.trim()) {
    const preview = conversation.transcript.trim();
    return preview.length > 160 ? `${preview.slice(0, 157)}...` : preview;
  }

  return "Conversation captured. Intelligence is still processing.";
}

type ConversationCardProps = {
  conversation: ConversationListItem;
};

export function ConversationCard({ conversation }: ConversationCardProps) {
  return (
    <Card className="group overflow-hidden border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-card">
      <Link href={`/conversations/${conversation.id}`} className="block p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight text-zinc-950">
                {getCustomerLabel(conversation)}
              </h3>
              <UrgencyBadge urgency={conversation.urgency as Urgency} />
              <ConversationStatusBadge status={conversation.status} />
            </div>

            <p className="mt-3 text-sm leading-7 text-zinc-600">{getSummaryPreview(conversation)}</p>

            <dl className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-500">
              <div className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" />
                <span>{formatTimestamp(conversation.createdAt)}</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                <span>{formatDuration(conversation.durationSeconds)}</span>
              </div>
              {conversation.customerPhone ? (
                <div className="inline-flex items-center gap-1.5">
                  <UserRound className="h-4 w-4" />
                  <span>{conversation.customerPhone}</span>
                </div>
              ) : null}
              <div>
                <span>{conversation._count.actionItems} action items</span>
              </div>
            </dl>
          </div>

          <div className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition-colors group-hover:text-emerald-800">
            View conversation
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </Card>
  );
}

export { formatDuration, formatTimestamp, getCustomerLabel, getSummaryPreview };
