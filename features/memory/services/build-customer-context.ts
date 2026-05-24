import type { MemoryCategory } from "@prisma/client";

import { getRelevantCustomerMemories } from "@/features/memory/services/retrieve-relevant-memories";
import { MEMORY_CATEGORY_LABELS } from "@/features/memory/utils/memory-category-labels";

export async function buildCustomerContext(input: {
  workspaceId: string;
  customerId: string;
  queryText?: string | null;
  isReturningCustomer?: boolean;
}): Promise<string> {
  const memories = await getRelevantCustomerMemories({
    workspaceId: input.workspaceId,
    customerId: input.customerId,
    queryText: input.queryText,
    limit: 6,
  });

  const lines: string[] = ["Customer Context:"];

  if (input.isReturningCustomer) {
    lines.push("- Returning customer");
  }

  if (memories.length === 0) {
    lines.push("- No prior operational memory captured yet");
    return lines.join("\n");
  }

  for (const memory of memories) {
    lines.push(`- ${memory.content}`);
  }

  return lines.join("\n");
}

export function buildCustomerContextFromMemories(input: {
  memories: Array<{ content: string; category: MemoryCategory }>;
  isReturningCustomer?: boolean;
}): string {
  const lines: string[] = ["Customer Context:"];

  if (input.isReturningCustomer) {
    lines.push("- Returning customer");
  }

  if (input.memories.length === 0) {
    lines.push("- No prior operational memory captured yet");
    return lines.join("\n");
  }

  for (const memory of input.memories.slice(0, 6)) {
    lines.push(`- ${memory.content}`);
  }

  return lines.join("\n");
}

export async function generateOperationalSummary(input: {
  workspaceId: string;
  customerId: string;
  customerName: string;
  conversationCount: number;
}): Promise<string> {
  const memories = await getRelevantCustomerMemories({
    workspaceId: input.workspaceId,
    customerId: input.customerId,
    limit: 8,
  });

  if (memories.length === 0) {
    if (input.conversationCount <= 1) {
      return `${input.customerName} is a new customer. ZOL will build operational memory as conversations continue.`;
    }

    return `${input.customerName} has contacted the business ${input.conversationCount} times. Operational memory is still forming from recent conversations.`;
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (apiKey) {
    try {
      const memoryLines = memories
        .map((memory) => `- [${MEMORY_CATEGORY_LABELS[memory.category]}] ${memory.content}`)
        .join("\n");

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.3,
          messages: [
            {
              role: "system",
              content:
                "Write one concise operational summary sentence (max 220 characters) about this customer for a business owner. Focus on relationship continuity and operational patterns. Do not mention AI or memory systems.",
            },
            {
              role: "user",
              content: `Customer: ${input.customerName}
Conversation count: ${input.conversationCount}
Operational memories:
${memoryLines}`,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          choices?: Array<{ message?: { content?: string | null } }>;
        };
        const summary = data.choices?.[0]?.message?.content?.trim();

        if (summary) {
          return summary;
        }
      }
    } catch (error) {
      console.error("Failed to generate operational summary:", error);
    }
  }

  const topMemories = memories.slice(0, 3).map((memory) => memory.content.toLowerCase());
  return `${input.customerName} frequently contacts the business. ZOL remembers: ${topMemories.join("; ")}.`;
}
