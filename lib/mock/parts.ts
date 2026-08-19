import { daysAgo, hoursAgo } from "./time";
import type { PartOrder, PartOrderStatus } from "./types";

export const partOrders: PartOrder[] = [
  {
    id: "PO-8812",
    vendor: "Coastline Parts",
    ro: "RO-4471",
    status: "delivered",
    placedAt: daysAgo(2),
    lines: [
      { description: "Ceramic brake pad set, front", partNumber: "RM-D1367", quantity: 1, unitPrice: 68.4 },
      { description: "Coated rotor, front", partNumber: "RM-580712", quantity: 2, unitPrice: 91.25 },
    ],
  },
  {
    id: "PO-8815",
    vendor: "Coastline Parts",
    ro: "RO-4465",
    status: "back-ordered",
    placedAt: daysAgo(1),
    threatens: "RO-4465 is holding bay 4 until this lands",
    lines: [{ description: "Transmission filter kit", partNumber: "AC-TF-283", quantity: 1, unitPrice: 47.6 }],
  },
  {
    id: "PO-8817",
    vendor: "Valley Supply",
    ro: "RO-4447",
    status: "shipped",
    placedAt: daysAgo(1),
    lines: [
      { description: "Water pump assembly", partNumber: "AS-WP9145", quantity: 1, unitPrice: 178.4 },
      { description: "Thermostat and housing", partNumber: "AS-TH2210", quantity: 1, unitPrice: 61.2 },
    ],
  },
  {
    id: "PO-8819",
    vendor: "Valley Supply",
    ro: "RO-4429",
    status: "shipped",
    placedAt: daysAgo(2),
    lines: [{ description: "Timing belt kit with water pump", partNumber: "GT-TCKWP329", quantity: 1, unitPrice: 289.9 }],
  },
  {
    id: "PO-8821",
    vendor: "Coastline Parts",
    ro: "RO-4432",
    status: "delivered",
    placedAt: daysAgo(1),
    lines: [
      { description: "All-terrain tire 265/65R17", partNumber: "TR-AT265", quantity: 4, unitPrice: 187 },
      { description: "TPMS service kit", partNumber: "TR-TPMS-4", quantity: 4, unitPrice: 6.5 },
    ],
  },
  {
    id: "PO-8823",
    vendor: "Bakersfield Electric",
    ro: "RO-4456",
    status: "delivered",
    placedAt: daysAgo(1),
    lines: [
      { description: "Remanufactured alternator, 110A", partNumber: "BS-13998", quantity: 1, unitPrice: 214 },
      { description: "Serpentine belt", partNumber: "GT-K060841", quantity: 1, unitPrice: 32.15 },
    ],
  },
  {
    id: "PO-8826",
    vendor: "Dorman Direct",
    ro: "RO-4444",
    status: "back-ordered",
    placedAt: daysAgo(2),
    threatens: "RO-4444 is open in bay 5 with the manifold already off",
    lines: [{ description: "Manifold bolt kit", partNumber: "DR-03410", quantity: 1, unitPrice: 27.4 }],
  },
  {
    id: "PO-8828",
    vendor: "Dorman Direct",
    ro: "RO-4444",
    status: "delivered",
    placedAt: daysAgo(2),
    lines: [
      { description: "Exhaust manifold, driver side", partNumber: "DR-674-511", quantity: 1, unitPrice: 246 },
      { description: "Manifold gasket set", partNumber: "FP-MS97008", quantity: 1, unitPrice: 38.7 },
    ],
  },
  {
    id: "PO-8830",
    vendor: "Valley Supply",
    ro: "RO-4468",
    status: "ordered",
    placedAt: hoursAgo(20),
    lines: [{ description: "Purge valve solenoid", partNumber: "DM-911-207", quantity: 1, unitPrice: 54.9 }],
  },
  {
    id: "PO-8832",
    vendor: "Moog Chassis West",
    ro: "RO-4453",
    status: "ordered",
    placedAt: hoursAgo(28),
    lines: [{ description: "Upper control arm assembly", partNumber: "MO-RK621282", quantity: 2, unitPrice: 128.5 }],
  },
  {
    id: "PO-8834",
    vendor: "Bakersfield Electric",
    ro: "RO-4435",
    status: "ordered",
    placedAt: hoursAgo(25),
    lines: [
      { description: "Ignition coil", partNumber: "DN-673-8305", quantity: 1, unitPrice: 62.4 },
      { description: "Iridium spark plug", partNumber: "NG-ILZKAR7B11", quantity: 4, unitPrice: 14.2 },
    ],
  },
  {
    id: "PO-8836",
    vendor: "Coastline Parts",
    ro: "RO-4450",
    status: "delivered",
    placedAt: daysAgo(2),
    lines: [
      { description: "Cabin air filter", partNumber: "WX-24013", quantity: 1, unitPrice: 18.9 },
      { description: "Engine air filter", partNumber: "WX-49020", quantity: 1, unitPrice: 22.35 },
    ],
  },
  {
    id: "PO-8838",
    vendor: "Coastline Parts",
    ro: "RO-4423",
    status: "delivered",
    placedAt: daysAgo(8),
    lines: [
      { description: "Ceramic brake pad set, rear", partNumber: "RM-D1468", quantity: 1, unitPrice: 61.3 },
      { description: "Coated rotor, rear", partNumber: "RM-580980", quantity: 2, unitPrice: 84.1 },
    ],
  },
  {
    id: "PO-8840",
    vendor: "Valley Supply",
    ro: "RO-4441",
    status: "delivered",
    placedAt: daysAgo(4),
    lines: [{ description: "Oil filter", partNumber: "WX-57045", quantity: 1, unitPrice: 10.6 }],
  },
  {
    id: "PO-8842",
    vendor: "Coastline Parts",
    ro: "RO-4459",
    status: "shipped",
    placedAt: hoursAgo(18),
    lines: [
      { description: "R-134a refrigerant, lb", partNumber: "PR-R134", quantity: 2, unitPrice: 18.5 },
      { description: "UV dye cartridge", partNumber: "TL-UVD-1", quantity: 1, unitPrice: 9.75 },
    ],
  },
];

export function partOrderTotal(order: PartOrder): number {
  return order.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
}

export function getPartOrdersForRepairOrder(ro: string): PartOrder[] {
  return partOrders.filter((order) => order.ro === ro);
}

export const backOrdered: PartOrder[] = partOrders.filter((order) => order.status === "back-ordered");

export const PART_STATUS_LABELS: Record<PartOrderStatus, string> = {
  ordered: "Ordered",
  shipped: "Shipped",
  delivered: "Delivered",
  "back-ordered": "Back-ordered",
};
