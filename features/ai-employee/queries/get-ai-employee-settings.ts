import { getCurrentWorkspace } from "@/features/workspace/queries/get-current-workspace";
import { prisma } from "@/lib/prisma";
import type { AIEmployeeSettings } from "@prisma/client";

export async function getAIEmployeeSettings(
  workspaceId: string,
): Promise<AIEmployeeSettings | null> {
  return prisma.aIEmployeeSettings.findUnique({
    where: { workspaceId },
  });
}

export async function getAIEmployeeSettingsForCurrentWorkspace(): Promise<{
  settings: AIEmployeeSettings | null;
  workspaceId: string;
} | null> {
  const currentWorkspace = await getCurrentWorkspace();

  if (!currentWorkspace) {
    return null;
  }

  const settings = await getAIEmployeeSettings(currentWorkspace.workspace.id);

  return {
    settings,
    workspaceId: currentWorkspace.workspace.id,
  };
}
