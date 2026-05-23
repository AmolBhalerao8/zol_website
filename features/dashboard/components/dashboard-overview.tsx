import Link from "next/link";
import {
  Brain,
  Check,
  Circle,
  ClipboardList,
  MessageSquareText,
  Network,
  Sparkles,
} from "lucide-react";
import type { AIEmployeeSettings, CommunicationChannel, Workspace } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  COMMUNICATION_TONE_LABELS,
  parseEnabledCapabilitiesJson,
} from "@/features/ai-employee/schemas/ai-employee-settings-schema";
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
  aiEmployeeUpdated?: boolean;
  assistantSync?: string;
};

export function DashboardOverview({
  workspace,
  aiSettings,
  communicationChannel,
  recentConversations,
  conversationStats,
  aiEmployeeUpdated = false,
  assistantSync,
}: DashboardOverviewProps) {
  const isAIConfigured = Boolean(aiSettings);
  const isVoiceChannelActive = communicationChannel?.status === "ACTIVE";
  const capabilitiesCount = aiSettings
    ? parseEnabledCapabilitiesJson(aiSettings.enabledCapabilities).length
    : 0;
  const hasBusinessContext = Boolean(aiSettings?.businessContext?.trim());

  const setupChecklist = [
    { label: "Account created", complete: true },
    { label: "Workspace created", complete: true },
    { label: "AI employee configured", complete: isAIConfigured },
    { label: "Voice channel active", complete: isVoiceChannelActive },
    { label: "Integrations pending", complete: false },
  ];

  const primaryCtaHref = !isAIConfigured
    ? "/setup/ai-employee"
    : !isVoiceChannelActive
      ? "/setup/voice-channel"
      : "/setup/voice-channel";

  const primaryCtaLabel = !isAIConfigured
    ? "Set Up AI Employee"
    : !isVoiceChannelActive
      ? "Activate AI Employee"
      : "Manage Voice Channel";

  const overviewCards = [
    {
      title: "Conversations",
      value:
        conversationStats.conversationCount > 0
          ? `${conversationStats.conversationCount} captured`
          : "Pending",
      body:
        conversationStats.conversationCount > 0
          ? "Customer calls are being captured and organized into summaries and action items."
          : "Customer calls and messages will appear here once your communication channel is connected.",
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
      value: `${conversationStats.openActionItemsCount} open`,
      body: "Quotes, follow-ups, appointments, and handoffs extracted from customer conversations.",
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

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {aiEmployeeUpdated ? <DashboardUpdateBanner assistantSync={assistantSync} /> : null}

      <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-card">
        <div className="border-b border-zinc-200 px-6 py-5 sm:px-8">
          <p className="text-sm font-medium text-zinc-500">Welcome to {workspace.name}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Your operational workspace is live
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Business Type:{" "}
            <span className="font-medium text-zinc-950">{workspace.businessType}</span>
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
                {isVoiceChannelActive
                  ? "Your AI employee is active"
                  : isAIConfigured
                    ? hasBusinessContext
                      ? "Activate your AI employee"
                      : "Complete your AI employee setup"
                    : "Teach ZOL about your business"}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">
                {isVoiceChannelActive
                  ? "Your communication channel is live. Keep business context current so ZOL stays aligned with how you operate."
                  : isAIConfigured
                    ? hasBusinessContext
                      ? "Choose a voice and activate your business communication channel to bring your AI employee online."
                      : "Add business context first, then activate your communication channel when you are ready."
                    : "Share business context so ZOL can handle customer communication and workflow organization intelligently."}
              </p>

              {isAIConfigured && aiSettings ? (
                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  <SetupInsightTile
                    href="/setup/ai-employee"
                    label="AI Employee"
                    value={aiSettings.displayName}
                    hint="Edit identity and greeting"
                  />
                  <SetupInsightTile
                    href="/setup/ai-employee"
                    label="Tone"
                    value={COMMUNICATION_TONE_LABELS[aiSettings.communicationTone]}
                    hint="Update communication style"
                  />
                  <SetupInsightTile
                    href="/setup/ai-employee"
                    label="Capabilities"
                    value={`${capabilitiesCount} enabled`}
                    hint="Adjust what ZOL can handle"
                  />
                  <SetupInsightTile
                    href="/setup/ai-employee"
                    label="Business Context"
                    value={hasBusinessContext ? "Added" : "Missing"}
                    hint={
                      hasBusinessContext
                        ? "Review or expand context"
                        : "Add context to improve responses"
                    }
                    variant={hasBusinessContext ? "default" : "attention"}
                  />
                  {isVoiceChannelActive && communicationChannel ? (
                    <>
                      <SetupInsightTile
                        href="/setup/voice-channel"
                        label="Communication number"
                        value={communicationChannel.phoneNumber ?? "Assigned"}
                        hint="Manage voice channel"
                      />
                      <SetupInsightTile
                        href="/setup/voice-channel"
                        label="Voice"
                        value={communicationChannel.voiceName}
                        hint="Change how ZOL sounds"
                      />
                    </>
                  ) : null}
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
              <div className="mt-6 space-y-3">
                <Button variant="accent" size="lg" className="w-full" asChild>
                  <Link href={primaryCtaHref}>{primaryCtaLabel}</Link>
                </Button>
                {isAIConfigured ? (
                  <Button variant="secondary" size="lg" className="w-full" asChild>
                    <Link href="/setup/ai-employee">Edit AI Employee</Link>
                  </Button>
                ) : null}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {isAIConfigured && aiSettings ? (
        <AIEmployeeConfigCard
          settings={aiSettings}
          hasBusinessContext={hasBusinessContext}
          isVoiceChannelActive={isVoiceChannelActive}
        />
      ) : null}

      <CommunicationChannelStatus channel={communicationChannel} isAIConfigured={isAIConfigured} />

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
