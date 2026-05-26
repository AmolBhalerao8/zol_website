import type { OperationalContext } from "@/features/copilot/types/copilot-types";

export function formatContextForDisplay(context: OperationalContext): string[] {
  return context.sections
    .filter((section) => !section.startsWith("Transcript Excerpt:"))
    .map((section) => section.replace(/\n/g, " · ").trim())
    .slice(0, 6);
}
