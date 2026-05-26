-- CreateEnum
CREATE TYPE "WorkflowType" AS ENUM ('FOLLOW_UP', 'URGENT_ISSUE', 'MISSED_CALLBACK', 'APPOINTMENT_REMINDER', 'CUSTOMER_ESCALATION', 'REPEATED_ISSUE', 'OPERATIONAL_ALERT', 'DAILY_SUMMARY');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "WorkflowPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateTable
CREATE TABLE "Workflow" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "type" "WorkflowType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "WorkflowStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "WorkflowPriority" NOT NULL DEFAULT 'MEDIUM',
    "sourceConversationId" TEXT,
    "sourceCustomerId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Workflow_workspaceId_status_createdAt_idx" ON "Workflow"("workspaceId", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Workflow_workspaceId_type_status_idx" ON "Workflow"("workspaceId", "type", "status");

-- CreateIndex
CREATE INDEX "Workflow_workspaceId_sourceConversationId_idx" ON "Workflow"("workspaceId", "sourceConversationId");

-- CreateIndex
CREATE INDEX "Workflow_workspaceId_sourceCustomerId_type_status_idx" ON "Workflow"("workspaceId", "sourceCustomerId", "type", "status");

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_sourceConversationId_fkey" FOREIGN KEY ("sourceConversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_sourceCustomerId_fkey" FOREIGN KEY ("sourceCustomerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
