import type { SuggestedWorkflow } from "@/features/workflows/types/workflow-types";

function templateInsight(suggestion: SuggestedWorkflow): string {
  switch (suggestion.type) {
    case "FOLLOW_UP":
      return "ZOL noticed an open follow-up that has been waiting longer than expected without resolution.";
    case "URGENT_ISSUE":
      return "ZOL detected an urgent customer conversation that still has unresolved operational next steps.";
    case "MISSED_CALLBACK":
      return "ZOL found a callback or follow-up action that appears overdue based on conversation activity.";
    case "REPEATED_ISSUE":
      return "ZOL detected repeated issue memories for the same customer, suggesting a recurring unresolved concern.";
    case "CUSTOMER_ESCALATION":
      return "ZOL noticed multiple urgent conversations from the same customer within a short period.";
    case "APPOINTMENT_REMINDER":
      return "ZOL found a scheduled appointment that may still need confirmation before service.";
    case "OPERATIONAL_ALERT":
      return "ZOL detected pending shop operational work that may need attention from your team.";
    case "DAILY_SUMMARY":
      return "ZOL compiled today's operational highlights from conversations, workflows, and synced shop data.";
    default:
      return "ZOL detected an operational pattern that may need attention.";
  }
}

export async function generateWorkflowInsight(
  suggestion: SuggestedWorkflow,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return templateInsight(suggestion);
  }

  try {
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
          {
            role: "system",
            content:
              "Explain in one concise sentence why ZOL created an operational workflow. Be trustworthy, calm, and operational. Return JSON: { insightReason: string }",
          },
          {
            role: "user",
            content: JSON.stringify({
              type: suggestion.type,
              title: suggestion.title,
              description: suggestion.description,
              context: suggestion.context ?? {},
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      return templateInsight(suggestion);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      return templateInsight(suggestion);
    }

    const parsed = JSON.parse(content) as { insightReason?: string };
    return parsed.insightReason?.trim() || templateInsight(suggestion);
  } catch {
    return templateInsight(suggestion);
  }
}
