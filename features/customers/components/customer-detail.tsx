import Link from "next/link";
import { ArrowLeft, Brain, Mail, MessageSquareText, Phone, Sparkles, UserRound } from "lucide-react";
import type { ActionItem, Conversation, Customer, MemoryCategory } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerConversationsList } from "@/features/customers/components/customer-conversations-list";
import { getCustomerDisplayName } from "@/features/customers/utils/normalize-customer-identity";
import { CustomerMemoryList } from "@/features/memory/components/customer-memory-list";

type CustomerDetailProps = {
  customer: Customer & {
    _count: {
      conversationLinks: number;
      memories: number;
    };
    conversationLinks: Array<{
      conversation: Conversation & {
        actionItems: ActionItem[];
      };
    }>;
    memories: Array<{
      id: string;
      content: string;
      category: MemoryCategory;
      createdAt: Date;
      conversation: {
        id: string;
        summary: string | null;
        createdAt: Date;
      } | null;
    }>;
  };
  operationalSummary: string;
  firstInteraction: Date | null;
  latestInteraction: Date | null;
};

function formatTimestamp(value: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function CustomerDetail({
  customer,
  operationalSummary,
  firstInteraction,
  latestInteraction,
}: CustomerDetailProps) {
  const displayName = getCustomerDisplayName(customer);

  return (
    <div className="space-y-8">
      <Button variant="secondary" asChild>
        <Link href="/customers">
          <ArrowLeft className="h-4 w-4" />
          Back to customers
        </Link>
      </Button>

      <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-card">
        <div className="border-b border-zinc-200 px-6 py-6 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <UserRound className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                {displayName}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">
                What ZOL knows about this customer from past conversations.
              </p>
            </div>
          </div>
        </div>

        <dl className="grid gap-3 p-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {customer.primaryPhone ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Phone</dt>
              <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-950">
                <Phone className="h-4 w-4" />
                {customer.primaryPhone}
              </dd>
            </div>
          ) : null}
          {customer.primaryEmail ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Email</dt>
              <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-950">
                <Mail className="h-4 w-4" />
                {customer.primaryEmail}
              </dd>
            </div>
          ) : null}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">First interaction</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-950">
              {firstInteraction ? formatTimestamp(firstInteraction) : "—"}
            </dd>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Latest interaction</dt>
            <dd className="mt-1 text-sm font-semibold text-zinc-950">
              {latestInteraction ? formatTimestamp(latestInteraction) : "—"}
            </dd>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Conversations</dt>
            <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-950">
              <MessageSquareText className="h-4 w-4" />
              {customer._count.conversationLinks}
            </dd>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Things remembered</dt>
            <dd className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-950">
              <Brain className="h-4 w-4" />
              {customer._count.memories}
            </dd>
          </div>
        </dl>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">At a glance</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-600">
            A quick summary of this customer&apos;s history with your business.
          </p>
        </div>
        <Card className="border-emerald-200 bg-emerald-50/60 shadow-card">
          <CardContent className="flex gap-4 p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="text-sm leading-7 text-emerald-950">{operationalSummary}</p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">What ZOL remembers</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-600">
            Useful details from past conversations that help on the next call.
          </p>
        </div>
        <CustomerMemoryList memories={customer.memories} />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Conversation history</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-600">
            Every conversation linked to this customer, with summaries and follow-ups.
          </p>
        </div>
        <CustomerConversationsList conversationLinks={customer.conversationLinks} />
      </section>
    </div>
  );
}
