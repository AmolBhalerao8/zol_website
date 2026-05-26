import { Suspense } from "react";

import { CustomerSearchForm } from "@/features/customers/components/customer-search-form";
import { CustomersList } from "@/features/customers/components/customers-list";
import { getCustomers } from "@/features/customers/queries/get-customers";
import { requireWorkspace } from "@/features/workspace";
import { withDbRetry } from "@/lib/db-retry";

type CustomersPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function CustomersPage({ searchParams }: CustomersPageProps) {
  const currentWorkspace = await requireWorkspace();
  const params = await searchParams;
  const customers = await withDbRetry(() =>
    getCustomers(currentWorkspace.workspace.id, params.q),
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Customers</h1>
        <p className="mt-2 max-w-2xl text-base leading-8 text-zinc-600">
          People who have called your business and what ZOL remembers about them.
        </p>
      </section>

      <Suspense
        fallback={
          <div className="h-11 animate-pulse rounded-full border border-zinc-200 bg-zinc-100" />
        }
      >
        <CustomerSearchForm initialQuery={params.q ?? ""} />
      </Suspense>

      <CustomersList customers={customers} />
    </div>
  );
}
