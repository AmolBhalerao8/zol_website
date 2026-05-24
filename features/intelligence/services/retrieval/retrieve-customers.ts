import type { ClassifiedIntelligenceQuery, IntelligenceRetrievalResult } from "@/features/intelligence/types/intelligence-types";
import { getCustomerDisplayName } from "@/features/customers/utils/normalize-customer-identity";
import { prisma } from "@/lib/prisma";

export async function retrieveCustomers(
  workspaceId: string,
  classified: ClassifiedIntelligenceQuery,
): Promise<IntelligenceRetrievalResult> {
  const needsFollowUp = classified.filters.needsFollowUp === "true";

  if (needsFollowUp) {
    const openActionItems = await prisma.actionItem.findMany({
      where: {
        workspaceId,
        status: { in: ["OPEN", "IN_PROGRESS"] },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        title: true,
        description: true,
        priority: true,
        conversation: {
          select: {
            id: true,
            customerName: true,
            summary: true,
            customerLink: {
              select: {
                customer: {
                  select: {
                    id: true,
                    name: true,
                    primaryPhone: true,
                    primaryEmail: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const customerMap = new Map<
      string,
      {
        customerId: string;
        name: string;
        actionItems: Array<{ id: string; title: string; priority: string }>;
        conversationId?: string;
      }
    >();

    for (const item of openActionItems) {
      const customer = item.conversation.customerLink?.customer;
      const customerId = customer?.id ?? `conversation-${item.conversation.id}`;
      const name =
        customer?.name ??
        item.conversation.customerName ??
        getCustomerDisplayName(customer ?? { primaryPhone: null, primaryEmail: null });

      const existing = customerMap.get(customerId);
      if (existing) {
        existing.actionItems.push({
          id: item.id,
          title: item.title,
          priority: item.priority,
        });
      } else {
        customerMap.set(customerId, {
          customerId,
          name,
          actionItems: [{ id: item.id, title: item.title, priority: item.priority }],
          conversationId: item.conversation.id,
        });
      }
    }

    const customers = Array.from(customerMap.values());

    return {
      queryType: "customers",
      recordCount: customers.length,
      payload: { customersNeedingFollowUp: customers },
      sources: customers.flatMap((customer) => [
        {
          id: customer.customerId,
          type: "customer" as const,
          title: customer.name,
          summary: `${customer.actionItems.length} open follow-up item(s)`,
          href: customer.customerId.startsWith("conversation-")
            ? undefined
            : `/customers/${customer.customerId}`,
        },
        ...customer.actionItems.map((item) => ({
          id: item.id,
          type: "action_item" as const,
          title: item.title,
          summary: `Priority: ${item.priority}`,
        })),
      ]),
    };
  }

  const createdAtFilter =
    classified.timeframe?.start || classified.timeframe?.end
      ? {
          gte: classified.timeframe.start,
          lte: classified.timeframe.end,
        }
      : undefined;

  const customers = await prisma.customer.findMany({
    where: {
      workspaceId,
      ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
    select: {
      id: true,
      name: true,
      primaryPhone: true,
      primaryEmail: true,
      updatedAt: true,
      _count: { select: { conversationLinks: true } },
    },
  });

  return {
    queryType: "customers",
    recordCount: customers.length,
    payload: {
      customers: customers.map((customer) => ({
        id: customer.id,
        name: getCustomerDisplayName(customer),
        conversationCount: customer._count.conversationLinks,
        updatedAt: customer.updatedAt.toISOString(),
      })),
    },
    sources: customers.map((customer) => ({
      id: customer.id,
      type: "customer" as const,
      title: getCustomerDisplayName(customer),
      summary: `${customer._count.conversationLinks} linked conversation(s)`,
      href: `/customers/${customer.id}`,
    })),
  };
}
