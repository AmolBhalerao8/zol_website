import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  className,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden px-6 py-10 sm:px-10 lg:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.22),transparent_28rem),radial-gradient(circle_at_80%_0%,rgba(251,146,60,0.16),transparent_24rem)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:36px_36px] opacity-40" />
          <div className="relative flex min-h-full flex-col justify-between">
            <Link href="/" className="flex w-fit items-center gap-3">
              <Image
                src="/zol-logo.png"
                alt=""
                width={44}
                height={44}
                priority
                className="rounded-full shadow-2xl ring-1 ring-white/10"
              />
              <span className="text-xl font-bold tracking-tight">ZOL</span>
            </Link>

            <div className="my-16 max-w-2xl lg:my-0">
              <div className="mb-5 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                {eyebrow}
              </div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-zinc-300 sm:text-lg">
                {description}
              </p>
            </div>

            <div className="grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
              {["Customer memory", "Workflow clarity", "Operational insight"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-[#fbfaf7] px-4 py-12 text-zinc-950 sm:px-6 lg:px-10">
          <div className={cn("w-full max-w-md", className)}>
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-premium sm:p-6">
              {children}
            </div>
            <div className="mt-6 text-center text-sm text-zinc-600">{footer}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
