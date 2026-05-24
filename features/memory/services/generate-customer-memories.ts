import type { MemoryCategory } from "@prisma/client";
import type { AIEmployeeSettings, Workspace } from "@prisma/client";

export type GeneratedCustomerMemory = {
  content: string;
  category: MemoryCategory;
  importanceScore: number;
};

const MEMORY_CATEGORIES = new Set<MemoryCategory>([
  "PREFERENCE",
  "ISSUE",
  "ORDER_HISTORY",
  "SERVICE_HISTORY",
  "COMMUNICATION_STYLE",
  "BUSINESS_CONTEXT",
  "FOLLOW_UP",
  "GENERAL",
]);

function parseModelJson(content: string): { memories?: GeneratedCustomerMemory[] } | null {
  try {
    return JSON.parse(content) as { memories?: GeneratedCustomerMemory[] };
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]) as { memories?: GeneratedCustomerMemory[] };
    } catch {
      return null;
    }
  }
}

function normalizeMemory(item: unknown): GeneratedCustomerMemory | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as GeneratedCustomerMemory;
  const content = typeof record.content === "string" ? record.content.trim() : "";
  const category = record.category;

  if (!content || content.length < 12 || !MEMORY_CATEGORIES.has(category)) {
    return null;
  }

  const genericPatterns = [
    /^customer called/i,
    /^customer contacted/i,
    /^customer reached out/i,
    /^the customer asked a question/i,
    /^customer had a conversation/i,
  ];

  if (genericPatterns.some((pattern) => pattern.test(content))) {
    return null;
  }

  const importanceScore =
    typeof record.importanceScore === "number" && Number.isFinite(record.importanceScore)
      ? Math.min(1, Math.max(0.1, record.importanceScore))
      : 0.6;

  return {
    content,
    category,
    importanceScore,
  };
}

async function callOpenAI(system: string, user: string): Promise<string | null> {
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
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `OpenAI request failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  return data.choices?.[0]?.message?.content ?? null;
}

function buildFallbackMemories(input: {
  summary: string | null;
  actionItems: Array<{ title: string; description: string | null }>;
}): GeneratedCustomerMemory[] {
  const memories: GeneratedCustomerMemory[] = [];

  if (input.summary?.trim()) {
    memories.push({
      content: input.summary.trim(),
      category: "GENERAL",
      importanceScore: 0.55,
    });
  }

  for (const action of input.actionItems.slice(0, 2)) {
    const content = action.description?.trim()
      ? `${action.title.trim()}: ${action.description.trim()}`
      : action.title.trim();

    if (content.length >= 12) {
      memories.push({
        content,
        category: "FOLLOW_UP",
        importanceScore: 0.65,
      });
    }
  }

  return memories;
}

export async function generateCustomerMemories(input: {
  transcript: string | null;
  summary: string | null;
  actionItems: Array<{ title: string; description: string | null }>;
  workspace: Workspace;
  aiSettings: AIEmployeeSettings | null;
  previousMemories: Array<{ content: string; category: MemoryCategory }>;
}): Promise<GeneratedCustomerMemory[]> {
  const transcript = input.transcript?.trim();
  const businessContext =
    input.aiSettings?.businessContext?.trim() ||
    `${input.workspace.name} is a ${input.workspace.businessType} business.`;

  if (!transcript && !input.summary?.trim()) {
    return [];
  }

  const previousMemoryLines =
    input.previousMemories.length > 0
      ? input.previousMemories.map((memory) => `- [${memory.category}] ${memory.content}`).join("\n")
      : "None yet.";

  const actionItemLines =
    input.actionItems.length > 0
      ? input.actionItems
          .map((item) => `- ${item.title}${item.description ? `: ${item.description}` : ""}`)
          .join("\n")
      : "None.";

  try {
    const system = `You extract durable operational customer memories for ZOL, a business-aware AI employee platform.

Return ONLY valid JSON:
{
  "memories": [
    {
      "content": string,
      "category": "PREFERENCE" | "ISSUE" | "ORDER_HISTORY" | "SERVICE_HISTORY" | "COMMUNICATION_STYLE" | "BUSINESS_CONTEXT" | "FOLLOW_UP" | "GENERAL",
      "importanceScore": number
    }
  ]
}

Rules:
- Extract 1-5 high-value memories only.
- Each memory must be operationally useful for future conversations.
- Do NOT repeat existing memories unless there is a meaningful update.
- Do NOT create generic memories like "customer called" or "customer asked a question".
- Prefer concrete facts: preferences, vehicles, orders, recurring issues, communication style, follow-ups.
- importanceScore is 0.1 to 1.0 based on future usefulness.
- Do not mention AI, embeddings, or internal systems.`;

    const user = `Business: ${input.workspace.name} (${input.workspace.businessType})
Business context: ${businessContext}

Existing customer memories:
${previousMemoryLines}

Conversation summary:
${input.summary?.trim() || "Not available"}

Recommended follow-ups:
${actionItemLines}

Transcript:
${transcript || "Not available"}`;

    const modelContent = await callOpenAI(system, user);

    if (!modelContent) {
      return buildFallbackMemories({
        summary: input.summary,
        actionItems: input.actionItems,
      });
    }

    const parsed = parseModelJson(modelContent);
    const memories = (parsed?.memories ?? [])
      .map(normalizeMemory)
      .filter((memory): memory is GeneratedCustomerMemory => memory !== null);

    if (memories.length === 0) {
      return buildFallbackMemories({
        summary: input.summary,
        actionItems: input.actionItems,
      });
    }

    return memories.slice(0, 5);
  } catch (error) {
    console.error("Failed to generate customer memories:", error);
    return buildFallbackMemories({
      summary: input.summary,
      actionItems: input.actionItems,
    });
  }
}
