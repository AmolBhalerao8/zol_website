"use client";

import { ZolProfileMenu } from "@/features/auth/components/zol-profile-menu";
import {
  Bot,
  LayoutDashboard,
  Lightbulb,
  Menu,
  MessageSquareText,
  Network,
  Settings,
  Sparkles,
  UsersRound,
  Workflow,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

import { cn } from "@/lib/utils";
import { getDashboardPageTitle, getSidebarStatusCopy } from "@/features/dashboard/utils/page-title";

const sidebarItems = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "ZOL setup", href: "/setup/ai-employee", icon: Bot },
  { label: "Calls", href: "/conversations", icon: MessageSquareText, showCount: true },
  { label: "Customers", href: "/customers", icon: UsersRound, showCustomerCount: true },
  { label: "Ask ZOL", href: "/intelligence", icon: Sparkles },
  { label: "Copilot", href: "/copilot", icon: Lightbulb },
  { label: "Follow-ups", href: "/workflows", icon: Workflow },
  { label: "Connections", href: "/integrations", icon: Network },
  { label: "Settings", href: "#", icon: Settings },
];

type DashboardShellProps = {
  children: ReactNode;
  workspaceName: string;
  conversationCount?: number;
  customerCount?: number;
  isVoiceChannelActive?: boolean;
  isAIConfigured?: boolean;
};

function SidebarContent({
  workspaceName,
  conversationCount = 0,
  customerCount = 0,
  isVoiceChannelActive = false,
  isAIConfigured = false,
  onNavigate,
}: {
  workspaceName: string;
  conversationCount?: number;
  customerCount?: number;
  isVoiceChannelActive?: boolean;
  isAIConfigured?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const sidebarStatus = getSidebarStatusCopy({ isVoiceChannelActive, isAIConfigured });

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
        {sidebarItems.map((item) => {
          const isActive =
            item.href !== "#" &&
            (pathname === item.href || pathname.startsWith(`${item.href}/`));

          return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white",
              isActive && "bg-white/[0.08] text-white",
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="flex-1">{item.label}</span>
            {"showCount" in item && item.showCount && conversationCount > 0 ? (
              <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-xs font-semibold text-orange-200">
                {conversationCount}
              </span>
            ) : null}
            {"showCustomerCount" in item && item.showCustomerCount && customerCount > 0 ? (
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-200">
                {customerCount}
              </span>
            ) : null}
          </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-3xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-sm font-semibold text-white">{sidebarStatus.title}</p>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{sidebarStatus.body}</p>
      </div>
    </div>
  );
}

export function DashboardShell({
  children,
  workspaceName,
  conversationCount = 0,
  customerCount = 0,
  isVoiceChannelActive = false,
  isAIConfigured = false,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle = getDashboardPageTitle(pathname);

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-zinc-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-zinc-950 p-5 md:block">
        <SidebarContent
          workspaceName={workspaceName}
          conversationCount={conversationCount}
          customerCount={customerCount}
          isVoiceChannelActive={isVoiceChannelActive}
          isAIConfigured={isAIConfigured}
        />
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
              conversationCount={conversationCount}
              customerCount={customerCount}
              isVoiceChannelActive={isVoiceChannelActive}
              isAIConfigured={isAIConfigured}
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
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{pageTitle}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isVoiceChannelActive ? (
                <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live on your business line
                </div>
              ) : null}
              <ZolProfileMenu />
            </div>
          </div>
        </header>

        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </main>
  );
}
