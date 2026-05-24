import type { Integration, IntegrationStatus } from "@prisma/client";

import { decrypt, encrypt } from "@/lib/encryption";
import type { TekmetricCredentials } from "@/features/integrations/services/tekmetric/types";
import type { ShopmonkeyCredentials } from "@/features/integrations/services/shopmonkey/types";

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

export function encryptShopmonkeyCredentials(credentials: ShopmonkeyCredentials): string {
  return encrypt(JSON.stringify(credentials));
}

export function decryptShopmonkeyCredentials(payload: string): ShopmonkeyCredentials {
  return JSON.parse(decrypt(payload)) as ShopmonkeyCredentials;
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

export function getShopmonkeyLocationName(
  integration: Pick<Integration, "metadata"> | null,
): string | null {
  if (!integration?.metadata || typeof integration.metadata !== "object") {
    return null;
  }

  const metadata = integration.metadata as Record<string, unknown>;
  return typeof metadata.locationName === "string" ? metadata.locationName : null;
}

export function getIntegrationMetadataValue(
  integration: Pick<Integration, "metadata"> | null,
  key: string,
): string {
  if (!integration?.metadata || typeof integration.metadata !== "object") {
    return "";
  }

  const value = (integration.metadata as Record<string, unknown>)[key];
  return typeof value === "string" ? value : "";
}
