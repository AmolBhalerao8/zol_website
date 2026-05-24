import type { Integration, Prisma } from "@prisma/client";

import {
  buildSafeCustomerMetadataUpdate,
  buildZolCustomerLookup,
  findMatchingZolCustomer,
} from "@/features/integrations/services/tekmetric/link-tekmetric-customers";
import {
  normalizeTekmetricAppointments,
  normalizeTekmetricCustomers,
  normalizeTekmetricRepairOrders,
  normalizeTekmetricVehicles,
} from "@/features/integrations/services/tekmetric/normalize-tekmetric-data";
import { createTekmetricClient } from "@/features/integrations/services/tekmetric/tekmetric-client";
import type {
  TekmetricSyncRecordCounts,
  TekmetricSyncResult,
} from "@/features/integrations/services/tekmetric/types";
import { decryptTekmetricCredentials } from "@/features/integrations/utils/integration-credentials";
import { isTekmetricMockMode } from "@/features/integrations/utils/tekmetric-mock-mode";
import { prisma } from "@/lib/prisma";

type SyncTekmetricDataInput = {
  workspaceId: string;
  integration: Integration;
};

type FetchStep = {
  key: keyof TekmetricSyncRecordCounts;
  label: string;
  fetch: () => Promise<unknown[]>;
};

async function upsertCustomers(
  workspaceId: string,
  integrationId: string,
  integration: Integration,
  syncedAt: Date,
): Promise<{ counts: Pick<TekmetricSyncRecordCounts, "customers" | "linkedCustomers">; customerLinks: Map<string, string> }> {
  const client = createTekmetricClient(
    integration.credentialsEncrypted
      ? decryptTekmetricCredentials(integration.credentialsEncrypted)
      : { clientId: "", apiKey: "", shopId: "" },
  );

  const rawCustomers = await client.getCustomers();
  const customers = normalizeTekmetricCustomers(rawCustomers);
  const zolCustomers = await prisma.customer.findMany({ where: { workspaceId } });
  const lookup = buildZolCustomerLookup(zolCustomers);
  const customerLinks = new Map<string, string>();
  let linkedCustomers = 0;

  for (const record of customers) {
    const matchedCustomer = findMatchingZolCustomer(record, lookup);
    const zolCustomerId = matchedCustomer?.id ?? null;

    if (zolCustomerId) {
      customerLinks.set(record.externalId, zolCustomerId);
      linkedCustomers += 1;

      if (matchedCustomer) {
        const metadataUpdate = buildSafeCustomerMetadataUpdate(matchedCustomer, record.externalId);
        if (metadataUpdate) {
          await prisma.customer.update({
            where: { id: matchedCustomer.id },
            data: { metadata: metadataUpdate as Prisma.InputJsonValue },
          });
        }
      }
    }

    await prisma.tekmetricCustomer.upsert({
      where: {
        workspaceId_integrationId_externalId: {
          workspaceId,
          integrationId,
          externalId: record.externalId,
        },
      },
      create: {
        workspaceId,
        integrationId,
        externalId: record.externalId,
        zolCustomerId,
        name: record.name,
        phone: record.phone,
        email: record.email,
        rawData: record.rawData as Prisma.InputJsonValue,
        lastSyncedAt: syncedAt,
      },
      update: {
        zolCustomerId,
        name: record.name,
        phone: record.phone,
        email: record.email,
        rawData: record.rawData as Prisma.InputJsonValue,
        lastSyncedAt: syncedAt,
      },
    });
  }

  return {
    counts: { customers: customers.length, linkedCustomers },
    customerLinks,
  };
}

