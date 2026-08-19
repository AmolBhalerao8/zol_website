"use client";

import { Show } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardList,
  MessageSquareText,
  Package,
  PhoneCall,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ZolProfileMenu } from "@/features/auth/components/zol-profile-menu";
import { cn } from "@/lib/utils";

/**
 * Product-first landing page. The board, repair-order timeline, and numbers
 * below mirror the sample dataset in `lib/mock` so the marketing surface and
 * the `(app)` surface tell the same story. Strings are inlined rather than
 * imported because `lib/mock` derives timestamps at module load, which would
 * not survive hydration in a client component.
 */

const navLinks = [
  { label: "The board", href: "#board" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Compare", href: "#compare" },
  { label: "Vision", href: "#vision" },
];

type BoardStatus = "in-bay" | "waiting-customer" | "waiting-parts" | "ready";

const boardRows: Array<{
  ro: string;
  bay: string;
  vehicle: string;
  plate: string;
  job: string;
  zolDid: string;
  byZol: boolean;
  waitingOn: string;
  status: BoardStatus;
  statusLabel: string;
}> = [
  {
    ro: "RO-4471",
    bay: "Bay 2",
    vehicle: "2018 Ford F-150 XLT",
    plate: "8XKR241",
    job: "Front brakes + rotors",
    zolDid: "Call answered 9:41p",
    byZol: true,
    waitingOn: "Tech — in progress",
    status: "in-bay",
    statusLabel: "In bay",
  },
  {
    ro: "RO-4459",
    bay: "Bay 1",
    vehicle: "2016 Ram 1500 Big Horn",
    plate: "5KJB728",
    job: "A/C not cooling",
    zolDid: "Booked from voicemail",
    byZol: true,
    waitingOn: "Tech — diagnosing",
    status: "in-bay",
    statusLabel: "In bay",
  },
  {
    ro: "RO-4456",
    bay: "Bay 3",
    vehicle: "2014 Nissan Altima 2.5 S",
    plate: "6WQX155",
    job: "Alternator replacement",
    zolDid: "Approval received 8:12a",
    byZol: true,
    waitingOn: "Tech — in progress",
    status: "in-bay",
    statusLabel: "In bay",
  },
  {
    ro: "RO-4465",
    bay: "Bay 4",
    vehicle: "2015 Chevrolet Silverado 1500",
    plate: "4YHN092",
    job: "Transmission service",
    zolDid: "Part ordered 11:20a",
    byZol: true,
    waitingOn: "Filter kit — back-ordered",
    status: "waiting-parts",
    statusLabel: "Waiting on parts",
  },
  {
    ro: "RO-4468",
    bay: "—",
    vehicle: "2020 Toyota RAV4 LE",
    plate: "9CMD517",
    job: "Check engine diagnostic",
    zolDid: "Estimate sent — awaiting approval",
    byZol: false,
    waitingOn: "Customer approval",
    status: "waiting-customer",
    statusLabel: "Waiting on customer",
  },
  {
    ro: "RO-4462",
    bay: "—",
    vehicle: "2021 Hyundai Elantra SEL",
    plate: "8PDF470",
    job: "Oil service + tire rotation",
    zolDid: "Texted back in 8s",
    byZol: true,
    waitingOn: "Pickup",
    status: "ready",
    statusLabel: "Ready",
  },
];

const boardFilters: Array<{ label: string; count: number; active?: boolean }> = [
  { label: "All", count: 6, active: true },
  { label: "In bay", count: 3 },
  { label: "Waiting on customer", count: 1 },
  { label: "Waiting on parts", count: 1 },
  { label: "Ready", count: 1 },
];

const boardStats = [
  { label: "Cars in bays", value: "4", hint: "of 6 bays" },
  { label: "Bays free", value: "2", hint: "ready for the next job" },
  { label: "Awaiting approval", value: "2", hint: "needs a customer reply" },
  { label: "Calls answered", value: "3", hint: "today, by ZOL" },
  { label: "Avg text reply", value: "8s", hint: "ZOL, unattended" },
];

/** RO-4471, newest last so the section reads top-to-bottom as it happened. */
const recordTimeline = [
  {
    when: "Mon 9:41p",
    actor: "zol" as const,
    label: "Call answered",
    detail: "After hours. 2m18s. Captured the complaint, VIN, and callback preference.",
  },
  {
    when: "Tue 7:52a",
    actor: "human" as const,
    label: "Ticket written",
    detail: "Service writer: Dana K.",
  },
  {
    when: "Tue 8:30a",
    actor: "zol" as const,
    label: "Estimate sent",
    detail: "$742.18 texted to (661) 555-0142 with the rotor measurement.",
  },
  {
    when: "Tue 10:15a",
    actor: "zol" as const,
    label: "Approval received",
    detail: "Customer replied YES by text; the RO released to the board on its own.",
  },
  {
    when: "Tue 12:40p",
    actor: "human" as const,
    label: "Job started",
    detail: "Tech: Manny R. — vehicle pulled into bay 2.",
  },
];

const agents = [
  {
    icon: PhoneCall,
    title: "It answers the phone",
    body: "Nights, weekends, and every call your front desk cannot get to. It captures the complaint, the VIN, and a callback preference — or transcribes the voicemail and calls back to book the slot.",
    proof: "Booked from voicemail — transcribed 6:48p, booked 8:00a",
  },
  {
    icon: MessageSquareText,
    title: "It texts back in seconds",
    body: "Inbound texts get a real answer before the shop opens. ZOL offers open slots, confirms them, and writes the appointment straight onto the board.",
    proof: "Inbound text 7:02a — answered in 8s",
  },
  {
    icon: ClipboardList,
    title: "It sends estimates and chases approvals",
    body: "The estimate goes out by text with a photo of the failed part and plain-English reasoning. If nobody replies, ZOL sends one nudge — then stops and flags it for a person.",
    proof: "No reply after 20h — one nudge sent, then paused",
  },
  {
    icon: Package,
    title: "It orders parts and catches the delays",
    body: "Parts get ordered against the approved estimate. When a vendor pushes an ETA, ZOL surfaces the bay conflict before the car is stuck on a lift.",
    proof: "Vendor moved ETA to Thursday — bay 4 conflict flagged",
  },
];

const compareRows: Array<{ before: string; after: string }> = [
  {
    before: "After-hours calls go to voicemail and half never call back",
    after: "Every call answered, triaged, and booked overnight",
  },
  {
    before: "Estimates wait until someone has a free minute at the counter",
    after: "Estimate texted the moment the tech finishes the diagnosis",
  },
  {
    before: "Approvals get chased by memory, or not at all",
    after: "One automatic follow-up, then it escalates to a person",
  },
  {
    before: "Back-ordered parts surface when the car is already on the lift",
    after: "Vendor delays flagged against the bay schedule in advance",
  },
  {
    before: "Status lives across a whiteboard, three tabs, and a text thread",
    after: "One board showing what ZOL handled and what still needs you",
  },
  {
    before: "New hires learn the shop's procedures by shadowing",
    after: "Procedures captured once, then guided step by step",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

function AnimatedSection({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={cn("mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8", className)}
    >
      {children}
    </motion.section>
  );
}

function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500",
        className,
      )}
    >
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" ? "mx-auto text-center" : "text-left")}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-8 text-zinc-600 sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/zol-logo.png"
      alt=""
      width={80}
      height={80}
      priority
      sizes="40px"
      className={cn(
        "h-10 w-10 rounded-full object-cover shadow-sm ring-1 ring-black/5",
        className,
      )}
      aria-hidden="true"
    />
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 sm:px-5",
          scrolled
            ? "border-zinc-200/80 bg-white/84 shadow-card backdrop-blur-xl"
            : "border-transparent bg-white/50 backdrop-blur-sm",
        )}
      >
        <a href="#" className="flex items-center gap-3" aria-label="ZOL home">
          <LogoMark />
          <span className="text-lg font-bold tracking-tight text-zinc-950">ZOL</span>
        </a>

        <div className="hidden items-center gap-1 rounded-full bg-zinc-100/80 p-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-white hover:text-zinc-950"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <Button size="sm" variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/request-access">Request access</Link>
            </Button>
          </Show>
          <Show when="signed-in">
            <Button size="sm" asChild>
              <Link href="/auth/continue">Profile</Link>
            </Button>
            <ZolProfileMenu />
          </Show>
        </div>
      </nav>
    </header>
  );
}

