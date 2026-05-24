import { TekmetricClientError, createTekmetricClient } from "@/features/integrations/services/tekmetric/tekmetric-client";
import type {
  TekmetricConnectionTestResult,
  TekmetricCredentials,
} from "@/features/integrations/services/tekmetric/types";
import { isTekmetricMockMode } from "@/features/integrations/utils/tekmetric-mock-mode";

function getErrorMessage(error: unknown): string {
  if (error instanceof TekmetricClientError) {
    if (error.status === 401 || error.status === 403) {
      return "Could not authenticate with Tekmetric. Check your client ID and API key.";
    }

    if (error.status === 404) {
      return "Tekmetric could not find the requested shop or endpoint.";
    }

    return "Tekmetric rejected the connection. Verify your credentials and shop ID.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to connect to Tekmetric.";
}

export async function testTekmetricConnection(
  credentials: TekmetricCredentials,
): Promise<TekmetricConnectionTestResult> {
  if (isTekmetricMockMode()) {
    return {
      success: true,
      shopId: credentials.shopId,
      shopName: "Demo Auto Shop (Mock)",
      apiBaseUrl: credentials.apiBaseUrl ?? "https://shop.tekmetric.com",
    };
  }

  try {
    const client = createTekmetricClient(credentials);
    await client.getAccessToken();

    const shop = await client.getShop();

    if (!shop) {
      return {
        success: false,
        message: "Connected to Tekmetric, but this shop ID was not found in your account.",
      };
    }

    return {
      success: true,
      shopId: credentials.shopId,
      shopName: shop.name ?? shop.nickname,
      apiBaseUrl: client.getBaseUrl(),
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}
