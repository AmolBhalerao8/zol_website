import type {
  NormalizedTekmetricAppointment,
  NormalizedTekmetricCustomer,
  NormalizedTekmetricRepairOrder,
  NormalizedTekmetricVehicle,
  TekmetricRawAppointment,
  TekmetricRawCustomer,
  TekmetricRawRepairOrder,
  TekmetricRawVehicle,
} from "@/features/integrations/services/tekmetric/types";
import { formatPhoneForStorage } from "@/features/customers/utils/normalize-customer-identity";

function toExternalId(value: string | number | undefined | null): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  const id = String(value).trim();
  return id.length > 0 ? id : null;
}

function buildCustomerName(raw: TekmetricRawCustomer): string | null {
  if (typeof raw.name === "string" && raw.name.trim()) {
    return raw.name.trim();
  }

  const parts = [raw.firstName, raw.lastName]
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
    .map((part) => part.trim());

  return parts.length > 0 ? parts.join(" ") : null;
}

export function normalizeTekmetricCustomers(
  records: TekmetricRawCustomer[],
): NormalizedTekmetricCustomer[] {
  return records
    .map((record) => {
      const externalId = toExternalId(record.id);
      if (!externalId) {
        return null;
      }

      return {
        externalId,
        name: buildCustomerName(record),
        phone: formatPhoneForStorage(record.phone),
        email: typeof record.email === "string" ? record.email.trim().toLowerCase() || null : null,
        rawData: record as Record<string, unknown>,
      };
    })
    .filter((record): record is NormalizedTekmetricCustomer => record !== null);
}

export function normalizeTekmetricVehicles(
  records: TekmetricRawVehicle[],
): NormalizedTekmetricVehicle[] {
  return records
    .map((record) => {
      const externalId = toExternalId(record.id);
      if (!externalId) {
        return null;
      }

      return {
        externalId,
        tekmetricCustomerId: toExternalId(record.customerId),
        year: record.year !== undefined && record.year !== null ? String(record.year) : null,
        make: typeof record.make === "string" ? record.make : null,
        model: typeof record.model === "string" ? record.model : null,
        vin: typeof record.vin === "string" ? record.vin : null,
        rawData: record as Record<string, unknown>,
      };
    })
    .filter((record): record is NormalizedTekmetricVehicle => record !== null);
}

export function normalizeTekmetricAppointments(
  records: TekmetricRawAppointment[],
): NormalizedTekmetricAppointment[] {
  return records
    .map((record) => {
      const externalId = toExternalId(record.id);
      if (!externalId) {
        return null;
      }

      const scheduledRaw = record.startTime ?? record.scheduledAt;
      const scheduledAt =
        typeof scheduledRaw === "string" && scheduledRaw.trim()
          ? new Date(scheduledRaw)
          : null;

      const summary =
        (typeof record.description === "string" && record.description) ||
        (typeof record.summary === "string" && record.summary) ||
        null;

      return {
        externalId,
        tekmetricCustomerId: toExternalId(record.customerId),
        scheduledAt: scheduledAt && !Number.isNaN(scheduledAt.getTime()) ? scheduledAt : null,
        status: typeof record.status === "string" ? record.status : null,
        summary,
        rawData: record as Record<string, unknown>,
      };
    })
    .filter((record): record is NormalizedTekmetricAppointment => record !== null);
}

export function normalizeTekmetricRepairOrders(
  records: TekmetricRawRepairOrder[],
): NormalizedTekmetricRepairOrder[] {
  return records
    .map((record) => {
      const externalId = toExternalId(record.id);
      if (!externalId) {
        return null;
      }

      const total = record.total ?? record.totalAmount;
      const totalAmount =
        total !== undefined && total !== null ? String(total) : null;

      const summary =
        (typeof record.description === "string" && record.description) ||
        (typeof record.summary === "string" && record.summary) ||
        null;

      return {
        externalId,
        tekmetricCustomerId: toExternalId(record.customerId),
        status: typeof record.status === "string" ? record.status : null,
        totalAmount,
        summary,
        rawData: record as Record<string, unknown>,
      };
    })
    .filter((record): record is NormalizedTekmetricRepairOrder => record !== null);
}
