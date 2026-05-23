"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type BusinessHours,
  type Weekday,
  WEEKDAY_LABELS,
  WEEKDAYS,
} from "@/features/ai-employee/schemas/ai-employee-settings-schema";

type BusinessHoursEditorProps = {
  value: BusinessHours;
  onChange: (value: BusinessHours) => void;
  disabled?: boolean;
};

export function BusinessHoursEditor({ value, onChange, disabled }: BusinessHoursEditorProps) {
  function updateDay(day: Weekday, patch: Partial<BusinessHours[Weekday]>) {
    onChange({
      ...value,
      [day]: { ...value[day], ...patch },
    });
  }

  return (
    <div className="space-y-3">
      {WEEKDAYS.map((day) => {
        const schedule = value[day];

        return (
          <div
            key={day}
            className="grid gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 sm:grid-cols-[120px_1fr]"
          >
            <div className="flex items-center justify-between sm:block">
              <p className="text-sm font-medium text-zinc-900">{WEEKDAY_LABELS[day]}</p>
              <label className="mt-0 flex items-center gap-2 text-xs text-zinc-500 sm:mt-2">
                <input
                  type="checkbox"
                  checked={schedule.closed}
                  disabled={disabled}
                  onChange={(event) =>
                    updateDay(day, {
                      closed: event.target.checked,
                      open: event.target.checked ? undefined : "09:00",
                      close: event.target.checked ? undefined : "17:00",
                    })
                  }
                  className="rounded border-zinc-300"
                />
                Closed
              </label>
            </div>

            {!schedule.closed ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor={`${day}-open`}>Open</Label>
                  <Input
                    id={`${day}-open`}
                    type="time"
                    value={schedule.open ?? "09:00"}
                    disabled={disabled}
                    onChange={(event) => updateDay(day, { open: event.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`${day}-close`}>Close</Label>
                  <Input
                    id={`${day}-close`}
                    type="time"
                    value={schedule.close ?? "17:00"}
                    disabled={disabled}
                    onChange={(event) => updateDay(day, { close: event.target.value })}
                  />
                </div>
              </div>
            ) : (
              <p className="flex items-center text-sm text-zinc-500">Closed all day</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
