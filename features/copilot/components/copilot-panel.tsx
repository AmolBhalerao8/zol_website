"use client";

import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import type { CopilotRecommendation } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { refreshCopilotRecommendations } from "@/features/copilot/actions/refresh-copilot-recommendations";
import { FollowUpDraftCard } from "@/features/copilot/components/follow-up-draft-card";
import { OperationalInsightCard } from "@/features/copilot/components/operational-insight-card";
import { ReplyDraftCard } from "@/features/copilot/components/reply-draft-card";
import { RecommendationCard } from "@/features/copilot/components/recommendation-card";
import type { CopilotScope } from "@/features/copilot/types/copilot-types";

type CopilotPanelProps = {
  title: string;
  description: string;
  recommendations: CopilotRecommendation[];
  scope: CopilotScope;
  contextSummary?: string;
  showRefresh?: boolean;
};

function renderRecommendation(recommendation: CopilotRecommendation) {
  switch (recommendation.type) {
    case "REPLY_DRAFT":
      return <ReplyDraftCard key={recommendation.id} recommendation={recommendation} />;
    case "FOLLOW_UP":
      return <FollowUpDraftCard key={recommendation.id} recommendation={recommendation} />;
    case "DAILY_INSIGHT":
    case "CUSTOMER_INSIGHT":
      return <OperationalInsightCard key={recommendation.id} recommendation={recommendation} />;
    default:
      return <RecommendationCard key={recommendation.id} recommendation={recommendation} />;
  }
}

export function CopilotPanel({
  title,
  description,
  recommendations,
  scope,
  contextSummary,
  showRefresh = true,
}: CopilotPanelProps) {
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      await refreshCopilotRecommendations(scope);
    });
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-950">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">{description}</p>
        </div>
        {showRefresh ? (
          <Button variant="secondary" size="sm" onClick={handleRefresh} disabled={isPending}>
            <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
            Refresh suggestions
          </Button>
        ) : null}
      </div>

      {contextSummary ? (
        <Card className="border-zinc-200 bg-zinc-50/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Operational context
          </p>
          <pre className="mt-3 whitespace-pre-wrap text-sm leading-7 text-zinc-700">
            {contextSummary}
          </pre>
        </Card>
      ) : null}

      {recommendations.length === 0 ? (
        <Card className="border-dashed border-zinc-200 p-8 text-center">
          <p className="text-sm leading-7 text-zinc-600">
            ZOL will generate operational suggestions as more customer and workflow data becomes
            available.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">{recommendations.map(renderRecommendation)}</div>
      )}
    </section>
  );
}
