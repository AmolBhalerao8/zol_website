"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { CopilotRecommendation } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RECOMMENDATION_TYPE_LABELS } from "@/features/copilot/types/copilot-types";
import { cn } from "@/lib/utils";

const TYPE_STYLES: Record<CopilotRecommendation["type"], string> = {
  REPLY_DRAFT: "border-zinc-200 bg-white",
  FOLLOW_UP: "border-blue-200 bg-blue-50/40",
  OPERATIONAL_ALERT: "border-orange-200 bg-orange-50/40",
  WORKFLOW_SUGGESTION: "border-violet-200 bg-violet-50/40",
  CUSTOMER_INSIGHT: "border-emerald-200 bg-emerald-50/40",
  DAILY_INSIGHT: "border-zinc-200 bg-zinc-50",
};

type RecommendationCardProps = {
  recommendation: CopilotRecommendation;
  showCopy?: boolean;
  className?: string;
};

export function RecommendationCard({
  recommendation,
  showCopy = false,
  className,
}: RecommendationCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(recommendation.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={cn("p-5", TYPE_STYLES[recommendation.type], className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {RECOMMENDATION_TYPE_LABELS[recommendation.type]}
          </p>
          <h3 className="mt-2 text-base font-semibold text-zinc-950">{recommendation.title}</h3>
        </div>
        {showCopy ? (
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-7 text-zinc-700">{recommendation.content}</p>
    </Card>
  );
}
