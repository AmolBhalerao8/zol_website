"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { CopilotRecommendation } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
    <Card className={cn("border-zinc-200 bg-white p-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-950">{recommendation.title}</h3>
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
