import { getAIEmployeeSettings } from "@/features/ai-employee/queries/get-ai-employee-settings";
import { getCustomerStats } from "@/features/customers/queries/get-customers";
import { getConversationStats } from "@/features/conversations/queries/get-conversations";
import { getCommunicationChannel } from "@/features/voice-channel/queries/get-communication-channel";
import { withDbRetry } from "@/lib/db-retry";

export async function getDashboardShellProps(workspaceId: string) {
  const [conversationStats, customerStats, communicationChannel, aiSettings] = await withDbRetry(() =>
    Promise.all([
      getConversationStats(workspaceId),
      getCustomerStats(workspaceId),
      getCommunicationChannel(workspaceId),
      getAIEmployeeSettings(workspaceId),
    ]),
  );

  return {
    conversationCount: conversationStats.conversationCount,
    customerCount: customerStats.customerCount,
    isVoiceChannelActive: communicationChannel?.status === "ACTIVE",
    isAIConfigured: Boolean(aiSettings),
  };
}
