import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Small shared building blocks for the `(app)` surface. These extend the
 * marketing/platform look already in the repo: white panels on the cream
 * ground, zinc text, emerald for anything ZOL did on its own, amber for
 * anything still waiting on a person.
 */

/** Uppercase mono label used for metadata and table headers. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Panel({
  children,
  className,
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "aside";
}) {
  return (
    <Tag className={cn("rounded-3xl border border-zinc-200/80 bg-white shadow-card", className)}>
      {children}
    </Tag>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-zinc-600">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="bg-white p-5">
      <Eyebrow>{label}</Eyebrow>
      <p className="mt-3 font-mono text-3xl font-semibold tracking-tight text-zinc-950">{value}</p>
      {hint ? <p className="mt-1 text-xs leading-5 text-zinc-500">{hint}</p> : null}
    </div>
  );
}

/**
 * Grid wrapper that renders hairline separators using `gap-px` over a tinted
 * parent, so tiles read as one continuous strip rather than floating cards.
 */
export function StatStrip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-200/80 shadow-card lg:grid-cols-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export type PillTone = "zol" | "human" | "neutral";

const PILL_TONES: Record<PillTone, string> = {
  // Emerald == ZOL acted on its own.
  zol: "border-emerald-600/30 bg-emerald-50 text-emerald-800",
  // Amber == a person is the blocker.
  human: "border-amber-600/30 bg-amber-50 text-amber-800",
  neutral: "border-zinc-300 bg-zinc-50 text-zinc-600",
};

export function StatusPill({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: PillTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] leading-4",
        PILL_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <p className="text-base font-semibold text-zinc-950">{title}</p>
      <p className="max-w-md text-sm leading-6 text-zinc-600">{body}</p>
      {action ? (
        <Link
          href={action.href}
          className="mt-2 rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
