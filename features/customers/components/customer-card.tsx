import Link from "next/link";
import { ChevronRight, Phone, UserRound } from "lucide-react";
import type { Customer } from "@prisma/client";

import { Card } from "@/components/ui/card";

type CustomerCardProps = {
  customer: Customer;
};

export function CustomerCard({ customer }: CustomerCardProps) {
  const name = customer.name?.trim() || null;
  const phone = customer.primaryPhone?.trim() || null;

  return (
    <Link href={`/customers/${customer.id}`} className="block">
      <Card className="overflow-hidden border-zinc-200 bg-white shadow-card transition-all hover:border-emerald-200 hover:shadow-lg">
        <div className="flex items-center gap-4 p-5 sm:p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <UserRound className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-semibold tracking-tight text-zinc-950">
              {name ?? phone ?? "Unknown customer"}
            </h2>
            {name && phone ? (
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-zinc-600">
                <Phone className="h-4 w-4 shrink-0" />
                <span className="truncate">{phone}</span>
              </p>
            ) : null}
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-zinc-400" />
        </div>
      </Card>
    </Link>
  );
}
