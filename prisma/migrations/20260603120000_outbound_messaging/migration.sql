-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('FOLLOW_UP', 'APPOINTMENT_REMINDER', 'ORDER_UPDATE', 'ISSUE_RESOLUTION', 'REVIEW_REQUEST', 'GENERAL');

-- CreateEnum
CREATE TYPE "MessageChannel" AS ENUM ('SMS', 'EMAIL');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('DRAFT', 'APPROVED', 'SENT', 'FAILED', 'REJECTED');

-- CreateEnum
CREATE TYPE "GeneratedBy" AS ENUM ('AI', 'USER');

-- CreateTable
CREATE TABLE "OutboundMessage" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "customerId" TEXT,
    "conversationId" TEXT,
    "workflowId" TEXT,
    "type" "MessageType" NOT NULL,
    "channel" "MessageChannel" NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'DRAFT',
    "recipient" TEXT NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "generatedBy" "GeneratedBy" NOT NULL,
    "generatedReason" TEXT,
    "approvedBy" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutboundMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageTemplate" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "type" "MessageType" NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OutboundMessage_workspaceId_status_createdAt_idx" ON "OutboundMessage"("workspaceId", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "OutboundMessage_workspaceId_customerId_createdAt_idx" ON "OutboundMessage"("workspaceId", "customerId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "OutboundMessage_workspaceId_conversationId_idx" ON "OutboundMessage"("workspaceId", "conversationId");

-- CreateIndex
CREATE INDEX "OutboundMessage_workspaceId_workflowId_status_idx" ON "OutboundMessage"("workspaceId", "workflowId", "status");

-- CreateIndex
CREATE INDEX "MessageTemplate_workspaceId_type_active_idx" ON "MessageTemplate"("workspaceId", "type", "active");

-- AddForeignKey
ALTER TABLE "OutboundMessage" ADD CONSTRAINT "OutboundMessage_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutboundMessage" ADD CONSTRAINT "OutboundMessage_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutboundMessage" ADD CONSTRAINT "OutboundMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutboundMessage" ADD CONSTRAINT "OutboundMessage_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutboundMessage" ADD CONSTRAINT "OutboundMessage_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageTemplate" ADD CONSTRAINT "MessageTemplate_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
