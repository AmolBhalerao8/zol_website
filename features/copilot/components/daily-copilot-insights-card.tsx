import Link from "next/link";
import { Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DailyOperationalInsights } from "@/features/copilot/types/copilot-types";

type DailyCopilotInsightsCardProps = {
  insights: DailyOperationalInsights;
};

export function DailyCopilotInsightsCard({ insights }: DailyCopilotInsightsCardProps) {
  const items = [
    ...insights.highlights,
    ...insights.customerIssues,
    ...insights.unresolvedConcerns,
    ...insights.workflowBottlenecks,
    ...(insights.appointmentLoad ? [insights.appointmentLoad] : []),
  ].slice(0, 4);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-500">Daily operational insights</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
            Copilot highlights
          </h3>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
          <Lightbulb className="h-5 w-5" />
        </div>
      </div>

      <ul className="mt-5 space-y-2 text-sm leading-7 text-zinc-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <Button className="mt-6" variant="secondary" asChild>
        <Link href="/copilot">Open operational copilot</Link>
      </Button>
    </Card>
  );
}
