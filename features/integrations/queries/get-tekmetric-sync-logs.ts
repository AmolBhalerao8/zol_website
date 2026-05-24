import { prisma } from "@/lib/prisma";
import { withDbRetry } from "@/lib/db-retry";

export async function getTekmetricSyncLogs(workspaceId: string, limit = 20) {
  return withDbRetry(() =>
    prisma.tekmetricSyncLog.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        status: true,
        startedAt: true,
        completedAt: true,
        errorMessage: true,
        recordsSynced: true,
        createdAt: true,
      },
    }),
  );
}

export async function getLatestTekmetricSyncLog(workspaceId: string) {
  return withDbRetry(() =>
    prisma.tekmetricSyncLog.findFirst({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        startedAt: true,
        completedAt: true,
        errorMessage: true,
        recordsSynced: true,
        createdAt: true,
      },
    }),
  );
}
