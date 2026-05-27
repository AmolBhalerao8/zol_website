-- Add invite-only approval gate for users
ALTER TABLE "User"
ADD COLUMN "isApproved" BOOLEAN NOT NULL DEFAULT false;
