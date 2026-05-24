import Link from "next/link";
import {
  Brain,
  Check,
  Circle,
  ClipboardList,
  MessageSquareText,
  Phone,
  Sparkles,
} from "lucide-react";
import type { AIEmployeeSettings, CommunicationChannel, Workspace } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AIEmployeeConfigCard } from "@/features/dashboard/components/ai-employee-config-card";
import { DashboardUpdateBanner } from "@/features/dashboard/components/dashboard-update-banner";
import { SetupInsightTile } from "@/features/dashboard/components/setup-insight-tile";
import { CommunicationChannelStatus } from "@/features/voice-channel/components/communication-channel-status";
import { RecentConversationsCard } from "@/features/conversations/components/recent-conversations-card";
import type { Conversation } from "@prisma/client";

type DashboardOverviewProps = {
  workspace: Workspace;
  aiSettings: AIEmployeeSettings | null;
  communicationChannel: CommunicationChannel | null;
  recentConversations: Array<
    Conversation & {
      _count: { actionItems: number };
    }
  >;
  conversationStats: {
    conversationCount: number;
    openActionItemsCount: number;
    urgentItemsCount: number;
  };
  customerCount: number;
  aiEmployeeUpdated?: boolean;
  assistantSync?: string;
};

export function DashboardOverview({
  workspace,
  aiSettings,
  communicationChannel,
  recentConversations,
  conversationStats,
  customerCount,
  aiEmployeeUpdated = false,
  assistantSync,
}: DashboardOverviewProps) {
  const isAIConfigured = Boolean(aiSettings);
  const isVoiceChannelActive = communicationChannel?.status === "ACTIVE";
  const hasBusinessContext = Boolean(aiSettings?.businessContext?.trim());

  const setupChecklist = [
    { label: "Account created", complete: true },
    { label: "Workspace created", complete: true },
    { label: "AI employee configured", complete: isAIConfigured },
    { label: "Voice channel active", complete: isVoiceChannelActive },
  ];

  const primaryCtaHref = !isAIConfigured
    ? "/setup/ai-employee"
    : !isVoiceChannelActive
      ? "/setup/voice-channel"
      : "/conversations";

  const primaryCtaLabel = !isAIConfigured
    ? "Set up AI employee"
    : !isVoiceChannelActive
      ? "Activate phone line"
      : "View conversations";

  const overviewCards = [
    {
      title: "Conversations",
      value:
        conversationStats.conversationCount > 0
          ? `${conversationStats.conversationCount} captured`
          : "Pending",
      body:
        conversationStats.conversationCount > 0
          ? "Customer calls ZOL has answered, summarized, and organized for your team."
          : "Calls will show up here once your phone line is active.",
      icon: MessageSquareText,
    },
    {
      title: "Customer Memory",
      value: customerCount > 0 ? `${customerCount} customers` : "Empty",
      body:
        customerCount > 0
          ? "ZOL remembers returning customers and keeps useful context from past conversations."
          : "ZOL will build reusable context from conversations, visits, orders, and service history.",
      icon: Brain,
    },
    {
      title: "Action Items",
      value: `${conversationStats.openActionItemsCount} open`,
      body: "Follow-ups, appointments, and handoffs pulled from customer conversations.",
      icon: ClipboardList,
    },
    {
      title: "Operational Insights",
      value: "Preparing",
      body: "Signals about missed opportunities, urgent requests, and follow-up will live here.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {aiEmployeeUpdated ? <DashboardUpdateBanner assistantSync={assistantSync} /> : null}

      <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-card">
        <div className="border-b border-zinc-200 px-6 py-5 sm:px-8">
          <p className="text-sm font-medium text-zinc-500">Welcome back</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            {workspace.name}
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            {workspace.businessType}
            {isVoiceChannelActive && communicationChannel?.phoneNumber ? (
              <>
                {" "}
                ·{" "}
                <span className="inline-flex items-center gap-1.5 font-medium text-zinc-950">
                  <Phone className="h-3.5 w-3.5" />
                  {communicationChannel.phoneNumber}
                </span>
              </>
            ) : null}
          </p>
        </div>
      </section>

      {!isVoiceChannelActive ? (
        <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-950 text-white shadow-premium">
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.2),transparent_24rem),radial-gradient(circle_at_0%_100%,rgba(251,146,60,0.14),transparent_22rem)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                  Setup progress
                </div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {isAIConfigured
                    ? hasBusinessContext
                      ? "Activate your phone line"
                      : "Finish teaching ZOL about your business"
                    : "Teach ZOL about your business"}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">
                  {isAIConfigured
                    ? hasBusinessContext
                      ? "Choose a voice and area code to give ZOL a business phone number."
                      : "Add a short business description, then activate your phone line when you are ready."
                    : "Start with your business name, greeting, and what customers usually ask about."}
                </p>

                {isAIConfigured && aiSettings ? (
                  <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                    <SetupInsightTile
                      href="/setup/ai-employee"
                      label="AI employee"
                      value={aiSettings.displayName}
                      hint="Edit name and greeting"
                    />
                    <SetupInsightTile
                      href="/setup/ai-employee"
                      label="Business context"
                      value={hasBusinessContext ? "Added" : "Missing"}
                      hint={
                        hasBusinessContext
                          ? "Review or expand context"
                          : "Add context to improve answers"
                      }
                      variant={hasBusinessContext ? "default" : "attention"}
                    />
                  </dl>
                ) : null}
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
                <div className="mt-6">
                  <Button variant="accent" size="lg" className="w-full" asChild>
                    <Link href={primaryCtaHref}>{primaryCtaLabel}</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
      ) : null}

      {isAIConfigured && aiSettings && !isVoiceChannelActive ? (
        <AIEmployeeConfigCard
          settings={aiSettings}
          hasBusinessContext={hasBusinessContext}
          isVoiceChannelActive={isVoiceChannelActive}
        />
      ) : null}

      <CommunicationChannelStatus
        channel={communicationChannel}
        isAIConfigured={isAIConfigured}
        compact={isVoiceChannelActive}
      />

      <RecentConversationsCard
        conversations={recentConversations}
        conversationCount={conversationStats.conversationCount}
        openActionItemsCount={conversationStats.openActionItemsCount}
        urgentItemsCount={conversationStats.urgentItemsCount}
      />

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
