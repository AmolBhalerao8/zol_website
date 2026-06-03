import Link from "next/link";
import {
  Check,
  Circle,
  Phone,
} from "lucide-react";
import type { AIEmployeeSettings, CommunicationChannel, Conversation, Workspace } from "@prisma/client";
import type { DailyOperationalInsights } from "@/features/copilot/types/copilot-types";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AIEmployeeConfigCard } from "@/features/dashboard/components/ai-employee-config-card";
import { DashboardFollowUpsCard } from "@/features/dashboard/components/dashboard-follow-ups-card";
import { DashboardUpdateBanner } from "@/features/dashboard/components/dashboard-update-banner";
import { SetupInsightTile } from "@/features/dashboard/components/setup-insight-tile";
import { CommunicationChannelStatus } from "@/features/voice-channel/components/communication-channel-status";
import { RecentConversationsCard } from "@/features/conversations/components/recent-conversations-card";
import { OperationalInsightCard } from "@/features/intelligence/components/operational-insight-card";
import { TekmetricSyncDashboardCard } from "@/features/integrations/components/tekmetric-sync-dashboard-card";
import type { TekmetricSyncStatusSummary } from "@/features/integrations/queries/get-tekmetric-sync-status";
import { DailyCopilotInsightsCard } from "@/features/copilot/components/daily-copilot-insights-card";
import { DashboardMessagingCard } from "@/features/messages/components/dashboard-messaging-card";
import type { MessageStats } from "@/features/messages/types/message-types";

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
  tekmetricSyncStatus: TekmetricSyncStatusSummary;
  workflowStats: {
    activeCount: number;
    urgentCount: number;
    followUpCount: number;
    appointmentsTomorrow: number;
  };
  copilotInsights: DailyOperationalInsights;
  messageStats: MessageStats;
  canManageIntegrations: boolean;
  aiEmployeeUpdated?: boolean;
  assistantSync?: string;
};

export function DashboardOverview({
  workspace,
  aiSettings,
  communicationChannel,
  recentConversations,
  conversationStats,
  tekmetricSyncStatus,
  workflowStats,
  copilotInsights,
  messageStats,
  canManageIntegrations,
  aiEmployeeUpdated = false,
  assistantSync,
}: DashboardOverviewProps) {
  const isAIConfigured = Boolean(aiSettings);
  const isVoiceChannelActive = communicationChannel?.status === "ACTIVE";
  const hasBusinessContext = Boolean(aiSettings?.businessContext?.trim());

  const setupChecklist = [
    { label: "Account ready", complete: true },
    { label: "ZOL knows your business", complete: isAIConfigured },
    { label: "Phone line active", complete: isVoiceChannelActive },
  ];

  const primaryCtaHref = !isAIConfigured
    ? "/setup/ai-employee"
    : !isVoiceChannelActive
      ? "/setup/voice-channel"
      : "/conversations";

  const primaryCtaLabel = !isAIConfigured
    ? "Set up ZOL"
    : !isVoiceChannelActive
      ? "Activate phone line"
      : "View calls";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {aiEmployeeUpdated ? <DashboardUpdateBanner assistantSync={assistantSync} /> : null}

      <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-card">
        <div className="border-b border-zinc-200 px-6 py-5 sm:px-8">
          <p className="text-sm font-medium text-zinc-500">Welcome back</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            {workspace.name}
          </h2>
          {isVoiceChannelActive && communicationChannel?.phoneNumber ? (
            <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-zinc-600">
              <Phone className="h-4 w-4" />
              {communicationChannel.phoneNumber}
            </p>
          ) : null}
        </div>
      </section>

      {!isVoiceChannelActive ? (
        <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-950 text-white shadow-premium">
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.2),transparent_24rem),radial-gradient(circle_at_0%_100%,rgba(251,146,60,0.14),transparent_22rem)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {isAIConfigured
                    ? hasBusinessContext
                      ? "Activate your phone line"
                      : "Tell ZOL a bit more about your business"
                    : "Get ZOL ready for your business"}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">
                  {isAIConfigured
                    ? hasBusinessContext
                      ? "Pick a voice and area code so ZOL can answer your business phone."
                      : "Add a short description of your business, then turn on your phone line."
                    : "Start with your business name, greeting, and what customers usually ask about."}
                </p>

                {isAIConfigured && aiSettings ? (
                  <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                    <SetupInsightTile
                      href="/setup/ai-employee"
                      label="ZOL name"
                      value={aiSettings.displayName}
                      hint="Edit name and greeting"
                    />
                    <SetupInsightTile
                      href="/setup/ai-employee"
                      label="About your business"
                      value={hasBusinessContext ? "Added" : "Not added yet"}
                      hint={hasBusinessContext ? "Review or update" : "Add a short description"}
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

      <DashboardFollowUpsCard
        followUpCount={workflowStats.followUpCount}
        urgentCount={workflowStats.urgentCount}
      />

      <DashboardMessagingCard stats={messageStats} />

      <RecentConversationsCard
        conversations={recentConversations}
        conversationCount={conversationStats.conversationCount}
        openActionItemsCount={conversationStats.openActionItemsCount}
        urgentItemsCount={conversationStats.urgentItemsCount}
      />

      <section className="grid gap-4 md:grid-cols-2">
        <DailyCopilotInsightsCard insights={copilotInsights} />
        <OperationalInsightCard compact />
      </section>

      {tekmetricSyncStatus.integrationConnected ? null : (
        <TekmetricSyncDashboardCard
          syncStatus={tekmetricSyncStatus}
          canManage={canManageIntegrations}
        />
      )}
    </div>
  );
}
