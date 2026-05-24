import { notFound } from "next/navigation";

import { CustomerDetail } from "@/features/customers/components/customer-detail";
import { getCustomerById } from "@/features/customers/queries/get-customers";
import { getCustomerDisplayName } from "@/features/customers/utils/normalize-customer-identity";
import { generateOperationalSummary } from "@/features/memory/services/build-customer-context";
import { requireWorkspace } from "@/features/workspace";
import { withDbRetry } from "@/lib/db-retry";

type CustomerDetailPageProps = {
  customerId: string;
};

export async function CustomerDetailPage({ customerId }: CustomerDetailPageProps) {
  const currentWorkspace = await requireWorkspace();
  const customer = await withDbRetry(() =>
    getCustomerById(currentWorkspace.workspace.id, customerId),
  );

  if (!customer) {
    notFound();
  }

  const conversationDates = customer.conversationLinks.map((link) => link.conversation.createdAt);
  const firstInteraction =
    conversationDates.length > 0
      ? new Date(Math.min(...conversationDates.map((date) => date.getTime())))
      : null;
  const latestInteraction =
    conversationDates.length > 0
      ? new Date(Math.max(...conversationDates.map((date) => date.getTime())))
      : null;

  const operationalSummary = await generateOperationalSummary({
    workspaceId: currentWorkspace.workspace.id,
    customerId: customer.id,
    customerName: getCustomerDisplayName(customer),
    conversationCount: customer._count.conversationLinks,
  });

  return (
    <div className="mx-auto max-w-5xl">
      <CustomerDetail
        customer={customer}
        operationalSummary={operationalSummary}
        firstInteraction={firstInteraction}
        latestInteraction={latestInteraction}
      />
    </div>
  );
}
