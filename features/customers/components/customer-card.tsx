import Link from "next/link";
import { ArrowRight, Brain, Mail, MessageSquareText, Phone, UserRound } from "lucide-react";
import type { Customer } from "@prisma/client";

import { Card } from "@/components/ui/card";
import { getCustomerDisplayName } from "@/features/customers/utils/normalize-customer-identity";

type CustomerListItem = Customer & {
  _count: {
    conversationLinks: number;
    memories: number;
  };
  conversationLinks: Array<{
    conversation: {
      createdAt: Date;
      summary: string | null;
    };
  }>;
};

function formatTimestamp(value: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

type CustomerCardProps = {
  customer: CustomerListItem;
};

export function CustomerCard({ customer }: CustomerCardProps) {
  const displayName = getCustomerDisplayName(customer);
  const latestInteraction = customer.conversationLinks[0]?.conversation;

  return (
    <Link href={`/customers/${customer.id}`} className="block">
      <Card className="overflow-hidden border-zinc-200 bg-white shadow-card transition-all hover:border-emerald-200 hover:shadow-lg">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-zinc-950">{displayName}</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Customer since {formatTimestamp(customer.createdAt)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-zinc-600">
              {customer.primaryPhone ? (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  {customer.primaryPhone}
                </span>
              ) : null}
              {customer.primaryEmail ? (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  {customer.primaryEmail}
                </span>
              ) : null}
            </div>

            {latestInteraction?.summary ? (
              <p className="mt-4 line-clamp-2 text-sm leading-7 text-zinc-600">
                {latestInteraction.summary}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-center sm:min-w-32">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Conversations</p>
                <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-zinc-950">
                  <MessageSquareText className="h-4 w-4" />
                  {customer._count.conversationLinks}
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-center sm:min-w-32">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Memories</p>
                <p className="mt-1 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-zinc-950">
                  <Brain className="h-4 w-4" />
                  {customer._count.memories}
                </p>
              </div>
            </div>

            <div className="text-sm text-zinc-500">
              Latest interaction:{" "}
              <span className="font-medium text-zinc-800">
                {latestInteraction ? formatTimestamp(latestInteraction.createdAt) : "—"}
              </span>
            </div>

            <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
              View customer memory
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
