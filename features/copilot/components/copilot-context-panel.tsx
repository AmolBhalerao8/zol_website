import { Card } from "@/components/ui/card";
import { formatContextForDisplay } from "@/features/copilot/utils/format-context-display";
import type { OperationalContext } from "@/features/copilot/types/copilot-types";

type CopilotContextPanelProps = {
  context: OperationalContext;
};

export function CopilotContextPanel({ context }: CopilotContextPanelProps) {
  const displayLines = formatContextForDisplay(context);

  return (
    <Card className="border-zinc-200 bg-zinc-50/80 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
        Operational context
      </p>
      <p className="mt-2 text-sm text-zinc-600">
        Grounded in your workspace data — conversations, customer memory, workflows, and shop
        activity.
      </p>
      <ul className="mt-4 space-y-2">
        {displayLines.map((line) => (
          <li key={line} className="flex gap-2 text-sm leading-7 text-zinc-700">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <details className="mt-4">
        <summary className="cursor-pointer text-xs font-medium text-zinc-500">
          View full context used for suggestions
        </summary>
        <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-white p-4 text-xs leading-6 text-zinc-600">
          {context.contextSummary}
        </pre>
      </details>
    </Card>
  );
}
