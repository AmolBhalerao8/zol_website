import type { SuggestedWorkflow } from "@/features/workflows/types/workflow-types";
import { prisma } from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * DAY_MS);
}

function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfTomorrow(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfTomorrow(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function isCallbackAction(title: string): boolean {
  const normalized = title.toLowerCase();
  return (
    normalized.includes("callback") ||
    normalized.includes("call back") ||
    normalized.includes("return call") ||
    normalized.includes("follow up") ||
    normalized.includes("follow-up")
  );
}

export async function detectOperationalWorkflows(
  workspaceId: string,
): Promise<SuggestedWorkflow[]> {
  const now = new Date();
  const twoDaysAgo = daysAgo(2);
  const oneDayAgo = daysAgo(1);
  const fourteenDaysAgo = daysAgo(14);
  const tomorrowStart = startOfTomorrow();
  const tomorrowEnd = endOfTomorrow();

  const [
    staleActionItems,
    urgentConversations,
    callbackActionItems,
    issueMemories,
    tomorrowAppointments,
    pendingRepairOrders,
  ] = await Promise.all([
    prisma.actionItem.findMany({
      where: {
        workspaceId,
        status: { in: ["OPEN", "IN_PROGRESS"] },
        createdAt: { lt: twoDaysAgo },
      },
      include: {
        conversation: {
          include: {
            customerLink: { include: { customer: true } },
          },
        },
      },
      take: 20,
    }),
    prisma.conversation.findMany({
      where: {
        workspaceId,
        urgency: "HIGH",
        status: "COMPLETED",
        createdAt: { gte: fourteenDaysAgo },
        actionItems: { some: { status: { in: ["OPEN", "IN_PROGRESS"] } } },
      },
      include: {
        actionItems: { where: { status: { in: ["OPEN", "IN_PROGRESS"] } } },
        customerLink: { include: { customer: true } },
      },
      take: 15,
    }),
    prisma.actionItem.findMany({
      where: {
        workspaceId,
        status: { in: ["OPEN", "IN_PROGRESS"] },
        createdAt: { lt: oneDayAgo },
      },
      include: {
        conversation: {
          include: {
            customerLink: { include: { customer: true } },
          },
        },
      },
      take: 30,
    }),
    prisma.customerMemory.findMany({
      where: {
        workspaceId,
        category: "ISSUE",
        createdAt: { gte: thirtyDaysAgo() },
      },
      include: { customer: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.tekmetricAppointment.findMany({
      where: {
        workspaceId,
        scheduledAt: { gte: tomorrowStart, lt: tomorrowEnd },
      },
      take: 20,
    }),
    prisma.tekmetricRepairOrder.findMany({
      where: {
        workspaceId,
        OR: [
          { status: { contains: "open", mode: "insensitive" } },
          { status: { contains: "pending", mode: "insensitive" } },
          { status: { contains: "waiting", mode: "insensitive" } },
        ],
      },
      take: 15,
    }),
  ]);

  const suggestions: SuggestedWorkflow[] = [];

  for (const item of staleActionItems) {
    const customerId = item.conversation.customerLink?.customerId;
    const customerName =
      item.conversation.customerName ??
      item.conversation.customerLink?.customer.name ??
      "Customer";

    suggestions.push({
      type: "FOLLOW_UP",
      title: `Customer waiting for follow-up`,
      description: `${customerName} has an open action item "${item.title}" that has been waiting since ${item.createdAt.toLocaleDateString()}.`,
      priority: item.priority === "HIGH" ? "HIGH" : "MEDIUM",
      sourceConversationId: item.conversationId,
      sourceCustomerId: customerId,
      dedupKey: `follow-up:action:${item.id}`,
      context: { actionItemId: item.id },
    });
  }

  for (const conversation of urgentConversations) {
    const customerId = conversation.customerLink?.customerId;
    const customerName =
      conversation.customerName ?? conversation.customerLink?.customer.name ?? "Customer";

    suggestions.push({
      type: "URGENT_ISSUE",
      title: "Urgent customer issue unresolved",
      description: `${customerName} reported an urgent issue that still has open operational next steps.`,
      priority: "URGENT",
      sourceConversationId: conversation.id,
      sourceCustomerId: customerId,
      dedupKey: `urgent:conversation:${conversation.id}`,
      context: { openActionItems: conversation.actionItems.length },
    });
  }

  for (const item of callbackActionItems) {
    if (!isCallbackAction(item.title)) {
      continue;
    }

    const customerId = item.conversation.customerLink?.customerId;
    const customerName =
      item.conversation.customerName ??
      item.conversation.customerLink?.customer.name ??
      "Customer";

    suggestions.push({
      type: "MISSED_CALLBACK",
      title: "Unreturned customer callback",
      description: `${customerName} is still waiting on "${item.title}".`,
      priority: "HIGH",
      sourceConversationId: item.conversationId,
      sourceCustomerId: customerId,
      dedupKey: `callback:action:${item.id}`,
      context: { actionItemId: item.id },
    });
  }

  const issueCountByCustomer = new Map<string, { count: number; customerName: string }>();
  for (const memory of issueMemories) {
    const current = issueCountByCustomer.get(memory.customerId);
    if (current) {
      current.count += 1;
    } else {
      issueCountByCustomer.set(memory.customerId, {
        count: 1,
        customerName: memory.customer.name ?? "Customer",
      });
    }
  }

  for (const [customerId, info] of issueCountByCustomer) {
    if (info.count < 2) {
      continue;
    }

    suggestions.push({
      type: "REPEATED_ISSUE",
      title: "Repeated service concern detected",
      description: `${info.customerName} has ${info.count} recorded issue memories that may indicate an unresolved pattern.`,
      priority: "HIGH",
      sourceCustomerId: customerId,
      dedupKey: `repeated-issue:customer:${customerId}`,
      context: { issueCount: info.count },
    });
  }

  const customerUrgentCounts = await prisma.conversation.findMany({
    where: {
      workspaceId,
      urgency: "HIGH",
      createdAt: { gte: fourteenDaysAgo },
      customerLink: { isNot: null },
    },
    include: { customerLink: { include: { customer: true } } },
  });

  const escalationCounts = new Map<string, { count: number; name: string }>();
  for (const conversation of customerUrgentCounts) {
    const customerId = conversation.customerLink?.customerId;
    if (!customerId) {
      continue;
    }
    const name =
      conversation.customerName ?? conversation.customerLink?.customer.name ?? "Customer";
    const current = escalationCounts.get(customerId);
    if (current) {
      current.count += 1;
    } else {
      escalationCounts.set(customerId, { count: 1, name });
    }
  }

  for (const [customerId, info] of escalationCounts) {
    if (info.count < 2) {
      continue;
    }

    suggestions.push({
      type: "CUSTOMER_ESCALATION",
      title: "Customer escalation pattern detected",
      description: `${info.name} has ${info.count} urgent conversations in the last two weeks.`,
      priority: "URGENT",
      sourceCustomerId: customerId,
      dedupKey: `escalation:customer:${customerId}`,
      context: { urgentConversationCount: info.count },
    });
  }

  for (const appointment of tomorrowAppointments) {
    const status = appointment.status?.toLowerCase() ?? "";
    if (status.includes("confirm")) {
      continue;
    }

    suggestions.push({
      type: "APPOINTMENT_REMINDER",
      title: "Tomorrow's appointment missing confirmation",
      description:
        appointment.summary ??
        `An appointment is scheduled for tomorrow and may still need confirmation.`,
      priority: "MEDIUM",
      sourceCustomerId: appointment.zolCustomerId ?? undefined,
      dedupKey: `appointment:${appointment.id}`,
      context: {
        tekmetricAppointmentId: appointment.id,
        scheduledAt: appointment.scheduledAt?.toISOString(),
      },
    });
  }

  for (const order of pendingRepairOrders) {
    suggestions.push({
      type: "OPERATIONAL_ALERT",
      title: "Repair order still pending",
      description:
        order.summary ??
        `Repair order ${order.externalId} is still marked ${order.status ?? "pending"}.`,
      priority: "MEDIUM",
      sourceCustomerId: order.zolCustomerId ?? undefined,
      dedupKey: `repair-order:${order.id}`,
      context: { tekmetricRepairOrderId: order.id, status: order.status },
    });
  }


  void now;

  return suggestions;
}

function thirtyDaysAgo(): Date {
  return daysAgo(30);
}
