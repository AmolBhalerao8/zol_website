/**
 * Barrel for the mock dataset, plus the derived numbers the app shell and the
 * board read. Every count here is computed from the arrays below -- nothing is
 * typed in twice, so the shell badge and the board tiles can never disagree.
 */

import { customers, getCustomer } from "./customers";
import { backOrdered, partOrders } from "./parts";
import { repairOrders } from "./repair-orders";
import { shop } from "./shop";
import { getVehicle, vehicles } from "./vehicles";
import type { RepairOrder } from "./types";

export * from "./types";
export { customers, getCustomer } from "./customers";
export { vehicles, getVehicle, getVehiclesForCustomer } from "./vehicles";
export {
  repairOrders,
  getRepairOrder,
  getRepairOrdersForCustomer,
  getRepairOrdersForVehicle,
  orderSubtotal,
  STATUS_LABELS,
} from "./repair-orders";
export {
  partOrders,
  partOrderTotal,
  getPartOrdersForRepairOrder,
  backOrdered,
  PART_STATUS_LABELS,
} from "./parts";
export { shop } from "./shop";
export { dayAt, daysAgo, hoursAgo, minutesAgo, startOfWeek, todayIndex } from "./time";

/**
 * Referential integrity gate. The mock data is hand-written, so a typo in a
 * customerId would otherwise surface as a blank page at runtime. Running this
 * at module load turns that into a build failure instead.
 */
function assertReferentialIntegrity(): void {
  const problems: string[] = [];

  for (const vehicle of vehicles) {
    if (!getCustomer(vehicle.customerId)) {
      problems.push(`vehicle ${vehicle.id} references missing customer ${vehicle.customerId}`);
    }
  }

  for (const order of repairOrders) {
    if (!getCustomer(order.customerId)) {
      problems.push(`${order.ro} references missing customer ${order.customerId}`);
    }
    const vehicle = getVehicle(order.vehicleId);
    if (!vehicle) {
      problems.push(`${order.ro} references missing vehicle ${order.vehicleId}`);
    } else if (vehicle.customerId !== order.customerId) {
      problems.push(`${order.ro} pairs vehicle ${vehicle.id} with the wrong customer`);
    }
  }

  const roNumbers = new Set(repairOrders.map((order) => order.ro));
  for (const order of partOrders) {
    if (!roNumbers.has(order.ro)) {
      problems.push(`part order ${order.id} references missing ${order.ro}`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`Mock data is inconsistent:\n  - ${problems.join("\n  - ")}`);
  }
}

assertReferentialIntegrity();

/** Reply latencies, in seconds, for texts ZOL answered without a human. */
const zolReplySeconds = [8, 12, 6, 21, 9, 14, 7, 31, 11, 5, 18, 9];

export type BoardStats = {
  carsInBays: number;
  baysFree: number;
  awaitingApproval: number;
  callsAnsweredToday: number;
  averageReplySeconds: number;
};

export function getBoardStats(): BoardStats {
  const carsInBays = repairOrders.filter((order) => order.bay !== null).length;
  const awaitingApproval = repairOrders.filter((order) => order.status === "waiting-customer").length;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const callsAnsweredToday = repairOrders.reduce((count, order) => {
    const answered = order.timeline.filter(
      (event) => event.actor === "zol" && event.label.startsWith("Call answered") && event.at >= startOfToday,
    );
    return count + answered.length;
  }, 0);

  const averageReplySeconds = Math.round(
    zolReplySeconds.reduce((sum, seconds) => sum + seconds, 0) / zolReplySeconds.length,
  );

  return {
    carsInBays,
    baysFree: Math.max(shop.bayCount - carsInBays, 0),
    awaitingApproval,
    callsAnsweredToday,
    averageReplySeconds,
  };
}

/** Repair orders that still need a human to do something. */
export function getOpenRepairOrders(): RepairOrder[] {
  return repairOrders.filter((order) => order.status !== "closed");
}

export const openRepairOrderCount = repairOrders.filter((order) => order.status !== "closed").length;
export const backOrderCount = backOrdered.length;
export const customerCount = customers.length;
