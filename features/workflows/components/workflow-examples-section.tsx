import type { WorkflowPriority, WorkflowType } from "@prisma/client";

import { Card } from "@/components/ui/card";
import { WorkflowPriorityBadge } from "@/features/workflows/components/workflow-priority-badge";
import { WORKFLOW_TYPE_LABELS } from "@/features/workflows/types/workflow-types";

const WORKFLOW_EXAMPLES: Array<{
  type: WorkflowType;
  title: string;
  description: string;
  priority: WorkflowPriority;
  insightReason: string;
}> = [
  {
    type: "URGENT_ISSUE",
    title: "Urgent customer issue unresolved",
    description:
      "A customer reported an urgent brake concern that still has open operational next steps.",
    priority: "URGENT",
    insightReason:
      "ZOL detected an urgent customer conversation that still has unresolved operational next steps.",
  },
  {
    type: "FOLLOW_UP",
    title: "Customer waiting for follow-up",
    description:
      "A customer has an open callback action that has been waiting longer than expected without resolution.",
    priority: "HIGH",
    insightReason:
      "ZOL noticed an open follow-up that has been waiting longer than expected without resolution.",
  },
  {
    type: "REPEATED_ISSUE",
    title: "Repeated service concern detected",
    description:
      "The same customer has multiple recorded issue memories that may indicate an unresolved pattern.",
    priority: "HIGH",
    insightReason:
      "ZOL detected repeated issue memories for the same customer, suggesting a recurring unresolved concern.",
  },
  {
    type: "APPOINTMENT_REMINDER",
    title: "Tomorrow's appointment missing confirmation",
    description:
      "An appointment is scheduled for tomorrow and may still need confirmation before service.",
    priority: "MEDIUM",
    insightReason:
      "ZOL found a scheduled appointment that may still need confirmation before service.",
  },
];

export function WorkflowExamplesSection() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-zinc-500">What ZOL detects</p>
        <p className="mt-1 text-sm leading-7 text-zinc-600">
          Examples of operational workflows ZOL generates automatically from conversations and
          synced shop data.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {WORKFLOW_EXAMPLES.map((example) => (
          <Card key={example.type} className="border-dashed border-zinc-200 bg-zinc-50/50 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    {WORKFLOW_TYPE_LABELS[example.type]}
                  </p>
                  <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
                    Example
                  </span>
                </div>
                <h3 className="mt-2 text-base font-semibold text-zinc-950">{example.title}</h3>
              </div>
              <WorkflowPriorityBadge priority={example.priority} />
            </div>

            <p className="mt-3 text-sm leading-7 text-zinc-600">{example.description}</p>

            <div className="mt-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 px-4 py-3 text-sm leading-7 text-emerald-950">
              {example.insightReason}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
