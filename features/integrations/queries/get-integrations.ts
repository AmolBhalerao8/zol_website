import type { Integration, IntegrationProvider } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type SafeIntegration = Pick<
  Integration,
  "id" | "provider" | "status" | "metadata" | "lastConnectedAt" | "lastSyncAt" | "updatedAt"
>;

export async function getIntegrations(workspaceId: string): Promise<SafeIntegration[]> {
  return prisma.integration.findMany({
    where: { workspaceId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      provider: true,
      status: true,
      metadata: true,
      lastConnectedAt: true,
      lastSyncAt: true,
      updatedAt: true,
    },
  });
}

export async function getIntegrationByProvider(
  workspaceId: string,
  provider: IntegrationProvider,
): Promise<SafeIntegration | null> {
  return prisma.integration.findUnique({
    where: {
      workspaceId_provider: {
        workspaceId,
        provider,
      },
    },
    select: {
      id: true,
      provider: true,
      status: true,
      metadata: true,
      lastConnectedAt: true,
      lastSyncAt: true,
      updatedAt: true,
    },
  });
}

export async function getTekmetricIntegration(workspaceId: string): Promise<SafeIntegration | null> {
  return getIntegrationByProvider(workspaceId, "TEKMETRIC");
}
