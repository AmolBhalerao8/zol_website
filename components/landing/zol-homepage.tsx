"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  Check,
  ChevronRight,
  ClipboardList,
  Clock3,
  Headphones,
  History,
  ListChecks,
  MessageSquareText,
  Mic2,
  Phone,
  Play,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const navLinks = ["How It Works", "Features", "Demo", "Why ZOL"];

const trustIndicators = [
  "Answers calls 24/7",
  "Built for auto repair shops",
  "Captures repair issues instantly",
  "Creates organized AI summaries",
  "Remembers customer history",
];

const problemCards = [
  {
    title: "Missed Calls",
    body: "When technicians are busy and phones keep ringing, repair opportunities disappear.",
    icon: Phone,
  },
  {
    title: "Lost Information",
    body: "Customer issues get written on sticky notes, forgotten, or miscommunicated.",
    icon: ClipboardList,
  },
  {
    title: "After-Hours Gaps",
    body: "Customers still call after closing time, but most shops stop answering.",
    icon: Clock3,
  },
  {
    title: "Disconnected Workflow",
    body: "Front desk conversations rarely turn into organized repair-ready information.",
    icon: MessageSquareText,
  },
];

const workflowSteps = [
  "Customer Calls",
  "ZOL Answers Instantly",
  "Captures Vehicle + Repair Issue",
  "Creates AI Repair Summary",
  "Shop Takes Action",
];

const featureCards = [
  {
    title: "24/7 AI Call Handling",
    body: "Every customer call gets answered professionally.",
    icon: Headphones,
  },
  {
    title: "AI Repair Summaries",
    body: "Clear summaries your technicians can actually use.",
    icon: ListChecks,
  },
  {
    title: "Customer Memory",
    body: "ZOL remembers previous visits, vehicles, and repair history.",
    icon: History,
  },
  {
    title: "Appointment Requests",
    body: "Capture customer scheduling requests automatically.",
    icon: CalendarClock,
  },
  {
    title: "Repair Issue Extraction",
    body: "Turn conversations into organized repair information.",
    icon: Wrench,
  },
  {
    title: "Front Desk Relief",
    body: "Reduce interruptions and communication overload.",
    icon: UserRoundCheck,
  },
];

const whyCards = [
  {
    title: "Works After Hours",
    body: "Capture customer opportunities even when the shop is closed.",
    icon: Clock3,
  },
  {
    title: "Reduces Front-Desk Chaos",
    body: "Keep communication organized between customers and technicians.",
    icon: ShieldCheck,
  },
  {
    title: "Feels Like An Additional Employee",
    body: "ZOL handles repetitive communication work so your team can focus on repairs.",
    icon: UserRoundCheck,
  },
];

const futureCapabilities = [
  "Appointment coordination",
  "Customer follow-up",
  "Repair workflow assistance",
  "CRM integration",
  "Shop insights",
  "Customer communication memory",
];

const dashboardCards = [
  {
    title: "AI Summary",
    body: "Customer reports grinding sound while braking at low speeds. Requested tomorrow morning if available.",
  },
  {
    title: "Vehicle Information",
    body: "2018 Toyota Camry, front brake concern, repeat customer.",
  },
  {
    title: "Customer History",
    body: "Last visit: oil change 3 months ago. Prior brake inspection noted.",
  },
  {
    title: "Action Items",
    body: "Inspect pads, check front rotors, prepare brake estimate.",
  },
  {
    title: "Follow-Up Status",
    body: "Ready for front desk review.",
  },
  {
    title: "Appointment Requests",
    body: "Preferred window: tomorrow morning.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
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
            ? "border-zinc-200/80 bg-white/82 shadow-card backdrop-blur-xl"
            : "border-transparent bg-white/45 backdrop-blur-sm",
        )}
      >
        <a href="#" className="flex items-center gap-2" aria-label="ZOL home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-sm font-bold text-white">
            Z
          </span>
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

        <Button size="sm" asChild>
          <a href="#demo">Book Demo</a>
        </Button>
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
          className="w-1 rounded-full bg-orange-500/80"
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

