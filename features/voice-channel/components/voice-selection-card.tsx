"use client";

import { useState } from "react";
import { Loader2, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VapiVoiceOption } from "@/features/voice-channel/utils/vapi-voices-catalog";
import {
  playVapiVoicePreview,
  stopActiveVoicePreview,
} from "@/features/voice-channel/utils/play-vapi-voice-preview";

type VoiceSelectionCardProps = {
  option: VapiVoiceOption;
  selected: boolean;
  disabled?: boolean;
  previewingVoiceId: string | null;
  onPreviewStart: (voiceId: string) => void;
  onPreviewEnd: () => void;
  onSelect: (id: string) => void;
};

export function VoiceSelectionCard({
  option,
  selected,
  disabled = false,
  previewingVoiceId,
  onPreviewStart,
  onPreviewEnd,
  onSelect,
}: VoiceSelectionCardProps) {
  const [previewError, setPreviewError] = useState<string | null>(null);
  const isPreviewing = previewingVoiceId === option.id;

  async function handlePreview(event: React.MouseEvent) {
    event.stopPropagation();

    if (isPreviewing) {
      stopActiveVoicePreview();
      onPreviewEnd();
      return;
    }

    setPreviewError(null);
    onPreviewStart(option.id);

    try {
      await playVapiVoicePreview(option.id);
    } catch {
      setPreviewError("Preview unavailable right now.");
    } finally {
      onPreviewEnd();
    }
  }

  function handleSelect() {
    if (disabled) {
      return;
    }

    onSelect(option.id);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(option.id);
    }
  }

  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={disabled ? -1 : 0}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative w-full cursor-pointer rounded-[1.5rem] border p-5 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
        selected
          ? "border-emerald-500 bg-emerald-50/80 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm",
        disabled && "cursor-not-allowed opacity-70",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold tracking-tight text-zinc-950">{option.name}</h3>
            {option.isNew ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                New
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{option.description}</p>
          <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
            {option.gender} · {option.accent} · {option.age}
          </p>
        </div>
        <span
          className={cn(
            "mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
            selected ? "border-emerald-500 bg-emerald-500" : "border-zinc-300 bg-white",
          )}
        >
          {selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={disabled || (previewingVoiceId !== null && !isPreviewing)}
          onClick={handlePreview}
        >
          {isPreviewing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Stop preview
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Preview sample
            </>
          )}
        </Button>
        {previewError ? <p className="text-xs text-red-600">{previewError}</p> : null}
      </div>
    </div>
  );
}
