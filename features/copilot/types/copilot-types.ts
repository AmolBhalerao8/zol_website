import type { CopilotRecommendation, RecommendationType } from "@prisma/client";

export type { RecommendationType };

export type CopilotScope =
  | { scope: "workspace" }
  | { scope: "conversation"; conversationId: string }
  | { scope: "customer"; customerId: string }
  | { scope: "workflow"; workflowId: string };

export type CopilotRecommendationInput = {
  type: RecommendationType;
  title: string;
  content: string;
  sourceConversationId?: string;
  sourceCustomerId?: string;
  sourceWorkflowId?: string;
  metadata?: Record<string, unknown>;
};

export type OperationalContext = {
  scope: CopilotScope["scope"];
  businessName: string;
  communicationTone: string;
  businessContext: string | null;
  contextSummary: string;
  sections: string[];
};

export type DailyOperationalInsights = {
  highlights: string[];
  customerIssues: string[];
  unresolvedConcerns: string[];
  workflowBottlenecks: string[];
  appointmentLoad: string | null;
};

export type CopilotRecommendationRecord = CopilotRecommendation;

export const RECOMMENDATION_TYPE_LABELS: Record<RecommendationType, string> = {
  REPLY_DRAFT: "Suggested reply",
  FOLLOW_UP: "Follow-up draft",
  OPERATIONAL_ALERT: "Operational alert",
  WORKFLOW_SUGGESTION: "Workflow recommendation",
  CUSTOMER_INSIGHT: "Customer insight",
  DAILY_INSIGHT: "Daily insight",
};

export function getScopeKey(scope: CopilotScope): string {
  switch (scope.scope) {
    case "workspace":
      return "workspace";
    case "conversation":
      return `conversation:${scope.conversationId}`;
    case "customer":
      return `customer:${scope.customerId}`;
    case "workflow":
      return `workflow:${scope.workflowId}`;
  }
}
