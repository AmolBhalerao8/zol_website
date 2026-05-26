import type { DailyOperationalInsights } from "@/features/copilot/types/copilot-types";
import { prisma } from "@/lib/prisma";

function startOfTomorrow(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfTomorrow(): Date {
  const date = startOfTomorrow();
  date.setDate(date.getDate() + 1);
  return date;
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export async function generateDailyOperationalInsights(
  workspaceId: string,
): Promise<DailyOperationalInsights> {
  const [
    conversationCount,
    urgentConversations,
    openWorkflows,
    followUpWorkflows,
    openActionItems,
    appointmentsTomorrow,
    pendingOrders,
    issueMemories,
  ] = await Promise.all([
    prisma.conversation.count({ where: { workspaceId } }),
    prisma.conversation.count({
      where: { workspaceId, urgency: "HIGH", status: "COMPLETED" },
    }),
    prisma.workflow.count({
      where: { workspaceId, status: { in: ["OPEN", "IN_PROGRESS"] }, type: { not: "DAILY_SUMMARY" } },
    }),
    prisma.workflow.count({
      where: { workspaceId, status: { in: ["OPEN", "IN_PROGRESS"] }, type: "FOLLOW_UP" },
    }),
    prisma.actionItem.count({
      where: { workspaceId, status: { in: ["OPEN", "IN_PROGRESS"] } },
    }),
    prisma.tekmetricAppointment.count({
      where: {
        workspaceId,
        scheduledAt: { gte: startOfTomorrow(), lt: endOfTomorrow() },
      },
    }),
    prisma.tekmetricRepairOrder.count({
      where: {
        workspaceId,
        OR: [
          { status: { contains: "pending", mode: "insensitive" } },
          { status: { contains: "open", mode: "insensitive" } },
        ],
      },
    }),
    prisma.customerMemory.count({
      where: { workspaceId, category: "ISSUE", createdAt: { gte: daysAgo(14) } },
    }),
  ]);

  const highlights: string[] = [];
  const customerIssues: string[] = [];
  const unresolvedConcerns: string[] = [];
  const workflowBottlenecks: string[] = [];

  if (conversationCount > 0) {
    highlights.push(`${conversationCount} conversation${conversationCount === 1 ? "" : "s"} captured by ZOL.`);
  }

  if (openWorkflows > 0) {
    highlights.push(`${openWorkflows} active operational workflow${openWorkflows === 1 ? "" : "s"} need attention.`);
  }

  if (followUpWorkflows > 0) {
    unresolvedConcerns.push(
      `${followUpWorkflows} customer${followUpWorkflows === 1 ? "" : "s"} may require follow-up.`,
    );
  }

  if (urgentConversations > 0) {
    customerIssues.push(
      `${urgentConversations} urgent conversation${urgentConversations === 1 ? "" : "s"} on record.`,
    );
  }

  if (issueMemories > 0) {
    customerIssues.push(
      `${issueMemories} recent issue memor${issueMemories === 1 ? "y" : "ies"} may indicate unresolved concerns.`,
    );
  }

  if (openActionItems > 0) {
    workflowBottlenecks.push(
      `${openActionItems} open action item${openActionItems === 1 ? "" : "s"} from conversations.`,
    );
  }

  if (pendingOrders > 0) {
    workflowBottlenecks.push(
      `${pendingOrders} repair order${pendingOrders === 1 ? "" : "s"} still pending.`,
    );
  }

  const appointmentLoad =
    appointmentsTomorrow > 0
      ? `${appointmentsTomorrow} appointment${appointmentsTomorrow === 1 ? "" : "s"} scheduled for tomorrow.`
      : null;

  if (highlights.length === 0) {
    highlights.push("ZOL is monitoring operations. Insights will appear as customer activity grows.");
  }

  return {
    highlights,
    customerIssues,
    unresolvedConcerns,
    workflowBottlenecks,
    appointmentLoad,
  };
}
