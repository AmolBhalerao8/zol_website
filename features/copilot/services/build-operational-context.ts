import { getAIEmployeeSettings } from "@/features/ai-employee/queries/get-ai-employee-settings";
import { getConversationById } from "@/features/conversations/queries/get-conversations";
import { getCustomerById } from "@/features/customers/queries/get-customers";
import { getCustomerDisplayName } from "@/features/customers/utils/normalize-customer-identity";
import { buildCustomerContextFromMemories } from "@/features/memory/services/build-customer-context";
import type { CopilotScope, OperationalContext } from "@/features/copilot/types/copilot-types";
import { getWorkflowById } from "@/features/workflows/queries/get-workflows";
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

export async function buildOperationalContext(
  workspaceId: string,
  scope: CopilotScope,
): Promise<OperationalContext> {
  const [aiSettings, workspace] = await Promise.all([
    getAIEmployeeSettings(workspaceId),
    prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: { name: true, businessType: true, timezone: true },
    }),
  ]);

  const sections: string[] = [];
  const businessName = workspace?.name ?? "Your business";
  const communicationTone = aiSettings?.communicationTone ?? "Professional and helpful";
  const businessContext = aiSettings?.businessContext?.trim() || null;

  if (businessContext) {
    sections.push(`Business Context:\n${businessContext}`);
  }

  sections.push(`Workspace:\n- ${businessName} (${workspace?.businessType ?? "Operational business"})`);

  if (scope.scope === "conversation") {
    const conversation = await getConversationById(workspaceId, scope.conversationId);
    if (conversation) {
      const customerId = conversation.customerLink?.customer.id;
      sections.push(
        `Conversation:\n- Customer: ${conversation.customerName ?? "Unknown"}\n- Urgency: ${conversation.urgency}\n- Status: ${conversation.status}\n- Summary: ${conversation.summary ?? "No summary yet"}`,
      );

      if (conversation.actionItems.length > 0) {
        sections.push(
          `Open Action Items:\n${conversation.actionItems
            .map((item) => `- [${item.priority}] ${item.title} (${item.status})`)
            .join("\n")}`,
        );
      }

      if (conversation.transcript?.trim()) {
        const excerpt = conversation.transcript.slice(0, 1200);
        sections.push(`Transcript Excerpt:\n${excerpt}`);
      }

      if (customerId) {
        const customer = await getCustomerById(workspaceId, customerId);
        if (customer) {
          sections.push(
            buildCustomerContextFromMemories({
              memories: customer.memories.map((memory) => ({
                content: memory.content,
                category: memory.category,
              })),
              isReturningCustomer: customer._count.conversationLinks > 1,
            }),
          );
        }
      }
    }
  }

  if (scope.scope === "customer") {
    const customer = await getCustomerById(workspaceId, scope.customerId);
    if (customer) {
      const displayName = getCustomerDisplayName(customer);
      sections.push(
        `Customer Profile:\n- Name: ${displayName}\n- Conversations: ${customer._count.conversationLinks}\n- Memories: ${customer._count.memories}`,
      );

      sections.push(
        buildCustomerContextFromMemories({
          memories: customer.memories.map((memory) => ({
            content: memory.content,
            category: memory.category,
          })),
          isReturningCustomer: customer._count.conversationLinks > 1,
        }),
      );

      const openActionItems = customer.conversationLinks.flatMap((link) =>
        link.conversation.actionItems.filter((item) => item.status !== "COMPLETED"),
      );

      if (openActionItems.length > 0) {
        sections.push(
          `Open Follow-Ups:\n${openActionItems
            .slice(0, 5)
            .map((item) => `- ${item.title}`)
            .join("\n")}`,
        );
      }

      const urgentConversations = customer.conversationLinks.filter(
        (link) => link.conversation.urgency === "HIGH" || link.conversation.urgency === "URGENT",
      );
      if (urgentConversations.length > 0) {
        sections.push(`- ${urgentConversations.length} urgent conversation(s) on record`);
      }
    }
  }

  if (scope.scope === "workflow") {
    const workflow = await getWorkflowById(workspaceId, scope.workflowId);
    if (workflow) {
      sections.push(
        `Workflow:\n- Type: ${workflow.type}\n- Title: ${workflow.title}\n- Priority: ${workflow.priority}\n- Status: ${workflow.status}\n- Description: ${workflow.description}`,
      );

      const metadata = workflow.metadata as { insightReason?: string } | null;
      if (metadata?.insightReason) {
        sections.push(`Workflow Insight:\n${metadata.insightReason}`);
      }

      if (workflow.sourceCustomer) {
        sections.push(
          `Linked Customer:\n- ${workflow.sourceCustomer.name ?? "Customer"}\n- Phone: ${workflow.sourceCustomer.primaryPhone ?? "Unknown"}`,
        );
      }

      if (workflow.sourceConversation?.summary) {
        sections.push(`Linked Conversation Summary:\n${workflow.sourceConversation.summary}`);
      }
    }
  }

  if (scope.scope === "workspace") {
    const [
      openWorkflows,
      openActionItems,
      recentConversations,
      tomorrowAppointments,
      pendingOrders,
    ] = await Promise.all([
      prisma.workflow.findMany({
        where: { workspaceId, status: { in: ["OPEN", "IN_PROGRESS"] }, type: { not: "DAILY_SUMMARY" } },
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        take: 8,
      }),
      prisma.actionItem.count({
        where: { workspaceId, status: { in: ["OPEN", "IN_PROGRESS"] } },
      }),
      prisma.conversation.findMany({
        where: { workspaceId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { customerName: true, urgency: true, summary: true, status: true },
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
    ]);

    sections.push(
      `Operational Snapshot:\n- ${openWorkflows.length} active workflow(s)\n- ${openActionItems} open action item(s)\n- ${tomorrowAppointments} appointment(s) tomorrow\n- ${pendingOrders} pending repair order(s)`,
    );

    if (openWorkflows.length > 0) {
      sections.push(
        `Active Workflows:\n${openWorkflows
          .map((workflow) => `- [${workflow.priority}] ${workflow.title}`)
          .join("\n")}`,
      );
    }

    if (recentConversations.length > 0) {
      sections.push(
        `Recent Conversations:\n${recentConversations
          .map(
            (conversation) =>
              `- ${conversation.customerName ?? "Customer"} (${conversation.urgency}): ${conversation.summary?.slice(0, 100) ?? "Processing"}`,
          )
          .join("\n")}`,
      );
    }
  }

  const contextSummary = sections.join("\n\n");

  return {
    scope: scope.scope,
    businessName,
    communicationTone,
    businessContext,
    contextSummary,
    sections,
  };
}
