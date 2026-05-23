-- AlterTable: migrate AIEmployeeSettings to business-context model
ALTER TABLE "AIEmployeeSettings" ADD COLUMN IF NOT EXISTS "businessContext" TEXT;
ALTER TABLE "AIEmployeeSettings" ADD COLUMN IF NOT EXISTS "commonScenarios" JSONB;
ALTER TABLE "AIEmployeeSettings" ADD COLUMN IF NOT EXISTS "enabledCapabilities" JSONB;

UPDATE "AIEmployeeSettings"
SET "enabledCapabilities" = "enabledTasks"
WHERE "enabledCapabilities" IS NULL
  AND "enabledTasks" IS NOT NULL;

UPDATE "AIEmployeeSettings"
SET "enabledCapabilities" = '[]'::jsonb
WHERE "enabledCapabilities" IS NULL;

ALTER TABLE "AIEmployeeSettings" DROP COLUMN IF EXISTS "primaryGoal";
ALTER TABLE "AIEmployeeSettings" DROP COLUMN IF EXISTS "operationalHandlingMode";
ALTER TABLE "AIEmployeeSettings" DROP COLUMN IF EXISTS "enabledTasks";

ALTER TABLE "AIEmployeeSettings" ALTER COLUMN "enabledCapabilities" SET NOT NULL;

DROP TYPE IF EXISTS "PrimaryGoal";
DROP TYPE IF EXISTS "OperationalHandlingMode";
