import { z } from "zod";

export const BUSINESS_TYPES = [
  "Auto Repair Shop",
  "Apparel Store",
  "Home Services",
  "Salon / Clinic",
  "Local Retail",
  "Other",
] as const;

export const TIMEZONES = [
  { value: "America/Los_Angeles", label: "Pacific Time (Los Angeles)" },
  { value: "America/Denver", label: "Mountain Time (Denver)" },
  { value: "America/Chicago", label: "Central Time (Chicago)" },
  { value: "America/New_York", label: "Eastern Time (New York)" },
  { value: "America/Phoenix", label: "Arizona (Phoenix)" },
  { value: "America/Anchorage", label: "Alaska (Anchorage)" },
  { value: "Pacific/Honolulu", label: "Hawaii (Honolulu)" },
] as const;

export const DEFAULT_TIMEZONE = "America/Los_Angeles";

function normalizeWebsite(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

export const onboardingSchema = z.object({
  name: z.string().trim().min(1, "Business name is required").max(120),
  businessType: z.enum(BUSINESS_TYPES, { message: "Select a business type" }),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  website: z
    .string()
    .trim()
    .optional()
    .transform(normalizeWebsite)
    .refine(
      (value) => {
        if (!value) {
          return true;
        }

        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Enter a valid website URL" },
    ),
  timezone: z.string().trim().min(1, "Timezone is required"),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
