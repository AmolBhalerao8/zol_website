import { prisma } from "@/lib/prisma";

export async function getCustomerMemories(workspaceId: string, customerId: string) {
  return prisma.customerMemory.findMany({
    where: {
      workspaceId,
      customerId,
    },
    orderBy: [{ importanceScore: "desc" }, { createdAt: "desc" }],
    include: {
      conversation: {
        select: {
          id: true,
          summary: true,
          createdAt: true,
        },
      },
    },
  });
}
