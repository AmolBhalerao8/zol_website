import Link from "next/link";

import { cn } from "@/lib/utils";

type SetupInsightTileProps = {
  href: string;
  label: string;
  value: string;
  hint?: string;
  variant?: "default" | "attention";
};

export function SetupInsightTile({
  href,
  label,
  value,
  hint,
  variant = "default",
}: SetupInsightTileProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-2xl border p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        variant === "attention"
          ? "border-amber-400/30 bg-amber-400/[0.08] hover:border-amber-300/50 hover:bg-amber-400/[0.12]"
          : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]",
      )}
    >
      <dt className="text-xs uppercase tracking-[0.16em] text-zinc-400">{label}</dt>
      <dd
        className={cn(
          "mt-1 text-sm font-semibold",
          variant === "attention" ? "text-amber-100" : "text-white",
        )}
      >
        {value}
      </dd>
      {hint ? (
        <p
          className={cn(
            "mt-2 text-xs font-medium transition-colors",
            variant === "attention"
              ? "text-amber-200/90 group-hover:text-amber-100"
              : "text-zinc-500 group-hover:text-zinc-300",
          )}
        >
          {hint}
        </p>
      ) : null}
    </Link>
  );
}
