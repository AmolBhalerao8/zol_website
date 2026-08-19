/**
 * Shared types for the front-end-only mock dataset that powers the `(app)`
 * route group. Nothing here touches Prisma or the network -- see
 * `docs/APP_UI.md` for what to swap when a real backend arrives.
 */

export type RepairOrderStatus =
  | "in-bay"
  | "waiting-customer"
  | "waiting-parts"
  | "ready"
  | "closed";

/** Who performed an action: ZOL unattended, or a person at the shop. */
export type Actor = "zol" | "human";

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  /** Months the customer has been with the shop. */
  tenureMonths: number;
};

export type Vehicle = {
  id: string;
  customerId: string;
  year: number;
  make: string;
  model: string;
  vin: string;
  plate: string;
  mileage: number;
};

export type LaborLine = {
  description: string;
  hours: number;
  rate: number;
};

export type PartLine = {
  description: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
};

export type TimelineEvent = {
  id: string;
  /** Absolute instant, derived at module load from a fixed offset. */
  at: Date;
  actor: Actor;
  label: string;
  detail?: string;
};

export type RepairOrder = {
  ro: string;
  customerId: string;
  vehicleId: string;
  /** Null when the vehicle is not currently occupying a bay. */
  bay: number | null;
  job: string;
  status: RepairOrderStatus;
  /** Short readout of the last thing ZOL or a human did on this RO. */
  zolDid: string;
  /** `zol` renders emerald (autonomous), `human` renders amber (needs a person). */
  zolDidActor: Actor;
  waitingOn: string;
  estimatedHours: number;
  /** 0 = Monday .. 6 = Sunday. Null when unscheduled. */
  scheduledDay: number | null;
  laborLines: LaborLine[];
  partLines: PartLine[];
  notes: string;
  timeline: TimelineEvent[];
};

export type PartOrderStatus = "ordered" | "shipped" | "delivered" | "back-ordered";

export type PartOrder = {
  id: string;
  vendor: string;
  ro: string;
  lines: PartLine[];
  status: PartOrderStatus;
  placedAt: Date;
  /** Present only on back-ordered rows: what the delay threatens. */
  threatens?: string;
};

export type ShopHours = {
  day: string;
  open: string;
  close: string;
  closed: boolean;
};

export type Shop = {
  name: string;
  address: string;
  laborRate: number;
  taxRate: number;
  bayCount: number;
  hours: ShopHours[];
};
