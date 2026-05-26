import type { Prisma } from "@prisma/client";

import { detectOperationalWorkflows } from "@/features/workflows/services/detect-operational-workflows";
import {
  formatDailySummaryDescription,
  generateDailyOperationalSummary,
} from "@/features/workflows/services/generate-daily-operational-summary";
import { generateWorkflowInsight } from "@/features/workflows/services/generate-workflow-insights";
import type { WorkflowScanResult } from "@/features/workflows/types/workflow-types";
import { workflowAlreadyExists } from "@/features/workflows/utils/workflow-dedup";
import { prisma } from "@/lib/prisma";

function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

async function syncResolvedWorkflowStatuses(workspaceId: string): Promise<number> {
  const openWorkflows = await prisma.workflow.findMany({
    where: {
      workspaceId,
      status: { in: ["OPEN", "IN_PROGRESS"] },
      sourceConversationId: { not: null },
      type: { in: ["URGENT_ISSUE", "MISSED_CALLBACK", "FOLLOW_UP"] },
    },
    select: {
      id: true,
      sourceConversationId: true,
    },
  });

  if (openWorkflows.length === 0) {
    return 0;
  }

  const conversationIds = openWorkflows
    .map((workflow) => workflow.sourceConversationId)
    .filter(Boolean) as string[];

  const resolvedConversations = await prisma.actionItem.groupBy({
    by: ["conversationId"],
    where: {
      workspaceId,
      conversationId: { in: conversationIds },
      status: { in: ["OPEN", "IN_PROGRESS"] },
    },
    _count: { _all: true },
  });

  const stillOpen = new Set(
    resolvedConversations.filter((row) => row._count._all > 0).map((row) => row.conversationId),
  );

  let updated = 0;
  for (const workflow of openWorkflows) {
    if (!workflow.sourceConversationId || stillOpen.has(workflow.sourceConversationId)) {
      continue;
    }

    await prisma.workflow.update({
      where: { id: workflow.id },
      data: { status: "COMPLETED" },
    });
    updated += 1;
  }

  return updated;
}

async function ensureDailySummaryWorkflow(workspaceId: string): Promise<boolean> {
  const todayStart = startOfToday();
  const existing = await prisma.workflow.findFirst({
    where: {
      workspaceId,
      type: "DAILY_SUMMARY",
      createdAt: { gte: todayStart },
    },
    select: { id: true },
  });

  if (existing) {
    return false;
  }

  const summary = await generateDailyOperationalSummary(workspaceId);
  const description = formatDailySummaryDescription(summary);
  const insightReason =
    "ZOL compiled today's operational picture from conversations, open workflows, and synced shop activity.";

  await prisma.workflow.create({
    data: {
      workspaceId,
      type: "DAILY_SUMMARY",
      title: "Daily operational summary",
      description,
      priority: summary.urgentIssues > 0 ? "HIGH" : "MEDIUM",
      status: "OPEN",
      metadata: {
        dedupKey: `daily-summary:${todayStart.toISOString().slice(0, 10)}`,
        insightReason,
        summary,
      } as Prisma.InputJsonValue,
    },
  });

  return true;
}

export async function runOperationalWorkflowScan(
  workspaceId: string,
): Promise<WorkflowScanResult> {
  const updatedStatuses = await syncResolvedWorkflowStatuses(workspaceId);
  const suggestions = await detectOperationalWorkflows(workspaceId);

  let created = 0;
  let skipped = 0;

  for (const suggestion of suggestions) {
    const exists = await workflowAlreadyExists({
      workspaceId,
      type: suggestion.type,
      dedupKey: suggestion.dedupKey,
      sourceConversationId: suggestion.sourceConversationId,
      sourceCustomerId: suggestion.sourceCustomerId,
    });

    if (exists) {
      skipped += 1;
      continue;
    }

    const insightReason = await generateWorkflowInsight(suggestion);

    await prisma.workflow.create({
      data: {
        workspaceId,
        type: suggestion.type,
        title: suggestion.title,
        description: suggestion.description,
        priority: suggestion.priority,
        sourceConversationId: suggestion.sourceConversationId,
        sourceCustomerId: suggestion.sourceCustomerId,
        metadata: {
          dedupKey: suggestion.dedupKey,
          insightReason,
          context: suggestion.context ?? {},
        } as Prisma.InputJsonValue,
      },
    });

    created += 1;
  }

  const dailyCreated = await ensureDailySummaryWorkflow(workspaceId);
  if (dailyCreated) {
    created += 1;
  }

  return { created, skipped, updatedStatuses };
}
