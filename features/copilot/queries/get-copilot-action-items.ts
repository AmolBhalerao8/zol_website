import { prisma } from "@/lib/prisma";

export async function getOpenFollowUpsForCopilot(workspaceId: string) {
  return prisma.actionItem.findMany({
    where: {
      workspaceId,
      status: { in: ["OPEN", "IN_PROGRESS"] },
    },
    include: {
      conversation: {
        select: {
          id: true,
          customerName: true,
          summary: true,
        },
      },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    take: 8,
  });
}

export async function getCopilotPageStats(workspaceId: string) {
  const [conversationCount, followUpCount, urgentCount, appointmentsTomorrow] = await Promise.all([
    prisma.conversation.count({ where: { workspaceId } }),
    prisma.workflow.count({
      where: { workspaceId, status: { in: ["OPEN", "IN_PROGRESS"] }, type: "FOLLOW_UP" },
    }),
    prisma.workflow.count({
      where: {
        workspaceId,
        status: { in: ["OPEN", "IN_PROGRESS"] },
        priority: { in: ["HIGH", "URGENT"] },
        type: { not: "DAILY_SUMMARY" },
      },
    }),
    prisma.tekmetricAppointment.count({
      where: {
        workspaceId,
        scheduledAt: {
          gte: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            d.setHours(0, 0, 0, 0);
            return d;
          })(),
          lt: (() => {
            const d = new Date();
            d.setDate(d.getDate() + 2);
            d.setHours(0, 0, 0, 0);
            return d;
          })(),
        },
      },
    }),
  ]);

  return { conversationCount, followUpCount, urgentCount, appointmentsTomorrow };
}
