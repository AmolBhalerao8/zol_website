import type { TekmetricSyncRecordCounts } from "@/features/integrations/services/tekmetric/types";

export function parseTekmetricRecordCounts(value: unknown): TekmetricSyncRecordCounts {
  const empty: TekmetricSyncRecordCounts = {
    customers: 0,
    vehicles: 0,
    appointments: 0,
    repairOrders: 0,
    linkedCustomers: 0,
  };

  if (!value || typeof value !== "object") {
    return empty;
  }

  const record = value as Record<string, unknown>;

  return {
    customers: typeof record.customers === "number" ? record.customers : 0,
    vehicles: typeof record.vehicles === "number" ? record.vehicles : 0,
    appointments: typeof record.appointments === "number" ? record.appointments : 0,
    repairOrders: typeof record.repairOrders === "number" ? record.repairOrders : 0,
    linkedCustomers: typeof record.linkedCustomers === "number" ? record.linkedCustomers : 0,
  };
}

export function getLatestSyncRecordCounts(
  latestLog: { recordsSynced: unknown } | null | undefined,
): TekmetricSyncRecordCounts {
  if (!latestLog?.recordsSynced) {
    return parseTekmetricRecordCounts(null);
  }

  return parseTekmetricRecordCounts(latestLog.recordsSynced);
}
