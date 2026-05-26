import { Card } from "@/components/ui/card";

export function CopilotSuggestionsSkeleton() {
  return (
    <Card className="animate-pulse border-zinc-200 p-6">
      <div className="h-4 w-40 rounded bg-zinc-200" />
      <div className="mt-3 h-3 w-full max-w-md rounded bg-zinc-100" />
      <div className="mt-6 space-y-3">
        <div className="h-24 rounded-2xl bg-zinc-100" />
        <div className="h-24 rounded-2xl bg-zinc-100" />
      </div>
    </Card>
  );
}
