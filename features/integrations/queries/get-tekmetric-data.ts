import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";

export async function getTekmetricDataOverview(workspaceId: string) {
  return withDbRetry(() =>
    Promise.all([
      prisma.tekmetricCustomer.findMany({
        where: { workspaceId },
        orderBy: { updatedAt: "desc" },
        take: 100,
        select: {
          id: true,
          externalId: true,
          name: true,
          phone: true,
          email: true,
          zolCustomerId: true,
          lastSyncedAt: true,
          zolCustomer: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.tekmetricVehicle.findMany({
        where: { workspaceId },
        orderBy: { updatedAt: "desc" },
        take: 100,
        select: {
          id: true,
          externalId: true,
          year: true,
          make: true,
          model: true,
          vin: true,
          tekmetricCustomerId: true,
          zolCustomerId: true,
          lastSyncedAt: true,
        },
      }),
      prisma.tekmetricAppointment.findMany({
        where: { workspaceId },
        orderBy: { scheduledAt: "desc" },
        take: 100,
        select: {
          id: true,
          externalId: true,
          scheduledAt: true,
          status: true,
          summary: true,
          tekmetricCustomerId: true,
          zolCustomerId: true,
          lastSyncedAt: true,
        },
      }),
      prisma.tekmetricRepairOrder.findMany({
        where: { workspaceId },
        orderBy: { updatedAt: "desc" },
        take: 100,
        select: {
          id: true,
          externalId: true,
          status: true,
          totalAmount: true,
          summary: true,
          tekmetricCustomerId: true,
          zolCustomerId: true,
          lastSyncedAt: true,
        },
      }),
    ]),
  );
}

export async function getTekmetricDataForCustomer(workspaceId: string, zolCustomerId: string) {
  return withDbRetry(() =>
    Promise.all([
      prisma.tekmetricCustomer.findMany({
        where: { workspaceId, zolCustomerId },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          externalId: true,
          name: true,
          phone: true,
          email: true,
          lastSyncedAt: true,
        },
      }),
      prisma.tekmetricVehicle.findMany({
        where: { workspaceId, zolCustomerId },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          externalId: true,
          year: true,
          make: true,
          model: true,
          vin: true,
          lastSyncedAt: true,
        },
      }),
      prisma.tekmetricAppointment.findMany({
        where: { workspaceId, zolCustomerId },
        orderBy: { scheduledAt: "desc" },
        select: {
          id: true,
          externalId: true,
          scheduledAt: true,
          status: true,
          summary: true,
          lastSyncedAt: true,
        },
      }),
      prisma.tekmetricRepairOrder.findMany({
        where: { workspaceId, zolCustomerId },
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          externalId: true,
          status: true,
          totalAmount: true,
          summary: true,
          lastSyncedAt: true,
        },
      }),
    ]),
  );
}

export async function hasTekmetricDataForCustomer(
  workspaceId: string,
  zolCustomerId: string,
): Promise<boolean> {
  const count = await withDbRetry(() =>
    prisma.tekmetricCustomer.count({
      where: { workspaceId, zolCustomerId },
    }),
  );

  return count > 0;
}
