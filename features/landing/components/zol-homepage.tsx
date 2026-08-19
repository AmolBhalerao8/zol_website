"use client";

import { Show } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Boxes,
  BrainCircuit,
  Check,
  ChevronDown,
  ClipboardCheck,
  Cpu,
  Eye,
  FileSearch,
  GitBranch,
  Layers,
  LucideIcon,
  Radar,
  ScanEye,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookDemoForm } from "@/features/landing/components/book-demo-form";
import { ZolProfileMenu } from "@/features/auth/components/zol-profile-menu";
import { cn } from "@/lib/utils";

const navLinks = ["Technology", "How It Works", "Demo", "Evaluation", "Vision"];

const pipelineStages = [
  {
    label: "Raw input",
    detail: "Toyota Camry repair video",
  },
  {
    label: "Perception",
    detail: "Parts and tools detected",
  },
  {
    label: "Extraction",
    detail: "Steps and state changes extracted",
  },
  {
    label: "Structure",
    detail: "Procedural action graph created",
  },
  {
    label: "Inference",
    detail: "Unseen video analyzed",
  },
  {
    label: "Guidance",
    detail: "Current step: Release housing clips",
  },
];

const problemPoints = [
  "Millions of repair demonstrations exist across videos, manuals, diagrams, forums, and technician experience.",
  "Videos show how people perform the work, but they are difficult for machines to search, verify, or execute.",
  "Manuals contain the official procedure, but they do not show the visual variations technicians encounter in real environments.",
  "Existing AI can answer questions about a frame, but it rarely maintains procedural state across an entire physical task.",
  "Robots and AI agents need more than instructions - they need grounded actions, dependencies, state transitions, failure conditions, and uncertainty.",
];

const pillars = [
  {
    title: "Visual understanding",
    body: "Identifies tools, parts, hand-object interactions, actions, and important visual evidence across time.",
    icon: Eye,
  },
  {
    title: "State-change tracking",
    body: "Understands that a component changed from attached to removed, closed to open, empty to installed, or unsecured to secured.",
    icon: Activity,
  },
  {
    title: "Procedural action graphs",
    body: "Converts demonstrations into structured steps with preconditions, resulting states, valid transitions, common mistakes, and completion conditions.",
    icon: GitBranch,
  },
  {
    title: "Grounded repair memory",
    body: "Connects visual demonstrations with manuals, diagrams, product information, specifications, and previously verified examples.",
    icon: Layers,
  },
  {
    title: "Real-time guidance",
    body: "Uses the current visual state and completed-step history to explain what the technician should do next - or request a clearer view when evidence is insufficient.",
    icon: Radar,
  },
];

const howItWorks = [
  {
    title: "Learn",
    body: "ZOL ingests repair videos, manuals, diagrams, and parts information.",
    icon: FileSearch,
  },
  {
    title: "Structure",
    body: "It extracts actions, objects, timestamps, physical state changes, dependencies, and common variations.",
    icon: Boxes,
  },
  {
    title: "Verify",
    body: "It compares demonstrations against authoritative technical documentation and flags disagreements or missing evidence.",
    icon: ShieldCheck,
  },
  {
    title: "Reason",
    body: "During a new repair, ZOL determines the current step, retrieves similar demonstrations, and validates the action against the procedure graph.",
    icon: BrainCircuit,
  },
  {
    title: "Guide",
    body: "It provides the next instruction, highlights risks, and explains what is visually confirmed versus uncertain.",
    icon: Workflow,
  },
];

const comparisonRows: Array<[string, string]> = [
  ["Describes one image", "Understands chronological actions"],
  ["Starts from zero each time", "Maintains the complete repair session"],
  ["Gives a plausible answer", "Validates the next action against the procedure"],
  ["Uses general knowledge", "Retrieves vehicle-specific demonstrations and documentation"],
  ["May assume hidden actions", "Tracks what is visually confirmed and unknown"],
  ["Produces text", "Produces structured actions, states, evidence and guidance"],
  ["Answers questions", "Detects errors and predicts the next valid step"],
];

const architectureLayers = [
  "Multimodal extraction",
  "Procedural memory",
  "State-transition graph",
  "Vehicle-specific retrieval",
  "Deterministic safety validation",
  "Frontier model reasoning",
];

