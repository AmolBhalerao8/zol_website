"use client";

import { useTransition } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { runWorkflowScan } from "@/features/workflows/actions/run-workflow-scan";
import { WorkflowCard } from "@/features/workflows/components/workflow-card";
import type { WorkflowWithSources } from "@/features/workflows/types/workflow-types";

type WorkflowListProps = {
  workflows: WorkflowWithSources[];
  canDismiss: boolean;
};

export function WorkflowList({ workflows, canDismiss }: WorkflowListProps) {
  const [isPending, startTransition] = useTransition();

  const handleScan = () => {
    startTransition(async () => {
      await runWorkflowScan();
    });
  };

  if (workflows.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-zinc-200 bg-white p-10 text-center">
        <p className="text-lg font-semibold text-zinc-950">All caught up</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-zinc-600">
          No follow-ups right now. ZOL will add items here when customers need a call back or
          something needs attention.
        </p>
        <Button className="mt-6" variant="secondary" onClick={handleScan} disabled={isPending}>
          <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
          Check again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={handleScan} disabled={isPending}>
          <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
          Check again
        </Button>
      </div>
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} canDismiss={canDismiss} />
      ))}
    </div>
  );
}
