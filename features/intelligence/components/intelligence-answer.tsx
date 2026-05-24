import { Sparkles } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { SourceRecordCard } from "@/features/intelligence/components/source-record-card";
import type { IntelligenceQueryResult } from "@/features/intelligence/types/intelligence-types";

type IntelligenceAnswerProps = {
  result: IntelligenceQueryResult;
};

export function IntelligenceAnswer({ result }: IntelligenceAnswerProps) {
  return (
    <section className="space-y-6">
      <Card className="overflow-hidden border-emerald-200 bg-emerald-50/60 shadow-card">
        <CardContent className="p-6 sm:p-8">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Operational answer
              </p>
              <p className="mt-3 text-base leading-8 text-emerald-950">{result.answer}</p>
              {result.summary && result.summary !== result.answer ? (
                <p className="mt-4 text-sm leading-7 text-emerald-900/80">{result.summary}</p>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {result.followUpInsights.length > 0 ? (
        <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-6 shadow-card">
          <p className="text-sm font-semibold text-zinc-950">Suggested follow-up insights</p>
          <ul className="mt-3 space-y-2 text-sm leading-7 text-zinc-600">
            {result.followUpInsights.map((insight) => (
              <li key={insight}>• {insight}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.sources.length > 0 ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
              Supporting records
            </h2>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              Operational sources ZOL used to ground this answer.
            </p>
          </div>
          <div className="grid gap-3">
            {result.sources.slice(0, 12).map((source) => (
              <SourceRecordCard key={`${source.type}-${source.id}`} source={source} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
