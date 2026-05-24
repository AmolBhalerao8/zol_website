import type { TekmetricSyncLog, TekmetricSyncStatus } from "@prisma/client";

import type { TekmetricSyncRecordCounts } from "@/features/integrations/services/tekmetric/types";
import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";

export type TekmetricSyncStatusSummary = {
  integrationConnected: boolean;
  lastSyncAt: Date | null;
  latestLog: Pick<
    TekmetricSyncLog,
    "id" | "status" | "startedAt" | "completedAt" | "errorMessage" | "recordsSynced"
  > | null;
  recordCounts: TekmetricSyncRecordCounts;
  syncHealth: "healthy" | "needs_sync" | "failed" | "not_connected";
};

function deriveSyncHealth(input: {
  integrationConnected: boolean;
  lastSyncAt: Date | null;
  latestStatus: TekmetricSyncStatus | null;
  totalRecords: number;
}): TekmetricSyncStatusSummary["syncHealth"] {
  if (!input.integrationConnected) {
    return "not_connected";
  }

  if (!input.lastSyncAt && input.totalRecords === 0) {
    return "needs_sync";
  }

  if (input.latestStatus === "FAILED") {
    return "failed";
  }

  if (input.lastSyncAt) {
    return "healthy";
  }

  return "needs_sync";
}

export async function getTekmetricSyncStatus(
  workspaceId: string,
): Promise<TekmetricSyncStatusSummary> {
  return withDbRetry(async () => {
    const integration = await prisma.integration.findUnique({
      where: {
        workspaceId_provider: {
          workspaceId,
          provider: "TEKMETRIC",
        },
      },
      select: {
        id: true,
        status: true,
        lastSyncAt: true,
      },
    });

    const integrationConnected = integration?.status === "CONNECTED";

    const [latestLog, customers, vehicles, appointments, repairOrders, linkedCustomers] =
      await Promise.all([
        integration
          ? prisma.tekmetricSyncLog.findFirst({
              where: { workspaceId, integrationId: integration.id },
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                status: true,
                startedAt: true,
                completedAt: true,
                errorMessage: true,
                recordsSynced: true,
              },
            })
          : Promise.resolve(null),
        prisma.tekmetricCustomer.count({ where: { workspaceId } }),
        prisma.tekmetricVehicle.count({ where: { workspaceId } }),
        prisma.tekmetricAppointment.count({ where: { workspaceId } }),
        prisma.tekmetricRepairOrder.count({ where: { workspaceId } }),
        prisma.tekmetricCustomer.count({
          where: { workspaceId, zolCustomerId: { not: null } },
        }),
      ]);

    const recordCounts: TekmetricSyncRecordCounts = {
      customers,
      vehicles,
      appointments,
      repairOrders,
      linkedCustomers,
    };

    const totalRecords =
      recordCounts.customers +
      recordCounts.vehicles +
      recordCounts.appointments +
      recordCounts.repairOrders;

    return {
      integrationConnected,
      lastSyncAt: integration?.lastSyncAt ?? null,
      latestLog,
      recordCounts,
      syncHealth: deriveSyncHealth({
        integrationConnected,
        lastSyncAt: integration?.lastSyncAt ?? null,
        latestStatus: latestLog?.status ?? null,
        totalRecords,
      }),
    };
  });
}
