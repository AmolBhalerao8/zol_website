import type { IntegrationStatus } from "@prisma/client";

import { getIntegrationStatusLabel } from "@/features/integrations/utils/integration-credentials";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<IntegrationStatus, string> = {
  NOT_CONNECTED: "border-zinc-200 bg-zinc-50 text-zinc-700",
  CONNECTING: "border-amber-200 bg-amber-50 text-amber-900",
  CONNECTED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  FAILED: "border-red-200 bg-red-50 text-red-800",
};

type IntegrationStatusBadgeProps = {
  status: IntegrationStatus;
  className?: string;
};

export function IntegrationStatusBadge({ status, className }: IntegrationStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
        STATUS_STYLES[status],
        className,
      )}
    >
      {getIntegrationStatusLabel(status)}
    </span>
  );
}
