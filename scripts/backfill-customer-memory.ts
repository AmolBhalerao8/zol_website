import { PrismaClient } from "@prisma/client";

import { processConversationCustomerMemory } from "../features/customers/services/process-conversation-customer";

const prisma = new PrismaClient();

async function main() {
  const conversations = await prisma.conversation.findMany({
    where: { status: "COMPLETED" },
    select: {
      id: true,
      workspaceId: true,
      customerName: true,
      customerPhone: true,
    },
    orderBy: { createdAt: "asc" },
  });

  let processed = 0;

  for (const conversation of conversations) {
    const result = await processConversationCustomerMemory({
      workspaceId: conversation.workspaceId,
      conversationId: conversation.id,
      customerName: conversation.customerName,
      customerPhone: conversation.customerPhone,
    });

    if (result) {
      processed += 1;
      console.log(
        `Processed ${conversation.id}: customer=${result.customerId}, memories=${result.memoriesCreated}, skipped=${result.skipped}`,
      );
    }
  }

  console.log(`Done. Processed ${processed} conversation(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