const moatPoints = [
  "Every processed video adds new camera angles, technician styles, part appearances, and real-world variations.",
  "Every verified procedure adds structured preconditions, state changes, errors, and completion evidence.",
  "Every guided session produces examples of where models succeed, hesitate, or make incorrect predictions.",
  "Every vehicle and repair expands a reusable procedural ontology.",
  "The resulting dataset can support guidance, model training, benchmarking, and robotic planning.",
];

const todayItems = [
  "Technician repair copilot",
  "Visual step verification",
  "Next-action guidance",
  "Training and onboarding",
  "Remote expert assistance",
  "Quality-control documentation",
];

const tomorrowItems = [
  "Embodied-AI training data",
  "Robot task planning",
  "Simulation and evaluation",
  "Procedural benchmark creation",
  "Cross-vehicle state representations",
  "Human-to-robot skill transfer",
];

const evalQuestions = [
  "Did the system identify the correct action?",
  "Did it recognize the affected tool and component?",
  "Did it detect the physical state change?",
  "Did it understand the required earlier steps?",
  "Did it predict a valid next action?",
  "Did it catch a skipped or incorrect step?",
  "Did it recognize when visual evidence was insufficient?",
  "Did the procedure finish in a correct and safe state?",
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
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  invert?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto max-w-3xl",
        align === "center" ? "text-center" : "mx-0 text-left",
      )}
    >
      {eyebrow ? <SectionLabel>{eyebrow}</SectionLabel> : null}
      <h2
        className={cn(
          "text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl",
          invert ? "text-white" : "text-zinc-950",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 text-base leading-8 sm:text-lg",
            invert ? "text-zinc-300" : "text-zinc-600",
          )}
        >
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

function useCycle(length: number, interval = 1600) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [length, interval]);

  return active;
}

