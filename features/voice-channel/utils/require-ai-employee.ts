import { redirect } from "next/navigation";

import { getAIEmployeeSettings } from "@/features/ai-employee/queries/get-ai-employee-settings";
import { requireWorkspace } from "@/features/workspace";

export async function requireAIEmployeeSettings() {
  const currentWorkspace = await requireWorkspace();
  const aiSettings = await getAIEmployeeSettings(currentWorkspace.workspace.id);

  if (!aiSettings) {
    redirect("/setup/ai-employee");
  }

  return {
    ...currentWorkspace,
    aiSettings,
  };
}
