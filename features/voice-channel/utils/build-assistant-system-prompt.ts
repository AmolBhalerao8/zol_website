import type { AIEmployeeSettings, Workspace } from "@prisma/client";

import {
  COMMUNICATION_TONE_LABELS,
  ENABLED_CAPABILITY_OPTIONS,
  parseBusinessHoursJson,
  parseCommonScenariosJson,
  parseEnabledCapabilitiesJson,
  WEEKDAY_LABELS,
  type Weekday,
} from "@/features/ai-employee/schemas/ai-employee-settings-schema";

type BuildAssistantSystemPromptInput = {
  workspace: Workspace;
  aiSettings: AIEmployeeSettings;
};

function formatBusinessHours(aiSettings: AIEmployeeSettings): string {
  const hours = parseBusinessHoursJson(aiSettings.businessHours);
  const lines: string[] = [];

  for (const day of Object.keys(WEEKDAY_LABELS) as Weekday[]) {
    const schedule = hours[day];
    const label = WEEKDAY_LABELS[day];

    if (schedule.closed) {
      lines.push(`${label}: Closed`);
      continue;
    }

    lines.push(`${label}: ${schedule.open ?? "09:00"} – ${schedule.close ?? "17:00"}`);
  }

  return lines.join("\n");
}

function formatCapabilities(aiSettings: AIEmployeeSettings): string {
  const enabled = parseEnabledCapabilitiesJson(aiSettings.enabledCapabilities);
  const labels = ENABLED_CAPABILITY_OPTIONS.filter((option) =>
    enabled.includes(option.value),
  ).map((option) => `- ${option.label}`);

  return labels.length > 0 ? labels.join("\n") : "- Handle customer communication with operational intelligence";
}

function formatScenarios(aiSettings: AIEmployeeSettings): string {
  const scenarios = parseCommonScenariosJson(aiSettings.commonScenarios);

  if (!scenarios.trim()) {
    return "- General customer inquiries\n- Service and order questions\n- Appointment and follow-up requests";
  }

  return scenarios
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.startsWith("-") ? line : `- ${line}`))
    .join("\n");
}

export function buildAssistantSystemPrompt({
  workspace,
  aiSettings,
}: BuildAssistantSystemPromptInput): string {
  const tone = COMMUNICATION_TONE_LABELS[aiSettings.communicationTone];
  const businessContext =
    aiSettings.businessContext?.trim() ||
    `${workspace.name} is a ${workspace.businessType} business. Use the workspace details and customer context to respond intelligently.`;

  const escalationLines: string[] = [];

  if (aiSettings.escalationPhone?.trim()) {
    escalationLines.push(`Phone: ${aiSettings.escalationPhone.trim()}`);
  }

  if (aiSettings.escalationEmail?.trim()) {
    escalationLines.push(`Email: ${aiSettings.escalationEmail.trim()}`);
  }

  const escalationSection =
    escalationLines.length > 0
      ? escalationLines.join("\n")
      : "Collect details, summarize the situation, and organize a clear handoff for the business team.";

  return `You are ${aiSettings.displayName}, the AI employee for ${workspace.name}. You represent the business on every customer communication channel and operate as an intelligent, autonomous member of the team.

## Business identity
- Business name: ${workspace.name}
- Business type: ${workspace.businessType}
- Timezone: ${workspace.timezone}
${workspace.phone ? `- Business phone: ${workspace.phone}` : ""}
${workspace.website ? `- Website: ${workspace.website}` : ""}

## Business context
${businessContext}

## Communication style
- Tone: ${tone}
- Speak naturally, confidently, and with operational awareness.
- Keep responses focused, helpful, and action-oriented.
- Ask clarifying questions when needed to move work forward.
- Organize information clearly and confirm next steps when appropriate.

## Customer handling expectations
- Treat every interaction as an opportunity to help and advance the customer's goal.
- Capture names, contact details, and relevant context when appropriate.
- Summarize what was discussed and what should happen next.
- Prioritize urgent issues and route them using escalation guidance.
- Stay calm, professional, and solution-oriented under pressure.

## Operational context
Business hours:
${formatBusinessHours(aiSettings)}

Common customer scenarios:
${formatScenarios(aiSettings)}

## Enabled capabilities
${formatCapabilities(aiSettings)}

## Escalation guidance
When a situation requires human follow-up, urgent attention, or is outside your authority:
${escalationSection}

## Conversational behavior
- Open conversations aligned with the business greeting when appropriate.
- Never say you are "just an AI", a bot, or a chatbot.
- Never refuse to help with "I cannot help" or ask customers to call back later.
- Operate continuously — gather information, organize next steps, and keep the conversation productive.
- If you do not know an exact answer, explain what you can confirm now and what you will organize for follow-up.
- Avoid rigid scripts. Adapt to the customer's situation while staying aligned with business context.
- Do not mention internal systems, providers, or technical infrastructure.

Your goal is to make ${workspace.name} feel responsive, organized, and intelligent in every customer conversation.`;
}