function HeroPipeline() {
  const active = useCycle(pipelineStages.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
      className="relative"
    >
      <div className="absolute -inset-8 rounded-[2.5rem] bg-emerald-500/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 p-3 text-white shadow-premium sm:p-5">
        <div className="mb-4 flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.06] px-4 py-3">
          <div className="flex items-center gap-3">
            <LogoMark className="h-8 w-8" />
            <div>
              <p className="text-sm font-semibold">ZOL procedural engine</p>
              <p className="text-xs text-zinc-400">
                2020 Toyota Camry - engine air-filter replacement
              </p>
            </div>
          </div>
          <StatusPill>Learning</StatusPill>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Pipeline
            </p>
            <div className="space-y-2">
              {pipelineStages.map((stage, index) => {
                const isActive = index === active;
                const isDone = index < active;

                return (
                  <div key={stage.label}>
                    <motion.div
                      animate={{
                        borderColor: isActive
                          ? "rgba(16, 185, 129, 0.6)"
                          : "rgba(255, 255, 255, 0.08)",
                        backgroundColor: isActive
                          ? "rgba(16, 185, 129, 0.12)"
                          : "rgba(0, 0, 0, 0.2)",
                      }}
                      transition={{ duration: 0.35 }}
                      className="flex items-center gap-3 rounded-2xl border p-3"
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors",
                          isActive
                            ? "bg-emerald-500 text-white"
                            : isDone
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-white/10 text-zinc-400",
                        )}
                      >
                        {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                          {stage.label}
                        </p>
                        <p
                          className={cn(
                            "truncate text-sm font-medium transition-colors",
                            isActive ? "text-white" : "text-zinc-400",
                          )}
                        >
                          {stage.detail}
                        </p>
                      </div>
                    </motion.div>
                    {index < pipelineStages.length - 1 ? (
                      <div className="flex justify-center py-0.5">
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-colors",
                            index < active ? "text-emerald-400" : "text-white/20",
                          )}
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Live procedure state
              </p>
              <div className="space-y-3">
                <StateRow label="Front clip" value="Released" tone="good" />
                <StateRow label="Rear clip" value="Not visible" tone="unknown" />
                <StateRow label="Housing cover" value="Closed" tone="neutral" />
              </div>
              <div className="mt-4 rounded-2xl bg-black/25 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Procedure status
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  2 of 10 steps confirmed
                </p>
                <div className="mt-3 h-1.5 rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-emerald-500"
                    initial={{ width: "8%" }}
                    animate={{ width: "20%" }}
                    transition={{ duration: 1.4, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-4 text-zinc-950">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Current step
              </p>
              <p className="text-base font-semibold">Release housing clips</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Next action
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-700">
                Lift the housing cover only after every retaining clip is confirmed
                released.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StateRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "good" | "unknown" | "neutral";
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2.5">
      <p className="text-sm text-zinc-400">{label}</p>
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-semibold",
          tone === "good" && "bg-emerald-500/15 text-emerald-300",
          tone === "unknown" && "bg-orange-500/15 text-orange-300",
          tone === "neutral" && "bg-white/10 text-zinc-300",
        )}
      >
        {value}
      </span>
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
            AI Shop Management for Auto Shops
          </div>
          <h1 className="mx-auto max-w-4xl text-[clamp(2.5rem,7vw,4rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-zinc-950">
            The best AI shop management tool for auto shops.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
            Don&rsquo;t let your competitors beat you with AI. Be on the forefront of tech and
            AI: ZOL turns repair videos, technical manuals, diagrams, and technician
            knowledge into grounded procedures that guide your techs today - and power
            embodied AI tomorrow.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <a href="#demo">
                Watch the system learn a repair <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#technology">Explore the technology</a>
            </Button>
          </div>
        </motion.div>

        <div className="w-full max-w-6xl">
          <HeroPipeline />
        </div>
      </div>
    </section>
  );
}

function CategorySection() {
  return (
    <AnimatedSection className="py-16">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-zinc-200 bg-white p-6 text-center shadow-card sm:p-10">
        <SectionLabel>Procedural Intelligence Infrastructure</SectionLabel>
        <p className="text-xl leading-9 text-zinc-700 sm:text-2xl sm:leading-10">
          Most AI can describe an image. ZOL understands a procedure - what happened,
          what changed, what must happen next, and when the system should stop and ask
          for more evidence.
        </p>
      </div>
    </AnimatedSection>
  );
}

function ProblemSection() {
  return (
    <AnimatedSection>
      <SectionHeading
        eyebrow="The problem"
        title="The world's most valuable physical knowledge is trapped in unstructured content."
      />
      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {problemPoints.map((point, index) => (
          <motion.div
            key={point}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
          >
            <Card className="flex h-full items-start gap-4 p-6">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-xs font-bold text-white">
                {index + 1}
              </span>
              <p className="text-sm leading-7 text-zinc-600">{point}</p>
            </Card>
          </motion.div>
        ))}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="lg:col-span-2"
        >
          <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8">
            <p className="text-lg font-semibold leading-8 text-emerald-900 sm:text-xl">
              The data already exists. The missing layer is the system that converts it
              into machine-usable procedural intelligence.
            </p>
          </div>
        </motion.div>
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
  className,
}: {
  title: string;
  body: string;
  icon: LucideIcon;
  index: number;
  darkIcon?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className={className}
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

function PillarsSection() {
  return (
    <AnimatedSection id="technology">
      <SectionHeading
        eyebrow="What ZOL creates"
        title="From demonstrations to executable knowledge."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {pillars.map((pillar, index) => (
          <FeatureCard
            key={pillar.title}
            title={pillar.title}
            body={pillar.body}
            icon={pillar.icon}
            index={index}
            darkIcon={index === 0}
            className={index === 4 ? "md:col-span-2 lg:col-span-1" : undefined}
          />
        ))}
      </div>
    </AnimatedSection>
  );
}

function HowItWorksSection() {
  const active = useCycle(howItWorks.length, 2200);

  return (
    <AnimatedSection id="how-it-works" className="py-24">
      <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-premium sm:p-8 lg:p-12">
        <SectionHeading
          eyebrow="How it works"
          title="One intelligence layer across the entire procedure."
        />

        <div className="relative mt-14">
          <div className="absolute inset-x-0 top-[2.25rem] hidden h-0.5 bg-zinc-200 md:block">
            <motion.div
              className="h-full bg-emerald-500"
              animate={{
                width: `${(active / (howItWorks.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-5">
            {howItWorks.map((step, index) => {
              const isActive = index === active;
              const isDone = index < active;
              const Icon = step.icon;

              return (
                <div key={step.title} className="relative">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.06 : 1,
                      backgroundColor: isActive
                        ? "rgb(5, 150, 105)"
                        : isDone
                          ? "rgb(209, 250, 229)"
                          : "rgb(244, 244, 245)",
                      color: isActive ? "#ffffff" : isDone ? "#047857" : "#71717a",
                    }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border-4 border-white shadow-card"
                  >
                    <Icon className="h-6 w-6" />
                  </motion.div>
                  <div className="mt-5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                      Step {index + 1}
                    </p>
                    <h3
                      className={cn(
                        "mt-1 text-lg font-semibold transition-colors",
                        isActive ? "text-emerald-700" : "text-zinc-950",
                      )}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">{step.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function DemoReadout({
  label,
  children,
  accent = false,
}: {
  label: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-5",
        accent
          ? "border-emerald-400/30 bg-emerald-400/10"
          : "border-white/10 bg-white/[0.04]",
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
        {label}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function DemoSection() {
  return (
    <AnimatedSection id="demo" className="py-24">
      <SectionHeading
        eyebrow="Live demo"
        title="Watch ZOL understand a repair it has never seen before."
        description="2020 Toyota Camry - engine air-filter replacement, analyzed from a held-out silent repair video."
      />

      <div className="mt-12 overflow-hidden rounded-[2rem] border border-zinc-200 bg-zinc-950 p-4 text-white shadow-premium sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600">
              <ScanEye className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Held-out silent repair video</p>
              <p className="text-xs text-zinc-400">No audio. No annotations. No prior exposure.</p>
            </div>
          </div>
          <StatusPill>Session active</StatusPill>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <DemoReadout label="Detected">
            <p className="text-base font-semibold leading-7">
              Technician is releasing the front housing clip
            </p>
          </DemoReadout>

          <DemoReadout label="Physical state">
            <div className="space-y-2.5">
              <StateRow label="Front clip" value="Released" tone="good" />
              <StateRow label="Rear clip" value="Not visible" tone="unknown" />
              <StateRow label="Housing cover" value="Closed" tone="neutral" />
            </div>
          </DemoReadout>

          <DemoReadout label="Procedure status">
            <p className="text-base font-semibold">2 of 10 steps confirmed</p>
            <div className="mt-4 h-1.5 rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-emerald-500"
                initial={{ width: 0 }}
                whileInView={{ width: "20%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Steps advance only when the required evidence is visually confirmed.
            </p>
          </DemoReadout>

          <DemoReadout label="Next action" accent>
            <p className="text-base font-semibold leading-7 text-emerald-100">
              Show the rear side of the housing and confirm that the second clip is
              released.
            </p>
          </DemoReadout>

          <DemoReadout label="Reason">
            <p className="text-sm leading-7 text-zinc-300">
              The housing should not be lifted until all retaining clips are released.
            </p>
          </DemoReadout>

          <DemoReadout label="Evidence">
            <ul className="space-y-2.5 text-sm text-zinc-300">
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                2 similar demonstrations
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                1 relevant manual section
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                89% visual confidence
              </li>
            </ul>
          </DemoReadout>
        </div>
      </div>
    </AnimatedSection>
  );
}

function ComparisonSection() {
  return (
    <AnimatedSection>
      <SectionHeading
        eyebrow="Not another chatbot"
        title="A chatbot answers. ZOL maintains procedural state."
      />
      <div className="mt-12 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-premium">
        <div className="grid grid-cols-2 border-b border-zinc-200 bg-zinc-50">
          <div className="px-5 py-4 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
              General visual chatbot
            </p>
          </div>
          <div className="border-l border-zinc-200 bg-zinc-950 px-5 py-4 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
              ZOL
            </p>
          </div>
        </div>
        {comparisonRows.map(([left, right], index) => (
          <motion.div
            key={left}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="grid grid-cols-2 border-b border-zinc-200 last:border-b-0"
          >
            <div className="px-5 py-5 text-sm leading-6 text-zinc-500 sm:px-8">
              {left}
            </div>
            <div className="border-l border-zinc-200 bg-zinc-950 px-5 py-5 text-sm font-medium leading-6 text-white sm:px-8">
              {right}
            </div>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}

function ArchitectureSection() {
  return (
    <AnimatedSection className="py-24">
      <div className="rounded-[2rem] border border-zinc-200 bg-zinc-950 p-6 text-white shadow-premium sm:p-8 lg:p-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <SectionHeading
              align="left"
              invert
              eyebrow="Technical advantage"
              title="Built for actions, not captions."
              description="The language model interprets visual evidence and communicates naturally. ZOL's procedural engine controls task state, retrieves the correct domain knowledge, validates step order, and prevents unsupported actions from advancing the procedure."
            />
          </div>
          <div className="space-y-2">
            {architectureLayers.map((layer, index) => (
              <div key={layer}>
                <motion.div
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600">
                    <Cpu className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-semibold text-zinc-100">{layer}</p>
                </motion.div>
                {index < architectureLayers.length - 1 ? (
                  <p className="py-1 text-center text-lg font-light text-white/25">+</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function MoatSection() {
  return (
    <AnimatedSection>
      <SectionHeading
        eyebrow="Data moat"
        title="Every procedure makes the system harder to replicate."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {moatPoints.map((point, index) => (
          <motion.div
            key={point}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.05 }}
          >
            <Card className="h-full p-6">
              <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Layers className="h-5 w-5" />
              </span>
              <p className="text-sm leading-7 text-zinc-600">{point}</p>
            </Card>
          </motion.div>
        ))}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.25 }}
        >
          <div className="flex h-full items-center rounded-[1.75rem] bg-zinc-950 p-6">
            <p className="text-lg font-semibold leading-8 text-white">
              We are not collecting more repair content. We are converting repair
              content into structured physical intelligence.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}

function HorizonSection() {
  return (
    <AnimatedSection id="vision" className="py-24">
      <SectionHeading
        eyebrow="Today and tomorrow"
        title="Guide technicians today. Train physical AI tomorrow."
      />
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <Card className="p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <ClipboardCheck className="h-5 w-5" />
            </span>
            <h3 className="text-2xl font-semibold text-zinc-950">Today</h3>
          </div>
          <ul className="space-y-4">
            {todayItems.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-zinc-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <div className="rounded-[1.75rem] bg-zinc-950 p-6 text-white shadow-premium sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <h3 className="text-2xl font-semibold">Tomorrow</h3>
          </div>
          <ul className="space-y-4">
            {tomorrowItems.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-zinc-200">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AnimatedSection>
  );
}

function EvaluationSection() {
  return (
    <AnimatedSection id="evaluation">
      <SectionHeading
        eyebrow="Evaluation layer"
        title="Physical AI needs evals, not just demos."
        description="Every guided session is scored against the questions that determine whether a system truly understood the work."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {evalQuestions.map((question, index) => (
          <motion.div
            key={question}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
            className="flex items-start gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-card"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-[10px] font-bold text-white">
              {index + 1}
            </span>
            <p className="text-sm font-medium leading-6 text-zinc-700">{question}</p>
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}

function ContactSection() {
  return (
    <AnimatedSection id="contact" className="py-24">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Get started"
          title="See ZOL understand a repair."
          description="Tell us what you work on and we will walk you through the system on a real procedure."
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
            The next generation of AI will not just understand language. It will
            understand work.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            ZOL is building the intelligence layer that turns human demonstrations into
            structured, verifiable, and actionable physical knowledge.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" variant="accent" asChild>
              <a href="#contact">
                See ZOL understand a repair <ArrowRight className="h-4 w-4" />
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
              Procedural intelligence infrastructure for physical work
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
          <a href="#contact" className="hover:text-zinc-950">
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
      <CategorySection />
      <ProblemSection />
      <PillarsSection />
      <HowItWorksSection />
      <DemoSection />
      <ComparisonSection />
      <ArchitectureSection />
      <MoatSection />
      <HorizonSection />
      <EvaluationSection />
      <ContactSection />
      <FinalCta />
      <Footer />
    </main>
  );
}
