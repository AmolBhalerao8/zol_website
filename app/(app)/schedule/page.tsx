import type { Metadata } from "next";
import Link from "next/link";

import { formatHours } from "@/components/app/format";
import { Eyebrow, PageHeader, Panel } from "@/components/app/primitives";
import { getVehicle, repairOrders, shop, todayIndex } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Schedule | ZOL",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SchedulePage() {
  const today = todayIndex();
  const bays = Array.from({ length: shop.bayCount }, (_, index) => index + 1);

  // Only scheduled work that actually occupies a bay lands on the grid.
  const scheduled = repairOrders.filter((order) => order.scheduledDay !== null && order.bay !== null);

  const bookedHours = scheduled.reduce((sum, order) => sum + order.estimatedHours, 0);
  const capacityHours = shop.bayCount * 5 * 8;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Schedule"
        title="Bay capacity, week at a glance"
        description="Blocks are sized by estimated hours. Empty slots are the point — they are the hours the shop is not selling."
      />

      <div className="flex flex-wrap gap-6">
        <p className="font-mono text-[11px] text-zinc-600">
          <span className="text-zinc-950">{formatHours(bookedHours)}</span> booked
        </p>
        <p className="font-mono text-[11px] text-zinc-600">
          <span className="text-zinc-950">{formatHours(capacityHours - bookedHours)}</span> open capacity
        </p>
        <p className="font-mono text-[11px] text-zinc-600">
          <span className="text-zinc-950">{Math.round((bookedHours / capacityHours) * 100)}%</span> utilized
        </p>
      </div>

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <caption className="sr-only">Bay schedule for the current week</caption>
            <thead>
              <tr className="border-b border-zinc-200">
                <th scope="col" className="w-24 px-5 py-3"><Eyebrow>Bay</Eyebrow></th>
                {DAYS.map((day, index) => (
                  <th key={day} scope="col" className="px-3 py-3">
                    <span className="flex items-center gap-2">
                      <Eyebrow className={cn(index === today && "text-emerald-700")}>{day}</Eyebrow>
                      {index === today ? (
                        <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-emerald-700">
                          Today
                        </span>
                      ) : null}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bays.map((bay) => (
                <tr key={bay} className="border-b border-zinc-100 last:border-b-0">
                  <th scope="row" className="px-5 py-3 align-top">
                    <span className="font-mono text-sm text-zinc-950">Bay {bay}</span>
                  </th>
                  {DAYS.map((day, dayIndex) => {
                    const jobs = scheduled.filter(
                      (order) => order.bay === bay && order.scheduledDay === dayIndex,
                    );
                    const isClosed = shop.hours[dayIndex]?.closed ?? false;

                    return (
                      <td
                        key={day}
                        className={cn(
                          "px-3 py-3 align-top",
                          dayIndex === today && "bg-emerald-50/40",
                        )}
                      >
                        {isClosed ? (
                          <p className="rounded-xl border border-dashed border-zinc-200 px-3 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-400">
                            Closed
                          </p>
                        ) : jobs.length === 0 ? (
                          <p className="rounded-xl border border-dashed border-amber-300/70 bg-amber-50/40 px-3 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-amber-700">
                            8 hr open
                          </p>
                        ) : (
                          <ul className="space-y-2">
                            {jobs.map((order) => {
                              const vehicle = getVehicle(order.vehicleId);
                              return (
                                <li key={order.ro}>
                                  <Link
                                    href={`/repair-orders/${order.ro}`}
                                    style={{ minHeight: `${Math.max(order.estimatedHours * 14, 48)}px` }}
                                    className="flex flex-col justify-center rounded-xl border border-zinc-900/10 bg-zinc-950 px-3 py-2 text-white transition-colors hover:bg-zinc-800"
                                  >
                                    <span className="font-mono text-[11px] text-emerald-300">{order.ro}</span>
                                    <span className="mt-0.5 font-mono text-[11px] text-zinc-300">
                                      {vehicle ? `${vehicle.make} ${vehicle.model}` : "Vehicle"}
                                    </span>
                                    <span className="mt-0.5 font-mono text-[10px] text-zinc-400">
                                      {order.job} · {formatHours(order.estimatedHours)}
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
