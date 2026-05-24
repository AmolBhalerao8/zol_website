"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

type PlatformErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PlatformError({ error, reset }: PlatformErrorProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ee] px-6 py-16">
      <div className="max-w-lg rounded-[2rem] border border-zinc-200 bg-white p-8 text-center shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Something went wrong
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
          We couldn&apos;t load your workspace
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600">
          Try again in a moment. If this keeps happening, contact support and share the digest
          below.
        </p>
        {error.digest ? (
          <p className="mt-4 rounded-2xl bg-zinc-50 px-4 py-3 text-xs text-zinc-500">
            Digest: {error.digest}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="accent" onClick={reset}>
            Try again
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
