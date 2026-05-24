import { getAIEmployeeSettings } from "@/features/ai-employee/queries/get-ai-employee-settings";
import { DashboardOverview } from "@/features/dashboard";
import {
  getConversationStats,
  getRecentConversations,
} from "@/features/conversations/queries/get-conversations";
import { getCustomerStats } from "@/features/customers/queries/get-customers";
import { getCommunicationChannel } from "@/features/voice-channel/queries/get-communication-channel";
import { getCurrentWorkspace } from "@/features/workspace";

type DashboardPageProps = {
  searchParams: Promise<{
    aiEmployeeUpdated?: string;
    assistantSync?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const currentWorkspace = await getCurrentWorkspace();

  if (!currentWorkspace) {
    return null;
  }

  const params = await searchParams;

  const [aiSettings, communicationChannel, recentConversations, conversationStats, customerStats] =
    await Promise.all([
      getAIEmployeeSettings(currentWorkspace.workspace.id),
      getCommunicationChannel(currentWorkspace.workspace.id),
      getRecentConversations(currentWorkspace.workspace.id),
      getConversationStats(currentWorkspace.workspace.id),
      getCustomerStats(currentWorkspace.workspace.id),
    ]);

  return (
    <DashboardOverview
      workspace={currentWorkspace.workspace}
      aiSettings={aiSettings}
      communicationChannel={communicationChannel}
      recentConversations={recentConversations}
      conversationStats={conversationStats}
      customerCount={customerStats.customerCount}
      aiEmployeeUpdated={params.aiEmployeeUpdated === "1"}
      assistantSync={params.assistantSync}
    />
  );
}
