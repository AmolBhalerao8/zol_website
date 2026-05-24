-- Enable pgvector for customer memory similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- CreateEnum
CREATE TYPE "MemoryCategory" AS ENUM (
  'PREFERENCE',
  'ISSUE',
  'ORDER_HISTORY',
  'SERVICE_HISTORY',
  'COMMUNICATION_STYLE',
  'BUSINESS_CONTEXT',
  'FOLLOW_UP',
  'GENERAL'
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "name" TEXT,
    "primaryPhone" TEXT,
    "primaryEmail" TEXT,
    "notes" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationCustomerLink" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION,
    "matchedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationCustomerLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerMemory" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "conversationId" TEXT,
    "content" TEXT NOT NULL,
    "category" "MemoryCategory" NOT NULL,
    "importanceScore" DOUBLE PRECISION,
    "embedding" vector(1536),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerMemory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Customer_workspaceId_createdAt_idx" ON "Customer"("workspaceId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Customer_workspaceId_primaryPhone_idx" ON "Customer"("workspaceId", "primaryPhone");

-- CreateIndex
CREATE INDEX "Customer_workspaceId_primaryEmail_idx" ON "Customer"("workspaceId", "primaryEmail");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationCustomerLink_conversationId_key" ON "ConversationCustomerLink"("conversationId");

-- CreateIndex
CREATE INDEX "ConversationCustomerLink_customerId_idx" ON "ConversationCustomerLink"("customerId");

-- CreateIndex
CREATE INDEX "CustomerMemory_workspaceId_customerId_createdAt_idx" ON "CustomerMemory"("workspaceId", "customerId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "CustomerMemory_customerId_category_idx" ON "CustomerMemory"("customerId", "category");

-- CreateIndex
CREATE INDEX "CustomerMemory_conversationId_idx" ON "CustomerMemory"("conversationId");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationCustomerLink" ADD CONSTRAINT "ConversationCustomerLink_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationCustomerLink" ADD CONSTRAINT "ConversationCustomerLink_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerMemory" ADD CONSTRAINT "CustomerMemory_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerMemory" ADD CONSTRAINT "CustomerMemory_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerMemory" ADD CONSTRAINT "CustomerMemory_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
