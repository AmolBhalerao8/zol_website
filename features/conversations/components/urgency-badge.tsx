import { cn } from "@/lib/utils";
import type { Urgency } from "@prisma/client";

const URGENCY_LABELS: Record<Urgency, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
  UNKNOWN: "Unknown",
};

const URGENCY_STYLES: Record<Urgency, string> = {
  LOW: "border-zinc-200 bg-zinc-50 text-zinc-700",
  MEDIUM: "border-amber-200 bg-amber-50 text-amber-800",
  HIGH: "border-orange-200 bg-orange-50 text-orange-800",
  URGENT: "border-red-200 bg-red-50 text-red-800",
  UNKNOWN: "border-zinc-200 bg-zinc-100 text-zinc-600",
};

type UrgencyBadgeProps = {
  urgency: Urgency;
  className?: string;
};

export function UrgencyBadge({ urgency, className }: UrgencyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
        URGENCY_STYLES[urgency],
        className,
      )}
    >
      {URGENCY_LABELS[urgency]}
    </span>
  );
}

export function getUrgencyLabel(urgency: Urgency): string {
  return URGENCY_LABELS[urgency];
}
