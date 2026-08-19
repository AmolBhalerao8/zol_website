"use client";

import { Show } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarRange,
  ClipboardList,
  LayoutGrid,
  MessageSquareText,
  Package,
  PhoneCall,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ZolProfileMenu } from "@/features/auth/components/zol-profile-menu";
import { cn } from "@/lib/utils";

/**
 * Product-first landing page, set as a shop work order: Archivo for display,
 * JetBrains Mono for anything that would be printed on a ticket (RO numbers,
 * plates, VINs, times), Inter for prose. Board data mirrors `lib/mock` so the
 * marketing surface and the `(app)` surface tell the same story, but the
 * strings are inlined -- `lib/mock` derives timestamps at module load, which
 * would not survive hydration in a client component.
 */

/** TODO: swap for the real Cal.com / Calendly link. */
const CALENDAR_URL = "/request-access";

/**
 * Shop photograph for the hero. Drop a licensed image at `public/hero-shop.jpg`
 * and set this to "/hero-shop.jpg" -- the board panel below is the stand-in
 * until then. Landscape, roughly 3:2, subject weighted to the right so the
 * diagonal does not cut across faces.
 */
const HERO_IMAGE: string | null = null;

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Software", href: "#software" },
  { label: "Compare", href: "#compare" },
  { label: "Vision", href: "#vision" },
];

const heroPoints = [
  "Answers every call, night and weekend",
  "Texts estimates and chases approvals",
  "Orders parts and flags vendor delays",
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

/**
 * A real sequence with real clock times, which is the only place on this page
 * where numbered markers carry information.
 */
const flowSteps = [
  {
    step: "01",
    time: "9:41 PM",
    name: "The call",
    body: "The phone rings four hours after close and ZOL picks up. It takes the complaint, the vehicle, and how the customer wants to be reached, then books the slot. Missed calls get transcribed and called back.",
    proof: "2m18s · complaint, VIN, and callback captured",
    byZol: true,
  },
  {
    step: "02",
    time: "7:12 AM",
    name: "Diagnosis",
    body: "The call is already a repair order before anyone unlocks the door. When the tech finishes the scan, the codes and findings attach to that same record.",
    proof: "P0455 · smoke test found the purge valve stuck open",
    byZol: false,
  },
  {
    step: "03",
    time: "8:30 AM",
    name: "The quote",
    body: "The estimate goes out by text with a photo of the failed part and the reasoning in plain English. If nobody replies, ZOL nudges once, then stops and hands it to a person.",
    proof: "$742.18 texted · approved by reply in 4 minutes",
    byZol: true,
  },
  {
    step: "04",
    time: "4:20 PM",
    name: "Invoice and follow-up",
    body: "The customer gets told the car is done, with the total. The invoice goes out by text, payment happens at your counter, and the follow-up that brings them back is handled for you.",
    proof: "Ready notice texted · invoice sent · follow-up scheduled",
    byZol: true,
  },
];

/** RO-4471, oldest first so the section reads top-to-bottom as it happened. */
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
    title: "It chases approvals",
    body: "The estimate goes out with a photo of the failed part and plain-English reasoning. If nobody replies, ZOL sends one nudge — then stops and flags it for a person.",
    proof: "No reply after 20h — one nudge sent, then paused",
  },
  {
    icon: Package,
    title: "It catches parts delays",
    body: "Parts get ordered against the approved estimate. When a vendor pushes an ETA, ZOL surfaces the bay conflict before the car is stuck on a lift.",
    proof: "Vendor moved ETA to Thursday — bay 4 conflict flagged",
  },
];

