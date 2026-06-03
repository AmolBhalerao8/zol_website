"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import type { MessageChannel } from "@prisma/client";

type MessageEditorProps = {
  channel: MessageChannel;
  initialContent: string;
  initialSubject?: string | null;
  initialRecipient?: string;
  onSubmit: (values: {
    content: string;
    subject?: string | null;
    recipient?: string;
  }) => void;
  submitLabel?: string;
  disabled?: boolean;
};

export function MessageEditor({
  channel,
  initialContent,
  initialSubject,
  initialRecipient,
  onSubmit,
  submitLabel = "Save",
  disabled = false,
}: MessageEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [subject, setSubject] = useState(initialSubject ?? "");
  const [recipient, setRecipient] = useState(initialRecipient ?? "");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({
      content,
      subject: channel === "EMAIL" ? subject : null,
      recipient,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-700">Recipient</span>
        <input
          value={recipient}
          onChange={(event) => setRecipient(event.target.value)}
          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none ring-emerald-500 focus:ring-2"
          required
        />
      </label>

      {channel === "EMAIL" ? (
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Subject</span>
          <input
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none ring-emerald-500 focus:ring-2"
          />
        </label>
      ) : null}

      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-700">Message</span>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={5}
          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-7 outline-none ring-emerald-500 focus:ring-2"
          required
        />
      </label>

      <Button type="submit" size="sm" disabled={disabled}>
        {submitLabel}
      </Button>
    </form>
  );
}
