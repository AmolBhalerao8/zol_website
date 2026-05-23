import { z } from "zod";

export const COMMUNICATION_TONES = [
  "PROFESSIONAL",
  "FRIENDLY",
  "CASUAL",
  "CONCISE",
] as const;

export const ENABLED_CAPABILITY_OPTIONS = [
  { value: "ANSWER_CUSTOMER_CALLS", label: "Answer customer calls" },
  { value: "CAPTURE_CUSTOMER_DETAILS", label: "Capture customer details" },
  { value: "SUMMARIZE_CONVERSATIONS", label: "Summarize conversations" },
  { value: "CREATE_ACTION_ITEMS", label: "Create action items" },
  { value: "REMEMBER_CUSTOMER_CONTEXT", label: "Remember customer context" },
  { value: "REQUEST_APPOINTMENTS", label: "Request appointments" },
  { value: "ROUTE_URGENT_ISSUES", label: "Route urgent issues" },
  { value: "ORGANIZE_OPERATIONAL_INFORMATION", label: "Organize operational information" },
  {
    value: "SUPPORT_ORDER_SERVICE_QUESTIONS",
    label: "Support order and service questions",
  },
  { value: "PREPARE_FOLLOW_UP_NOTES", label: "Prepare follow-up notes" },
] as const;

export const ENABLED_CAPABILITY_VALUES = [
  "ANSWER_CUSTOMER_CALLS",
  "CAPTURE_CUSTOMER_DETAILS",
  "SUMMARIZE_CONVERSATIONS",
  "CREATE_ACTION_ITEMS",
  "REMEMBER_CUSTOMER_CONTEXT",
  "REQUEST_APPOINTMENTS",
  "ROUTE_URGENT_ISSUES",
  "ORGANIZE_OPERATIONAL_INFORMATION",
  "SUPPORT_ORDER_SERVICE_QUESTIONS",
  "PREPARE_FOLLOW_UP_NOTES",
] as const;

export const COMMUNICATION_TONE_LABELS: Record<(typeof COMMUNICATION_TONES)[number], string> = {
  PROFESSIONAL: "Professional",
  FRIENDLY: "Friendly",
  CASUAL: "Casual",
  CONCISE: "Concise",
};

export const COMMUNICATION_TONE_DESCRIPTIONS: Record<
  (typeof COMMUNICATION_TONES)[number],
  string
> = {
  PROFESSIONAL: "Structured and business-like",
  FRIENDLY: "Warm and conversational",
  CASUAL: "Relaxed and approachable",
  CONCISE: "Short and efficient",
};

export const WEEKDAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export type BusinessHoursDay = {
  closed: boolean;
  open?: string;
  close?: string;
};

export type BusinessHours = Record<Weekday, BusinessHoursDay>;

export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  monday: { closed: false, open: "09:00", close: "17:00" },
  tuesday: { closed: false, open: "09:00", close: "17:00" },
  wednesday: { closed: false, open: "09:00", close: "17:00" },
  thursday: { closed: false, open: "09:00", close: "17:00" },
  friday: { closed: false, open: "09:00", close: "17:00" },
  saturday: { closed: true },
  sunday: { closed: true },
};

export const DEFAULT_GREETING_MESSAGE =
  "Hi, thanks for contacting us. This is ZOL, the AI employee for the business. How can I help you today?";

export const DEFAULT_COMMON_SCENARIOS_PLACEHOLDER = `- Customers ask about order status
- Customers ask about appointment availability
- Customers ask about returns or exchanges
- Customers ask for pricing
- Customers ask for service updates
- Customers need urgent support`;

export const DEFAULT_ENABLED_CAPABILITIES = [...ENABLED_CAPABILITY_VALUES];

const businessHoursDaySchema = z
  .object({
    closed: z.boolean(),
    open: z.string().optional(),
    close: z.string().optional(),
  })
  .refine(
    (day) => day.closed || (Boolean(day.open) && Boolean(day.close)),
    { message: "Open and close times are required when not closed" },
  );

const businessHoursSchema = z.object({
  monday: businessHoursDaySchema,
  tuesday: businessHoursDaySchema,
  wednesday: businessHoursDaySchema,
  thursday: businessHoursDaySchema,
  friday: businessHoursDaySchema,
  saturday: businessHoursDaySchema,
  sunday: businessHoursDaySchema,
});

export const aiEmployeeSettingsSchema = z.object({
  displayName: z.string().trim().min(1, "AI employee name is required").max(80),
  greetingMessage: z.string().trim().min(1, "Greeting message is required").max(2000),
  communicationTone: z.enum(COMMUNICATION_TONES).optional().default("PROFESSIONAL"),
  businessContext: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  commonScenarios: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  businessHours: businessHoursSchema,
  escalationPhone: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  escalationEmail: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Enter a valid escalation email",
    }),
  enabledCapabilities: z
    .array(z.enum(ENABLED_CAPABILITY_VALUES))
    .min(1, "Select at least one capability"),
});

export type AIEmployeeSettingsFormValues = z.infer<typeof aiEmployeeSettingsSchema>;

export function parseBusinessHoursJson(value: unknown): BusinessHours {
  const parsed = businessHoursSchema.safeParse(value);
  return parsed.success ? parsed.data : DEFAULT_BUSINESS_HOURS;
}

export function parseEnabledCapabilitiesJson(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [...DEFAULT_ENABLED_CAPABILITIES];
  }

  const validCapabilities = [...ENABLED_CAPABILITY_VALUES];
  const filtered = value.filter(
    (capability): capability is (typeof ENABLED_CAPABILITY_VALUES)[number] =>
      typeof capability === "string" &&
      validCapabilities.includes(capability as (typeof ENABLED_CAPABILITY_VALUES)[number]),
  );

  return filtered.length > 0 ? filtered : [...DEFAULT_ENABLED_CAPABILITIES];
}

export function parseCommonScenariosJson(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string").join("\n");
  }

  return "";
}

export function commonScenariosToJson(value: string | undefined) {
  if (!value) {
    return null;
  }

  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.length > 0 ? lines : null;
}
