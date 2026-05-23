"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { VoiceSelectionCard } from "@/features/voice-channel/components/voice-selection-card";
import { stopActiveVoicePreview } from "@/features/voice-channel/utils/play-vapi-voice-preview";
import type { VapiVoiceOption } from "@/features/voice-channel/utils/vapi-voices-catalog";

type VoiceSelectionGridProps = {
  voices: VapiVoiceOption[];
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
};

export function VoiceSelectionGrid({
  voices,
  defaultValue,
  disabled = false,
  name = "voiceId",
}: VoiceSelectionGridProps) {
  const initialSelection = defaultValue ?? voices[0]?.id ?? "";
  const [selected, setSelected] = useState(initialSelection);
  const [query, setQuery] = useState("");
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  function handlePreviewStart(voiceId: string) {
    stopActiveVoicePreview();
    setPreviewingVoiceId(voiceId);
  }

  function handlePreviewEnd() {
    setPreviewingVoiceId(null);
  }

  const filteredVoices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return voices;
    }

    return voices.filter((voice) => {
      const haystack = [
        voice.name,
        voice.gender,
        voice.accent,
        voice.age,
        voice.description,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [query, voices]);

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={selected} />

      <Input
        type="search"
        placeholder="Search voices by name, accent, or style..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        disabled={disabled}
      />

      <p className="text-sm text-zinc-500">
        {filteredVoices.length} voice{filteredVoices.length === 1 ? "" : "s"} available
      </p>

      <div className="grid gap-4 md:grid-cols-2" role="radiogroup" aria-label="Choose a voice">
        {filteredVoices.map((option) => (
          <VoiceSelectionCard
            key={option.id}
            option={option}
            selected={selected === option.id}
            disabled={disabled}
            previewingVoiceId={previewingVoiceId}
            onPreviewStart={handlePreviewStart}
            onPreviewEnd={handlePreviewEnd}
            onSelect={setSelected}
          />
        ))}
      </div>

      {filteredVoices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-600">
          No voices match your search. Try a different keyword.
        </div>
      ) : null}
    </div>
  );
}
