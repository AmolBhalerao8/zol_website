import type { Metadata } from "next";

import { formatCurrency } from "@/components/app/format";
import { PageHeader } from "@/components/app/primitives";
import { getCustomer, getVehicle, orderSubtotal, repairOrders, shop, STATUS_LABELS } from "@/lib/mock";
import { RepairOrdersTable, type RepairOrderRow } from "./repair-orders-table";

export const metadata: Metadata = {
  title: "Repair orders | ZOL",
};

export default function RepairOrdersPage() {
  const rows: RepairOrderRow[] = repairOrders.map((order) => {
    const vehicle = getVehicle(order.vehicleId);
    const customer = getCustomer(order.customerId);
    const subtotal = orderSubtotal(order);

    return {
      ro: order.ro,
      customer: customer ? customer.name : "Unknown",
      vehicle: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Unknown vehicle",
      plate: vehicle ? vehicle.plate : "—",
      vin: vehicle ? vehicle.vin : "",
      job: order.job,
      status: order.status,
      statusLabel: STATUS_LABELS[order.status],
      zolDid: order.zolDid,
      zolDidByZol: order.zolDidActor === "zol",
      total: formatCurrency(subtotal * (1 + shop.taxRate)),
    };
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Repair orders"
        title="Every ticket, open and closed"
        description="Search by RO number, customer, plate, or VIN. Totals include tax at the shop rate."
      />
      <RepairOrdersTable rows={rows} />
    </div>
  );
}
