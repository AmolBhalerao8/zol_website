"use client";

import Link from "next/link";
import { useTransition } from "react";
import { ArrowRight, Check, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { updateWorkflowStatus } from "@/features/workflows/actions/update-workflow-status";
import { WorkflowPriorityBadge } from "@/features/workflows/components/workflow-priority-badge";
import type { WorkflowWithSources } from "@/features/workflows/types/workflow-types";

type WorkflowCardProps = {
  workflow: WorkflowWithSources;
  canDismiss: boolean;
};

export function WorkflowCard({ workflow, canDismiss }: WorkflowCardProps) {
  const [isPending, startTransition] = useTransition();
  const customerLabel =
    workflow.sourceCustomer?.name ?? workflow.sourceConversation?.customerName ?? null;

  const handleStatus = (status: "COMPLETED" | "DISMISSED") => {
    startTransition(async () => {
      await updateWorkflowStatus(workflow.id, status);
    });
  };

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {customerLabel ? (
            <p className="text-sm font-medium text-zinc-500">{customerLabel}</p>
          ) : null}
          <h3 className="mt-1 text-lg font-semibold text-zinc-950">{workflow.title}</h3>
        </div>
        {(workflow.priority === "HIGH" || workflow.priority === "URGENT") ? (
          <WorkflowPriorityBadge priority={workflow.priority} />
        ) : null}
      </div>

      <p className="mt-3 text-sm leading-7 text-zinc-600">{workflow.description}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {workflow.sourceConversation ? (
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/conversations/${workflow.sourceConversation.id}`}>
              View call <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : workflow.sourceCustomer ? (
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/customers/${workflow.sourceCustomer.id}`}>
              View customer <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}

        {workflow.status !== "COMPLETED" ? (
          <Button
            variant="secondary"
            size="sm"
            disabled={isPending}
            onClick={() => handleStatus("COMPLETED")}
          >
            <Check className="h-4 w-4" />
            Done
          </Button>
        ) : null}

        {canDismiss && workflow.status !== "DISMISSED" ? (
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => handleStatus("DISMISSED")}
          >
            <EyeOff className="h-4 w-4" />
            Dismiss
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
