import { IntelligenceWorkspace } from "@/features/intelligence/components/intelligence-workspace";
import { requireWorkspace } from "@/features/workspace";

export async function IntelligencePage() {
  await requireWorkspace();

  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col">
      <section className="shrink-0 pb-4">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Ask ZOL</h1>
        <p className="mt-2 max-w-2xl text-base leading-8 text-zinc-600">
          Ask questions about your customers, calls, appointments, and shop activity.
        </p>
      </section>

      <IntelligenceWorkspace />
    </div>
  );
}
