import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { MessageStats } from "@/features/messages/types/message-types";

type DashboardMessagingCardProps = {
  stats: MessageStats;
};

export function DashboardMessagingCard({ stats }: DashboardMessagingCardProps) {
  if (
    stats.pendingDrafts === 0 &&
    stats.awaitingApproval === 0 &&
    stats.sentToday === 0
  ) {
    return null;
  }

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <Card className="p-5">
        <p className="text-sm font-medium text-zinc-500">Pending drafts</p>
        <p className="mt-2 text-3xl font-semibold text-zinc-950">{stats.pendingDrafts}</p>
        <Link href="/messages/drafts" className="mt-3 inline-block text-sm font-semibold text-emerald-700">
          Review drafts
        </Link>
      </Card>
      <Card className="p-5">
        <p className="text-sm font-medium text-zinc-500">Awaiting approval</p>
        <p className="mt-2 text-3xl font-semibold text-zinc-950">{stats.awaitingApproval}</p>
        <Link href="/messages" className="mt-3 inline-block text-sm font-semibold text-emerald-700">
          Open communications
        </Link>
      </Card>
      <Card className="p-5">
        <p className="text-sm font-medium text-zinc-500">Messages sent today</p>
        <p className="mt-2 text-3xl font-semibold text-zinc-950">{stats.sentToday}</p>
        <Link href="/messages/history" className="mt-3 inline-block text-sm font-semibold text-emerald-700">
          View history
        </Link>
      </Card>
    </section>
  );
}
