"use client";

import { UserButton } from "@clerk/nextjs";
import {
  Brain,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Network,
  Settings,
  UsersRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Conversations", href: "#", icon: MessageSquareText },
  { label: "Customers", href: "#", icon: UsersRound },
  { label: "Memory", href: "#", icon: Brain },
  { label: "Integrations", href: "#", icon: Network },
  { label: "Settings", href: "#", icon: Settings },
];

type DashboardShellProps = {
  children: ReactNode;
  workspaceName: string;
};

function SidebarContent({
  workspaceName,
  onNavigate,
}: {
  workspaceName: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-3 px-3" onClick={onNavigate}>
        <Image
          src="/zol-logo.png"
          alt=""
          width={40}
          height={40}
          priority
          className="rounded-full ring-1 ring-white/10"
        />
        <div>
          <p className="text-lg font-bold tracking-tight text-white">ZOL</p>
          <p className="truncate text-xs text-zinc-500">{workspaceName}</p>
        </div>
      </Link>

      <nav className="mt-10 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white",
              item.label === "Dashboard" && "bg-white/[0.08] text-white",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-sm font-semibold text-white">AI employee status</p>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Workspace setup is ready for the next onboarding step.
        </p>
      </div>
    </div>
  );
}

export function DashboardShell({ children, workspaceName }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-zinc-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-zinc-950 p-5 md:block">
        <SidebarContent workspaceName={workspaceName} />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-zinc-950/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-80 max-w-[86vw] bg-zinc-950 p-5 shadow-2xl">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 rounded-full border border-white/10 p-2 text-zinc-400"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent
              workspaceName={workspaceName}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      ) : null}

      <div className="md:pl-72">
        <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-[#f7f4ee]/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => setMobileOpen(true)}
                className="rounded-full border border-zinc-200 bg-white p-2 shadow-sm md:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div>
                <p className="text-sm font-medium text-zinc-500">{workspaceName}</p>
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Operational layer active
              </div>
              <UserButton />
            </div>
          </div>
        </header>

        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </main>
  );
}
