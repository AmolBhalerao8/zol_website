import {
  Brain,
  Check,
  Circle,
  ClipboardList,
  MessageSquareText,
  Network,
  Sparkles,
} from "lucide-react";
import type { Workspace } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const overviewCards = [
  {
    title: "Conversations",
    value: "Ready",
    body: "Customer calls and messages will appear here once your workspace is connected.",
    icon: MessageSquareText,
  },
  {
    title: "Customer Memory",
    value: "Empty",
    body: "ZOL will build reusable context from conversations, visits, orders, and service history.",
    icon: Brain,
  },
  {
    title: "Action Items",
    value: "0 open",
    body: "Quotes, callbacks, appointments, and handoffs will be organized here.",
    icon: ClipboardList,
  },
  {
    title: "Integrations",
    value: "Not connected",
    body: "Connect calendars, CRMs, commerce tools, and phone systems in a later setup step.",
    icon: Network,
  },
  {
    title: "Operational Insights",
    value: "Preparing",
    body: "Signals about missed opportunities, urgent requests, and follow-up will live here.",
    icon: Sparkles,
  },
];

const setupChecklist = [
  { label: "Account created", complete: true },
  { label: "Workspace created", complete: true },
  { label: "AI employee setup pending", complete: false },
  { label: "Integrations pending", complete: false },
];

type DashboardOverviewProps = {
  workspace: Workspace;
};

export function DashboardOverview({ workspace }: DashboardOverviewProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-card">
        <div className="border-b border-zinc-200 px-6 py-5 sm:px-8">
          <p className="text-sm font-medium text-zinc-500">Welcome to {workspace.name}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Your operational workspace is live
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Business Type: <span className="font-medium text-zinc-950">{workspace.businessType}</span>
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-950 text-white shadow-premium">
        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.2),transparent_24rem),radial-gradient(circle_at_0%_100%,rgba(251,146,60,0.14),transparent_22rem)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                Setup progress
              </div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Your workspace is ready
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">
                Next, connect your communication channels and configure your AI employee.
              </p>
            </div>

            <Card className="border-white/10 bg-white/[0.06] p-6 text-white shadow-none">
              <ul className="space-y-4">
                {setupChecklist.map((item) => (
                  <li key={item.label} className="flex items-center gap-3 text-sm">
                    {item.complete ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                        <Check className="h-4 w-4" />
                      </span>
                    ) : (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-zinc-500">
                        <Circle className="h-4 w-4" />
                      </span>
                    )}
                    <span className={item.complete ? "text-zinc-100" : "text-zinc-400"}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
              <Button variant="accent" size="lg" className="mt-6 w-full" asChild>
                <a href="#">Continue Setup</a>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {overviewCards.map((card) => (
          <Card key={card.title} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-500">{card.title}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
                  {card.value}
                </h3>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-zinc-600">{card.body}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
