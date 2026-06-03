import type { MessageType, WorkflowType } from "@prisma/client";

const WORKFLOW_MESSAGE_TYPES: Partial<Record<WorkflowType, MessageType>> = {
  FOLLOW_UP: "FOLLOW_UP",
  MISSED_CALLBACK: "FOLLOW_UP",
  APPOINTMENT_REMINDER: "APPOINTMENT_REMINDER",
  URGENT_ISSUE: "ISSUE_RESOLUTION",
  REPEATED_ISSUE: "ISSUE_RESOLUTION",
  CUSTOMER_ESCALATION: "ISSUE_RESOLUTION",
  OPERATIONAL_ALERT: "ORDER_UPDATE",
};

export function mapWorkflowToMessageType(workflowType: WorkflowType): MessageType | null {
  return WORKFLOW_MESSAGE_TYPES[workflowType] ?? null;
}

export function shouldGenerateDraftForWorkflow(workflowType: WorkflowType): boolean {
  return workflowType !== "DAILY_SUMMARY" && mapWorkflowToMessageType(workflowType) !== null;
}

export function getGeneratedReasonForWorkflow(
  workflowType: WorkflowType,
  workflowTitle: string,
): string {
  switch (workflowType) {
    case "FOLLOW_UP":
      return "Customer needs follow-up";
    case "MISSED_CALLBACK":
      return "After-hours callback follow-up";
    case "APPOINTMENT_REMINDER":
      return "Appointment reminder needed";
    case "URGENT_ISSUE":
    case "REPEATED_ISSUE":
    case "CUSTOMER_ESCALATION":
      return "Unresolved customer issue";
    case "OPERATIONAL_ALERT":
      return "Order or service update follow-up";
    default:
      return workflowTitle;
  }
}
