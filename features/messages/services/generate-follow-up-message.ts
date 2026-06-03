import type { MessageChannel, MessageType } from "@prisma/client";

import { getAIEmployeeSettings } from "@/features/ai-employee/queries/get-ai-employee-settings";
import { buildOperationalContext } from "@/features/copilot/services/build-operational-context";
import type { CopilotScope } from "@/features/copilot/types/copilot-types";
import { getCustomerDisplayName } from "@/features/customers/utils/normalize-customer-identity";
import type { GeneratedFollowUpMessage } from "@/features/messages/types/message-types";
import { resolveRecipient } from "@/features/messages/utils/resolve-recipient";
import { prisma } from "@/lib/prisma";

type GenerateFollowUpMessageInput = {
  workspaceId: string;
  customerId?: string;
  conversationId?: string;
  workflowId?: string;
  type?: MessageType;
  generatedReason?: string;
};

function buildScope(input: GenerateFollowUpMessageInput): CopilotScope {
  if (input.conversationId) {
    return { scope: "conversation", conversationId: input.conversationId };
  }

  if (input.customerId) {
    return { scope: "customer", customerId: input.customerId };
  }

  if (input.workflowId) {
    return { scope: "workflow", workflowId: input.workflowId };
  }

  return { scope: "workspace" };
}

function templateMessage(input: {
  customerName: string;
  businessName: string;
  type: MessageType;
  generatedReason: string;
  summary?: string | null;
}): GeneratedFollowUpMessage {
  const firstName = input.customerName.split(" ")[0] || "there";

  const templates: Record<MessageType, { content: string; subject: string | null }> = {
    APPOINTMENT_REMINDER: {
      subject: `Appointment reminder — ${input.businessName}`,
      content: `Hi ${firstName}, just a reminder about your upcoming appointment with ${input.businessName}. Let us know if anything changes.`,
    },
    FOLLOW_UP: {
      subject: `Following up — ${input.businessName}`,
      content: `Hi ${firstName}, we wanted to follow up regarding your recent request${input.summary ? `: ${input.summary.toLowerCase()}` : ""}. Let us know if you'd like to schedule a visit or need anything else.`,
    },
    ORDER_UPDATE: {
      subject: `Order update — ${input.businessName}`,
      content: `Hi ${firstName}, we wanted to share a quick update on your order with ${input.businessName}. We'll keep you posted as things move forward.`,
    },
    ISSUE_RESOLUTION: {
      subject: `Checking in — ${input.businessName}`,
      content: `Hi ${firstName}, we wanted to follow up on your recent issue and make sure everything is moving in the right direction. Please reply if you still need help.`,
    },
    REVIEW_REQUEST: {
      subject: `How did we do? — ${input.businessName}`,
      content: `Hi ${firstName}, thank you for choosing ${input.businessName}. If you have a moment, we'd appreciate hearing how your recent experience went.`,
    },
    GENERAL: {
      subject: `Message from ${input.businessName}`,
      content: `Hi ${firstName}, thank you for contacting ${input.businessName}. We're here if you need anything else.`,
    },
  };

  const selected = templates[input.type];

  return {
    subject: selected.subject,
    content: selected.content,
    type: input.type,
    recommendedChannel: "SMS",
    generatedReason: input.generatedReason,
  };
}

async function callOpenAI(
  system: string,
  user: string,
): Promise<GeneratedFollowUpMessage | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    return null;
  }

  try {
    const parsed = JSON.parse(content) as GeneratedFollowUpMessage;
    if (!parsed.content || !parsed.type || !parsed.recommendedChannel) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function generateFollowUpMessage(
  input: GenerateFollowUpMessageInput,
): Promise<GeneratedFollowUpMessage & { channel: MessageChannel; recipient: string } | null> {
  const [workspace, customer, conversation, workflow, aiSettings] = await Promise.all([
    prisma.workspace.findUnique({
      where: { id: input.workspaceId },
      select: { name: true },
    }),
    input.customerId
      ? prisma.customer.findFirst({
          where: { id: input.customerId, workspaceId: input.workspaceId },
        })
      : Promise.resolve(null),
    input.conversationId
      ? prisma.conversation.findFirst({
          where: { id: input.conversationId, workspaceId: input.workspaceId },
          select: { customerPhone: true, summary: true, customerName: true },
        })
      : Promise.resolve(null),
    input.workflowId
      ? prisma.workflow.findFirst({
          where: { id: input.workflowId, workspaceId: input.workspaceId },
          select: { type: true, title: true, description: true },
        })
      : Promise.resolve(null),
    getAIEmployeeSettings(input.workspaceId),
  ]);

  const messageType =
    input.type ??
    (workflow?.type === "APPOINTMENT_REMINDER"
      ? "APPOINTMENT_REMINDER"
      : workflow?.type === "OPERATIONAL_ALERT"
        ? "ORDER_UPDATE"
        : workflow?.type === "URGENT_ISSUE" ||
            workflow?.type === "REPEATED_ISSUE" ||
            workflow?.type === "CUSTOMER_ESCALATION"
          ? "ISSUE_RESOLUTION"
          : "FOLLOW_UP");

  const generatedReason =
    input.generatedReason ??
    workflow?.title ??
    "Operational follow-up suggested by ZOL";

  const customerName = customer
    ? getCustomerDisplayName(customer)
    : conversation?.customerName ?? "the customer";

  const recipientInfo = resolveRecipient({
    primaryPhone: customer?.primaryPhone,
    primaryEmail: customer?.primaryEmail,
    conversationPhone: conversation?.customerPhone,
  });

  if (!recipientInfo) {
    return null;
  }

  const scope = buildScope(input);
  const operationalContext = await buildOperationalContext(input.workspaceId, scope);
  const tone = aiSettings?.communicationTone ?? "PROFESSIONAL";

  const aiResult = await callOpenAI(
    [
      "You generate concise operational customer follow-up messages for a business.",
      "Return JSON with keys: subject (string|null), content (string), type (FOLLOW_UP|APPOINTMENT_REMINDER|ORDER_UPDATE|ISSUE_RESOLUTION|REVIEW_REQUEST|GENERAL), recommendedChannel (SMS|EMAIL), generatedReason (string).",
      "Rules:",
      "- Use only verified context provided.",
      "- Do not invent order status, appointment times, or promises.",
      "- Keep SMS-style messages under 320 characters when recommendedChannel is SMS.",
      "- Sound human, professional, and contextual.",
      `- Match this communication tone: ${tone}.`,
    ].join("\n"),
    [
      `Business: ${workspace?.name ?? "Business"}`,
      `Customer: ${customerName}`,
      `Message type: ${messageType}`,
      `Reason: ${generatedReason}`,
      "",
      operationalContext.contextSummary,
    ].join("\n"),
  );

  const generated =
    aiResult ??
    templateMessage({
      customerName,
      businessName: workspace?.name ?? "our team",
      type: messageType,
      generatedReason,
      summary: conversation?.summary,
    });

  return {
    ...generated,
    type: messageType,
    generatedReason,
    channel: recipientInfo.channel,
    recipient: recipientInfo.recipient,
    recommendedChannel: generated.recommendedChannel ?? recipientInfo.channel,
  };
}
