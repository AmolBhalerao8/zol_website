import { IntelligenceWorkspace } from "@/features/intelligence/components/intelligence-workspace";
import { getRecentIntelligenceQueries } from "@/features/intelligence/queries/get-recent-intelligence-queries";
import { requireWorkspace } from "@/features/workspace";

export async function IntelligencePage() {
  const currentWorkspace = await requireWorkspace();
  const recentQueries = await getRecentIntelligenceQueries(currentWorkspace.workspace.id);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section>
        <div className="mb-3 inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700">
          Operational intelligence
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Operational Intelligence
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-zinc-600">
          Ask questions about your business, customers, conversations, and operations.
        </p>
      </section>

      <IntelligenceWorkspace recentQueries={recentQueries} />
    </div>
  );
}
