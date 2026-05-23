import { getCurrentWorkspace } from "@/features/workspace/queries/get-current-workspace";
import { prisma } from "@/lib/prisma";
import type { CommunicationChannel } from "@prisma/client";

export async function getCommunicationChannel(
  workspaceId: string,
): Promise<CommunicationChannel | null> {
  return prisma.communicationChannel.findUnique({
    where: { workspaceId },
  });
}

export async function getCommunicationChannelForCurrentWorkspace(): Promise<{
  channel: CommunicationChannel | null;
  workspaceId: string;
} | null> {
  const currentWorkspace = await getCurrentWorkspace();

  if (!currentWorkspace) {
    return null;
  }

  const channel = await getCommunicationChannel(currentWorkspace.workspace.id);

  return {
    channel,
    workspaceId: currentWorkspace.workspace.id,
  };
}
