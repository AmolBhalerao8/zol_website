import type { Metadata } from "next";
import { Car } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatCurrency, formatHours, formatMiles } from "@/components/app/format";
import { Eyebrow, Panel, StatusPill } from "@/components/app/primitives";
import { Timeline } from "@/components/app/timeline";
import {
  getCustomer,
  getPartOrdersForRepairOrder,
  getRepairOrder,
  getVehicle,
  orderSubtotal,
  repairOrders,
  shop,
  STATUS_LABELS,
} from "@/lib/mock";
import { PART_STATUS_LABELS } from "@/lib/mock/parts";

type PageProps = {
  params: Promise<{ ro: string }>;
};

export function generateStaticParams(): { ro: string }[] {
  return repairOrders.map((order) => ({ ro: order.ro }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ro } = await params;
  const order = getRepairOrder(ro);
  return { title: order ? `${order.ro} | ZOL` : "Repair order not found | ZOL" };
}

export default async function RepairOrderPage({ params }: PageProps) {
  const { ro } = await params;
  const order = getRepairOrder(ro);

  if (!order) {
    notFound();
  }

  const vehicle = getVehicle(order.vehicleId);
  const customer = getCustomer(order.customerId);
  const partOrders = getPartOrdersForRepairOrder(order.ro);

  const laborTotal = order.laborLines.reduce((sum, line) => sum + line.hours * line.rate, 0);
  const partsTotal = order.partLines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  const subtotal = orderSubtotal(order);
  const tax = subtotal * shop.taxRate;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Link
          href="/repair-orders"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500 underline-offset-4 hover:text-zinc-950 hover:underline"
        >
          ← All repair orders
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">{order.ro}</h1>
          <StatusPill tone={order.zolDidActor === "zol" ? "zol" : "human"}>{order.zolDid}</StatusPill>
          <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-zinc-600">
            {STATUS_LABELS[order.status]}
          </span>
        </div>
        <p className="text-sm text-zinc-600">
          {order.job}
          {customer ? (
            <>
              {" · "}
              <span className="text-zinc-800">{customer.name}</span>
              {" · "}
              <span className="font-mono text-zinc-600">{customer.phone}</span>
            </>
          ) : null}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Left column: the work. `min-w-0` lets the grid item shrink below the
            estimate table's intrinsic width so the table scrolls, not the page. */}
        <div className="min-w-0 space-y-6">
          <Panel className="overflow-hidden">
            <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
              <div
                aria-hidden
                className="flex h-24 w-full shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 sm:w-36"
              >
                <Car className="h-8 w-8" />
              </div>
              <div className="min-w-0 space-y-2">
                <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                  {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Unknown vehicle"}
                </h2>
                {vehicle ? (
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                    <div>
                      <dt><Eyebrow>VIN</Eyebrow></dt>
                      <dd className="mt-1 break-all font-mono text-[11px] text-zinc-700">{vehicle.vin}</dd>
                    </div>
                    <div>
                      <dt><Eyebrow>Plate</Eyebrow></dt>
                      <dd className="mt-1 font-mono text-[11px] text-zinc-700">{vehicle.plate}</dd>
                    </div>
                    <div>
                      <dt><Eyebrow>Mileage</Eyebrow></dt>
                      <dd className="mt-1 font-mono text-[11px] text-zinc-700">{formatMiles(vehicle.mileage)}</dd>
                    </div>
                  </dl>
                ) : null}
              </div>
            </div>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="border-b border-zinc-200/80 px-6 py-4">
              <h2 className="text-base font-semibold tracking-tight text-zinc-950">Estimate</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">Itemized labor and parts for {order.ro}</caption>
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th scope="col" className="px-6 py-3"><Eyebrow>Labor</Eyebrow></th>
                    <th scope="col" className="px-6 py-3 text-right"><Eyebrow>Hours</Eyebrow></th>
                    <th scope="col" className="px-6 py-3 text-right"><Eyebrow>Rate</Eyebrow></th>
                    <th scope="col" className="px-6 py-3 text-right"><Eyebrow>Amount</Eyebrow></th>
                  </tr>
                </thead>
                <tbody>
                  {order.laborLines.map((line) => (
                    <tr key={line.description} className="border-b border-zinc-100">
                      <td className="px-6 py-3 text-sm text-zinc-800">{line.description}</td>
                      <td className="px-6 py-3 text-right font-mono text-sm text-zinc-700">{formatHours(line.hours)}</td>
                      <td className="px-6 py-3 text-right font-mono text-sm text-zinc-700">{formatCurrency(line.rate)}</td>
                      <td className="px-6 py-3 text-right font-mono text-sm text-zinc-950">
                        {formatCurrency(line.hours * line.rate)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                {order.partLines.length > 0 ? (
                  <>
                    <thead>
                      <tr className="border-b border-zinc-200">
                        <th scope="col" className="px-6 py-3"><Eyebrow>Parts</Eyebrow></th>
                        <th scope="col" className="px-6 py-3 text-right"><Eyebrow>Qty</Eyebrow></th>
                        <th scope="col" className="px-6 py-3 text-right"><Eyebrow>Unit</Eyebrow></th>
                        <th scope="col" className="px-6 py-3 text-right"><Eyebrow>Amount</Eyebrow></th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.partLines.map((line) => (
                        <tr key={line.partNumber} className="border-b border-zinc-100">
                          <td className="px-6 py-3 text-sm text-zinc-800">
                            {line.description}
                            <span className="mt-0.5 block font-mono text-[11px] text-zinc-500">{line.partNumber}</span>
                          </td>
                          <td className="px-6 py-3 text-right font-mono text-sm text-zinc-700">{line.quantity}</td>
                          <td className="px-6 py-3 text-right font-mono text-sm text-zinc-700">
                            {formatCurrency(line.unitPrice)}
                          </td>
                          <td className="px-6 py-3 text-right font-mono text-sm text-zinc-950">
                            {formatCurrency(line.quantity * line.unitPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                ) : null}

                <tfoot>
                  <tr>
                    <td colSpan={3} className="px-6 py-2 text-right"><Eyebrow>Labor</Eyebrow></td>
                    <td className="px-6 py-2 text-right font-mono text-sm text-zinc-700">{formatCurrency(laborTotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-6 py-2 text-right"><Eyebrow>Parts</Eyebrow></td>
                    <td className="px-6 py-2 text-right font-mono text-sm text-zinc-700">{formatCurrency(partsTotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-6 py-2 text-right"><Eyebrow>Subtotal</Eyebrow></td>
                    <td className="px-6 py-2 text-right font-mono text-sm text-zinc-700">{formatCurrency(subtotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-6 py-2 text-right">
                      <Eyebrow>{`Tax ${(shop.taxRate * 100).toFixed(2)}%`}</Eyebrow>
                    </td>
                    <td className="px-6 py-2 text-right font-mono text-sm text-zinc-700">{formatCurrency(tax)}</td>
                  </tr>
                  <tr className="border-t border-zinc-200">
                    <td colSpan={3} className="px-6 py-4 text-right"><Eyebrow>Total</Eyebrow></td>
                    <td className="px-6 py-4 text-right font-mono text-base font-semibold text-zinc-950">
                      {formatCurrency(subtotal + tax)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Panel>

          <Panel className="p-6">
            <h2 className="text-base font-semibold tracking-tight text-zinc-950">Technician notes</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-700">{order.notes}</p>
          </Panel>

          {partOrders.length > 0 ? (
            <Panel className="p-6">
              <h2 className="text-base font-semibold tracking-tight text-zinc-950">Parts on order</h2>
              <ul className="mt-4 space-y-3">
                {partOrders.map((partOrder) => (
                  <li key={partOrder.id} className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-sm text-zinc-800">
                      {partOrder.id}
                      <span className="ml-2 text-zinc-500">{partOrder.vendor}</span>
                    </span>
                    <StatusPill tone={partOrder.status === "back-ordered" ? "human" : "neutral"}>
                      {PART_STATUS_LABELS[partOrder.status]}
                    </StatusPill>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}
        </div>

        {/* Right column: the history. */}
        <Panel as="aside" className="h-fit min-w-0 p-6">
          <h2 className="text-base font-semibold tracking-tight text-zinc-950">Timeline</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Everything that happened on this ticket, newest first.
          </p>
          <div className="mt-6">
            <Timeline events={order.timeline} />
          </div>
        </Panel>
      </div>
    </div>
  );
}
