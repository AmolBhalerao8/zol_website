"use client";

import Link from "next/link";
import { useTransition } from "react";
import { ArrowRight, Check, EyeOff, MessageSquareText, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { updateWorkflowStatus } from "@/features/workflows/actions/update-workflow-status";
import { WorkflowPriorityBadge } from "@/features/workflows/components/workflow-priority-badge";
import {
  WORKFLOW_TYPE_LABELS,
  type WorkflowWithSources,
} from "@/features/workflows/types/workflow-types";

type WorkflowCardProps = {
  workflow: WorkflowWithSources;
  canDismiss: boolean;
};

function getInsightReason(workflow: WorkflowWithSources): string | null {
  const metadata = workflow.metadata as { insightReason?: string } | null;
  return metadata?.insightReason ?? null;
}

export function WorkflowCard({ workflow, canDismiss }: WorkflowCardProps) {
  const [isPending, startTransition] = useTransition();
  const insightReason = getInsightReason(workflow);
  const customerLabel =
    workflow.sourceCustomer?.name ??
    workflow.sourceConversation?.customerName ??
    null;

  const handleStatus = (status: "COMPLETED" | "DISMISSED") => {
    startTransition(async () => {
      await updateWorkflowStatus(workflow.id, status);
    });
  };

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {WORKFLOW_TYPE_LABELS[workflow.type]}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-zinc-950">{workflow.title}</h3>
        </div>
        <WorkflowPriorityBadge priority={workflow.priority} />
      </div>

      <p className="mt-4 text-sm leading-7 text-zinc-600">{workflow.description}</p>

      {insightReason ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm leading-7 text-emerald-950">
          {insightReason}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-4 text-sm text-zinc-500">
        {customerLabel ? (
          <span className="inline-flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            {customerLabel}
          </span>
        ) : null}
        {workflow.sourceConversation ? (
          <span className="inline-flex items-center gap-2">
            <MessageSquareText className="h-4 w-4" />
            Linked conversation
          </span>
        ) : null}
        <span>{new Date(workflow.createdAt).toLocaleString()}</span>
        <span className="font-medium capitalize text-zinc-700">
          {workflow.status.toLowerCase().replace("_", " ")}
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {workflow.sourceConversation ? (
          <Button variant="secondary" size="sm" asChild>
            <Link href={`/conversations/${workflow.sourceConversation.id}`}>
              View source <ArrowRight className="h-4 w-4" />
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
            Mark complete
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
