import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

type CustomerTekmetricSectionProps = {
  tekmetricCustomers: Array<{
    id: string;
    externalId: string;
    name: string | null;
    phone: string | null;
    email: string | null;
    lastSyncedAt: Date;
  }>;
  vehicles: Array<{
    id: string;
    externalId: string;
    year: string | null;
    make: string | null;
    model: string | null;
    vin: string | null;
    lastSyncedAt: Date;
  }>;
  appointments: Array<{
    id: string;
    externalId: string;
    scheduledAt: Date | null;
    status: string | null;
    summary: string | null;
    lastSyncedAt: Date;
  }>;
  repairOrders: Array<{
    id: string;
    externalId: string;
    status: string | null;
    totalAmount: string | null;
    summary: string | null;
    lastSyncedAt: Date;
  }>;
};

function formatTimestamp(value: Date | null | undefined): string {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function CustomerTekmetricSection({
  tekmetricCustomers,
  vehicles,
  appointments,
  repairOrders,
}: CustomerTekmetricSectionProps) {
  if (
    tekmetricCustomers.length === 0 &&
    vehicles.length === 0 &&
    appointments.length === 0 &&
    repairOrders.length === 0
  ) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
          Connected shop system data
        </h2>
        <p className="mt-2 text-sm leading-7 text-zinc-600">
          Operational context synced from Tekmetric and linked to this customer.
        </p>
      </div>

      {tekmetricCustomers.length > 0 ? (
        <Card className="border-zinc-200 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Shop customer profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tekmetricCustomers.map((customer) => (
              <div key={customer.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="font-semibold text-zinc-950">{customer.name ?? "Shop customer"}</p>
                <p className="mt-1 text-sm text-zinc-600">
                  {[customer.phone, customer.email].filter(Boolean).join(" · ") || "No contact on file"}
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  Last synced {formatTimestamp(customer.lastSyncedAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {vehicles.length > 0 ? (
        <Card className="border-zinc-200 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Vehicles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="rounded-xl bg-white p-2 text-emerald-700">
                  <Wrench className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-zinc-950">
                    {[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ") || "Vehicle"}
                  </p>
                  {vehicle.vin ? (
                    <p className="mt-1 text-sm text-zinc-600">VIN {vehicle.vin}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {appointments.length > 0 ? (
        <Card className="border-zinc-200 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="font-semibold text-zinc-950">
                  {formatTimestamp(appointment.scheduledAt)}
                  {appointment.status ? ` · ${appointment.status}` : ""}
                </p>
                {appointment.summary ? (
                  <p className="mt-2 text-sm leading-7 text-zinc-600">{appointment.summary}</p>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {repairOrders.length > 0 ? (
        <Card className="border-zinc-200 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Repair orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {repairOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="font-semibold text-zinc-950">
                  {order.status ?? "Repair order"}
                  {order.totalAmount ? ` · $${order.totalAmount}` : ""}
                </p>
                {order.summary ? (
                  <p className="mt-2 text-sm leading-7 text-zinc-600">{order.summary}</p>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
