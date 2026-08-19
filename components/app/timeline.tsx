import { Bot, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/lib/mock/types";
import { formatDateTime } from "./format";

/**
 * Reverse-chronological history of one repair order. Emerald marks work ZOL
 * did unattended; amber marks work a person did. This is the screen that shows
 * the owner what they slept through, so the actor distinction carries it.
 */
export function Timeline({ events }: { events: TimelineEvent[] }) {
  const ordered = [...events].sort((a, b) => b.at.getTime() - a.at.getTime());

  return (
    <ol className="relative space-y-6 pl-8">
      <span aria-hidden className="absolute left-[15px] top-2 bottom-2 w-px bg-zinc-200" />
      {ordered.map((event) => {
        const isZol = event.actor === "zol";
        const Icon = isZol ? Bot : UserRound;
        return (
          <li key={event.id} className="relative">
            <span
              className={cn(
                "absolute -left-8 flex h-8 w-8 items-center justify-center rounded-full border",
                isZol
                  ? "border-emerald-600/30 bg-emerald-50 text-emerald-700"
                  : "border-amber-600/30 bg-amber-50 text-amber-700",
              )}
            >
              <Icon aria-hidden className="h-4 w-4" />
              <span className="sr-only">{isZol ? "Done by ZOL" : "Done by a person"}</span>
            </span>
            <div className="pt-1">
              <p className="text-sm font-medium text-zinc-950">{event.label}</p>
              {event.detail ? (
                <p className="mt-1 text-sm leading-6 text-zinc-600">{event.detail}</p>
              ) : null}
              <time dateTime={event.at.toISOString()} className="mt-1 block font-mono text-[11px] text-zinc-500">
                {formatDateTime(event.at)}
              </time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
