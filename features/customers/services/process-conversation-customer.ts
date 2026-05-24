import { getAIEmployeeSettings } from "@/features/ai-employee/queries/get-ai-employee-settings";
import { identifyOrCreateCustomer } from "@/features/customers/services/identify-or-create-customer";
import { generateCustomerMemories } from "@/features/memory/services/generate-customer-memories";
import {
  getExistingMemoriesForCustomer,
  saveCustomerMemories,
} from "@/features/memory/services/save-customer-memories";
import { prisma } from "@/lib/prisma";

export type ProcessConversationCustomerResult = {
  customerId: string;
  memoriesCreated: number;
  skipped: boolean;
};

export async function processConversationCustomerMemory(input: {
  workspaceId: string;
  conversationId: string;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
}): Promise<ProcessConversationCustomerResult | null> {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: input.conversationId,
      workspaceId: input.workspaceId,
      status: "COMPLETED",
    },
    include: {
      actionItems: {
        select: {
          title: true,
          description: true,
        },
      },
    },
  });

  if (!conversation) {
    return null;
  }

  const { customer } = await identifyOrCreateCustomer({
    workspaceId: input.workspaceId,
    conversationId: conversation.id,
    customerName: input.customerName ?? conversation.customerName,
    customerPhone: input.customerPhone ?? conversation.customerPhone,
    customerEmail: input.customerEmail,
  });

  const existingMemoryCount = await prisma.customerMemory.count({
    where: { conversationId: conversation.id },
  });

  if (existingMemoryCount > 0) {
    return {
      customerId: customer.id,
      memoriesCreated: 0,
      skipped: true,
    };
  }

  const [workspace, aiSettings, previousMemories] = await Promise.all([
    prisma.workspace.findUniqueOrThrow({ where: { id: input.workspaceId } }),
    getAIEmployeeSettings(input.workspaceId),
    getExistingMemoriesForCustomer(input.workspaceId, customer.id),
  ]);

  const generatedMemories = await generateCustomerMemories({
    transcript: conversation.transcript,
    summary: conversation.summary,
    actionItems: conversation.actionItems,
    workspace,
    aiSettings,
    previousMemories,
  });

  const memoriesCreated = await saveCustomerMemories({
    workspaceId: input.workspaceId,
    customerId: customer.id,
    conversationId: conversation.id,
    memories: generatedMemories,
  });

  return {
    customerId: customer.id,
    memoriesCreated,
    skipped: false,
  };
}
