-- CreateTable
CREATE TABLE "IntelligenceQuery" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntelligenceQuery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IntelligenceQuery_workspaceId_createdAt_idx" ON "IntelligenceQuery"("workspaceId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "IntelligenceQuery" ADD CONSTRAINT "IntelligenceQuery_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
