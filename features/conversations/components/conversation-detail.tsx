import Link from "next/link";
import { ArrowLeft, ExternalLink, Phone, UserRound } from "lucide-react";
import type { ActionItem, Conversation, Urgency } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActionItemsList } from "@/features/conversations/components/action-items-list";
import {
  formatDuration,
  formatTimestamp,
  getCustomerLabel,
} from "@/features/conversations/components/conversation-card";
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
  const showUrgency =
    conversation.urgency === "HIGH" || conversation.urgency === "URGENT";

  return (
    <div className="space-y-6">
      <Button variant="secondary" asChild>
        <Link href="/conversations">
          <ArrowLeft className="h-4 w-4" />
          Back to calls
        </Link>
      </Button>

      <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-card">
        <div className="border-b border-zinc-200 px-6 py-6 sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">{customerLabel}</h1>
            {showUrgency ? <UrgencyBadge urgency={conversation.urgency as Urgency} /> : null}
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">
            {formatTimestamp(conversation.createdAt)}
            {conversation.durationSeconds ? ` · ${formatDuration(conversation.durationSeconds)}` : null}
          </p>
        </div>

        <dl className="grid gap-3 p-6 sm:grid-cols-2 sm:px-8">
          {conversation.customerPhone ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <dt className="text-sm text-zinc-500">Caller phone</dt>
              <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-950">
                <UserRound className="h-4 w-4" />
                {conversation.customerPhone}
              </dd>
            </div>
          ) : null}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-sm text-zinc-500">Your business line</dt>
            <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-950">
              <Phone className="h-4 w-4" />
              {conversation.communicationChannel.phoneNumber ?? "Assigned line"}
            </dd>
          </div>
          {conversation.customerLink ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:col-span-2">
              <dt className="text-sm text-emerald-700">Customer profile</dt>
              <dd className="mt-1">
                <Link
                  href={`/customers/${conversation.customerLink.customer.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-900"
                >
                  View customer
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </dd>
            </div>
          ) : null}
        </dl>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-7 text-zinc-700">
            {conversation.summary?.trim() ||
              "Summary is still being prepared. Check back in a moment."}
          </p>
        </CardContent>
      </Card>

      {conversation.recordingUrl ? (
        <Card>
          <CardHeader>
            <CardTitle>Recording</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" asChild>
              <a href={conversation.recordingUrl} target="_blank" rel="noreferrer">
                Listen to recording
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <ActionItemsList actionItems={conversation.actionItems} />

      {(conversation.transcript?.trim() || conversation.transcriptUrl) ? (
        <Card>
          <CardHeader>
            <CardTitle>Full transcript</CardTitle>
          </CardHeader>
          <CardContent>
            {conversation.transcript?.trim() ? (
              <pre className="whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-7 text-zinc-700">
                {conversation.transcript}
              </pre>
            ) : conversation.transcriptUrl ? (
              <Button variant="secondary" asChild>
                <a href={conversation.transcriptUrl} target="_blank" rel="noreferrer">
                  Open transcript
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
