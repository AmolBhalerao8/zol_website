import type { TekmetricSyncRecordCounts } from "@/features/integrations/services/tekmetric/types";

type SyncSummaryProps = {
  records: TekmetricSyncRecordCounts;
  compact?: boolean;
};

const SUMMARY_ITEMS: Array<{ key: keyof TekmetricSyncRecordCounts; label: string }> = [
  { key: "customers", label: "Customers" },
  { key: "vehicles", label: "Vehicles" },
  { key: "appointments", label: "Appointments" },
  { key: "repairOrders", label: "Repair orders" },
  { key: "linkedCustomers", label: "Linked to ZOL customers" },
];

export function SyncSummary({ records, compact = false }: SyncSummaryProps) {
  return (
    <dl className={compact ? "grid gap-2 sm:grid-cols-2" : "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
      {SUMMARY_ITEMS.map((item) => (
        <div
          key={item.key}
          className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
        >
          <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">{item.label}</dt>
          <dd className="mt-1 text-sm font-semibold text-zinc-950">{records[item.key]}</dd>
        </div>
      ))}
    </dl>
  );
}