/** Emerald == ZOL acted on its own. Amber == a person is the blocker. */
function ActorPill({ children, byZol }: { children: React.ReactNode; byZol: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] leading-4",
        byZol
          ? "border-emerald-600/30 bg-emerald-50 text-emerald-800"
          : "border-amber-600/30 bg-amber-50 text-amber-800",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          byZol ? "bg-emerald-500" : "bg-amber-500",
        )}
      />
      {children}
    </span>
  );
}

const STATUS_DOT: Record<BoardStatus, string> = {
  "in-bay": "bg-emerald-500",
  "waiting-customer": "bg-amber-500",
  "waiting-parts": "bg-amber-500",
  ready: "bg-zinc-400",
};

/**
 * The hero shot: the `(app)` board rebuilt as a static, responsive mockup.
 * Narrow screens drop the bay and waiting-on columns rather than scrolling.
 */
function BoardShot() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
      className="relative w-full"
    >
      <div className="absolute -inset-6 rounded-[2.5rem] bg-emerald-500/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white shadow-premium">
        {/* Window chrome */}
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200/80 bg-zinc-50/80 px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <LogoMark className="h-7 w-7" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-950">Fifth Street Auto</p>
              <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                Bakersfield, CA · 6 bays
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-600/30 bg-emerald-50 px-2.5 py-1 font-mono text-[11px] text-emerald-800">
            <span className="app-led h-1.5 w-1.5 rounded-full bg-emerald-500" />
            LIVE
          </span>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto border-b border-zinc-200/80 px-4 py-3 sm:px-5">
          {boardFilters.map((chip) => (
            <span
              key={chip.label}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                chip.active
                  ? "border-zinc-950 bg-zinc-950 text-white"
                  : "border-zinc-200 bg-white text-zinc-600",
              )}
            >
              {chip.label}
              <span
                className={cn(
                  "font-mono text-[10px]",
                  chip.active ? "text-zinc-400" : "text-zinc-400",
                )}
              >
                {chip.count}
              </span>
            </span>
          ))}
        </div>

        {/* Rows */}
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-200/80">
              <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 sm:px-5">
                RO
              </th>
              <th className="hidden px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 lg:table-cell">
                Bay
              </th>
              <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                Vehicle
              </th>
              <th className="hidden px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 sm:table-cell">
                Job
              </th>
              <th className="px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                ZOL did
              </th>
              <th className="hidden px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 lg:table-cell">
                Waiting on
              </th>
            </tr>
          </thead>
          <tbody>
            {boardRows.map((row) => (
              <tr key={row.ro} className="border-b border-zinc-100 last:border-b-0">
                <td className="whitespace-nowrap px-4 py-3.5 align-top sm:px-5">
                  <span className="flex items-center gap-2">
                    <span
                      className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_DOT[row.status])}
                      title={row.statusLabel}
                    />
                    <span className="font-mono text-sm text-zinc-950">{row.ro}</span>
                  </span>
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3.5 align-top font-mono text-sm text-zinc-600 lg:table-cell">
                  {row.bay}
                </td>
                <td className="px-4 py-3.5 align-top">
                  <span className="block text-sm text-zinc-800">{row.vehicle}</span>
                  <span className="mt-0.5 block font-mono text-[11px] text-zinc-500">
                    {row.plate}
                  </span>
                  <span className="mt-0.5 block text-xs text-zinc-500 sm:hidden">{row.job}</span>
                </td>
                <td className="hidden px-4 py-3.5 align-top text-sm text-zinc-700 sm:table-cell">
                  {row.job}
                </td>
                <td className="px-4 py-3.5 align-top">
                  <ActorPill byZol={row.byZol}>{row.zolDid}</ActorPill>
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3.5 align-top text-sm text-zinc-600 lg:table-cell">
                  {row.waitingOn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
        Sample shop — illustrative data
      </p>
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-12 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-40">
      <div className="industrial-grid absolute inset-x-0 top-0 h-[56rem] opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto mb-6 inline-flex max-w-[92vw] items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase leading-5 tracking-[0.12em] text-emerald-700 shadow-sm backdrop-blur sm:text-xs sm:tracking-[0.18em]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 sm:h-2 sm:w-2" />
            Now onboarding independent shops
          </div>

          <h1 className="mx-auto max-w-3xl text-[clamp(2.5rem,7vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
            The best AI shop management tool for auto shops.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
            Don&apos;t let your competitors beat you with AI.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
            ZOL answers the phone after hours, texts estimates, chases approvals, and
            orders parts on its own. When you walk in, one board shows what it handled
            overnight and what still needs a person.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/request-access">
                Request access <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>
        </motion.div>

        <div id="board" className="w-full scroll-mt-28">
          <BoardShot />
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  return (
    <AnimatedSection className="py-12">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-zinc-200/80 bg-zinc-200/80 shadow-card lg:grid-cols-5">
        {boardStats.map((stat) => (
          <div key={stat.label} className="bg-white p-5">
            <Eyebrow>{stat.label}</Eyebrow>
            <p className="mt-3 font-mono text-3xl font-semibold tracking-tight text-zinc-950">
              {stat.value}
            </p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">{stat.hint}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}

function RecordSection() {
  return (
    <AnimatedSection id="how-it-works" className="scroll-mt-24 py-24">
      <SectionHeading
        eyebrow="01 — One record"
        title="One repair order, from the missed call to the lift."
        description="Nothing here was retyped into a second system. This is RO-4471 exactly as it happened — green is what ZOL did unattended, amber is where a person took over."
      />

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Vehicle card */}
        <div className="h-fit rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-card">
          <Eyebrow>Vehicle</Eyebrow>
          <p className="mt-3 text-lg font-semibold text-zinc-950">2018 Ford F-150 XLT</p>
          <dl className="mt-5 space-y-3 text-sm">
            {[
              ["Plate", "8XKR241"],
              ["VIN", "1FTEW1EP4JKD82910"],
              ["Mileage", "118,420"],
              ["Job", "Front brakes + rotors"],
              ["Bay", "2"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4">
                <dt className="text-zinc-500">{label}</dt>
                <dd className="text-right font-mono text-[13px] text-zinc-900">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
            <Eyebrow>Tech note</Eyebrow>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              Pedal pulse above 45 mph. Rotors measured below spec at 26.1mm. Rears
              still have ~40%.
            </p>
          </div>
          <div className="mt-5 flex items-baseline justify-between border-t border-zinc-200 pt-4">
            <span className="text-sm text-zinc-500">Approved total</span>
            <span className="font-mono text-xl font-semibold text-zinc-950">$742.18</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-card">
          <Eyebrow>Timeline</Eyebrow>
          <ol className="mt-5 space-y-0">
            {recordTimeline.map((event, index) => {
              const byZol = event.actor === "zol";
              const isLast = index === recordTimeline.length - 1;

              return (
                <li key={event.label} className="relative flex gap-4 pb-6 last:pb-0">
                  {!isLast ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-[11px] top-6 h-full w-px bg-zinc-200"
                    />
                  ) : null}
                  <span
                    className={cn(
                      "relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white ring-1",
                      byZol
                        ? "bg-emerald-50 ring-emerald-600/30"
                        : "bg-amber-50 ring-amber-600/30",
                    )}
                  >
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        byZol ? "bg-emerald-500" : "bg-amber-500",
                      )}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p className="text-sm font-semibold text-zinc-950">{event.label}</p>
                      <span className="font-mono text-[11px] text-zinc-400">{event.when}</span>
                      <span
                        className={cn(
                          "font-mono text-[10px] uppercase tracking-[0.14em]",
                          byZol ? "text-emerald-700" : "text-amber-700",
                        )}
                      >
                        {byZol ? "ZOL" : "Person"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-zinc-600">{event.detail}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </AnimatedSection>
  );
}

function AgentsSection() {
  return (
    <AnimatedSection className="py-24">
      <SectionHeading
        eyebrow="02 — The part that runs itself"
        title="The work your front desk never gets to."
        description="Not a chatbot bolted onto a calendar. Four jobs ZOL does end to end, and hands back the moment judgment is required."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {agents.map((agent) => (
          <div
            key={agent.title}
            className="flex flex-col rounded-3xl border border-zinc-200/80 bg-white p-7 shadow-card"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-600/20">
              <agent.icon className="h-5 w-5 text-emerald-700" />
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-zinc-950">
              {agent.title}
            </h3>
            <p className="mt-3 flex-1 text-sm leading-7 text-zinc-600">{agent.body}</p>
            <div className="mt-5 rounded-2xl bg-zinc-50 px-4 py-3">
              <Eyebrow>From the board</Eyebrow>
              <p className="mt-1.5 font-mono text-[12px] leading-5 text-zinc-700">
                {agent.proof}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}

function CompareSection() {
  return (
    <AnimatedSection id="compare" className="scroll-mt-24 py-24">
      <SectionHeading
        eyebrow="03 — The switch"
        title="What changes on the first day."
        description="Same shop, same techs, same labor rate. The difference is how much of the day survives contact with the phone."
      />

      <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-card">
        <div className="grid grid-cols-1 border-b border-zinc-200/80 sm:grid-cols-2">
          <div className="px-6 py-4">
            <Eyebrow>Most shops today</Eyebrow>
          </div>
          <div className="border-t border-zinc-200/80 bg-emerald-50/40 px-6 py-4 sm:border-l sm:border-t-0">
            <Eyebrow className="text-emerald-800">With ZOL</Eyebrow>
          </div>
        </div>

        {compareRows.map((row) => (
          <div
            key={row.before}
            className="grid grid-cols-1 border-b border-zinc-100 last:border-b-0 sm:grid-cols-2"
          >
            <div className="flex gap-3 px-6 py-5">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
              <p className="text-sm leading-6 text-zinc-600">{row.before}</p>
            </div>
            <div className="flex gap-3 bg-emerald-50/40 px-6 py-5 sm:border-l sm:border-zinc-100">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <p className="text-sm leading-6 text-zinc-800">{row.after}</p>
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}

function VisionSection() {
  return (
    <AnimatedSection id="vision" className="scroll-mt-24 py-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 px-6 py-16 shadow-premium sm:px-12 lg:py-20">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300">
            04 — Where this goes
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]">
            Every repair teaches the system how the work is actually done.
          </h2>
          <p className="mt-6 text-base leading-8 text-zinc-300 sm:text-lg">
            Running the front desk is how ZOL earns its place in the shop. What it
            builds underneath is the harder thing: a structured record of real repair
            procedures — the steps, the order they happen in, the state a part is in
            before and after, and what goes wrong when a step is skipped.
          </p>
          <p className="mt-5 text-base leading-8 text-zinc-300 sm:text-lg">
            That record is what turns into step-by-step guidance for a new tech today.
            It is also the training data physical AI needs to do this work tomorrow.
            No amount of text on the internet substitutes for it.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <Eyebrow className="text-zinc-400">Today</Eyebrow>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Guided procedures for new techs",
                  "Visual step verification",
                  "Remote expert assistance",
                  "Quality-control documentation",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-6 text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <Eyebrow className="text-zinc-400">Tomorrow</Eyebrow>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Embodied-AI training data",
                  "Robot task planning",
                  "Procedural benchmarks",
                  "Human-to-robot skill transfer",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-6 text-zinc-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function FinalCta() {
  return (
    <AnimatedSection className="pb-24">
      <div className="relative overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white px-6 py-16 text-center shadow-card sm:px-10">
        <Sparkles className="mx-auto mb-5 h-7 w-7 text-emerald-600" />
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          The phone rings whether or not anyone is there to answer it.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-zinc-600">
          ZOL is onboarding a small number of independent shops.
        </p>
        <div className="mt-8 flex justify-center">
          <Button size="lg" asChild>
            <Link href="/request-access">
              Request access <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </AnimatedSection>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <LogoMark />
          <div>
            <p className="text-lg font-bold tracking-tight text-zinc-950">ZOL</p>
            <p className="mt-1 text-sm text-zinc-500">
              AI shop management for independent auto shops
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 text-sm font-medium text-zinc-600">
          <a href="#" className="hover:text-zinc-950">
            Privacy
          </a>
          <a href="#" className="hover:text-zinc-950">
            Terms
          </a>
          <Link href="/request-access" className="hover:text-zinc-950">
            Contact
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl text-sm text-zinc-400">&copy; 2026 ZOL</div>
    </footer>
  );
}

export function ZolHomepage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
      <StatsStrip />
      <RecordSection />
      <AgentsSection />
      <CompareSection />
      <VisionSection />
      <FinalCta />
      <Footer />
    </main>
  );
}
