-- CreateEnum
CREATE TYPE "IntelligenceMessageRole" AS ENUM ('USER', 'ASSISTANT');

-- CreateTable
CREATE TABLE "IntelligenceSession" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntelligenceSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntelligenceMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" "IntelligenceMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntelligenceMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IntelligenceSession_workspaceId_createdAt_idx" ON "IntelligenceSession"("workspaceId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "IntelligenceMessage_sessionId_createdAt_idx" ON "IntelligenceMessage"("sessionId", "createdAt" ASC);

-- AddForeignKey
ALTER TABLE "IntelligenceSession" ADD CONSTRAINT "IntelligenceSession_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntelligenceMessage" ADD CONSTRAINT "IntelligenceMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "IntelligenceSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