/** Mirrors the four surfaces in the (app) rail. */
const modules = [
  {
    icon: LayoutGrid,
    name: "Board",
    body: "Every open repair order, the bay it is in, and who it is waiting on.",
  },
  {
    icon: ClipboardList,
    name: "Repair orders",
    body: "Labor, parts, notes, and the full timeline on one record.",
  },
  {
    icon: CalendarRange,
    name: "Schedule",
    body: "Bays across the week, with vendor delays shown as conflicts.",
  },
  {
    icon: Package,
    name: "Parts",
    body: "Purchase orders and back-orders, flagged against the job they delay.",
  },
];

const integrations = [
  { name: "Tekmetric", body: "Customers, vehicles, and repair orders sync both ways." },
  { name: "Shopmonkey", body: "Same two-way sync, one record on both sides." },
];

/**
 * Compared against the category rather than vendor by vendor: every cell below
 * is a claim about ZOL, not an assertion about a named competitor's feature set
 * or pricing.
 */
const competitors = ["Tekmetric", "Shopmonkey", "Shop-Ware", "Mitchell 1", "AutoLeap"];

const competitorRows: Array<{ capability: string; them: string; zol: string }> = [
  {
    capability: "After-hours phone",
    them: "Voicemail, or a separate answering service",
    zol: "Built-in AI agent answers, triages, and books",
  },
  {
    capability: "Inbound texts",
    them: "Answered by a person, when one is free",
    zol: "Answered unattended in seconds, around the clock",
  },
  {
    capability: "Estimate approvals",
    them: "Chased manually by the service writer",
    zol: "Sent, followed up once, then escalated to a person",
  },
  {
    capability: "Parts delays",
    them: "Surface when someone checks the order",
    zol: "Flagged against the bay schedule automatically",
  },
  {
    capability: "Getting started",
    them: "Migrate your shop onto a new system",
    zol: "Runs on top of the system you already use",
  },
  {
    capability: "Shop procedures",
    them: "Learned by shadowing a senior tech",
    zol: "Captured once, then guided step by step",
  },
];

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
    <section
      id={id}
      className={cn("mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:py-28", className)}
    >
      {children}
    </section>
  );
}

/** Uppercase mono label. The page's utility voice. */
function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Section headers are set as a ledger entry: rule, mono label, display title on
 * the left, and the explanation held to a narrow measure on the right.
 */
function SectionHead({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="rule border-t pt-6">
      <Kicker>{kicker}</Kicker>
      <div className="mt-5 grid gap-x-12 gap-y-5 lg:grid-cols-[1.15fr_1fr] lg:items-end">
        <h2 className="whitespace-pre-line font-display text-[clamp(2rem,4.4vw,3.25rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-zinc-950">
          {title}
        </h2>
        {description ? (
          <p className="max-w-xl text-[15px] leading-7 text-zinc-600 lg:pb-2">{description}</p>
        ) : null}
      </div>
    </header>
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
      className={cn("h-9 w-9 rounded-full object-cover ring-1 ring-black/5", className)}
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

  /** Unscrolled, the bar sits over the dark hero and has to invert. */
  const onDark = !scrolled;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        className={cn(
          "flex items-center justify-between border-b px-5 py-3.5 transition-colors duration-300 sm:px-8",
          scrolled
            ? "border-zinc-950/10 bg-[#f7f4ee]/90 backdrop-blur-xl"
            : "border-white/10 bg-transparent",
        )}
      >
        <a href="#" className="flex items-center gap-2.5" aria-label="ZOL home">
          <LogoMark />
          <span
            className={cn(
              "font-display text-xl font-extrabold uppercase tracking-[-0.02em] transition-colors",
              onDark ? "text-white" : "text-zinc-950",
            )}
          >
            ZOL
          </span>
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "font-mono text-[11px] uppercase tracking-[0.16em] transition-colors",
                onDark ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-950",
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <Button
              size="sm"
              variant="ghost"
              className={onDark ? "text-zinc-200 hover:bg-white/10 hover:text-white" : undefined}
              asChild
            >
              <Link href={CALENDAR_URL}>My calendar</Link>
            </Button>
            <Button size="sm" variant={onDark ? "accent" : "default"} asChild>
              <Link href="/request-access">Book a demo</Link>
            </Button>
          </Show>
          <Show when="signed-in">
            <Button size="sm" variant={onDark ? "accent" : "default"} asChild>
              <Link href="/auth/continue">Profile</Link>
            </Button>
            <ZolProfileMenu />
          </Show>
        </div>
      </nav>
    </header>
  );
}

