import type { ClassifiedIntelligenceQuery, IntelligenceRetrievalResult } from "@/features/intelligence/types/intelligence-types";
import { prisma } from "@/lib/prisma";

const OPEN_STATUSES = ["open", "in progress", "estimate", "pending", "scheduled"];

export async function retrieveRepairOrders(
  workspaceId: string,
  classified: ClassifiedIntelligenceQuery,
): Promise<IntelligenceRetrievalResult> {
  const openOnly = classified.filters.openOnly === "true";

  const repairOrders = await prisma.tekmetricRepairOrder.findMany({
    where: { workspaceId },
    orderBy: { updatedAt: "desc" },
    take: 30,
    select: {
      id: true,
      externalId: true,
      status: true,
      totalAmount: true,
      summary: true,
      zolCustomerId: true,
      updatedAt: true,
    },
  });

  const filtered = openOnly
    ? repairOrders.filter((order) => {
        const status = order.status?.toLowerCase() ?? "";
        return OPEN_STATUSES.some((value) => status.includes(value)) || status !== "completed";
      })
    : repairOrders;

  const results = filtered.slice(0, 20);

  return {
    queryType: "repair_orders",
    recordCount: results.length,
    payload: {
      repairOrders: results.map((order) => ({
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        summary: order.summary,
        zolCustomerId: order.zolCustomerId,
        updatedAt: order.updatedAt.toISOString(),
      })),
    },
    sources: results.map((order) => ({
      id: order.id,
      type: "repair_order" as const,
      title: order.status ?? "Repair order",
      summary: order.summary ?? "Synced repair order",
      metadata: {
        total: order.totalAmount ?? "—",
        externalId: order.externalId,
      },
    })),
  };
}
