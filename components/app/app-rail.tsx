"use client";

import { ClipboardList, LayoutGrid, PackageSearch, CalendarRange } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { label: "Board", href: "/board", icon: LayoutGrid },
  { label: "Repair orders", href: "/repair-orders", icon: ClipboardList },
  { label: "Schedule", href: "/schedule", icon: CalendarRange },
  { label: "Parts", href: "/parts", icon: PackageSearch },
];

function useIsActive(href: string): boolean {
  const pathname = usePathname();
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
}) {
  const isActive = useIsActive(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors",
        "lg:justify-start",
        isActive ? "bg-white/[0.08] text-white" : "text-zinc-400 hover:bg-white/[0.06] hover:text-white",
      )}
    >
      {/* Active marker: emerald edge bar. */}
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-full bg-emerald-500 transition-opacity",
          isActive ? "opacity-100" : "opacity-0",
        )}
      />
      <Icon aria-hidden className="h-4 w-4 shrink-0" />
      <span className="hidden lg:inline">{label}</span>
      <span className="sr-only lg:hidden">{label}</span>
    </Link>
  );
}

/** Desktop rail: 220px on lg and up, icon-only 64px below that. */
export function AppRail({ shopName }: { shopName: string }) {
  return (
    <nav
      aria-label="Application"
      className="fixed inset-y-0 left-0 z-30 hidden w-16 flex-col border-r border-white/10 bg-zinc-950 p-3 md:flex lg:w-[220px] lg:p-5"
    >
      <Link href="/" className="flex items-center gap-3 px-1 lg:px-2">
        <Image src="/zol-logo.png" alt="" width={32} height={32} className="rounded-full ring-1 ring-white/10" />
        <span className="hidden lg:block">
          <span className="block text-base font-bold tracking-tight text-white">ZOL</span>
          <span className="block truncate text-xs text-zinc-500">{shopName}</span>
        </span>
        <span className="sr-only">ZOL home</span>
      </Link>

      <div className="mt-8 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </div>

      <div className="mt-auto hidden lg:block">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">Shop</p>
          <p className="mt-1 truncate text-sm font-medium text-white">{shopName}</p>
        </div>
      </div>
    </nav>
  );
}

/** Mobile: the same destinations as a bottom bar. */
export function AppBottomBar() {
  return (
    <nav
      aria-label="Application"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-zinc-950 md:hidden"
    >
      <ul className="grid grid-cols-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <BottomBarLink {...item} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function BottomBarLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: typeof LayoutGrid;
}) {
  const isActive = useIsActive(href);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex flex-col items-center gap-1 px-2 py-3 text-[11px] transition-colors",
        isActive ? "text-white" : "text-zinc-500 hover:text-zinc-200",
      )}
    >
      <Icon aria-hidden className="h-5 w-5" />
      <span className="truncate">{label}</span>
    </Link>
  );
}