/**
 * The page's signature mark. A filled square reads as a status lamp on a shop
 * panel; emerald means ZOL acted unattended, amber means a person is the
 * blocker. Same contract as the `(app)` surface.
 */
function ActorMark({ byZol }: { byZol: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn("mt-[5px] h-2 w-2 shrink-0", byZol ? "bg-emerald-600" : "bg-amber-600")}
    />
  );
}

function ActorTag({ children, byZol }: { children: React.ReactNode; byZol: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] leading-4",
        byZol ? "text-emerald-800" : "text-amber-800",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-2 w-2 shrink-0", byZol ? "bg-emerald-600" : "bg-amber-600")}
      />
      {children}
    </span>
  );
}

const STATUS_MARK: Record<BoardStatus, string> = {
  "in-bay": "bg-emerald-600",
  "waiting-customer": "bg-amber-600",
  "waiting-parts": "bg-amber-600",
  ready: "bg-zinc-400",
};

function BoardChrome() {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-950/10 bg-white px-4 py-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-2.5">
        <LogoMark className="h-6 w-6" />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-zinc-950">Fifth Street Auto</p>
          <p className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
            Bakersfield, CA · 6 bays
          </p>
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-800">
        <span aria-hidden="true" className="app-led h-2 w-2 bg-emerald-600" />
        Live
      </span>
    </div>
  );
}

