CREATE TYPE "IntegrationProvider" AS ENUM ('TEKMETRIC');
CREATE TYPE "IntegrationStatus" AS ENUM ('NOT_CONNECTED', 'CONNECTING', 'CONNECTED', 'FAILED');

CREATE TABLE "Integration" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "provider" "IntegrationProvider" NOT NULL,
    "status" "IntegrationStatus" NOT NULL DEFAULT 'NOT_CONNECTED',
    "credentialsEncrypted" TEXT,
    "metadata" JSONB,
    "lastConnectedAt" TIMESTAMP(3),
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Integration_workspaceId_provider_key" ON "Integration"("workspaceId", "provider");
CREATE INDEX "Integration_workspaceId_status_idx" ON "Integration"("workspaceId", "status");

ALTER TABLE "Integration" ADD CONSTRAINT "Integration_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
