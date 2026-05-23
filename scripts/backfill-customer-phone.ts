import { PrismaClient } from "@prisma/client";

import { normalizeCustomerPhone } from "../features/conversations/utils/normalize-customer-phone";
import { parseVapiWebhookPayload } from "../features/conversations/utils/parse-vapi-webhook";
import { fetchVapiCall } from "../features/voice-channel/services/vapi";

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.conversation.findMany({
    select: {
      id: true,
      vapiCallId: true,
      customerPhone: true,
      rawProviderPayload: true,
    },
  });

  let updated = 0;

  for (const row of rows) {
    const parsed = parseVapiWebhookPayload(row.rawProviderPayload);
    let phone = normalizeCustomerPhone(parsed?.customerPhone);

    if (!phone && row.vapiCallId) {
      try {
        const call = await fetchVapiCall(row.vapiCallId);
        phone = normalizeCustomerPhone(
          call.customer?.number ?? call.customer?.phone ?? call.customer?.phoneNumber ?? null,
        );
      } catch {
        // Ignore missing or inaccessible calls (e.g. test payloads).
      }
    }

    if (phone && phone !== row.customerPhone) {
      await prisma.conversation.update({
        where: { id: row.id },
        data: { customerPhone: phone },
      });
      console.log(`Updated ${row.vapiCallId}: ${row.customerPhone} -> ${phone}`);
      updated += 1;
    }
  }

  console.log(`Done. Updated ${updated} conversation(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
