import {
  ShopmonkeyClientError,
  createShopmonkeyClient,
} from "@/features/integrations/services/shopmonkey/shopmonkey-client";
import type {
  ShopmonkeyConnectionTestResult,
  ShopmonkeyCredentials,
} from "@/features/integrations/services/shopmonkey/types";

function getErrorMessage(error: unknown): string {
  if (error instanceof ShopmonkeyClientError) {
    if (error.status === 401 || error.status === 403) {
      return "Could not authenticate with Shopmonkey. Check your API key and permissions.";
    }

    return error.message || "Shopmonkey rejected the connection.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to connect to Shopmonkey.";
}

export async function testShopmonkeyConnection(
  credentials: ShopmonkeyCredentials,
): Promise<ShopmonkeyConnectionTestResult> {
  try {
    const client = createShopmonkeyClient(credentials);
    const status = await client.checkApiKeyStatus();

    if (status.success === false) {
      return {
        success: false,
        message: status.message ?? "Shopmonkey could not verify this API key.",
      };
    }

    const location = await client.resolveLocation();

    if (credentials.locationId && !location) {
      return {
        success: false,
        message: "Connected to Shopmonkey, but this location ID was not found in your account.",
      };
    }

    return {
      success: true,
      locationId: location?.id ?? credentials.locationId,
      locationName: location?.name ?? location?.companyName ?? undefined,
      apiBaseUrl: client.getBaseUrl(),
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}
