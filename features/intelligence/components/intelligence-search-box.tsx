import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

type IntelligenceSearchBoxProps = {
  defaultQuery?: string;
  isPending?: boolean;
};

export function IntelligenceSearchBox({
  defaultQuery = "",
  isPending = false,
}: IntelligenceSearchBoxProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-card">
      <div className="border-b border-zinc-200 px-6 py-5 sm:px-8">
        <label htmlFor="intelligence-query" className="text-sm font-medium text-zinc-600">
          Ask ZOL about your business operations
        </label>
      </div>
      <div className="space-y-4 p-6 sm:p-8">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <textarea
            id="intelligence-query"
            name="query"
            rows={3}
            defaultValue={defaultQuery}
            placeholder="Ask ZOL about your business..."
            className="min-h-28 w-full resize-y rounded-[1.25rem] border border-zinc-200 bg-zinc-50 px-12 py-4 text-base text-zinc-950 outline-none ring-emerald-500/30 transition focus:border-emerald-300 focus:bg-white focus:ring-4"
            required
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>
    </div>
  );
}
