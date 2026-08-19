"use client";

import { useMemo, useState } from "react";

import { DataTable, type Column } from "@/components/app/data-table";
import { FilterChips, type FilterChip } from "@/components/app/filter-chips";
import { EmptyState, StatusPill } from "@/components/app/primitives";
import type { RepairOrderStatus } from "@/lib/mock/types";

/** Flattened, already-formatted row so the client bundle carries no date logic. */
export type BoardRow = {
  ro: string;
  bay: string;
  vehicle: string;
  plate: string;
  job: string;
  status: RepairOrderStatus;
  statusLabel: string;
  zolDid: string;
  zolDidByZol: boolean;
  waitingOn: string;
};

type BoardFilter = "all" | RepairOrderStatus;

const FILTERS: { value: BoardFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in-bay", label: "In bay" },
  { value: "waiting-customer", label: "Waiting on customer" },
  { value: "waiting-parts", label: "Waiting on parts" },
  { value: "ready", label: "Ready for pickup" },
];

export function BoardTable({ rows }: { rows: BoardRow[] }) {
  const [filter, setFilter] = useState<BoardFilter>("all");

  const chips: FilterChip<BoardFilter>[] = useMemo(
    () =>
      FILTERS.map((entry) => ({
        ...entry,
        count: entry.value === "all" ? rows.length : rows.filter((row) => row.status === entry.value).length,
      })),
    [rows],
  );

  const visible = useMemo(
    () => (filter === "all" ? rows : rows.filter((row) => row.status === filter)),
    [filter, rows],
  );

  const columns: Column<BoardRow>[] = [
    {
      key: "ro",
      header: "RO",
      primary: true,
      className: "font-mono text-sm",
      cell: (row) => row.ro,
    },
    {
      key: "bay",
      header: "Bay",
      className: "font-mono text-sm text-zinc-600",
      cell: (row) => row.bay,
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
    {
      key: "job",
      header: "Job",
      className: "text-sm text-zinc-700",
      cell: (row) => row.job,
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-600">
          {row.statusLabel}
        </span>
      ),
    },
    {
      key: "zol",
      header: "ZOL did",
      cell: (row) => (
        <StatusPill tone={row.zolDidByZol ? "zol" : "human"}>{row.zolDid}</StatusPill>
      ),
    },
    {
      key: "waiting",
      header: "Waiting on",
      className: "text-sm text-zinc-600",
      cell: (row) => row.waitingOn,
    },
  ];

  return (
    <div className="space-y-5">
      <FilterChips chips={chips} value={filter} onChange={setFilter} label="Filter the board by status" />

      <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-card">
        <DataTable
          caption="Live board of open repair orders"
          columns={columns}
          rows={visible}
          stagger
          getRowKey={(row) => row.ro}
          getRowHref={(row) => `/repair-orders/${row.ro}`}
          empty={
            <EmptyState
              title="Nothing in this lane"
              body="No repair orders match this filter right now. Try another lane, or look at the whole board."
            />
          }
        />
      </div>
    </div>
  );
}
