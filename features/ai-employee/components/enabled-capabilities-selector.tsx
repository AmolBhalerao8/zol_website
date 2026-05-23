"use client";

import { cn } from "@/lib/utils";
import {
  ENABLED_CAPABILITY_OPTIONS,
  type ENABLED_CAPABILITY_VALUES,
} from "@/features/ai-employee/schemas/ai-employee-settings-schema";

type EnabledCapabilitiesSelectorProps = {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  error?: string;
};

export function EnabledCapabilitiesSelector({
  value,
  onChange,
  disabled,
  error,
}: EnabledCapabilitiesSelectorProps) {
  function toggleCapability(capability: (typeof ENABLED_CAPABILITY_VALUES)[number]) {
    if (disabled) {
      return;
    }

    if (value.includes(capability)) {
      onChange(value.filter((item) => item !== capability));
      return;
    }

    onChange([...value, capability]);
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {ENABLED_CAPABILITY_OPTIONS.map((capability) => {
          const checked = value.includes(capability.value);

          return (
            <label
              key={capability.value}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors",
                checked
                  ? "border-emerald-300 bg-emerald-50/70"
                  : "border-zinc-200 bg-white hover:border-zinc-300",
                disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <input
                type="checkbox"
                name="enabledCapabilities"
                value={capability.value}
                checked={checked}
                disabled={disabled}
                onChange={() => toggleCapability(capability.value)}
                className="mt-0.5 rounded border-zinc-300"
              />
              <span className="text-sm font-medium text-zinc-800">{capability.label}</span>
            </label>
          );
        })}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
