"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  runIntelligenceQuery,
  type IntelligenceActionState,
} from "@/features/intelligence/actions/run-intelligence-query";
import {
  IntelligenceChatThread,
  type IntelligenceChatMessage,
} from "@/features/intelligence/components/intelligence-chat-message";
import { IntelligenceSearchBox } from "@/features/intelligence/components/intelligence-search-box";
import { SuggestedQueryList } from "@/features/intelligence/components/suggested-query-list";
import { SUGGESTED_INTELLIGENCE_QUERIES } from "@/features/intelligence/types/intelligence-types";

const initialState: IntelligenceActionState = {};

function createMessageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function IntelligenceWorkspace() {
  const [state, formAction, isPending] = useActionState(runIntelligenceQuery, initialState);
  const [draftQuery, setDraftQuery] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [turnCounter, setTurnCounter] = useState(0);
  const [messages, setMessages] = useState<IntelligenceChatMessage[]>([]);
  const appliedTurnRef = useRef<number | null>(null);

  useEffect(() => {
    if (!state.result || !state.query || state.turnId === undefined) {
      return;
    }

    if (appliedTurnRef.current === state.turnId) {
      return;
    }

    appliedTurnRef.current = state.turnId;

    setMessages((current) => {
      if (current.some((message) => message.role === "assistant" && message.turnId === state.turnId)) {
        return current;
      }

      return [
        ...current,
        {
          id: createMessageId(),
          role: "assistant",
          turnId: state.turnId!,
          result: state.result!,
        },
      ];
    });

    if (state.sessionId) {
      setSessionId(state.sessionId);
    }

    setDraftQuery("");
  }, [state]);

  const submitQuery = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || isPending) {
      return;
    }

    const nextTurnId = turnCounter + 1;
    setTurnCounter(nextTurnId);
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

    const formData = new FormData();
    formData.set("query", trimmedQuery);
    formData.set("turnId", String(nextTurnId));
    if (sessionId) {
      formData.set("sessionId", sessionId);
    }

    formAction(formData);
  };

  const startNewChat = () => {
    setMessages([]);
    setDraftQuery("");
    setSessionId("");
    setTurnCounter(0);
    appliedTurnRef.current = null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">
          {messages.length > 0 ? "Follow up in this conversation" : "Start a new operational search"}
        </p>
        {messages.length > 0 ? (
          <Button type="button" variant="secondary" size="sm" onClick={startNewChat}>
            New chat
          </Button>
        ) : null}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          submitQuery(String(formData.get("query") ?? ""));
        }}
      >
        <input type="hidden" name="sessionId" value={sessionId} />
        <IntelligenceSearchBox
          value={draftQuery}
          onChange={setDraftQuery}
          isPending={isPending}
        />
        {state.error ? <p className="mt-2 text-sm text-red-700">{state.error}</p> : null}
      </form>

      {messages.length > 0 ? <IntelligenceChatThread messages={messages} isPending={isPending} /> : null}

      {messages.length === 0 ? (
        <section className="space-y-3 pt-2">
          <div>
            <h2 className="text-base font-semibold text-zinc-950">Example operational queries</h2>
            <p className="mt-1 text-sm text-zinc-600">Click an example to get started.</p>
          </div>
          <SuggestedQueryList
            queries={SUGGESTED_INTELLIGENCE_QUERIES}
            onSelect={(query) => submitQuery(query)}
          />
        </section>
      ) : null}
    </div>
  );
}
