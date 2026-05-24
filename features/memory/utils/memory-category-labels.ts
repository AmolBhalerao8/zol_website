import type { MemoryCategory } from "@prisma/client";

export const MEMORY_CATEGORY_LABELS: Record<MemoryCategory, string> = {
  PREFERENCE: "Preference",
  ISSUE: "Issue",
  ORDER_HISTORY: "Order history",
  SERVICE_HISTORY: "Service history",
  COMMUNICATION_STYLE: "Communication style",
  BUSINESS_CONTEXT: "Business context",
  FOLLOW_UP: "Follow-up",
  GENERAL: "General",
};

export const MEMORY_CATEGORY_ORDER: MemoryCategory[] = [
  "BUSINESS_CONTEXT",
  "PREFERENCE",
  "COMMUNICATION_STYLE",
  "ISSUE",
  "ORDER_HISTORY",
  "SERVICE_HISTORY",
  "FOLLOW_UP",
  "GENERAL",
];

export const MEMORY_CATEGORY_STYLES: Record<MemoryCategory, string> = {
  PREFERENCE: "border-violet-200 bg-violet-50 text-violet-800",
  ISSUE: "border-red-200 bg-red-50 text-red-800",
  ORDER_HISTORY: "border-blue-200 bg-blue-50 text-blue-800",
  SERVICE_HISTORY: "border-cyan-200 bg-cyan-50 text-cyan-800",
  COMMUNICATION_STYLE: "border-amber-200 bg-amber-50 text-amber-900",
  BUSINESS_CONTEXT: "border-emerald-200 bg-emerald-50 text-emerald-800",
  FOLLOW_UP: "border-orange-200 bg-orange-50 text-orange-800",
  GENERAL: "border-zinc-200 bg-zinc-50 text-zinc-700",
};
