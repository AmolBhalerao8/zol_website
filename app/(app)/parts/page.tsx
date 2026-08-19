import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { formatCurrency, formatRelative } from "@/components/app/format";
import { Eyebrow, PageHeader, Panel, StatusPill } from "@/components/app/primitives";
import { backOrdered, partOrders, partOrderTotal } from "@/lib/mock";
import { PART_STATUS_LABELS } from "@/lib/mock/parts";

export const metadata: Metadata = {
  title: "Parts | ZOL",
};

export default function PartsPage() {
  const now = new Date();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Parts"
        title="Purchase orders and back-orders"
        description="Every part ZOL ordered, and every one that is now threatening a job already on the schedule."
      />

      {backOrdered.length > 0 ? (
        <div className="rounded-3xl border border-amber-500/40 bg-amber-50 p-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
            <AlertTriangle aria-hidden className="h-4 w-4" />
            {backOrdered.length} back-ordered {backOrdered.length === 1 ? "part" : "parts"}
          </p>
          <ul className="mt-3 space-y-2">
            {backOrdered.map((order) => (
              <li key={order.id} className="text-sm leading-6 text-amber-900">
                <Link href={`/repair-orders/${order.ro}`} className="font-mono underline underline-offset-4">
                  {order.ro}
                </Link>
                {" — "}
                {order.threatens ?? "Waiting on the vendor."}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">Parts purchase orders</caption>
            <thead>
              <tr className="border-b border-zinc-200">
                <th scope="col" className="px-5 py-3"><Eyebrow>PO</Eyebrow></th>
                <th scope="col" className="px-5 py-3"><Eyebrow>Vendor</Eyebrow></th>
                <th scope="col" className="px-5 py-3"><Eyebrow>RO</Eyebrow></th>
                <th scope="col" className="px-5 py-3"><Eyebrow>Line items</Eyebrow></th>
                <th scope="col" className="px-5 py-3"><Eyebrow>Placed</Eyebrow></th>
                <th scope="col" className="px-5 py-3"><Eyebrow>Status</Eyebrow></th>
                <th scope="col" className="px-5 py-3 text-right"><Eyebrow>Cost</Eyebrow></th>
              </tr>
            </thead>
            <tbody>
              {partOrders.map((order) => (
                <tr key={order.id} className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50">
                  <td className="px-5 py-4 font-mono text-sm text-zinc-950">{order.id}</td>
                  <td className="px-5 py-4 text-sm text-zinc-800">{order.vendor}</td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/repair-orders/${order.ro}`}
                      className="font-mono text-sm text-zinc-950 underline-offset-4 hover:underline"
                    >
                      {order.ro}
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <ul className="space-y-1">
                      {order.lines.map((line) => (
                        <li key={line.partNumber} className="text-sm text-zinc-700">
                          {line.quantity}× {line.description}
                          <span className="ml-2 font-mono text-[11px] text-zinc-500">{line.partNumber}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-5 py-4 font-mono text-[11px] text-zinc-500">
                    {formatRelative(order.placedAt, now)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill tone={order.status === "back-ordered" ? "human" : "zol"}>
                      {PART_STATUS_LABELS[order.status]}
                    </StatusPill>
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-sm text-zinc-950">
                    {formatCurrency(partOrderTotal(order))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
