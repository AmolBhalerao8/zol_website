import { prisma } from "@/lib/prisma";

export async function getCustomers(
  workspaceId: string,
  search?: string | null,
) {
  const query = search?.trim();

  return prisma.customer.findMany({
    where: {
      workspaceId,
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { primaryPhone: { contains: query, mode: "insensitive" } },
              { primaryEmail: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCustomerStats(workspaceId: string) {
  const customerCount = await prisma.customer.count({
    where: { workspaceId },
  });

  return { customerCount };
}

export async function getCustomerById(workspaceId: string, customerId: string) {
  return prisma.customer.findFirst({
    where: {
      id: customerId,
      workspaceId,
    },
    include: {
      _count: {
        select: {
          conversationLinks: true,
          memories: true,
        },
      },
      conversationLinks: {
        orderBy: { createdAt: "desc" },
        include: {
          conversation: {
            include: {
              actionItems: {
                orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
              },
            },
          },
        },
      },
      memories: {
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
      },
    },
  });
}
