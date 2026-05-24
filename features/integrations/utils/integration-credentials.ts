import type { Integration, IntegrationStatus } from "@prisma/client";

import { decrypt, encrypt } from "@/lib/encryption";
import type { TekmetricCredentials } from "@/features/integrations/services/tekmetric/types";

export function encryptTekmetricCredentials(credentials: TekmetricCredentials): string {
  return encrypt(JSON.stringify(credentials));
}

export function decryptTekmetricCredentials(payload: string): TekmetricCredentials {
  return JSON.parse(decrypt(payload)) as TekmetricCredentials;
}

export function hasStoredTekmetricCredentials(integration: Integration | null): boolean {
  return Boolean(integration?.credentialsEncrypted);
}

export function getIntegrationStatusLabel(status: IntegrationStatus): string {
  switch (status) {
    case "CONNECTED":
      return "Connected";
    case "CONNECTING":
      return "Connecting";
    case "FAILED":
      return "Connection failed";
    default:
      return "Not connected";
  }
}

export function getTekmetricShopName(
  integration: Pick<Integration, "metadata"> | null,
): string | null {
  if (!integration?.metadata || typeof integration.metadata !== "object") {
    return null;
  }

  const metadata = integration.metadata as Record<string, unknown>;
  return typeof metadata.shopName === "string" ? metadata.shopName : null;
}
