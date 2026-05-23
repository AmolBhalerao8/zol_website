import type { Prisma } from "@prisma/client";

import { getAIEmployeeSettings } from "@/features/ai-employee/queries/get-ai-employee-settings";
import { extractConversationIntelligence } from "@/features/conversations/services/extract-conversation-intelligence";
import type { ParsedVapiWebhook } from "@/features/conversations/utils/parse-vapi-webhook";
import { prisma } from "@/lib/prisma";

export type ProcessVapiWebhookResult =
  | { status: "ignored"; reason: string }
  | { status: "not_found"; reason: string }
  | { status: "invalid"; reason: string }
  | { status: "processed"; conversationId: string; vapiCallId: string };

export async function findCommunicationChannelForWebhook(input: {
  assistantId: string | null;
  phoneNumberId: string | null;
}) {
  const filters = [];

  if (input.assistantId) {
    filters.push({ vapiAssistantId: input.assistantId });
  }

  if (input.phoneNumberId) {
    filters.push({ vapiPhoneNumberId: input.phoneNumberId });
  }

  if (filters.length === 0) {
    return null;
  }

  return prisma.communicationChannel.findFirst({
    where: { OR: filters },
    include: { workspace: true },
  });
}

export async function processVapiWebhookEvent(
  parsed: ParsedVapiWebhook,
  rawPayload: Prisma.InputJsonValue,
): Promise<ProcessVapiWebhookResult> {
  if (!parsed.isCompletedCall) {
    return { status: "ignored", reason: `Unsupported event type: ${parsed.eventType}` };
  }

  if (!parsed.callId) {
    return { status: "invalid", reason: "Missing call ID" };
  }

  const channel = await findCommunicationChannelForWebhook({
    assistantId: parsed.assistantId,
    phoneNumberId: parsed.phoneNumberId,
  });

  if (!channel) {
    return { status: "not_found", reason: "No matching communication channel" };
  }

  const existingConversation = await prisma.conversation.findUnique({
    where: { vapiCallId: parsed.callId },
    include: { actionItems: true },
  });

  const conversation = existingConversation
    ? await prisma.conversation.update({
        where: { id: existingConversation.id },
        data: {
          customerName: parsed.customerName ?? existingConversation.customerName,
          customerPhone: parsed.customerPhone ?? existingConversation.customerPhone,
          transcript: parsed.transcript ?? existingConversation.transcript,
          transcriptUrl: parsed.transcriptUrl ?? existingConversation.transcriptUrl,
          recordingUrl: parsed.recordingUrl ?? existingConversation.recordingUrl,
          startedAt: parsed.startedAt ?? existingConversation.startedAt,
          endedAt: parsed.endedAt ?? existingConversation.endedAt,
          durationSeconds: parsed.durationSeconds ?? existingConversation.durationSeconds,
          rawProviderPayload: rawPayload,
          status: existingConversation.status === "COMPLETED" ? "COMPLETED" : "PROCESSING",
        },
      })
    : await prisma.conversation.create({
        data: {
          workspaceId: channel.workspaceId,
          communicationChannelId: channel.id,
          vapiCallId: parsed.callId,
          customerName: parsed.customerName,
          customerPhone: parsed.customerPhone,
          transcript: parsed.transcript,
          transcriptUrl: parsed.transcriptUrl,
          recordingUrl: parsed.recordingUrl,
          startedAt: parsed.startedAt,
          endedAt: parsed.endedAt,
          durationSeconds: parsed.durationSeconds,
          rawProviderPayload: rawPayload,
          status: "PROCESSING",
        },
      });

  if (existingConversation?.status === "COMPLETED" && existingConversation.summary) {
    return {
      status: "processed",
      conversationId: conversation.id,
      vapiCallId: parsed.callId,
    };
  }

  try {
    const aiSettings = await getAIEmployeeSettings(channel.workspaceId);
    const intelligence = await extractConversationIntelligence({
      transcript: parsed.transcript,
      workspace: channel.workspace,
      aiSettings,
      fallbackCustomerPhone: parsed.customerPhone,
    });

    await prisma.$transaction(async (tx) => {
      await tx.conversation.update({
        where: { id: conversation.id },
        data: {
          customerName: intelligence.customerName ?? parsed.customerName,
          customerPhone: intelligence.customerPhone ?? parsed.customerPhone,
          summary: intelligence.summary,
          urgency: intelligence.urgency,
          status: "COMPLETED",
        },
      });

      if (existingConversation?.actionItems.length) {
        await tx.actionItem.deleteMany({ where: { conversationId: conversation.id } });
      }

      if (intelligence.recommendedActions.length > 0) {
        await tx.actionItem.createMany({
          data: intelligence.recommendedActions.map((action) => ({
            workspaceId: channel.workspaceId,
            conversationId: conversation.id,
            title: action.title,
            description: action.description || null,
            priority: action.priority,
            status: "OPEN",
          })),
        });
      }
    });
  } catch (error) {
    console.error("Conversation intelligence processing failed:", error);

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { status: "FAILED" },
    });

    throw error;
  }

  return {
    status: "processed",
    conversationId: conversation.id,
    vapiCallId: parsed.callId,
  };
}
