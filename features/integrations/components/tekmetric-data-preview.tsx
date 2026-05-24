"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TekmetricCustomerRow = {
  id: string;
  externalId: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  zolCustomerId: string | null;
  lastSyncedAt: Date;
  zolCustomer: { id: string; name: string | null } | null;
};

type TekmetricVehicleRow = {
  id: string;
  externalId: string;
  year: string | null;
  make: string | null;
  model: string | null;
  vin: string | null;
  tekmetricCustomerId: string | null;
  zolCustomerId: string | null;
  lastSyncedAt: Date;
};

type TekmetricAppointmentRow = {
  id: string;
  externalId: string;
  scheduledAt: Date | null;
  status: string | null;
  summary: string | null;
  tekmetricCustomerId: string | null;
  zolCustomerId: string | null;
  lastSyncedAt: Date;
};

type TekmetricRepairOrderRow = {
  id: string;
  externalId: string;
  status: string | null;
  totalAmount: string | null;
  summary: string | null;
  tekmetricCustomerId: string | null;
  zolCustomerId: string | null;
  lastSyncedAt: Date;
};

type TekmetricSyncLogRow = {
  id: string;
  status: string;
  startedAt: Date;
  completedAt: Date | null;
  errorMessage: string | null;
  recordsSynced: unknown;
  createdAt: Date;
};

type TekmetricDataPreviewProps = {
  customers: TekmetricCustomerRow[];
  vehicles: TekmetricVehicleRow[];
  appointments: TekmetricAppointmentRow[];
  repairOrders: TekmetricRepairOrderRow[];
  syncLogs: TekmetricSyncLogRow[];
};

const TABS = [
  { id: "customers", label: "Customers" },
  { id: "vehicles", label: "Vehicles" },
  { id: "appointments", label: "Appointments" },
  { id: "repairOrders", label: "Repair Orders" },
  { id: "syncLogs", label: "Sync Logs" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function formatTimestamp(value: Date | null | undefined): string {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center">
      <p className="text-sm text-zinc-600">{message}</p>
    </div>
  );
}

export function TekmetricDataPreview({
  customers,
  vehicles,
  appointments,
  repairOrders,
  syncLogs,
}: TekmetricDataPreviewProps) {
  const [activeTab, setActiveTab] = useState<TabId>("customers");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden border-zinc-200 bg-white shadow-card">
        <CardHeader className="border-b border-zinc-200">
          <CardTitle className="text-lg">
            {TABS.find((tab) => tab.id === activeTab)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {activeTab === "customers" ? (
            customers.length === 0 ? (
              <div className="p-6">
                <EmptyState message="No synced customers yet. Run a sync from Integrations to pull shop customer data." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-[0.14em] text-zinc-500">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Linked ZOL customer</th>
                      <th className="px-4 py-3">External ID</th>
                      <th className="px-4 py-3">Last synced</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((row) => (
                      <tr key={row.id} className="border-b border-zinc-100">
                        <td className="px-4 py-3 font-medium text-zinc-950">{row.name ?? "—"}</td>
                        <td className="px-4 py-3">{row.phone ?? "—"}</td>
                        <td className="px-4 py-3">{row.email ?? "—"}</td>
                        <td className="px-4 py-3">{row.zolCustomer?.name ?? "Not linked"}</td>
                        <td className="px-4 py-3 text-zinc-500">{row.externalId}</td>
                        <td className="px-4 py-3">{formatTimestamp(row.lastSyncedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : null}

          {activeTab === "vehicles" ? (
            vehicles.length === 0 ? (
              <div className="p-6">
                <EmptyState message="No synced vehicles yet." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-[0.14em] text-zinc-500">
                    <tr>
                      <th className="px-4 py-3">Vehicle</th>
                      <th className="px-4 py-3">VIN</th>
                      <th className="px-4 py-3">Linked ZOL customer</th>
                      <th className="px-4 py-3">External ID</th>
                      <th className="px-4 py-3">Last synced</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((row) => (
                      <tr key={row.id} className="border-b border-zinc-100">
                        <td className="px-4 py-3 font-medium text-zinc-950">
                          {[row.year, row.make, row.model].filter(Boolean).join(" ") || "—"}
                        </td>
                        <td className="px-4 py-3">{row.vin ?? "—"}</td>
                        <td className="px-4 py-3">{row.zolCustomerId ? "Linked" : "Not linked"}</td>
                        <td className="px-4 py-3 text-zinc-500">{row.externalId}</td>
                        <td className="px-4 py-3">{formatTimestamp(row.lastSyncedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : null}

          {activeTab === "appointments" ? (
            appointments.length === 0 ? (
              <div className="p-6">
                <EmptyState message="No synced appointments yet." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-[0.14em] text-zinc-500">
                    <tr>
                      <th className="px-4 py-3">When</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Summary</th>
                      <th className="px-4 py-3">External ID</th>
                      <th className="px-4 py-3">Last synced</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((row) => (
                      <tr key={row.id} className="border-b border-zinc-100">
                        <td className="px-4 py-3">{formatTimestamp(row.scheduledAt)}</td>
                        <td className="px-4 py-3">{row.status ?? "—"}</td>
                        <td className="px-4 py-3">{row.summary ?? "—"}</td>
                        <td className="px-4 py-3 text-zinc-500">{row.externalId}</td>
                        <td className="px-4 py-3">{formatTimestamp(row.lastSyncedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : null}

          {activeTab === "repairOrders" ? (
            repairOrders.length === 0 ? (
              <div className="p-6">
                <EmptyState message="No synced repair orders yet." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-[0.14em] text-zinc-500">
                    <tr>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Summary</th>
                      <th className="px-4 py-3">External ID</th>
                      <th className="px-4 py-3">Last synced</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repairOrders.map((row) => (
                      <tr key={row.id} className="border-b border-zinc-100">
                        <td className="px-4 py-3">{row.status ?? "—"}</td>
                        <td className="px-4 py-3">{row.totalAmount ? `$${row.totalAmount}` : "—"}</td>
                        <td className="px-4 py-3">{row.summary ?? "—"}</td>
                        <td className="px-4 py-3 text-zinc-500">{row.externalId}</td>
                        <td className="px-4 py-3">{formatTimestamp(row.lastSyncedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : null}

          {activeTab === "syncLogs" ? (
            syncLogs.length === 0 ? (
              <div className="p-6">
                <EmptyState message="No sync history yet." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-[0.14em] text-zinc-500">
                    <tr>
                      <th className="px-4 py-3">Started</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Completed</th>
                      <th className="px-4 py-3">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {syncLogs.map((row) => (
                      <tr key={row.id} className="border-b border-zinc-100">
                        <td className="px-4 py-3">{formatTimestamp(row.startedAt)}</td>
                        <td className="px-4 py-3">{row.status}</td>
                        <td className="px-4 py-3">{formatTimestamp(row.completedAt)}</td>
                        <td className="px-4 py-3 text-zinc-600">{row.errorMessage ?? "Completed"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
