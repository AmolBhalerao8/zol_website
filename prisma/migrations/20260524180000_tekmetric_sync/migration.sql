-- CreateEnum
CREATE TYPE "TekmetricSyncStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "TekmetricSyncLog" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "status" "TekmetricSyncStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "recordsSynced" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TekmetricSyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TekmetricCustomer" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "zolCustomerId" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "rawData" JSONB NOT NULL,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TekmetricCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TekmetricVehicle" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "tekmetricCustomerId" TEXT,
    "zolCustomerId" TEXT,
    "year" TEXT,
    "make" TEXT,
    "model" TEXT,
    "vin" TEXT,
    "rawData" JSONB NOT NULL,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TekmetricVehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TekmetricAppointment" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "tekmetricCustomerId" TEXT,
    "zolCustomerId" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "status" TEXT,
    "summary" TEXT,
    "rawData" JSONB NOT NULL,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TekmetricAppointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TekmetricRepairOrder" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "tekmetricCustomerId" TEXT,
    "zolCustomerId" TEXT,
    "status" TEXT,
    "totalAmount" TEXT,
    "summary" TEXT,
    "rawData" JSONB NOT NULL,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TekmetricRepairOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TekmetricSyncLog_workspaceId_createdAt_idx" ON "TekmetricSyncLog"("workspaceId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "TekmetricSyncLog_integrationId_createdAt_idx" ON "TekmetricSyncLog"("integrationId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "TekmetricCustomer_workspaceId_integrationId_externalId_key" ON "TekmetricCustomer"("workspaceId", "integrationId", "externalId");

-- CreateIndex
CREATE INDEX "TekmetricCustomer_workspaceId_zolCustomerId_idx" ON "TekmetricCustomer"("workspaceId", "zolCustomerId");

-- CreateIndex
CREATE INDEX "TekmetricCustomer_workspaceId_phone_idx" ON "TekmetricCustomer"("workspaceId", "phone");

-- CreateIndex
CREATE INDEX "TekmetricCustomer_workspaceId_email_idx" ON "TekmetricCustomer"("workspaceId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "TekmetricVehicle_workspaceId_integrationId_externalId_key" ON "TekmetricVehicle"("workspaceId", "integrationId", "externalId");

-- CreateIndex
CREATE INDEX "TekmetricVehicle_workspaceId_zolCustomerId_idx" ON "TekmetricVehicle"("workspaceId", "zolCustomerId");

-- CreateIndex
CREATE INDEX "TekmetricVehicle_workspaceId_tekmetricCustomerId_idx" ON "TekmetricVehicle"("workspaceId", "tekmetricCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "TekmetricAppointment_workspaceId_integrationId_externalId_key" ON "TekmetricAppointment"("workspaceId", "integrationId", "externalId");

-- CreateIndex
CREATE INDEX "TekmetricAppointment_workspaceId_zolCustomerId_idx" ON "TekmetricAppointment"("workspaceId", "zolCustomerId");

-- CreateIndex
CREATE INDEX "TekmetricAppointment_workspaceId_scheduledAt_idx" ON "TekmetricAppointment"("workspaceId", "scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "TekmetricRepairOrder_workspaceId_integrationId_externalId_key" ON "TekmetricRepairOrder"("workspaceId", "integrationId", "externalId");

-- CreateIndex
CREATE INDEX "TekmetricRepairOrder_workspaceId_zolCustomerId_idx" ON "TekmetricRepairOrder"("workspaceId", "zolCustomerId");

-- CreateIndex
CREATE INDEX "TekmetricRepairOrder_workspaceId_status_idx" ON "TekmetricRepairOrder"("workspaceId", "status");

-- AddForeignKey
ALTER TABLE "TekmetricSyncLog" ADD CONSTRAINT "TekmetricSyncLog_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TekmetricSyncLog" ADD CONSTRAINT "TekmetricSyncLog_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TekmetricCustomer" ADD CONSTRAINT "TekmetricCustomer_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TekmetricCustomer" ADD CONSTRAINT "TekmetricCustomer_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TekmetricCustomer" ADD CONSTRAINT "TekmetricCustomer_zolCustomerId_fkey" FOREIGN KEY ("zolCustomerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TekmetricVehicle" ADD CONSTRAINT "TekmetricVehicle_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TekmetricVehicle" ADD CONSTRAINT "TekmetricVehicle_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TekmetricAppointment" ADD CONSTRAINT "TekmetricAppointment_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TekmetricAppointment" ADD CONSTRAINT "TekmetricAppointment_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TekmetricRepairOrder" ADD CONSTRAINT "TekmetricRepairOrder_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TekmetricRepairOrder" ADD CONSTRAINT "TekmetricRepairOrder_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "Integration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
