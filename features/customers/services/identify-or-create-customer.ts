import type { Customer } from "@prisma/client";

import {
  formatPhoneForStorage,
  normalizeEmailForMatch,
  normalizePhoneForMatch,
} from "@/features/customers/utils/normalize-customer-identity";
import { prisma } from "@/lib/prisma";

export type IdentifyCustomerInput = {
  workspaceId: string;
  conversationId: string;
  customerName?: string | null;
  customerPhone?: string | null;
  customerEmail?: string | null;
};

export type IdentifyCustomerResult = {
  customer: Customer;
  matchedBy: "existing_link" | "phone" | "email" | "created";
  confidenceScore: number;
  created: boolean;
};

async function findCustomerByPhone(workspaceId: string, phone: string | null | undefined) {
  const phoneKey = normalizePhoneForMatch(phone);

  if (!phoneKey) {
    return null;
  }

  const candidates = await prisma.customer.findMany({
    where: {
      workspaceId,
      primaryPhone: { not: null },
    },
    take: 100,
    orderBy: { updatedAt: "desc" },
  });

  return (
    candidates.find((customer) => normalizePhoneForMatch(customer.primaryPhone) === phoneKey) ??
    null
  );
}

async function findCustomerByEmail(workspaceId: string, email: string | null | undefined) {
  const normalizedEmail = normalizeEmailForMatch(email);

  if (!normalizedEmail) {
    return null;
  }

  return prisma.customer.findFirst({
    where: {
      workspaceId,
      primaryEmail: normalizedEmail,
    },
  });
}

export async function identifyOrCreateCustomer(
  input: IdentifyCustomerInput,
): Promise<IdentifyCustomerResult> {
  const existingLink = await prisma.conversationCustomerLink.findUnique({
    where: { conversationId: input.conversationId },
    include: { customer: true },
  });

  if (existingLink) {
    return {
      customer: existingLink.customer,
      matchedBy: "existing_link",
      confidenceScore: existingLink.confidenceScore ?? 1,
      created: false,
    };
  }

  const storedPhone = formatPhoneForStorage(input.customerPhone);
  const storedEmail = normalizeEmailForMatch(input.customerEmail);
  const storedName = input.customerName?.trim() || null;

  let customer = await findCustomerByPhone(input.workspaceId, storedPhone);
  let matchedBy: IdentifyCustomerResult["matchedBy"] = "phone";
  let confidenceScore = 0.95;

  if (!customer && storedEmail) {
    customer = await findCustomerByEmail(input.workspaceId, storedEmail);
    matchedBy = "email";
    confidenceScore = 0.9;
  }

  let created = false;

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        workspaceId: input.workspaceId,
        name: storedName,
        primaryPhone: storedPhone,
        primaryEmail: storedEmail,
      },
    });
    matchedBy = "created";
    confidenceScore = 0.85;
    created = true;
  } else {
    const updates: {
      name?: string;
      primaryPhone?: string;
      primaryEmail?: string;
    } = {};

    if (storedName && !customer.name) {
      updates.name = storedName;
    }

    if (storedPhone && !customer.primaryPhone) {
      updates.primaryPhone = storedPhone;
    }

    if (storedEmail && !customer.primaryEmail) {
      updates.primaryEmail = storedEmail;
    }

    if (Object.keys(updates).length > 0) {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: updates,
      });
    }
  }

  await prisma.conversationCustomerLink.create({
    data: {
      conversationId: input.conversationId,
      customerId: customer.id,
      confidenceScore,
      matchedBy,
    },
  });

  return {
    customer,
    matchedBy,
    confidenceScore,
    created,
  };
}
