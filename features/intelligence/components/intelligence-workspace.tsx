"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  IntelligenceChatThread,
  type IntelligenceChatMessage,
} from "@/features/intelligence/components/intelligence-chat-message";
import { IntelligenceSearchBox } from "@/features/intelligence/components/intelligence-search-box";
import { SuggestedQueryList } from "@/features/intelligence/components/suggested-query-list";
import {
  SUGGESTED_INTELLIGENCE_QUERIES,
  type IntelligenceQueryResult,
} from "@/features/intelligence/types/intelligence-types";

function createMessageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

type IntelligenceQueryResponse = {
  result: IntelligenceQueryResult;
  query: string;
  sessionId: string;
  turnId?: number;
  error?: string;
};

export function IntelligenceWorkspace() {
  const [draftQuery, setDraftQuery] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [turnCounter, setTurnCounter] = useState(0);
  const [messages, setMessages] = useState<IntelligenceChatMessage[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    const container = scrollRef.current;
    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending, scrollToBottom]);

  const submitQuery = async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || isPending) {
      return;
    }

    const nextTurnId = turnCounter + 1;
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    setTurnCounter(nextTurnId);
    setError(null);
    setIsPending(true);
    setMessages((current) => [
      ...current,
      {
        id: createMessageId(),
        role: "user",
        content: trimmedQuery,
        turnId: nextTurnId,
      },
    ]);
    setDraftQuery("");

    try {
      const response = await fetch("/api/intelligence/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmedQuery,
          sessionId: sessionId || undefined,
          turnId: nextTurnId,
        }),
      });

      const data = (await response.json()) as IntelligenceQueryResponse;

      if (requestRef.current !== requestId) {
        return;
      }

      if (!response.ok || data.error) {
        setError(data.error ?? "Unable to answer that question right now.");
        return;
      }

      setSessionId(data.sessionId);

      setMessages((current) => {
        if (current.some((message) => message.role === "assistant" && message.turnId === nextTurnId)) {
          return current;
        }

        return [
          ...current,
          {
            id: createMessageId(),
            role: "assistant",
            turnId: nextTurnId,
            result: data.result,
          },
        ];
      });
    } catch {
      if (requestRef.current === requestId) {
        setError("Unable to reach ZOL right now. Please try again.");
      }
    } finally {
      if (requestRef.current === requestId) {
        setIsPending(false);
      }
    }
  };

  const startNewChat = () => {
    requestRef.current += 1;
    setMessages([]);
    setDraftQuery("");
    setSessionId("");
    setTurnCounter(0);
    setError(null);
    setIsPending(false);
  };

  return (
    <div className="flex min-h-[calc(100dvh-12rem)] flex-col">
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">
          {messages.length > 0 ? "Ask a follow-up question" : "Try an example question below"}
        </p>
        {messages.length > 0 ? (
          <Button type="button" variant="secondary" size="sm" onClick={startNewChat}>
            New chat
          </Button>
        ) : null}
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto pb-4">
        {messages.length > 0 ? (
          <IntelligenceChatThread messages={messages} isPending={isPending} />
        ) : (
          <section className="flex h-full flex-col justify-end space-y-3 pb-2">
            <div>
              <h2 className="text-base font-semibold text-zinc-950">Example questions</h2>
              <p className="mt-1 text-sm text-zinc-600">Tap one to get started.</p>
            </div>
            <SuggestedQueryList
              queries={SUGGESTED_INTELLIGENCE_QUERIES}
              onSelect={(query) => void submitQuery(query)}
            />
          </section>
        )}
      </div>

      <div className="sticky bottom-0 shrink-0 border-t border-zinc-200/80 bg-[#f7f4ee] pt-4">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void submitQuery(draftQuery);
          }}
        >
          <IntelligenceSearchBox
            value={draftQuery}
            onChange={setDraftQuery}
            isPending={isPending}
          />
        </form>
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
      </div>
    </div>
  );
}
