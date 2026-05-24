import { z } from "zod";

import { TEKMETRIC_DEFAULT_API_BASE_URL } from "@/features/integrations/services/tekmetric/types";

export const tekmetricConnectSchema = z.object({
  clientId: z.string().trim().min(1, "Client ID is required"),
  apiKey: z.string().trim().min(1, "API key is required"),
  shopId: z.string().trim().min(1, "Shop ID is required"),
  apiBaseUrl: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => !value || z.string().url().safeParse(value).success, {
      message: "Enter a valid API URL",
    }),
});

export type TekmetricConnectInput = z.infer<typeof tekmetricConnectSchema>;

export const tekmetricTestSchema = tekmetricConnectSchema;

export function getDefaultTekmetricApiBaseUrl(): string {
  return TEKMETRIC_DEFAULT_API_BASE_URL;
}
