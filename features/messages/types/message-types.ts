import type {
  GeneratedBy,
  MessageChannel,
  MessageStatus,
  MessageType,
  OutboundMessage,
  Customer,
  Conversation,
  Workflow,
} from "@prisma/client";

export type OutboundMessageWithRelations = OutboundMessage & {
  customer: Pick<Customer, "id" | "name" | "primaryPhone" | "primaryEmail"> | null;
  conversation: Pick<Conversation, "id" | "customerName" | "summary"> | null;
  workflow: Pick<Workflow, "id" | "title" | "type"> | null;
};

export type GenerateMessageDraftInput = {
  customerId?: string;
  conversationId?: string;
  workflowId?: string;
  type?: MessageType;
  generatedBy?: GeneratedBy;
};

export type GeneratedFollowUpMessage = {
  subject: string | null;
  content: string;
  type: MessageType;
  recommendedChannel: MessageChannel;
  generatedReason: string;
};

export type MessageStats = {
  pendingDrafts: number;
  awaitingApproval: number;
  sentToday: number;
};

export const MESSAGE_TYPE_LABELS: Record<MessageType, string> = {
  FOLLOW_UP: "Follow-up",
  APPOINTMENT_REMINDER: "Appointment reminder",
  ORDER_UPDATE: "Order update",
  ISSUE_RESOLUTION: "Issue resolution",
  REVIEW_REQUEST: "Review request",
  GENERAL: "General",
};

export const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  DRAFT: "Draft",
  APPROVED: "Approved",
  SENT: "Sent",
  FAILED: "Failed",
  REJECTED: "Rejected",
};

export const MESSAGE_CHANNEL_LABELS: Record<MessageChannel, string> = {
  SMS: "SMS",
  EMAIL: "Email",
};
