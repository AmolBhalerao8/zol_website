"use client";

import { useTransition } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CopilotRecommendation } from "@prisma/client";

import { runWorkflowScan } from "@/features/workflows/actions/run-workflow-scan";
import { WorkflowCard } from "@/features/workflows/components/workflow-card";
import { WorkflowExamplesSection } from "@/features/workflows/components/workflow-examples-section";
import type { WorkflowWithSources } from "@/features/workflows/types/workflow-types";

type WorkflowListProps = {
  workflows: WorkflowWithSources[];
  canDismiss: boolean;
  recommendationsByWorkflowId?: Record<string, CopilotRecommendation[]>;
};

export function WorkflowList({
  workflows,
  canDismiss,
  recommendationsByWorkflowId = {},
}: WorkflowListProps) {
  const [isPending, startTransition] = useTransition();

  const handleScan = () => {
    startTransition(async () => {
      await runWorkflowScan();
    });
  };

  if (workflows.length === 0) {
    return (
      <div className="space-y-8">
        <div className="rounded-[1.5rem] border border-dashed border-zinc-200 bg-white p-8 text-center">
          <p className="text-lg font-semibold text-zinc-950">No active operational workflows</p>
          <p className="mt-3 text-sm leading-7 text-zinc-600">
            ZOL will proactively detect follow-ups, urgent issues, and operational gaps from your
            conversations and synced shop data.
          </p>
          <Button className="mt-6" onClick={handleScan} disabled={isPending}>
            <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
            Run operational scan
          </Button>
        </div>

        <WorkflowExamplesSection />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={handleScan} disabled={isPending}>
          <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
          Refresh scan
        </Button>
      </div>
      {workflows.map((workflow) => (
        <WorkflowCard
          key={workflow.id}
          workflow={workflow}
          canDismiss={canDismiss}
          copilotRecommendations={recommendationsByWorkflowId[workflow.id]}
        />
      ))}
    </div>
  );
}
