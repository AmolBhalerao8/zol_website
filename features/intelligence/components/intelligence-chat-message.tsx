import { Sparkles, UserRound } from "lucide-react";

import { SourceRecordCard } from "@/features/intelligence/components/source-record-card";
import type { IntelligenceQueryResult } from "@/features/intelligence/types/intelligence-types";
import { cn } from "@/lib/utils";

export type IntelligenceChatMessage =
  | { id: string; role: "user"; content: string; turnId: number }
  | { id: string; role: "assistant"; turnId: number; result: IntelligenceQueryResult };

type IntelligenceChatMessageProps = {
  message: IntelligenceChatMessage;
};

export function IntelligenceChatMessageBubble({ message }: IntelligenceChatMessageProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[85%] gap-3">
          <div className="rounded-[1.25rem] rounded-tr-md bg-zinc-950 px-4 py-3 text-sm leading-7 text-white sm:px-5 sm:text-base">
            {message.content}
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
            <UserRound className="h-4 w-4" />
          </div>
        </div>
      </div>
    );
  }

  const { result } = message;

  return (
    <div className="flex justify-start">
      <div className="flex max-w-full gap-3 sm:max-w-[92%]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="min-w-0 space-y-3">
          <div className="rounded-[1.25rem] rounded-tl-md border border-emerald-200 bg-emerald-50/70 px-4 py-3 sm:px-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
              ZOL
            </p>
            <p className="mt-2 text-sm leading-7 text-emerald-950 sm:text-base">{result.answer}</p>
            {result.summary && result.summary !== result.answer ? (
              <p className="mt-3 text-sm leading-7 text-emerald-900/80">{result.summary}</p>
            ) : null}
          </div>

          {result.followUpInsights.length > 0 ? (
            <div className="rounded-[1rem] border border-zinc-200 bg-white px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
                Follow-up insights
              </p>
              <ul className="mt-2 space-y-1.5 text-sm leading-6 text-zinc-600">
                {result.followUpInsights.map((insight) => (
                  <li key={insight}>• {insight}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {result.sources.length > 0 ? (
            <details className="group rounded-[1rem] border border-zinc-200 bg-white">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-zinc-700 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="group-open:hidden">
                  View {result.sources.length} supporting record
                  {result.sources.length === 1 ? "" : "s"}
                </span>
                <span className="hidden group-open:inline">Hide supporting records</span>
              </summary>
              <div className="space-y-2 border-t border-zinc-100 px-3 pb-3 pt-2">
                {result.sources.slice(0, 8).map((source) => (
                  <SourceRecordCard key={`${source.type}-${source.id}`} source={source} />
                ))}
              </div>
            </details>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type IntelligenceChatThreadProps = {
  messages: IntelligenceChatMessage[];
  isPending?: boolean;
};

export function IntelligenceChatThread({ messages, isPending = false }: IntelligenceChatThreadProps) {
  return (
    <section className="space-y-4" aria-label="Conversation">
      {messages.map((message) => (
        <IntelligenceChatMessageBubble key={message.id} message={message} />
      ))}

      {isPending ? (
        <div className="flex justify-start">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Sparkles className="h-4 w-4" />
            </div>
            <div
              className={cn(
                "rounded-[1.25rem] rounded-tl-md border border-emerald-200 bg-emerald-50/70 px-4 py-3",
              )}
            >
              <p className="text-sm text-emerald-800">Searching your operations...</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
