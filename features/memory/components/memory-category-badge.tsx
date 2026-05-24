import type { MemoryCategory } from "@prisma/client";

import {
  MEMORY_CATEGORY_LABELS,
  MEMORY_CATEGORY_STYLES,
} from "@/features/memory/utils/memory-category-labels";
import { cn } from "@/lib/utils";

type MemoryCategoryBadgeProps = {
  category: MemoryCategory;
  className?: string;
};

export function MemoryCategoryBadge({ category, className }: MemoryCategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
        MEMORY_CATEGORY_STYLES[category],
        className,
      )}
    >
      {MEMORY_CATEGORY_LABELS[category]}
    </span>
  );
}
