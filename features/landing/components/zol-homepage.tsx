"use client";

import { Show, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Check,
  ChevronDown,
  ClipboardList,
  DatabaseZap,
  Gauge,
  Headphones,
  History,
  Home,
  LucideIcon,
  Network,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UsersRound,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookDemoForm } from "@/features/landing/components/book-demo-form";
import { cn } from "@/lib/utils";

const navLinks = ["Platform", "Use Cases", "How It Works", "Demo", "Integrations"];

const trustIndicators = [
  "Answers calls and messages",
  "Remembers customer context",
  "Creates quotes or next steps",
  "Books appointments",
  "Triggers follow-up",
  "Works with existing tools",
];

const chaosCards = [
  {
    title: "Missed Calls Become Lost Revenue",
    body: "Busy teams, ringing phones, and after-hours questions create opportunities that disappear before anyone can act.",
    icon: Phone,
  },
  {
    title: "Front Desk Staff Juggle Too Much At Once",
    body: "Calls, appointments, estimates, order questions, team updates, and customer follow-ups all compete for attention.",
    icon: Headphones,
  },
  {
    title: "Work Details Get Lost Between Teams",
    body: "A customer concern turns into partial notes, verbal handoffs, and unclear next steps for the people doing the work.",
    icon: ClipboardList,
  },
  {
    title: "Customer History Lives In People's Memory",
    body: "The best context often sits in a staff member's head instead of a system the whole team can use.",
    icon: History,
  },
];

const workflowSteps = [
  "Customer Reaches Out",
  "ZOL Captures Context",
  "ZOL Takes The Next Step",
  "Calendar + Systems Update",
  "Follow-Up Continues",
];

const platformCards = [
  {
    title: "AI Call Handling",
    body: "Calls and messages become clean records your team can use.",
    icon: Headphones,
  },
  {
    title: "Customer Memory",
    body: "ZOL remembers previous purchases, visits, service requests, vehicles, and conversations.",
    icon: Brain,
  },
  {
    title: "Workflow Execution",
    body: "ZOL prepares estimates, schedules appointments, and routes work to the right people.",
    icon: Wrench,
  },
  {
    title: "Operational Visibility",
    body: "See callbacks, pending approvals, appointments, and open work without digging.",
    icon: Gauge,
  },
  {
    title: "Operational Intelligence Search",
    body: "Ask questions like: Which customers need follow-up? What work is waiting on approval?",
    icon: Search,
  },
  {
    title: "Integration Layer",
    body: "Moves context into systems like Tekmetric, Shopify, calendars, CRMs, and payment tools.",
    icon: Network,
  },
];

const searchPrompts = [
  "How many customers are waiting for callbacks?",
  "Which orders or estimates haven't been approved yet?",
  "What appointments or pickups are scheduled tomorrow?",
  "Which customers mentioned urgent issues this week?",
];

const useCases = [
  {
    title: "Auto Repair Shops",
    body: "Appointments, repair workflows, customer history, vehicle context, and follow-ups.",
    icon: Wrench,
  },
  {
    title: "Apparel Stores",
    body: "Customer communication, order support, returns, sizing questions, and Shopify-connected workflows.",
    icon: ShoppingBag,
  },
  {
    title: "Home Services",
    body: "Scheduling, customer intake, job details, callbacks, and post-service follow-ups.",
    icon: Home,
  },
  {
    title: "Customer-Service Businesses",
    body: "Communication organization, customer memory, workflow visibility, and operational handoffs.",
    icon: UsersRound,
  },
];

const integrations = [
  "Tekmetric",
  "Shopify",
  "Square",
  "Google Calendar",
  "Twilio",
  "HubSpot",
  "Stripe",
];

const dashboardCards = [
  ["Conversation records", "Action-ready notes from calls, messages, and customer requests."],
  ["Customer timelines", "Previous visits, open issues, orders, and service history."],
  ["Work histories", "Vehicle, order, or service context available before the customer arrives."],
  ["Calendar updates", "Requested times become confirmed slots when the workflow is ready."],
  ["Action items", "Estimate prep, order check, callback, or team handoff."],
  ["Follow-up actions", "ZOL keeps customers moving before work stalls."],
  ["Business signals", "Pending approvals, urgent callbacks, and missed opportunities."],
  ["Urgent issues", "High-priority customer needs surfaced before they get buried."],
  ["Team notifications", "The right people get context when something needs attention."],
];