/** Narrow board panel for the hero. Bleeds past the grid on large screens. */
function CompactBoard() {
  return (
    <div className="hero-rise-delayed relative w-full">
      <div className="overflow-hidden rounded-xl border border-zinc-950/10 bg-white shadow-premium">
        <BoardChrome />
        <ul>
          {boardRows.slice(0, 5).map((row) => (
            <li
              key={row.ro}
              className="flex items-start gap-3 border-b border-zinc-950/[0.07] px-4 py-3 last:border-b-0 sm:px-5"
            >
              <span
                aria-hidden="true"
                className={cn("mt-[7px] h-2 w-2 shrink-0", STATUS_MARK[row.status])}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2.5">
                  <span className="tnum font-mono text-[12px] text-zinc-950">{row.ro}</span>
                  <span className="truncate text-[13px] text-zinc-700">{row.vehicle}</span>
                </div>
                <p
                  className={cn(
                    "mt-1 font-mono text-[11px]",
                    row.byZol ? "text-emerald-800" : "text-amber-800",
                  )}
                >
                  {row.zolDid}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
        Sample shop — illustrative data
      </p>
    </div>
  );
}

/** Full board for the software section. */
function BoardShot() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-950/10 bg-white shadow-card">
      <BoardChrome />

      <div className="flex gap-5 overflow-x-auto border-b border-zinc-950/10 px-4 py-3 sm:px-5">
        {boardFilters.map((chip) => (
          <span
            key={chip.label}
            className={cn(
              "inline-flex shrink-0 items-baseline gap-1.5 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em]",
              chip.active
                ? "border-b-2 border-zinc-950 pb-0.5 text-zinc-950"
                : "pb-0.5 text-zinc-400",
            )}
          >
            {chip.label}
            <span className="tnum text-[10px] text-zinc-400">{chip.count}</span>
          </span>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-950/10">
              {["RO", "Bay", "Vehicle", "Job", "ZOL did", "Waiting on"].map((head, index) => (
                <th
                  key={head}
                  className={cn(
                    "whitespace-nowrap px-4 py-2.5 font-mono text-[10px] font-normal uppercase tracking-[0.16em] text-zinc-400 sm:px-5",
                    index === 1 && "hidden lg:table-cell",
                    index === 3 && "hidden sm:table-cell",
                    index === 5 && "hidden lg:table-cell",
                  )}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {boardRows.map((row) => (
              <tr key={row.ro} className="border-b border-zinc-950/[0.07] last:border-b-0">
                <td className="whitespace-nowrap px-4 py-3.5 align-top sm:px-5">
                  <span className="flex items-start gap-2.5">
                    <span
                      aria-hidden="true"
                      className={cn("mt-[5px] h-2 w-2 shrink-0", STATUS_MARK[row.status])}
                      title={row.statusLabel}
                    />
                    <span className="tnum font-mono text-[13px] text-zinc-950">{row.ro}</span>
                  </span>
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3.5 align-top font-mono text-[13px] text-zinc-500 lg:table-cell">
                  {row.bay}
                </td>
                <td className="px-4 py-3.5 align-top">
                  <span className="block whitespace-nowrap text-[13px] text-zinc-800">
                    {row.vehicle}
                  </span>
                  <span className="mt-0.5 block font-mono text-[11px] text-zinc-500">
                    {row.plate}
                  </span>
                  <span className="mt-0.5 block text-xs text-zinc-500 sm:hidden">{row.job}</span>
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3.5 align-top text-[13px] text-zinc-600 sm:table-cell">
                  {row.job}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 align-top">
                  <ActorTag byZol={row.byZol}>{row.zolDid}</ActorTag>
                </td>
                <td className="hidden whitespace-nowrap px-4 py-3.5 align-top text-[13px] text-zinc-500 lg:table-cell">
                  {row.waitingOn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-zinc-950">
      <div className="mx-auto grid max-w-[110rem] items-stretch lg:grid-cols-[1.06fr_0.94fr]">
        <div className="hero-rise px-5 pb-14 pt-28 sm:px-8 sm:pt-32 lg:py-32 lg:pl-[5vw] lg:pr-14">
          <Kicker className="text-emerald-400">The best AI</Kicker>

          <h1 className="mt-4 font-display text-[clamp(2.9rem,6.4vw,5.25rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.035em] text-white">
            Auto repair
            <br />
            software
          </h1>

          <p className="mt-6 max-w-md text-lg leading-8 text-zinc-300">
            Don&apos;t let your competitors beat you with AI.
          </p>

          <ul className="mt-8 max-w-md border-t border-white/15">
            {heroPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 border-b border-white/15 py-3 text-[15px] leading-6 text-zinc-300"
              >
                <span aria-hidden="true" className="mt-[7px] h-2 w-2 shrink-0 bg-emerald-500" />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" variant="accent" asChild>
              <Link href="/request-access">
                Book a demo <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href={CALENDAR_URL}>My calendar</Link>
            </Button>
          </div>
        </div>

        {/* Emerald diagonal, then the plate it edges. Straight on small screens. */}
        <div className="relative min-h-[19rem] sm:min-h-[24rem] lg:min-h-[42rem]">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-emerald-500 lg:[clip-path:polygon(9%_0,100%_0,100%_100%,0_100%)]"
          />
          <div className="absolute inset-0 overflow-hidden bg-zinc-900 lg:[clip-path:polygon(11.5%_0,100%_0,100%_100%,2.5%_100%)]">
            {HERO_IMAGE ? (
              <Image
                src={HERO_IMAGE}
                alt="Technicians and a service writer on the floor of an independent auto shop"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center px-5 py-10 sm:px-8 lg:py-14 lg:pl-[15%] lg:pr-12">
                <CompactBoard />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  return (
    <AnimatedSection className="py-10 lg:py-12">
      <div className="rule grid grid-cols-2 border-t sm:grid-cols-3 lg:grid-cols-5">
        {boardStats.map((stat) => (
          <div key={stat.label} className="rule border-b border-r px-5 py-6 last:border-r-0">
            <Kicker className="text-[10px]">{stat.label}</Kicker>
            <p className="tnum mt-3 font-display text-4xl font-extrabold tracking-[-0.03em] text-zinc-950">
              {stat.value}
            </p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">{stat.hint}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
        A day on the sample shop board — illustrative data
      </p>
    </AnimatedSection>
  );
}

/**
 * The job as a ledger. This is the one sequence on the page, so it is the one
 * place numbered markers and clock times earn their keep.
 */
function FlowSection() {
  return (
    <AnimatedSection id="how-it-works" className="scroll-mt-20">
      <SectionHead
        kicker="How it works"
        title={"From the missed call\nto the follow-up"}
        description="One job, start to finish, on a Tuesday. ZOL runs the green lines unattended and hands you the rest."
      />

      <ol className="mt-14">
        {flowSteps.map((step) => (
          <li
            key={step.step}
            className="rule grid gap-x-10 gap-y-4 border-b py-8 md:grid-cols-[8rem_minmax(0,1fr)_15rem] lg:py-10"
          >
            <div className="flex items-baseline gap-4 md:block">
              <span className="tnum font-mono text-[11px] tracking-[0.16em] text-zinc-400">
                {step.step}
              </span>
              <span className="tnum font-mono text-[13px] text-zinc-950 md:mt-2 md:block">
                {step.time}
              </span>
            </div>

            <div>
              <h3 className="font-display text-2xl font-bold uppercase tracking-[-0.02em] text-zinc-950 sm:text-[1.75rem]">
                {step.name}
              </h3>
              <p className="mt-3 max-w-xl text-[15px] leading-7 text-zinc-600">{step.body}</p>
            </div>

            <div className="md:pt-1.5">
              <ActorTag byZol={step.byZol}>{step.byZol ? "ZOL" : "Your tech"}</ActorTag>
              <p className="mt-2 font-mono text-[11px] leading-5 text-zinc-500">{step.proof}</p>
            </div>
          </li>
        ))}
      </ol>
    </AnimatedSection>
  );
}

function RecordSection() {
  return (
    <AnimatedSection>
      <SectionHead
        kicker="One record"
        title={"Everything on\none ticket"}
        description="Nothing here was retyped into a second system. This is RO-4471 as it happened — emerald is what ZOL did unattended, amber is where a person took over."
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="rule h-fit border-t pt-6">
          <Kicker>Vehicle</Kicker>
          <p className="mt-4 font-display text-2xl font-bold uppercase tracking-[-0.02em] text-zinc-950">
            2018 Ford F-150 XLT
          </p>
          <dl className="mt-6">
            {[
              ["Plate", "8XKR241"],
              ["VIN", "1FTEW1EP4JKD82910"],
              ["Mileage", "118,420"],
              ["Job", "Front brakes + rotors"],
              ["Bay", "2"],
            ].map(([label, value]) => (
              <div key={label} className="rule flex items-baseline justify-between gap-4 border-b py-2.5">
                <dt className="text-sm text-zinc-500">{label}</dt>
                <dd className="tnum text-right font-mono text-[12px] text-zinc-900">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-sm leading-6 text-zinc-600">
            Pedal pulse above 45 mph. Rotors measured below spec at 26.1mm. Rears still
            have ~40%.
          </p>

          <div className="rule mt-6 flex items-baseline justify-between border-t pt-4">
            <span className="text-sm text-zinc-500">Approved total</span>
            <span className="tnum font-display text-2xl font-extrabold tracking-[-0.02em] text-zinc-950">
              $742.18
            </span>
          </div>
        </div>

        <div className="rule border-t pt-6">
          <Kicker>Timeline</Kicker>
          <ol className="mt-5">
            {recordTimeline.map((event) => {
              const byZol = event.actor === "zol";

              return (
                <li key={event.label} className="rule flex gap-4 border-b py-4 sm:gap-6">
                  <ActorMark byZol={byZol} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <p className="text-[15px] font-semibold text-zinc-950">{event.label}</p>
                      <span className="tnum font-mono text-[11px] text-zinc-400">
                        {event.when}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-zinc-600">{event.detail}</p>
                  </div>
                  <span
                    className={cn(
                      "hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] sm:block",
                      byZol ? "text-emerald-700" : "text-amber-700",
                    )}
                  >
                    {byZol ? "ZOL" : "Person"}
                  </span>
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
    <AnimatedSection>
      <SectionHead
        kicker="Runs itself"
        title={"The work your front\ndesk never gets to"}
        description="Not a chatbot bolted onto a calendar. Four jobs ZOL does end to end, and hands back the moment judgment is required."
      />

      <div className="rule mt-14 grid border-t sm:grid-cols-2">
        {agents.map((agent) => (
          <div key={agent.title} className="rule border-b px-0 py-8 sm:odd:border-r sm:odd:pr-10 sm:even:pl-10">
            <agent.icon aria-hidden="true" className="h-5 w-5 text-emerald-700" />
            <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-[-0.02em] text-zinc-950">
              {agent.title}
            </h3>
            <p className="mt-3 max-w-lg text-[15px] leading-7 text-zinc-600">{agent.body}</p>
            <p className="mt-4 font-mono text-[11px] leading-5 text-zinc-500">{agent.proof}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}

function SoftwareSection() {
  return (
    <AnimatedSection id="software" className="scroll-mt-20">
      <SectionHead
        kicker="The software"
        title={"Run every job\nfrom one screen"}
        description="Four surfaces over one record. Nothing gets retyped from the board into the ticket, or from the ticket into the parts order."
      />

      <div className="mt-14">
        <BoardShot />
      </div>

      <div className="rule mt-12 grid border-t sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((item) => (
          <div key={item.name} className="rule border-b py-6 lg:border-r lg:px-6 lg:last:border-r-0 lg:first:pl-0">
            <item.icon aria-hidden="true" className="h-5 w-5 text-zinc-950" />
            <h3 className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-950">
              {item.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{item.body}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}

function IntegrationsSection() {
  return (
    <AnimatedSection>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="rule border-t pt-6">
          <Kicker>No rip and replace</Kicker>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.4vw,3.25rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-zinc-950">
            Keep the system
            <br />
            you already run
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-7 text-zinc-600">
            ZOL sits on top of your shop management software instead of replacing it.
            Customers, vehicles, and repair orders stay in sync, so your writers keep
            working where they already work while ZOL takes the phone and the follow-up.
          </p>
        </div>

        <div className="rule border-t pt-6 lg:pt-16">
          {integrations.map((item) => (
            <div key={item.name} className="rule flex items-start justify-between gap-6 border-b py-5">
              <div className="min-w-0">
                <p className="font-display text-lg font-bold uppercase tracking-[-0.01em] text-zinc-950">
                  {item.name}
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{item.body}</p>
              </div>
              <span className="shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                Two-way sync
              </span>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function CompareSection() {
  return (
    <AnimatedSection id="compare" className="scroll-mt-20">
      <SectionHead
        kicker="The switch"
        title={"How ZOL\nis different"}
        description="Shops run on Tekmetric, Shopmonkey, Shop-Ware, Mitchell 1, or AutoLeap. Those systems record the work. ZOL does the work nobody has time for, and leaves your system in place."
      />

      <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
        {competitors.map((name) => (
          <span
            key={name}
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400"
          >
            {name}
          </span>
        ))}
      </div>

      <div className="rule mt-8 border-t">
        <div className="hidden grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-10 py-3 sm:grid">
          <span />
          <Kicker className="text-[10px]">Shop management software</Kicker>
          <Kicker className="text-[10px] text-emerald-800">With ZOL on top</Kicker>
        </div>

        {competitorRows.map((row) => (
          <div
            key={row.capability}
            className="rule grid gap-x-10 gap-y-2 border-t py-5 sm:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)]"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-950">
              {row.capability}
            </p>
            <p className="text-[15px] leading-7 text-zinc-500">{row.them}</p>
            <p className="flex gap-3 text-[15px] leading-7 text-zinc-900">
              <span aria-hidden="true" className="mt-[9px] h-2 w-2 shrink-0 bg-emerald-600" />
              {row.zol}
            </p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}

function VisionSection() {
  return (
    <AnimatedSection id="vision" className="scroll-mt-20">
      <div className="relative overflow-hidden rounded-xl bg-zinc-950 px-6 py-16 sm:px-12 lg:px-16 lg:py-24">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="relative">
          <Kicker className="text-emerald-400">Where this goes</Kicker>

          <h2 className="mt-5 max-w-4xl font-display text-[clamp(2rem,4.4vw,3.25rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-white">
            Every repair teaches the system how the work is done
          </h2>

          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <p className="text-[15px] leading-8 text-zinc-400">
              Running the front desk is how ZOL earns its place in the shop. What it
              builds underneath is the harder thing: a structured record of real repair
              procedures — the steps, the order they happen in, the state a part is in
              before and after, and what goes wrong when a step is skipped.
            </p>
            <p className="text-[15px] leading-8 text-zinc-400">
              That record is what turns into step-by-step guidance for a new tech today.
              It is also the training data physical AI needs to do this work tomorrow.
              No amount of text on the internet substitutes for it.
            </p>
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:gap-16">
            {[
              {
                label: "Today",
                items: [
                  "Guided procedures for new techs",
                  "Visual step verification",
                  "Remote expert assistance",
                  "Quality-control documentation",
                ],
              },
              {
                label: "Tomorrow",
                items: [
                  "Embodied-AI training data",
                  "Robot task planning",
                  "Procedural benchmarks",
                  "Human-to-robot skill transfer",
                ],
              },
            ].map((column) => (
              <div key={column.label} className="border-t border-white/15 pt-5">
                <Kicker className="text-zinc-500">{column.label}</Kicker>
                <ul className="mt-4">
                  {column.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 border-b border-white/10 py-3 text-sm leading-6 text-zinc-300"
                    >
                      <span aria-hidden="true" className="mt-[7px] h-2 w-2 shrink-0 bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function FinalCta() {
  return (
    <AnimatedSection className="pb-24">
      <div className="rule border-t pt-14">
        <h2 className="max-w-3xl font-display text-[clamp(2rem,4.8vw,3.5rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-zinc-950">
          The phone rings whether anyone is there to answer it
        </h2>
        <p className="mt-6 max-w-md text-[15px] leading-7 text-zinc-600">
          ZOL is onboarding a small number of independent shops.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/request-access">
              Book a demo <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <Link href={CALENDAR_URL}>My calendar</Link>
          </Button>
        </div>
      </div>
    </AnimatedSection>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-950/10 px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-7 w-7" />
          <span className="font-display text-lg font-extrabold uppercase tracking-[-0.02em] text-zinc-950">
            ZOL
          </span>
          <span className="ml-2 text-sm text-zinc-500">
            AI shop management for independent auto shops
          </span>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          {[
            { label: "Sign in", href: "/sign-in" },
            { label: "Privacy", href: "#" },
            { label: "Terms", href: "#" },
            { label: "Contact", href: "/request-access" },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500 transition-colors hover:text-zinc-950"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
        &copy; 2026 ZOL
      </div>
    </footer>
  );
}

export function ZolHomepage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <StatsStrip />
      <FlowSection />
      <RecordSection />
      <AgentsSection />
      <SoftwareSection />
      <IntegrationsSection />
      <CompareSection />
      <VisionSection />
      <FinalCta />
      <Footer />
    </main>
  );
}
