import type {
  Conversation,
  Customer,
  Workflow,
  WorkflowPriority,
  WorkflowStatus,
  WorkflowType,
} from "@prisma/client";

export type { WorkflowPriority, WorkflowStatus, WorkflowType };

export type SuggestedWorkflow = {
  type: WorkflowType;
  title: string;
  description: string;
  priority: WorkflowPriority;
  sourceConversationId?: string;
  sourceCustomerId?: string;
  dedupKey: string;
  context?: Record<string, unknown>;
};

export type WorkflowWithSources = Workflow & {
  sourceConversation: Pick<Conversation, "id" | "customerName" | "summary" | "urgency"> | null;
  sourceCustomer: Pick<Customer, "id" | "name" | "primaryPhone"> | null;
};

export type WorkflowScanResult = {
  created: number;
  skipped: number;
  updatedStatuses: number;
};

export type DailySummaryContent = {
  conversationCount: number;
  urgentIssues: number;
  openWorkflows: number;
  pendingFollowUps: number;
  appointmentsTomorrow: number;
  highlights: string[];
};

export const WORKFLOW_TYPE_LABELS: Record<WorkflowType, string> = {
  FOLLOW_UP: "Follow-up",
  URGENT_ISSUE: "Urgent issue",
  MISSED_CALLBACK: "Missed callback",
  APPOINTMENT_REMINDER: "Appointment reminder",
  CUSTOMER_ESCALATION: "Customer escalation",
  REPEATED_ISSUE: "Repeated issue",
  OPERATIONAL_ALERT: "Operational alert",
  DAILY_SUMMARY: "Daily summary",
};
