"use client";

type SuggestedQueryListProps = {
  queries: readonly string[];
  onSelect: (query: string) => void;
};

export function SuggestedQueryList({ queries, onSelect }: SuggestedQueryListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {queries.map((query) => (
        <button
          key={query}
          type="button"
          onClick={() => onSelect(query)}
          className="rounded-[1.25rem] border border-zinc-200 bg-white px-4 py-4 text-left text-sm leading-7 text-zinc-700 transition hover:border-emerald-200 hover:bg-emerald-50/50"
        >
          {query}
        </button>
      ))}
    </div>
  );
}
