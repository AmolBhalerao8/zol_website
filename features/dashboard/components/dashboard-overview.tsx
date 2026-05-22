import {
  Brain,
  ClipboardList,
  MessageSquareText,
  Network,
  Sparkles,
} from "lucide-react";

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

export function DashboardOverview() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-950 text-white shadow-premium">
        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.2),transparent_24rem),radial-gradient(circle_at_0%_100%,rgba(251,146,60,0.14),transparent_22rem)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                Step 1 complete
              </div>
              <h2 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Set up your business workspace
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">
                Connect your workflows and configure your AI employee.
              </p>
            </div>
            <Button variant="accent" size="lg" asChild>
              <a href="#">Continue Setup</a>
            </Button>
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
