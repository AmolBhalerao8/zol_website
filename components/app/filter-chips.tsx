"use client";

import { cn } from "@/lib/utils";

export type FilterChip<TValue extends string> = {
  value: TValue;
  label: string;
  count?: number;
};

/**
 * Controlled chip row. State lives in the parent client component so the same
 * chips can drive a board filter or a status filter without a route change.
 */
export function FilterChips<TValue extends string>({
  chips,
  value,
  onChange,
  label,
}: {
  chips: FilterChip<TValue>[];
  value: TValue;
  onChange: (next: TValue) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const isActive = chip.value === value;
        return (
          <button
            key={chip.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(chip.value)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors",
              isActive
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-950",
            )}
          >
            {chip.label}
            {typeof chip.count === "number" ? (
              <span className={cn(isActive ? "text-zinc-400" : "text-zinc-400")}>{chip.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
