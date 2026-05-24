"use client";

import { useActionState, useState } from "react";

import {
  runIntelligenceQuery,
  type IntelligenceActionState,
} from "@/features/intelligence/actions/run-intelligence-query";
import { IntelligenceAnswer } from "@/features/intelligence/components/intelligence-answer";
import { IntelligenceSearchBox } from "@/features/intelligence/components/intelligence-search-box";
import { SuggestedQueryList } from "@/features/intelligence/components/suggested-query-list";
import {
  SUGGESTED_INTELLIGENCE_QUERIES,
  type IntelligenceQueryResult,
} from "@/features/intelligence/types/intelligence-types";

type IntelligenceWorkspaceProps = {
  recentQueries: Array<{ id: string; query: string; createdAt: Date }>;
  initialResult?: IntelligenceQueryResult | null;
  initialQuery?: string;
};

const initialState: IntelligenceActionState = {};

export function IntelligenceWorkspace({
  recentQueries,
  initialResult = null,
  initialQuery = "",
}: IntelligenceWorkspaceProps) {
  const [state, formAction, isPending] = useActionState(runIntelligenceQuery, initialState);
  const [draftQuery, setDraftQuery] = useState(initialQuery);
  const result = state.result ?? initialResult;

  return (
    <div className="space-y-8">
      <form action={formAction} className="space-y-6">
        <IntelligenceSearchBox defaultQuery={draftQuery} isPending={isPending} />
        {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      </form>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">Example operational queries</h2>
          <p className="mt-2 text-sm leading-7 text-zinc-600">
            Click an example to search your business naturally.
          </p>
        </div>
        <SuggestedQueryList
          queries={SUGGESTED_INTELLIGENCE_QUERIES}
          onSelect={(query) => {
            setDraftQuery(query);
            const form = document.querySelector("form");
            const textarea = form?.querySelector(
              "textarea[name='query']",
            ) as HTMLTextAreaElement | null;
            if (textarea) {
              textarea.value = query;
            }
            form?.requestSubmit();
          }}
        />
      </section>

      {recentQueries.length > 0 ? (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">Recent searches</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              Pick up where your team left off.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentQueries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => {
                  setDraftQuery(entry.query);
                  const form = document.querySelector("form");
                  const textarea = form?.querySelector(
                    "textarea[name='query']",
                  ) as HTMLTextAreaElement | null;
                  if (textarea) {
                    textarea.value = entry.query;
                  }
                  form?.requestSubmit();
                }}
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 transition hover:border-emerald-200 hover:bg-emerald-50/50"
              >
                {entry.query}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {result ? <IntelligenceAnswer result={result} /> : null}
    </div>
  );
}
