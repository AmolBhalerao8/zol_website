import type { Metadata } from "next";

import { PageHeader, StatStrip, StatTile } from "@/components/app/primitives";
import { getBoardStats, getOpenRepairOrders, getVehicle } from "@/lib/mock";
import { BoardTable, type BoardRow } from "./board-table";
import { STATUS_LABELS } from "@/lib/mock/repair-orders";

export const metadata: Metadata = {
  title: "Board | ZOL",
};

export default function BoardPage() {
  const stats = getBoardStats();

  const rows: BoardRow[] = getOpenRepairOrders().map((order) => {
    const vehicle = getVehicle(order.vehicleId);
    return {
      ro: order.ro,
      bay: order.bay === null ? "—" : `Bay ${order.bay}`,
      vehicle: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Unknown vehicle",
      plate: vehicle ? vehicle.plate : "—",
      job: order.job,
      status: order.status,
      statusLabel: STATUS_LABELS[order.status],
      zolDid: order.zolDid,
      zolDidByZol: order.zolDidActor === "zol",
      waitingOn: order.waitingOn,
    };
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Live board"
        title="Everything in the shop, on one screen"
        description="Every open repair order, what ZOL handled on its own, and what is still waiting on a person."
      />

      <StatStrip>
        <StatTile label="Cars in bays" value={stats.carsInBays} hint={`of ${stats.carsInBays + stats.baysFree} bays`} />
        <StatTile label="Bays free" value={stats.baysFree} hint="ready for the next job" />
        <StatTile label="Awaiting approval" value={stats.awaitingApproval} hint="needs a customer reply" />
        <StatTile label="Calls answered today" value={stats.callsAnsweredToday} hint="handled by ZOL" />
        <StatTile label="Avg text reply" value={`${stats.averageReplySeconds}s`} hint="ZOL, unattended" />
      </StatStrip>

      <BoardTable rows={rows} />
    </div>
  );
}
