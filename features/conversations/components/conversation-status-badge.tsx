import { cn } from "@/lib/utils";
import type { ConversationStatus } from "@prisma/client";

const STATUS_LABELS: Record<ConversationStatus, string> = {
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  FAILED: "Failed",
};

const STATUS_STYLES: Record<ConversationStatus, string> = {
  PROCESSING: "border-sky-200 bg-sky-50 text-sky-800",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  FAILED: "border-red-200 bg-red-50 text-red-800",
};

type ConversationStatusBadgeProps = {
  status: ConversationStatus;
  className?: string;
};

export function ConversationStatusBadge({ status, className }: ConversationStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
        STATUS_STYLES[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function getConversationStatusLabel(status: ConversationStatus): string {
  return STATUS_LABELS[status];
}
