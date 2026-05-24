import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

type IntelligenceSearchBoxProps = {
  value: string;
  onChange: (value: string) => void;
  isPending?: boolean;
};

export function IntelligenceSearchBox({
  value,
  onChange,
  isPending = false,
}: IntelligenceSearchBoxProps) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white shadow-card">
      <div className="flex items-end gap-3 p-4 sm:p-5">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-zinc-400" />
          <textarea
            id="intelligence-query"
            name="query"
            rows={2}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            placeholder="Ask ZOL about your business..."
            className="min-h-[3.5rem] w-full resize-none rounded-[1rem] border border-zinc-200 bg-zinc-50 px-10 py-3 text-base text-zinc-950 outline-none ring-emerald-500/30 transition focus:border-emerald-300 focus:bg-white focus:ring-4"
            required
          />
        </div>
        <Button type="submit" size="lg" disabled={isPending || !value.trim()} className="shrink-0">
          {isPending ? "..." : "Ask"}
        </Button>
      </div>
    </div>
  );
}
