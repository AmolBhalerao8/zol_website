import { z } from "zod";

import { SHOPMONKEY_DEFAULT_API_BASE_URL } from "@/features/integrations/services/shopmonkey/types";

export const shopmonkeyConnectSchema = z.object({
  apiKey: z.string().trim().min(1, "API key is required"),
  locationId: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  apiBaseUrl: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => !value || z.string().url().safeParse(value).success, {
      message: "Enter a valid API URL",
    }),
});

export type ShopmonkeyConnectInput = z.infer<typeof shopmonkeyConnectSchema>;

export const shopmonkeyTestSchema = shopmonkeyConnectSchema;

export function getDefaultShopmonkeyApiBaseUrl(): string {
  return SHOPMONKEY_DEFAULT_API_BASE_URL;
}
