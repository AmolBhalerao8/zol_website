import type { Customer } from "@prisma/client";

import {
  normalizeEmailForMatch,
  normalizePhoneForMatch,
} from "@/features/customers/utils/normalize-customer-identity";
import type { NormalizedTekmetricCustomer } from "@/features/integrations/services/tekmetric/types";

export function buildZolCustomerLookup(customers: Customer[]) {
  const byPhone = new Map<string, Customer>();
  const byEmail = new Map<string, Customer>();

  for (const customer of customers) {
    const phoneKey = normalizePhoneForMatch(customer.primaryPhone);
    if (phoneKey && !byPhone.has(phoneKey)) {
      byPhone.set(phoneKey, customer);
    }

    const emailKey = normalizeEmailForMatch(customer.primaryEmail);
    if (emailKey && !byEmail.has(emailKey)) {
      byEmail.set(emailKey, customer);
    }
  }

  return { byPhone, byEmail };
}

export function findMatchingZolCustomer(
  record: Pick<NormalizedTekmetricCustomer, "phone" | "email">,
  lookup: ReturnType<typeof buildZolCustomerLookup>,
): Customer | null {
  const phoneKey = normalizePhoneForMatch(record.phone);
  if (phoneKey) {
    const match = lookup.byPhone.get(phoneKey);
    if (match) {
      return match;
    }
  }

  const emailKey = normalizeEmailForMatch(record.email);
  if (emailKey) {
    const match = lookup.byEmail.get(emailKey);
    if (match) {
      return match;
    }
  }

  return null;
}

export function buildSafeCustomerMetadataUpdate(
  customer: Customer,
  tekmetricExternalId: string,
): Record<string, unknown> | null {
  const existing =
    customer.metadata && typeof customer.metadata === "object" && !Array.isArray(customer.metadata)
      ? (customer.metadata as Record<string, unknown>)
      : {};

  const updates: Record<string, unknown> = { ...existing };

  if (!existing.tekmetricExternalId) {
    updates.tekmetricExternalId = tekmetricExternalId;
  }

  if (!customer.primaryEmail && typeof updates.primaryEmail !== "string") {
    // metadata only — do not overwrite customer fields here
  }

  return JSON.stringify(updates) === JSON.stringify(existing) ? null : updates;
}