function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
      className="relative"
    >
      <div className="absolute -inset-6 rounded-[2.5rem] bg-orange-500/10 blur-3xl" />
      <div className="dashboard-noise relative overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-premium">
        <div className="border-b border-zinc-200/80 bg-zinc-950 px-5 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-400">
                Incoming Call
              </p>
              <h3 className="mt-1 text-xl font-semibold">Sarah Mitchell</h3>
              <p className="text-sm text-zinc-300">2018 Toyota Camry</p>
            </div>
            <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
              Call Active
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/8 px-4 py-3">
            <Waveform />
            <Mic2 className="h-5 w-5 text-orange-300" />
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoBlock label="Issue" value="Grinding noise while braking" />
            <InfoBlock label="Urgency" value="High" tone="orange" />
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                AI Summary
              </p>
              <motion.span
                animate={{ opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700"
              >
                AI Summary Generated
              </motion.span>
            </div>
            <p className="text-sm leading-6 text-zinc-700">
              Customer reports grinding sound during braking at low speeds. Requests
              appointment for tomorrow morning.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-zinc-200 bg-white p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Recommended Actions
              </p>
              <ul className="space-y-3 text-sm text-zinc-700">
                {["Inspect brake pads", "Check front rotors", "Prepare brake estimate"].map(
                  (item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Customer Memory
              </p>
              <p className="text-sm font-semibold text-zinc-950">Last visit:</p>
              <p className="mt-1 text-sm leading-6 text-zinc-700">
                Oil change - 3 months ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InfoBlock({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "orange";
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 text-base font-semibold text-zinc-950",
          tone === "orange" && "text-orange-700",
        )}
      >
        {value}
      </p>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8 lg:pb-28 lg:pt-40">
      <div className="industrial-grid absolute inset-x-0 top-0 h-[42rem] opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Front-desk operations for auto repair shops
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.055em] text-zinc-950 sm:text-6xl lg:text-7xl">
            Your Shop&apos;s First AI Employee
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl">
            ZOL answers every customer call, captures repair issues, remembers
            customer history, and creates organized repair-ready summaries - so your
            team can stay focused on the cars.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <a href="#demo">
                Book Demo <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#demo-call">
                <Play className="h-4 w-4" /> Listen to AI Call
              </a>
            </Button>
          </div>
          <div className="mt-7 grid gap-3 text-sm font-medium text-zinc-700 sm:grid-cols-2">
            {trustIndicators.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {item}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm font-semibold text-zinc-500">
            No new hardware. No complicated setup.
          </p>
        </motion.div>

        <HeroDashboard />
      </div>
    </section>
  );
}

function SocialProof() {
  const stats = [
    {
      title: "Missed calls",
      body: "Busy shops cannot answer every ring during peak hours.",
    },
    {
      title: "After-hours inquiries",
      body: "Customers still ask for help when bays are closed.",
    },
    {
      title: "Front-desk overload",
      body: "Important repair details get buried in the daily rush.",
    },
  ];

  return (
    <AnimatedSection className="py-16">
      <div className="rounded-[2rem] border border-zinc-200 bg-zinc-950 p-6 text-white shadow-premium sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.2fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Repair shops lose revenue when calls go unanswered.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-300">
              Between busy front desks, after-hours calls, and incomplete notes,
              valuable repair opportunities slip through every day.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-5"
              >
                <p className="text-lg font-semibold text-white">{stat.title}</p>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{stat.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function ProblemSection() {
  return (
    <AnimatedSection>
      <SectionHeading
        eyebrow="The daily reality"
        title="The front desk was never meant to handle everything."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {problemCards.map((card, index) => (
          <motion.div
            key={card.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            whileHover={{ y: -6 }}
          >
            <Card className="h-full p-6">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-950">{card.title}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-600">{card.body}</p>
            </Card>
          </motion.div>
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
          title="ZOL works like another employee - without changing your workflow."
          description="No complicated setup. No retraining your team."
        />
        <div className="mt-14 grid gap-4 lg:grid-cols-5">
          {workflowSteps.map((step, index) => (
            <div key={step} className="relative">
              <div className="h-full rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-base font-semibold leading-6 text-zinc-950">
                  {step}
                </p>
              </div>
              {index < workflowSteps.length - 1 ? (
                <ChevronRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-white text-zinc-300 lg:block" />
              ) : null}
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-lg leading-8 text-zinc-600">
          ZOL helps your team stay focused on repairs while every customer interaction
          stays organized.
        </p>
      </div>
    </AnimatedSection>
  );
}

function FeaturesSection() {
  return (
    <AnimatedSection id="features">
      <SectionHeading
        eyebrow="Core features"
        title="Built specifically for auto repair shops."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((feature, index) => (
          <motion.div
            key={feature.title}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
            whileHover={{ y: -6 }}
          >
            <Card className="h-full p-6">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-zinc-950">{feature.title}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-600">{feature.body}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}

function MemorySection() {
  return (
    <AnimatedSection className="py-24">
      <div className="grid items-center gap-10 lg:grid-cols-[0.86fr_1.14fr]">
        <SectionHeading
          align="left"
          eyebrow="Shop memory"
          title="ZOL remembers every customer."
          description="Every conversation becomes organized shop memory."
        />
        <Card className="overflow-hidden p-0">
          <div className="border-b border-zinc-200 bg-zinc-950 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Customer conversation</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-300">
                Memory active
              </span>
            </div>
          </div>
          <div className="space-y-5 p-6 sm:p-8">
            <div className="max-w-[82%] rounded-3xl rounded-tl-md bg-zinc-100 p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Customer
              </p>
              <p className="text-lg font-medium text-zinc-950">
                &quot;My brakes are making noise again.&quot;
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="ml-auto max-w-[88%] rounded-3xl rounded-tr-md bg-orange-500 p-5 text-white"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-100">
                ZOL
              </p>
              <p className="text-lg font-medium leading-8">
                &quot;I see your Honda Accord previously came in for brake vibration
                issues three months ago. Is this related to the same problem?&quot;
              </p>
            </motion.div>
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-sm leading-7 text-zinc-600">
                ZOL helps create a more personal customer experience while keeping
                repair history organized.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AnimatedSection>
  );
}

function DemoCallSection() {
  const conversation = [
    ["Customer", "My car makes a grinding noise when I brake."],
    ["ZOL", "I can help with that. What's the vehicle year, make, and model?"],
    ["Customer", "2018 Toyota Camry."],
    ["ZOL", "Got it. I'll capture this for the shop and help request an appointment."],
  ];

  return (
    <AnimatedSection id="demo-call" className="py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Demo call"
          title="Listen to how ZOL handles a real repair call."
        />
        <Card className="mt-12 overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="bg-zinc-950 p-8 text-white">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500">
                <Play className="h-7 w-7 fill-white" />
              </div>
              <h3 className="text-2xl font-semibold">Brake concern intake</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                A simple call becomes a clean repair summary your team can act on.
              </p>
              <Button className="mt-8" variant="accent">
                <Play className="h-4 w-4 fill-white" /> Play Demo Call
              </Button>
            </div>
            <div className="space-y-4 p-6 sm:p-8">
              {conversation.map(([speaker, line]) => (
                <div key={line} className="rounded-3xl border border-zinc-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                    {speaker}
                  </p>
                  <p className="mt-2 text-base leading-7 text-zinc-800">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </AnimatedSection>
  );
}

function DashboardPreviewSection() {
  return (
    <AnimatedSection className="py-24">
      <SectionHeading
        eyebrow="Organized automatically"
        title="Everything stays organized automatically."
      />
      <div className="mt-12 rounded-[2rem] border border-zinc-200 bg-zinc-950 p-4 shadow-premium sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Repair intake dashboard</p>
            <p className="mt-1 text-sm text-zinc-400">Sarah Mitchell - 2018 Toyota Camry</p>
          </div>
          <span className="w-fit rounded-full bg-orange-500/15 px-3 py-1 text-xs font-semibold text-orange-300">
            Ready for shop review
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dashboardCards.map((card) => (
            <div key={card.title} className="rounded-3xl bg-white p-5">
              <p className="text-sm font-semibold text-zinc-950">{card.title}</p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function WhyZolSection() {
  return (
    <AnimatedSection id="why-zol">
      <SectionHeading eyebrow="Why ZOL" title="Why shops choose ZOL." />
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {whyCards.map((card) => (
          <Card key={card.title} className="p-7">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white">
              <card.icon className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">
              {card.title}
            </h3>
            <p className="mt-4 text-base leading-7 text-zinc-600">{card.body}</p>
          </Card>
        ))}
      </div>
    </AnimatedSection>
  );
}

function FutureVisionSection() {
  return (
    <AnimatedSection>
      <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-card sm:p-8 lg:p-12">
        <SectionHeading
          eyebrow="Future vision"
          title="More than call answering."
          description="ZOL is becoming the operational intelligence layer for modern repair shops."
        />
        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
          {futureCapabilities.map((capability) => (
            <span
              key={capability}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700"
            >
              {capability}
            </span>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

function FinalCta() {
  return (
    <AnimatedSection id="demo" className="pb-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-zinc-950 px-6 py-16 text-center shadow-premium sm:px-10 lg:py-20">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <Sparkles className="mx-auto mb-5 h-7 w-7 text-orange-300" />
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Ready to bring an AI employee into your shop?
          </h2>
          <p className="mt-5 text-lg leading-8 text-zinc-300">
            Start organizing calls, repair conversations, and customer communication
            with ZOL.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="accent">
              Book Demo <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#how-it-works">See How It Works</a>
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
        <div>
          <p className="text-lg font-bold tracking-tight text-zinc-950">ZOL</p>
          <p className="mt-2 text-sm text-zinc-500">AI employee for auto repair shops</p>
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
      <SocialProof />
      <ProblemSection />
      <WorkflowSection />
      <FeaturesSection />
      <MemorySection />
      <DemoCallSection />
      <DashboardPreviewSection />
      <WhyZolSection />
      <FutureVisionSection />
      <FinalCta />
      <Footer />
    </main>
  );
}
