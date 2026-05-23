import { getAIEmployeeSettings } from "@/features/ai-employee/queries/get-ai-employee-settings";
import { DashboardOverview } from "@/features/dashboard";
import { getCurrentWorkspace } from "@/features/workspace";

export default async function DashboardPage() {
  const currentWorkspace = await getCurrentWorkspace();

  if (!currentWorkspace) {
    return null;
  }

  const aiSettings = await getAIEmployeeSettings(currentWorkspace.workspace.id);

  return (
    <DashboardOverview workspace={currentWorkspace.workspace} aiSettings={aiSettings} />
  );
}
