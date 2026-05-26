import type { WorkflowStatus, WorkflowType } from "@prisma/client";

import type { WorkflowWithSources } from "@/features/workflows/types/workflow-types";
import { prisma } from "@/lib/prisma";

const workflowInclude = {
  sourceConversation: {
    select: {
      id: true,
      customerName: true,
      summary: true,
      urgency: true,
    },
  },
  sourceCustomer: {
    select: {
      id: true,
      name: true,
      primaryPhone: true,
    },
  },
} as const;

export async function getWorkflows(
  workspaceId: string,
  options?: { status?: WorkflowStatus[]; limit?: number },
): Promise<WorkflowWithSources[]> {
  return prisma.workflow.findMany({
    where: {
      workspaceId,
      ...(options?.status ? { status: { in: options.status } } : {}),
    },
    include: workflowInclude,
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    take: options?.limit ?? 50,
  });
}

export async function getActiveWorkflows(workspaceId: string): Promise<WorkflowWithSources[]> {
  return getWorkflows(workspaceId, {
    status: ["OPEN", "IN_PROGRESS"],
    limit: 30,
  });
}

export async function getDailySummary(workspaceId: string) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  return prisma.workflow.findFirst({
    where: {
      workspaceId,
      type: "DAILY_SUMMARY",
      createdAt: { gte: todayStart },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWorkflowStats(workspaceId: string) {
  const [activeCount, urgentCount, followUpCount, dailySummary] = await Promise.all([
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
        status: { in: ["OPEN", "IN_PROGRESS"] },
        priority: { in: ["HIGH", "URGENT"] },
        type: { not: "DAILY_SUMMARY" },
      },
    }),
    prisma.workflow.count({
      where: {
        workspaceId,
        status: { in: ["OPEN", "IN_PROGRESS"] },
        type: "FOLLOW_UP",
      },
    }),
    getDailySummary(workspaceId),
  ]);

  const tomorrowStart = new Date();
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  tomorrowStart.setHours(0, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

  const appointmentsTomorrow = await prisma.tekmetricAppointment.count({
    where: {
      workspaceId,
      scheduledAt: { gte: tomorrowStart, lt: tomorrowEnd },
    },
  });

  return {
    activeCount,
    urgentCount,
    followUpCount,
    appointmentsTomorrow,
    dailySummary,
  };
}

export async function getWorkflowById(workspaceId: string, workflowId: string) {
  return prisma.workflow.findFirst({
    where: { id: workflowId, workspaceId },
    include: workflowInclude,
  });
}

export async function getRecentWorkflowsByType(
  workspaceId: string,
  type: WorkflowType,
  limit = 5,
) {
  return prisma.workflow.findMany({
    where: { workspaceId, type },
    include: workflowInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
