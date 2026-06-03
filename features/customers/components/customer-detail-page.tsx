import { Suspense } from "react";
import { notFound } from "next/navigation";

import { CustomerCopilotSection } from "@/features/copilot/components/customer-copilot-section";
import { CopilotSuggestionsSkeleton } from "@/features/copilot/components/copilot-suggestions-skeleton";
import { CustomerDetail } from "@/features/customers/components/customer-detail";
import { getCustomerById } from "@/features/customers/queries/get-customers";
import { getCustomerDisplayName } from "@/features/customers/utils/normalize-customer-identity";
import { CustomerTekmetricSection } from "@/features/integrations/components/customer-tekmetric-section";
import { getTekmetricDataForCustomer } from "@/features/integrations/queries/get-tekmetric-data";
import { generateOperationalSummary } from "@/features/memory/services/build-customer-context";
import { CustomerCommunicationHistory } from "@/features/messages/components/customer-communication-history";
import { getCustomerMessages } from "@/features/messages/queries/get-message-drafts";
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

  const tekmetricData = await withDbRetry(() =>
    getTekmetricDataForCustomer(currentWorkspace.workspace.id, customer.id),
  );
  const customerMessages = await withDbRetry(() =>
    getCustomerMessages(currentWorkspace.workspace.id, customer.id),
  );
  const [tekmetricCustomers, tekmetricVehicles, tekmetricAppointments, tekmetricRepairOrders] =
    tekmetricData;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <CustomerDetail
        customer={customer}
        operationalSummary={operationalSummary}
        firstInteraction={firstInteraction}
        latestInteraction={latestInteraction}
        tekmetricSection={
          <CustomerTekmetricSection
            tekmetricCustomers={tekmetricCustomers}
            vehicles={tekmetricVehicles}
            appointments={tekmetricAppointments}
            repairOrders={tekmetricRepairOrders}
          />
        }
      />
      <CustomerCommunicationHistory messages={customerMessages} />
      <Suspense fallback={<CopilotSuggestionsSkeleton />}>
        <CustomerCopilotSection
          workspaceId={currentWorkspace.workspace.id}
          customerId={customer.id}
        />
      </Suspense>
    </div>
  );
}