const adoptionCards = [
  {
    title: "No complicated onboarding",
    body: "ZOL starts with the conversations your business already has every day.",
    icon: Check,
  },
  {
    title: "Works with existing workflows",
    body: "Your team keeps using familiar tools while ZOL coordinates the work around them.",
    icon: Network,
  },
  {
    title: "Designed for operational teams",
    body: "The product language is built around real customer requests, handoffs, and follow-through.",
    icon: ShieldCheck,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {children}
    </div>
  );
}

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
    <div
      className={cn(
        "mx-auto max-w-3xl",
        align === "center" ? "text-center" : "mx-0 text-left",
      )}
    >
      {eyebrow ? <SectionLabel>{eyebrow}</SectionLabel> : null}
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-8 text-zinc-600 sm:text-lg">
          {description}
        </p>
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
              key={link}
              href={`#${link.toLowerCase().replaceAll(" ", "-")}`}
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-white hover:text-zinc-950"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <Button size="sm" variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </Show>
          <Show when="signed-in">
            <Button size="sm" asChild>
              <Link href="/auth/continue">Profile</Link>
            </Button>
            <UserButton />
          </Show>
        </div>
      </nav>
    </header>
  );
}

function Waveform() {
  return (
    <div className="flex h-10 items-center gap-1.5">
      {Array.from({ length: 18 }).map((_, index) => (
        <motion.span
          key={index}
          className="w-1 rounded-full bg-emerald-400/85"
          animate={{
            height: [8, 24 + (index % 4) * 4, 10],
            opacity: [0.35, 1, 0.45],
          }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            delay: index * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function StatusPill({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      animate={{ opacity: [0.65, 1, 0.65] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
      {children}
    </motion.span>
  );
}

function MiniPanel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-3xl border border-white/10 bg-white/[0.06] p-4", className)}>
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
        {title}
      </p>
      {children}
    </div>
  );
}

function HeroDashboard() {
  const intelligence = [
    ["Tomorrow", "12 appointments"],
    ["Estimates", "3 pending"],
    ["Callbacks", "2 urgent"],
    ["Follow-up", "1 overdue"],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
      className="relative"
    >
      <div className="absolute -inset-8 rounded-[2.5rem] bg-emerald-500/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 p-3 text-white shadow-premium sm:p-4">
        <div className="mb-3 flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-3">
            <LogoMark className="h-8 w-8" />
            <div>
              <p className="text-sm font-semibold">ZOL Operations OS</p>
              <p className="text-xs text-zinc-400">Operational intelligence active</p>
            </div>
          </div>
          <StatusPill>Live</StatusPill>
        </div>

        <div className="grid gap-3 lg:grid-cols-[0.9fr_1.2fr_0.95fr]">
          <MiniPanel title="Live Incoming Call">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Sarah Mitchell</h3>
                <p className="text-sm text-zinc-300">2018 Toyota Camry</p>
              </div>
              <div className="rounded-2xl bg-black/25 p-3">
                <Waveform />
              </div>
              <div className="grid gap-3">
                <Metric label="Issue" value="Grinding noise while braking" />
                <Metric label="Urgency" value="High" accent />
                <Metric label="Status" value="AI Capturing Repair Details" />
              </div>
            </div>
          </MiniPanel>

          <MiniPanel title="AI Action Plan" className="bg-white text-zinc-950">
            <p className="text-sm leading-6 text-zinc-700">
              ZOL captures the request, prepares the right next step, books the
              appointment, and keeps the team informed.
            </p>
            <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Automated Next Steps
              </p>
              <ul className="space-y-3 text-sm text-zinc-700">
                {[
                  "Create quote or estimate when needed",
                  "Book the appointment on the calendar",
                  "Notify the team with customer context",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <motion.div
              className="mt-4 h-1.5 rounded-full bg-zinc-100"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              <div className="h-full w-3/4 rounded-full bg-emerald-500" />
            </motion.div>
          </MiniPanel>

          <MiniPanel title="Customer Memory">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-white">Previous Visits</p>
                <div className="mt-3 space-y-2 text-sm text-zinc-300">
                  <p>Oil Change - 3 months ago</p>
                  <p>Brake vibration inspection - 8 months ago</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Customer Notes
                </p>
                <p className="mt-2 text-sm text-zinc-200">Prefers text communication</p>
              </div>
            </div>
          </MiniPanel>
        </div>

        <div className="mt-3 rounded-3xl border border-white/10 bg-white/[0.06] p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Operations Intelligence
            </p>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
              Updated now
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {intelligence.map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-black/20 p-3">
                <p className="text-xs text-zinc-500">{label}</p>
                <p className="mt-1 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p className={cn("mt-1 text-sm font-semibold text-white", accent && "text-orange-300")}>
        {value}
      </p>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-28 lg:pt-40">
      <div className="industrial-grid absolute inset-x-0 top-0 h-[56rem] opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-10 sm:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-5xl text-center"
        >
          <div className="mx-auto mb-5 inline-flex max-w-[92vw] items-center justify-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase leading-5 tracking-[0.12em] text-emerald-700 shadow-sm backdrop-blur sm:mb-6 sm:text-xs sm:tracking-[0.18em]">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500 sm:h-2 sm:w-2" />
            Operational Intelligence For Customer-Facing Businesses
          </div>
          <h1 className="mx-auto max-w-4xl text-[clamp(2.5rem,7vw,4rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
            Your Business&apos;s First AI Employee
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
            ZOL answers calls, remembers customers, and turns conversations into
            organized operational intelligence.
            <span className="mx-auto mt-3 block max-w-xl text-sm font-medium leading-6 text-zinc-500 sm:text-base sm:leading-7">
              Reduce chaos, move faster, and keep every customer interaction
              connected.
            </span>
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <a href="#demo">
                Book Demo <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="mx-auto mt-7 grid max-w-4xl gap-3 text-left text-sm font-medium text-zinc-700 sm:grid-cols-2 lg:grid-cols-3">
            {trustIndicators.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {item}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm font-semibold text-zinc-500">
            No complicated setup. Works alongside your existing workflow.
          </p>
        </motion.div>

        <div className="w-full max-w-6xl">
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}

function ChaosSection() {
  return (
    <AnimatedSection>
      <SectionHeading
        eyebrow="The operating problem"
        title="Operational businesses run on conversations - but conversations get lost."
        description="Calls, notes, after-hours requests, team updates, and customer concerns create work that is easy to miss and hard to track."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {chaosCards.map((card, index) => (
          <FeatureCard
            key={card.title}
            title={card.title}
            body={card.body}
            icon={card.icon}
            index={index}
            darkIcon
          />
        ))}
      </div>
    </AnimatedSection>
  );
}

function WorkflowSection() {
  return (
    <AnimatedSection id="how-it-works" className="py-24">
      <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-premium sm:p-8 lg:p-12">
        <SectionHeading
          eyebrow="How it works"
          title="From customer request to completed next step."
          description="ZOL fits into the work your team already does: answer, capture, act, update, follow up."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-5">
          {workflowSteps.map((step, index) => (
            <div key={step} className="relative">
              <div className="h-full rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-sm font-semibold leading-6 text-zinc-950">{step}</p>
              </div>
              {index < workflowSteps.length - 1 ? (
                <ChevronDown className="absolute -bottom-3 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-white text-zinc-300 md:-right-3 md:left-auto md:top-1/2 md:-translate-y-1/2 md:rotate-[-90deg]" />
              ) : null}
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-lg leading-8 text-zinc-600">
          The result is simple: fewer dropped requests, cleaner handoffs, and customers
          who hear back without your team chasing every thread manually.
        </p>
      </div>
    </AnimatedSection>
  );
}

function FeatureCard({
  title,
  body,
  icon: Icon,
  index,
  darkIcon = false,
}: {
  title: string;
  body: string;
  icon: LucideIcon;
  index: number;
  darkIcon?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
    >
      <Card className="h-full p-6">
        <div
          className={cn(
            "mb-6 flex h-12 w-12 items-center justify-center rounded-2xl",
            darkIcon ? "bg-zinc-950 text-white" : "bg-emerald-50 text-emerald-700",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-950">{title}</h3>
        <p className="mt-4 text-sm leading-7 text-zinc-600">{body}</p>
      </Card>
    </motion.div>
  );
}

function PlatformSection() {
  return (
    <AnimatedSection id="platform">
      <SectionHeading
        eyebrow="Platform"
        title="More than call handling."
        description="ZOL gives customer-facing teams a shared layer for context, next steps, and visibility."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {platformCards.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            body={feature.body}
            icon={feature.icon}
            index={index}
          />
        ))}
      </div>
    </AnimatedSection>
  );
}

function UseCasesSection() {
  return (
    <AnimatedSection id="use-cases">
      <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-premium sm:p-8 lg:p-12">
        <SectionHeading
          eyebrow="Use cases"
          title="Built For Operational Businesses."
          description="ZOL adapts to the context, tools, and handoffs behind each type of customer-facing work."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {useCases.map((useCase, index) => (
            <FeatureCard
              key={useCase.title}
              title={useCase.title}
              body={useCase.body}
              icon={useCase.icon}
              index={index}
              darkIcon={index === 0}
            />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function MemorySection() {
  const examples = [
    {
      customer: "My brakes are making noise again.",
      zol: "I see your Honda Accord previously came in for brake vibration issues three months ago. Has the issue gotten worse recently?",
    },
    {
      customer: "I think I spoke with someone last week.",
      zol: "Yes - you called about an oil leak inspection for your Ford F-150. Would you like me to continue helping with that appointment request?",
    },
  ];

  return (
    <AnimatedSection className="py-24">
      <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr]">
        <SectionHeading
          align="left"
          eyebrow="Core moat"
          title="ZOL remembers every customer, order, vehicle, and conversation."
          description="Every interaction adds context your team can use later."
        />
        <Card className="overflow-hidden p-0">
          <div className="border-b border-zinc-200 bg-zinc-950 px-6 py-4 text-white">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold">Operational memory examples</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                Memory active
              </span>
            </div>
          </div>
          <div className="space-y-6 p-6 sm:p-8">
            {examples.map((example, index) => (
              <div key={example.customer} className="space-y-4">
                <div className="max-w-[86%] rounded-3xl rounded-tl-md bg-zinc-100 p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    Customer
                  </p>
                  <p className="text-base font-medium text-zinc-950">
                    &quot;{example.customer}&quot;
                  </p>
                </div>
                <motion.div
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.14 }}
                  className="ml-auto max-w-[90%] rounded-3xl rounded-tr-md bg-emerald-600 p-5 text-white"
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                    ZOL
                  </p>
                  <p className="text-base font-medium leading-7">
                    &quot;{example.zol}&quot;
                  </p>
                </motion.div>
              </div>
            ))}
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-sm leading-7 text-zinc-600">
                ZOL helps teams respond with context instead of asking customers to
                repeat themselves.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AnimatedSection>
  );
}

function ShopIntelligenceSection() {
  return (
    <AnimatedSection className="py-24">
      <div className="rounded-[2rem] border border-zinc-200 bg-zinc-950 p-6 text-white shadow-premium sm:p-8 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <SectionHeading
            align="left"
            eyebrow="Operational intelligence"
            title="Your business becomes searchable."
            description="Owners and teams can ask direct questions instead of hunting through calls, notes, and tools."
          />
          <div className="space-y-3">
            {searchPrompts.map((prompt, index) => (
              <motion.div
                key={prompt}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.06] p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                  <Search className="h-5 w-5" />
                </span>
                <p className="text-sm font-medium text-zinc-100">&quot;{prompt}&quot;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function IntegrationsSection() {
  return (
    <AnimatedSection id="integrations">
      <SectionHeading
        eyebrow="Integrations"
        title="Built to work alongside your existing systems."
        description="Works alongside the tools your business already uses."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card
            key={integration}
            className="flex items-center justify-between p-6 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                <DatabaseZap className="h-5 w-5" />
              </span>
              <p className="text-lg font-semibold text-zinc-950">{integration}</p>
            </div>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
              Layer
            </span>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  );
}

function DashboardPreviewSection() {
  return (
    <AnimatedSection className="py-24">
      <SectionHeading
        eyebrow="Operational center"
        title="The work stays organized automatically."
        description="A single view for customer context, appointments, orders, follow-up, approvals, and urgent work."
      />
      <div className="mt-12 rounded-[2rem] border border-zinc-200 bg-zinc-950 p-4 shadow-premium sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Operations dashboard</p>
            <p className="mt-1 text-sm text-zinc-400">
              Customer context, next steps, and team visibility in one place
            </p>
          </div>
          <span className="w-fit rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
            Live business context
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dashboardCards.map(([title, body]) => (
            <div key={title} className="rounded-3xl bg-white p-5">
              <p className="text-sm font-semibold text-zinc-950">{title}</p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function AdoptionSection() {
  return (
    <AnimatedSection>
      <SectionHeading
        eyebrow="Adoption"
        title="Easy for operational teams to adopt."
        description="Your team keeps working normally. ZOL handles the capture, coordination, and follow-through around them."
      />
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {adoptionCards.map((card, index) => (
          <FeatureCard
            key={card.title}
            title={card.title}
            body={card.body}
            icon={card.icon}
            index={index}
            darkIcon
          />
        ))}
      </div>
    </AnimatedSection>
  );
}

function DemoSection() {
  return (
    <AnimatedSection id="demo" className="py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Demo"
          title="Book a demo with ZOL."
          description="Tell us about your business and we will reach out to schedule a walkthrough."
        />
        <Card className="mt-12 p-6 sm:p-8">
          <BookDemoForm />
        </Card>
      </div>
    </AnimatedSection>
  );
}

function FinalCta() {
  return (
    <AnimatedSection className="pb-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 px-6 py-16 text-center shadow-premium sm:px-10 lg:py-20">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl">
          <Sparkles className="mx-auto mb-5 h-7 w-7 text-emerald-300" />
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            The next generation of operational businesses will run on AI employee infrastructure.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            ZOL helps customer-facing teams organize communication, reduce chaos, and
            operate with real-time intelligence.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="accent" asChild>
              <a href="#demo">
                Book Demo <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
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
              AI employee platform for operational businesses
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
          <a href="#" className="hover:text-zinc-950">
            Contact
          </a>
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
      <ChaosSection />
      <WorkflowSection />
      <PlatformSection />
      <UseCasesSection />
      <MemorySection />
      <ShopIntelligenceSection />
      <IntegrationsSection />
      <DashboardPreviewSection />
      <AdoptionSection />
      <DemoSection />
      <FinalCta />
      <Footer />
    </main>
  );
}
