-- CreateEnum
CREATE TYPE "RecommendationType" AS ENUM ('REPLY_DRAFT', 'FOLLOW_UP', 'OPERATIONAL_ALERT', 'WORKFLOW_SUGGESTION', 'CUSTOMER_INSIGHT', 'DAILY_INSIGHT');

-- CreateTable
CREATE TABLE "CopilotRecommendation" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "type" "RecommendationType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sourceConversationId" TEXT,
    "sourceCustomerId" TEXT,
    "sourceWorkflowId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CopilotRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CopilotRecommendation_workspaceId_type_createdAt_idx" ON "CopilotRecommendation"("workspaceId", "type", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "CopilotRecommendation_workspaceId_sourceConversationId_creat_idx" ON "CopilotRecommendation"("workspaceId", "sourceConversationId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "CopilotRecommendation_workspaceId_sourceCustomerId_createdAt_idx" ON "CopilotRecommendation"("workspaceId", "sourceCustomerId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "CopilotRecommendation_workspaceId_sourceWorkflowId_createdAt_idx" ON "CopilotRecommendation"("workspaceId", "sourceWorkflowId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "CopilotRecommendation" ADD CONSTRAINT "CopilotRecommendation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CopilotRecommendation" ADD CONSTRAINT "CopilotRecommendation_sourceConversationId_fkey" FOREIGN KEY ("sourceConversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CopilotRecommendation" ADD CONSTRAINT "CopilotRecommendation_sourceCustomerId_fkey" FOREIGN KEY ("sourceCustomerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CopilotRecommendation" ADD CONSTRAINT "CopilotRecommendation_sourceWorkflowId_fkey" FOREIGN KEY ("sourceWorkflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
