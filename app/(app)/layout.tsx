import type { ReactNode } from "react";

import { AppBottomBar, AppRail } from "@/components/app/app-rail";
import { formatDate } from "@/components/app/format";
import { backOrderCount, getBoardStats, shop } from "@/lib/mock";

/**
 * Shell for the front-end-only product surface. Deliberately has no auth and
 * no data fetching -- every number below is derived from `lib/mock`.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  const stats = getBoardStats();
  const today = new Date();

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-zinc-950">
      <AppRail shopName={shop.name} />
      <AppBottomBar />

      <div className="md:pl-16 lg:pl-[220px]">
        <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-[#f7f4ee]/90 backdrop-blur">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 sm:px-8">
            <p className="flex items-center gap-2">
              <span aria-hidden className="app-led h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-700">Live</span>
            </p>
            <p className="text-sm font-semibold text-zinc-950">{shop.name}</p>
            <p className="font-mono text-[11px] text-zinc-500">{formatDate(today)}</p>

            <div className="ml-auto flex items-center gap-4">
              <span className="font-mono text-[11px] text-zinc-600">
                <span className="text-zinc-950">{stats.awaitingApproval}</span> awaiting approval
              </span>
              <span className="font-mono text-[11px] text-zinc-600">
                <span className="text-zinc-950">{backOrderCount}</span> back-ordered
              </span>
            </div>
          </div>
        </header>

        <main className="px-5 pb-28 pt-8 sm:px-8 md:pb-12">{children}</main>
      </div>
    </div>
  );
}
