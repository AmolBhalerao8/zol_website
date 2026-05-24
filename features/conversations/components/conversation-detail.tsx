import Link from "next/link";
import { ArrowLeft, Clock3, ExternalLink, Phone, UserRound } from "lucide-react";
import type { ActionItem, Conversation, Urgency } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionItemsList } from "@/features/conversations/components/action-items-list";
import {
  formatDuration,
  formatTimestamp,
  getCustomerLabel,
} from "@/features/conversations/components/conversation-card";
import { ConversationStatusBadge } from "@/features/conversations/components/conversation-status-badge";
import { UrgencyBadge } from "@/features/conversations/components/urgency-badge";

type ConversationDetailProps = {
  conversation: Conversation & {
    actionItems: ActionItem[];
    communicationChannel: {
      phoneNumber: string | null;
      voiceName: string;
    };
    customerLink: {
      customer: {
        id: string;
        name: string | null;
        primaryPhone: string | null;
      };
    } | null;
  };
};

export function ConversationDetail({ conversation }: ConversationDetailProps) {
  const customerLabel = getCustomerLabel(conversation);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="secondary" asChild>
          <Link href="/conversations">
            <ArrowLeft className="h-4 w-4" />
            Back to conversations
          </Link>
        </Button>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-card">
        <div className="border-b border-zinc-200 px-6 py-6 sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">{customerLabel}</h1>
            <UrgencyBadge urgency={conversation.urgency as Urgency} />
            <ConversationStatusBadge status={conversation.status} />
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">
            ZOL turned this customer conversation into organized business intelligence.
          </p>
        </div>

        <dl className="grid gap-3 p-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Captured</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-950">
              {formatTimestamp(conversation.createdAt)}
            </dd>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Duration</dt>
            <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-950">
              <Clock3 className="h-4 w-4" />
              {formatDuration(conversation.durationSeconds)}
            </dd>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Business line</dt>
            <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-950">
              <Phone className="h-4 w-4" />
              {conversation.communicationChannel.phoneNumber ?? "Assigned line"}
            </dd>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Voice</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-950">
              {conversation.communicationChannel.voiceName}
            </dd>
          </div>
          {conversation.customerLink ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:col-span-2">
              <dt className="text-xs uppercase tracking-[0.16em] text-emerald-700">Customer profile</dt>
              <dd className="mt-1">
                <Link
                  href={`/customers/${conversation.customerLink.customer.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-900"
                >
                  View customer memory
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </dd>
            </div>
          ) : null}
          {conversation.customerPhone ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:col-span-2">
              <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Customer phone</dt>
              <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-950">
                <UserRound className="h-4 w-4" />
                {conversation.customerPhone}
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-zinc-700">
              {conversation.summary?.trim() ||
                "Summary is still processing. Check back shortly or review the transcript below."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recording</CardTitle>
          </CardHeader>
          <CardContent>
            {conversation.recordingUrl ? (
              <Button variant="secondary" asChild>
                <a href={conversation.recordingUrl} target="_blank" rel="noreferrer">
                  Open recording
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            ) : (
              <p className="text-sm leading-7 text-zinc-600">
                No recording link was included with this conversation.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <ActionItemsList actionItems={conversation.actionItems} />

      <Card>
        <CardHeader>
          <CardTitle>Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          {conversation.transcript?.trim() ? (
            <pre className="whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-7 text-zinc-700">
              {conversation.transcript}
            </pre>
          ) : conversation.transcriptUrl ? (
            <Button variant="secondary" asChild>
              <a href={conversation.transcriptUrl} target="_blank" rel="noreferrer">
                Open transcript reference
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          ) : (
            <p className="text-sm leading-7 text-zinc-600">
              No transcript text was included in the webhook payload.
            </p>
          )}
        </CardContent>
      </Card>

      <details className="overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white shadow-card">
        <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-zinc-700">
          Provider details
        </summary>
        <div className="border-t border-zinc-200 px-6 py-4">
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Call ID</dt>
              <dd className="mt-1 break-all text-sm font-medium text-zinc-950">
                {conversation.vapiCallId}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Started</dt>
              <dd className="mt-1 text-sm font-medium text-zinc-950">
                {conversation.startedAt ? formatTimestamp(conversation.startedAt) : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Ended</dt>
              <dd className="mt-1 text-sm font-medium text-zinc-950">
                {conversation.endedAt ? formatTimestamp(conversation.endedAt) : "—"}
              </dd>
            </div>
          </dl>
        </div>
      </details>
    </div>
  );
}