export async function syncTekmetricData({
  workspaceId,
  integration,
}: SyncTekmetricDataInput): Promise<TekmetricSyncResult> {
  const mockMode = isTekmetricMockMode();

  if (integration.status !== "CONNECTED") {
    return {
      success: false,
      message: "Tekmetric is not connected for this workspace.",
      mockMode,
    };
  }

  if (!mockMode && !integration.credentialsEncrypted) {
    return {
      success: false,
      message: "Tekmetric credentials are missing. Reconnect your shop system.",
      mockMode,
    };
  }

  const syncLog = await prisma.tekmetricSyncLog.create({
    data: {
      workspaceId,
      integrationId: integration.id,
      status: "RUNNING",
    },
  });

  const syncedAt = new Date();
  const recordsSynced: TekmetricSyncRecordCounts = {
    customers: 0,
    vehicles: 0,
    appointments: 0,
    repairOrders: 0,
    linkedCustomers: 0,
  };

  const errors: string[] = [];
  let customerLinks = new Map<string, string>();

  try {
    const customerResult = await upsertCustomers(
      workspaceId,
      integration.id,
      integration,
      syncedAt,
    );
    recordsSynced.customers = customerResult.counts.customers;
    recordsSynced.linkedCustomers = customerResult.counts.linkedCustomers;
    customerLinks = customerResult.customerLinks;
  } catch (error) {
    errors.push(
      error instanceof Error ? `Customers: ${error.message}` : "Customers: sync failed",
    );
  }

  const client = createTekmetricClient(
    integration.credentialsEncrypted
      ? decryptTekmetricCredentials(integration.credentialsEncrypted)
      : { clientId: "", apiKey: "", shopId: "" },
  );

  const fetchSteps: FetchStep[] = [
    {
      key: "vehicles",
      label: "Vehicles",
      fetch: async () => normalizeTekmetricVehicles(await client.getVehicles()),
    },
    {
      key: "appointments",
      label: "Appointments",
      fetch: async () => normalizeTekmetricAppointments(await client.getAppointments()),
    },
    {
      key: "repairOrders",
      label: "Repair orders",
      fetch: async () => normalizeTekmetricRepairOrders(await client.getRepairOrders()),
    },
  ];

  for (const step of fetchSteps) {
    try {
      const records = (await step.fetch()) as Array<{
        externalId: string;
        tekmetricCustomerId: string | null;
        rawData: Record<string, unknown>;
        year?: string | null;
        make?: string | null;
        model?: string | null;
        vin?: string | null;
        scheduledAt?: Date | null;
        status?: string | null;
        summary?: string | null;
        totalAmount?: string | null;
      }>;

      for (const record of records) {
        const zolCustomerId = record.tekmetricCustomerId
          ? customerLinks.get(record.tekmetricCustomerId) ?? null
          : null;

        if (step.key === "vehicles") {
          await prisma.tekmetricVehicle.upsert({
            where: {
              workspaceId_integrationId_externalId: {
                workspaceId,
                integrationId: integration.id,
                externalId: record.externalId,
              },
            },
            create: {
              workspaceId,
              integrationId: integration.id,
              externalId: record.externalId,
              tekmetricCustomerId: record.tekmetricCustomerId,
              zolCustomerId,
              year: record.year ?? null,
              make: record.make ?? null,
              model: record.model ?? null,
              vin: record.vin ?? null,
              rawData: record.rawData as Prisma.InputJsonValue,
              lastSyncedAt: syncedAt,
            },
            update: {
              tekmetricCustomerId: record.tekmetricCustomerId,
              zolCustomerId,
              year: record.year ?? null,
              make: record.make ?? null,
              model: record.model ?? null,
              vin: record.vin ?? null,
              rawData: record.rawData as Prisma.InputJsonValue,
              lastSyncedAt: syncedAt,
            },
          });
        }

        if (step.key === "appointments") {
          await prisma.tekmetricAppointment.upsert({
            where: {
              workspaceId_integrationId_externalId: {
                workspaceId,
                integrationId: integration.id,
                externalId: record.externalId,
              },
            },
            create: {
              workspaceId,
              integrationId: integration.id,
              externalId: record.externalId,
              tekmetricCustomerId: record.tekmetricCustomerId,
              zolCustomerId,
              scheduledAt: record.scheduledAt ?? null,
              status: record.status ?? null,
              summary: record.summary ?? null,
              rawData: record.rawData as Prisma.InputJsonValue,
              lastSyncedAt: syncedAt,
            },
            update: {
              tekmetricCustomerId: record.tekmetricCustomerId,
              zolCustomerId,
              scheduledAt: record.scheduledAt ?? null,
              status: record.status ?? null,
              summary: record.summary ?? null,
              rawData: record.rawData as Prisma.InputJsonValue,
              lastSyncedAt: syncedAt,
            },
          });
        }

        if (step.key === "repairOrders") {
          await prisma.tekmetricRepairOrder.upsert({
            where: {
              workspaceId_integrationId_externalId: {
                workspaceId,
                integrationId: integration.id,
                externalId: record.externalId,
              },
            },
            create: {
              workspaceId,
              integrationId: integration.id,
              externalId: record.externalId,
              tekmetricCustomerId: record.tekmetricCustomerId,
              zolCustomerId,
              status: record.status ?? null,
              totalAmount: record.totalAmount ?? null,
              summary: record.summary ?? null,
              rawData: record.rawData as Prisma.InputJsonValue,
              lastSyncedAt: syncedAt,
            },
            update: {
              tekmetricCustomerId: record.tekmetricCustomerId,
              zolCustomerId,
              status: record.status ?? null,
              totalAmount: record.totalAmount ?? null,
              summary: record.summary ?? null,
              rawData: record.rawData as Prisma.InputJsonValue,
              lastSyncedAt: syncedAt,
            },
          });
        }
      }

      recordsSynced[step.key] = records.length;
    } catch (error) {
      errors.push(
        error instanceof Error ? `${step.label}: ${error.message}` : `${step.label}: sync failed`,
      );
    }
  }

  const hasAnyRecords =
    recordsSynced.customers +
      recordsSynced.vehicles +
      recordsSynced.appointments +
      recordsSynced.repairOrders >
    0;

  const success = errors.length === 0 || (hasAnyRecords && recordsSynced.customers > 0);
  const status = success ? "SUCCESS" : "FAILED";
  const errorMessage = errors.length > 0 ? errors.join(" | ") : null;

  await prisma.tekmetricSyncLog.update({
    where: { id: syncLog.id },
    data: {
      status,
      completedAt: new Date(),
      errorMessage,
      recordsSynced: recordsSynced as Prisma.InputJsonValue,
    },
  });

  if (success) {
    await prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncAt: syncedAt },
    });
  }

  if (!success) {
    return {
      success: false,
      syncLogId: syncLog.id,
      message: errorMessage ?? "Tekmetric sync failed.",
      recordsSynced,
      mockMode,
    };
  }

  return {
    success: true,
    syncLogId: syncLog.id,
    recordsSynced,
    mockMode,
  };
}
