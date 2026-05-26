import type { DailySummaryContent } from "@/features/workflows/types/workflow-types";
import { prisma } from "@/lib/prisma";

function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

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

export async function generateDailyOperationalSummary(
  workspaceId: string,
): Promise<DailySummaryContent> {
  const todayStart = startOfToday();
  const tomorrowStart = startOfTomorrow();
  const tomorrowEnd = endOfTomorrow();

  const [
    conversationCount,
    urgentIssues,
    openWorkflows,
    pendingFollowUps,
    appointmentsTomorrow,
  ] = await Promise.all([
    prisma.conversation.count({
      where: { workspaceId, createdAt: { gte: todayStart } },
    }),
    prisma.workflow.count({
      where: {
        workspaceId,
        type: { in: ["URGENT_ISSUE", "CUSTOMER_ESCALATION"] },
        status: { in: ["OPEN", "IN_PROGRESS"] },
      },
    }),
    prisma.workflow.count({
      where: {
        workspaceId,
        status: { in: ["OPEN", "IN_PROGRESS"] },
        type: { not: "DAILY_SUMMARY" },
      },
    }),
    prisma.workflow.count({
      where: {
        workspaceId,
        type: "FOLLOW_UP",
        status: { in: ["OPEN", "IN_PROGRESS"] },
      },
    }),
    prisma.tekmetricAppointment.count({
      where: {
        workspaceId,
        scheduledAt: { gte: tomorrowStart, lt: tomorrowEnd },
      },
    }),
  ]);

  const highlights: string[] = [];

  if (conversationCount > 0) {
    highlights.push(`${conversationCount} conversation${conversationCount === 1 ? "" : "s"} captured today`);
  }

  if (urgentIssues > 0) {
    highlights.push(`${urgentIssues} urgent operational issue${urgentIssues === 1 ? "" : "s"} still open`);
  }

  if (pendingFollowUps > 0) {
    highlights.push(`${pendingFollowUps} customer follow-up${pendingFollowUps === 1 ? "" : "s"} waiting`);
  }

  if (appointmentsTomorrow > 0) {
    highlights.push(`${appointmentsTomorrow} appointment${appointmentsTomorrow === 1 ? "" : "s"} scheduled for tomorrow`);
  }

  if (highlights.length === 0) {
    highlights.push("No urgent operational gaps detected in today's scan.");
  }

  return {
    conversationCount,
    urgentIssues,
    openWorkflows,
    pendingFollowUps,
    appointmentsTomorrow,
    highlights,
  };
}

export function formatDailySummaryDescription(summary: DailySummaryContent): string {
  return summary.highlights.join(". ") + ".";
}
