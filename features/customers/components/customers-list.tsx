import { UsersRound } from "lucide-react";
import type { Customer } from "@prisma/client";

import { Card } from "@/components/ui/card";
import { CustomerCard } from "@/features/customers/components/customer-card";

type CustomersListProps = {
  customers: Customer[];
};

export function CustomersList({ customers }: CustomersListProps) {
  if (customers.length === 0) {
    return (
      <Card className="overflow-hidden border-zinc-200 bg-white p-8 text-center shadow-card sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <UsersRound className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-950">No customers yet</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-600">
          As ZOL answers calls, customers will show up here automatically with notes from each call.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {customers.map((customer) => (
        <CustomerCard key={customer.id} customer={customer} />
      ))}
    </div>
  );
}
