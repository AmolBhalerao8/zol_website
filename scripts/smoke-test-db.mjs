import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const checks = [
  { name: "users", run: () => prisma.user.count() },
  { name: "workspaces", run: () => prisma.workspace.count() },
  { name: "customers", run: () => prisma.customer.count() },
  { name: "conversations", run: () => prisma.conversation.count() },
  { name: "integrations", run: () => prisma.integration.count() },
  { name: "customer_memory", run: () => prisma.customerMemory.count() },
];

let failed = false;

for (const check of checks) {
  try {
    const count = await check.run();
    console.log(`OK ${check.name}: ${count}`);
  } catch (error) {
    failed = true;
    console.error(
      `FAIL ${check.name}:`,
      error instanceof Error ? error.message : error,
    );
  }
}

await prisma.$disconnect();
process.exit(failed ? 1 : 0);
