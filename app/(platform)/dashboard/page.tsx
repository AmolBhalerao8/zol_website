import { getAIEmployeeSettings } from "@/features/ai-employee/queries/get-ai-employee-settings";
import { DashboardOverview } from "@/features/dashboard";
import { getCommunicationChannel } from "@/features/voice-channel/queries/get-communication-channel";
import { getCurrentWorkspace } from "@/features/workspace";

export default async function DashboardPage() {
  const currentWorkspace = await getCurrentWorkspace();

  if (!currentWorkspace) {
    return null;
  }

  const [aiSettings, communicationChannel] = await Promise.all([
    getAIEmployeeSettings(currentWorkspace.workspace.id),
    getCommunicationChannel(currentWorkspace.workspace.id),
  ]);

  return (
    <DashboardOverview
      workspace={currentWorkspace.workspace}
      aiSettings={aiSettings}
      communicationChannel={communicationChannel}
    />
  );
}
