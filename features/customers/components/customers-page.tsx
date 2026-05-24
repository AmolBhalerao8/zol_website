import { Suspense } from "react";

import { CustomerSearchForm } from "@/features/customers/components/customer-search-form";
import { CustomersList } from "@/features/customers/components/customers-list";
import { getCustomers } from "@/features/customers/queries/get-customers";
import { requireWorkspace } from "@/features/workspace";

type CustomersPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function CustomersPage({ searchParams }: CustomersPageProps) {
  const currentWorkspace = await requireWorkspace();
  const params = await searchParams;
  const customers = await getCustomers(currentWorkspace.workspace.id, params.q);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section>
        <div className="mb-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Customer relationships
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Customers</h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-zinc-600">
          People who have called your business — with what ZOL remembers from past conversations.
        </p>
      </section>

      <Suspense fallback={null}>
        <CustomerSearchForm initialQuery={params.q ?? ""} />
      </Suspense>

      <CustomersList customers={customers} />
    </div>
  );
}
