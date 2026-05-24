import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type OperationalInsightCardProps = {
  compact?: boolean;
};

export function OperationalInsightCard({ compact = false }: OperationalInsightCardProps) {
  if (compact) {
    return (
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-zinc-500">Operational Intelligence</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
              Search your business
            </h3>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-5 text-sm leading-7 text-zinc-600">
          Ask ZOL about your business operations, customers, conversations, and synced shop data.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/intelligence">Open Intelligence Search</Link>
        </Button>
      </Card>
    );
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-950 text-white shadow-premium">
      <div className="relative p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.18),transparent_24rem)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Operational Intelligence
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Ask ZOL about your business operations
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">
              Search conversations, customers, follow-ups, appointments, and repair context in
              natural language — grounded in your real workspace data.
            </p>
          </div>
          <Button variant="accent" size="lg" asChild>
            <Link href="/intelligence">Open Intelligence Search</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
