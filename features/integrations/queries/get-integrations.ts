import type { Integration, IntegrationProvider } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";

export type SafeIntegration = Pick<
  Integration,
  "id" | "provider" | "status" | "metadata" | "lastConnectedAt" | "lastSyncAt" | "updatedAt"
>;

export async function getIntegrations(workspaceId: string): Promise<SafeIntegration[]> {
  return withDbRetry(() =>
    prisma.integration.findMany({
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
    }),
  );
}

export async function getIntegrationByProvider(
  workspaceId: string,
  provider: IntegrationProvider,
): Promise<SafeIntegration | null> {
  return withDbRetry(() =>
    prisma.integration.findUnique({
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
    }),
  );
}

export async function getTekmetricIntegration(workspaceId: string): Promise<SafeIntegration | null> {
  return getIntegrationByProvider(workspaceId, "TEKMETRIC");
}

export async function getShopmonkeyIntegration(workspaceId: string): Promise<SafeIntegration | null> {
  return getIntegrationByProvider(workspaceId, "SHOPMONKEY");
}

export async function getIntegrationsByProvider(
  workspaceId: string,
): Promise<Partial<Record<IntegrationProvider, SafeIntegration | null>>> {
  const integrations = await getIntegrations(workspaceId);

  return integrations.reduce<Partial<Record<IntegrationProvider, SafeIntegration | null>>>(
    (acc, integration) => {
      acc[integration.provider] = integration;
      return acc;
    },
    {},
  );
}
