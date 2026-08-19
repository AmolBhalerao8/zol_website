"use client";

import { useMemo, useState } from "react";

import { DataTable, type Column } from "@/components/app/data-table";
import { FilterChips, type FilterChip } from "@/components/app/filter-chips";
import { SearchInput } from "@/components/app/search-input";
import { EmptyState, StatusPill } from "@/components/app/primitives";
import type { RepairOrderStatus } from "@/lib/mock/types";

export type RepairOrderRow = {
  ro: string;
  customer: string;
  vehicle: string;
  plate: string;
  vin: string;
  job: string;
  status: RepairOrderStatus;
  statusLabel: string;
  zolDid: string;
  zolDidByZol: boolean;
  total: string;
};

type StatusFilter = "all" | RepairOrderStatus;

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in-bay", label: "In bay" },
  { value: "waiting-customer", label: "Waiting on customer" },
  { value: "waiting-parts", label: "Waiting on parts" },
  { value: "ready", label: "Ready" },
  { value: "closed", label: "Closed" },
];

export function RepairOrdersTable({ rows }: { rows: RepairOrderRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const chips: FilterChip<StatusFilter>[] = useMemo(
    () =>
      FILTERS.map((entry) => ({
        ...entry,
        count: entry.value === "all" ? rows.length : rows.filter((row) => row.status === entry.value).length,
      })),
    [rows],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesStatus = status === "all" || row.status === status;
      if (!matchesStatus) return false;
      if (needle.length === 0) return true;
      return (
        row.ro.toLowerCase().includes(needle) ||
        row.customer.toLowerCase().includes(needle) ||
        row.plate.toLowerCase().includes(needle) ||
        row.vin.toLowerCase().includes(needle)
      );
    });
  }, [query, rows, status]);

  const columns: Column<RepairOrderRow>[] = [
    { key: "ro", header: "RO", primary: true, className: "font-mono text-sm", cell: (row) => row.ro },
    {
      key: "customer",
      header: "Customer",
      className: "text-sm text-zinc-800",
      cell: (row) => row.customer,
    },
    {
      key: "vehicle",
      header: "Vehicle",
      cell: (row) => (
        <span className="block text-sm text-zinc-800">
          {row.vehicle}
          <span className="mt-0.5 block font-mono text-[11px] text-zinc-500">{row.plate}</span>
        </span>
      ),
    },
    { key: "job", header: "Job", className: "text-sm text-zinc-700", cell: (row) => row.job },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-600">{row.statusLabel}</span>
      ),
    },
    {
      key: "zol",
      header: "ZOL did",
      cell: (row) => <StatusPill tone={row.zolDidByZol ? "zol" : "human"}>{row.zolDid}</StatusPill>,
    },
    {
      key: "total",
      header: "Total",
      className: "text-right font-mono text-sm text-zinc-950",
      cell: (row) => row.total,
    },
  ];

  const isSearching = query.trim().length > 0 || status !== "all";

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          value={query}
          onChange={setQuery}
          label="Search repair orders"
          placeholder="RO number, customer, plate, or VIN"
        />
        <FilterChips chips={chips} value={status} onChange={setStatus} label="Filter by status" />
      </div>

      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-card">
        <DataTable
          caption="All repair orders"
          columns={columns}
          rows={visible}
          getRowKey={(row) => row.ro}
          getRowHref={(row) => `/repair-orders/${row.ro}`}
          empty={
            isSearching ? (
              <EmptyState
                title="No repair orders match"
                body="Nothing here matches that search and filter combination. Clear the filter or try a different plate, VIN, or RO number."
              />
            ) : (
              <EmptyState
                title="No repair orders yet"
                body="When ZOL answers a call or a text, the ticket it writes will show up here."
              />
            )
          }
        />
      </div>
    </div>
  );
}
