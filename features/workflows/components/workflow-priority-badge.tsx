import type { WorkflowPriority } from "@prisma/client";

import { cn } from "@/lib/utils";

const PRIORITY_STYLES: Record<WorkflowPriority, string> = {
  LOW: "border-zinc-200 bg-zinc-50 text-zinc-600",
  MEDIUM: "border-amber-200 bg-amber-50 text-amber-800",
  HIGH: "border-orange-200 bg-orange-50 text-orange-800",
  URGENT: "border-red-200 bg-red-50 text-red-800",
};

type WorkflowPriorityBadgeProps = {
  priority: WorkflowPriority;
  className?: string;
};

export function WorkflowPriorityBadge({ priority, className }: WorkflowPriorityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
        PRIORITY_STYLES[priority],
        className,
      )}
    >
      {priority.toLowerCase()}
    </span>
  );
}
