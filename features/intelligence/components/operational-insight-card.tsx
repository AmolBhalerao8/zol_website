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
            <p className="text-sm font-semibold text-zinc-500">Have a question?</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">Ask ZOL</h3>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-5 text-sm leading-7 text-zinc-600">
          Ask about customers, calls, appointments, or jobs in plain English.
        </p>
        <Button className="mt-6" variant="secondary" asChild>
          <Link href="/intelligence">Ask a question</Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-zinc-950">Ask ZOL anything</h3>
      <p className="mt-3 text-sm leading-7 text-zinc-600">
        Questions about customers, calls, appointments, or shop activity — answered from your
        real data.
      </p>
      <Button className="mt-6" asChild>
        <Link href="/intelligence">Open Ask ZOL</Link>
      </Button>
    </Card>
  );
}
