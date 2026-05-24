import type { IntegrationProvider, IntegrationStatus } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import { Store, Wrench } from "lucide-react";

export type IntegrationProviderDefinition = {
  id: IntegrationProvider;
  name: string;
  icon: LucideIcon;
  accentClassName: string;
};

export const INTEGRATION_PROVIDERS: IntegrationProviderDefinition[] = [
  {
    id: "TEKMETRIC",
    name: "Tekmetric",
    icon: Wrench,
    accentClassName: "bg-zinc-950 text-white",
  },
  {
    id: "SHOPMONKEY",
    name: "Shopmonkey",
    icon: Store,
    accentClassName: "bg-orange-500 text-white",
  },
];

export function getIntegrationProviderDefinition(
  provider: IntegrationProvider,
): IntegrationProviderDefinition {
  const match = INTEGRATION_PROVIDERS.find((entry) => entry.id === provider);
  if (!match) {
    throw new Error(`Unknown integration provider: ${provider}`);
  }
  return match;
}

export function getProviderStatus(
  integration: { status: IntegrationStatus } | null | undefined,
): IntegrationStatus {
  return integration?.status ?? "NOT_CONNECTED";
}
