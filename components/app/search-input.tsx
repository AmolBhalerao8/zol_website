"use client";

import { Search } from "lucide-react";
import { useId } from "react";

export function SearchInput({
  value,
  onChange,
  label,
  placeholder,
}: {
  value: string;
  onChange: (next: string) => void;
  label: string;
  placeholder?: string;
}) {
  const id = useId();

  return (
    <div className="relative w-full sm:max-w-sm">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-zinc-300 bg-white py-2.5 pl-11 pr-4 text-sm text-zinc-950 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
      />
    </div>
  );
}
