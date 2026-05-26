import type { RecommendationType } from "@prisma/client";

import type {
  CopilotRecommendationInput,
  CopilotScope,
  OperationalContext,
} from "@/features/copilot/types/copilot-types";

function templateRecommendations(
  context: OperationalContext,
  scope: CopilotScope,
): CopilotRecommendationInput[] {
  const recommendations: CopilotRecommendationInput[] = [];

  if (scope.scope === "conversation") {
    recommendations.push({
      type: "REPLY_DRAFT",
      title: "Suggested reply",
      content:
        "Thank you for reaching out. We understand your concern and are reviewing the details now. A team member will follow up shortly with a clear update.",
      sourceConversationId: scope.conversationId,
    });
    recommendations.push({
      type: "FOLLOW_UP",
      title: "Follow-up draft",
      content:
        "We wanted to follow up regarding your recent conversation and make sure your request is moving forward.",
      sourceConversationId: scope.conversationId,
    });
    recommendations.push({
      type: "OPERATIONAL_ALERT",
      title: "Suggested next action",
      content: "Review open action items from this conversation and confirm ownership with your team.",
      sourceConversationId: scope.conversationId,
    });
  }

  if (scope.scope === "customer") {
    recommendations.push({
      type: "CUSTOMER_INSIGHT",
      title: "Customer may require follow-up",
      content:
        "Based on recent conversation history, this customer may benefit from a proactive check-in.",
      sourceCustomerId: scope.customerId,
    });
    recommendations.push({
      type: "FOLLOW_UP",
      title: "Follow-up draft",
      content:
        "We wanted to follow up regarding your recent service issue and confirm whether everything has been resolved.",
      sourceCustomerId: scope.customerId,
    });
    recommendations.push({
      type: "WORKFLOW_SUGGESTION",
      title: "Operational recommendation",
      content: "Review recent memories and open follow-ups before the next customer interaction.",
      sourceCustomerId: scope.customerId,
    });
  }

  if (scope.scope === "workflow") {
    recommendations.push({
      type: "WORKFLOW_SUGGESTION",
      title: "Consider escalating this issue",
      content: "This workflow may need direct team attention to prevent further delay.",
      sourceWorkflowId: scope.workflowId,
    });
    recommendations.push({
      type: "FOLLOW_UP",
      title: "Follow-up may improve satisfaction",
      content: "A concise follow-up message could help close the loop with the customer.",
      sourceWorkflowId: scope.workflowId,
    });
  }

  if (scope.scope === "workspace") {
    recommendations.push({
      type: "DAILY_INSIGHT",
      title: "Operational overview",
      content: `ZOL is monitoring ${context.businessName} for follow-ups, urgent issues, and workflow bottlenecks.`,
    });
    recommendations.push({
      type: "WORKFLOW_SUGGESTION",
      title: "Review active workflows",
      content: "Check open operational workflows and assign next steps to your team.",
    });
    recommendations.push({
      type: "OPERATIONAL_ALERT",
      title: "Stay ahead of customer follow-ups",
      content: "Prioritize customers with open action items or unresolved urgent conversations.",
    });
  }

  return recommendations.slice(0, 5);
}

export async function generateOperationalRecommendations(input: {
  context: OperationalContext;
  scope: CopilotScope;
}): Promise<CopilotRecommendationInput[]> {
  const { context, scope } = input;
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey || context.contextSummary.trim().length < 20) {
    return templateRecommendations(context, scope);
  }

  const scopeInstruction = {
    workspace:
      "Generate workspace-level operational recommendations including daily insights, workflow suggestions, and operational alerts.",
    conversation:
      "Generate a suggested reply draft, follow-up draft, next action, and operational insight for this conversation.",
    customer:
      "Generate customer insights, follow-up drafts, and operational recommendations for this customer.",
    workflow:
      "Generate workflow recommendations and follow-up suggestions for this operational workflow.",
  }[scope.scope];

  try {
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
          {
            role: "system",
            content: `You are ZOL's operational copilot for ${context.businessName}. ${scopeInstruction}
Communication tone: ${context.communicationTone}.
Rules:
- Stay grounded in the provided context only.
- Do not invent facts, appointments, or order statuses.
- Be concise, calm, and operationally useful.
- If context is insufficient, say so clearly in one recommendation.
- Return JSON: { recommendations: [{ type: RecommendationType, title: string, content: string }] }
Valid types: REPLY_DRAFT, FOLLOW_UP, OPERATIONAL_ALERT, WORKFLOW_SUGGESTION, CUSTOMER_INSIGHT, DAILY_INSIGHT
Return 3-5 recommendations maximum.`,
          },
          {
            role: "user",
            content: context.contextSummary,
          },
        ],
      }),
    });

    if (!response.ok) {
      return templateRecommendations(context, scope);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      return templateRecommendations(context, scope);
    }

    const parsed = JSON.parse(content) as {
      recommendations?: Array<{
        type?: RecommendationType;
        title?: string;
        content?: string;
      }>;
    };

    const validTypes: RecommendationType[] = [
      "REPLY_DRAFT",
      "FOLLOW_UP",
      "OPERATIONAL_ALERT",
      "WORKFLOW_SUGGESTION",
      "CUSTOMER_INSIGHT",
      "DAILY_INSIGHT",
    ];

    const recommendations = (parsed.recommendations ?? [])
      .filter(
        (item) =>
          item.type &&
          validTypes.includes(item.type) &&
          item.title?.trim() &&
          item.content?.trim(),
      )
      .slice(0, 5)
      .map((item) => ({
        type: item.type as RecommendationType,
        title: item.title!.trim(),
        content: item.content!.trim(),
        ...(scope.scope === "conversation"
          ? { sourceConversationId: scope.conversationId }
          : {}),
        ...(scope.scope === "customer" ? { sourceCustomerId: scope.customerId } : {}),
        ...(scope.scope === "workflow" ? { sourceWorkflowId: scope.workflowId } : {}),
      }));

    return recommendations.length > 0 ? recommendations : templateRecommendations(context, scope);
  } catch {
    return templateRecommendations(context, scope);
  }
}
