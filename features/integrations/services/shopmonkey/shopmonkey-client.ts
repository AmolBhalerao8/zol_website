import {
  SHOPMONKEY_DEFAULT_API_BASE_URL,
  type ShopmonkeyApiKeyStatusResponse,
  type ShopmonkeyCredentials,
  type ShopmonkeyLocation,
  type ShopmonkeyLocationsResponse,
} from "@/features/integrations/services/shopmonkey/types";

export class ShopmonkeyClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ShopmonkeyClientError";
    this.status = status;
  }
}

function normalizeBaseUrl(apiBaseUrl?: string): string {
  const trimmed = apiBaseUrl?.trim() || SHOPMONKEY_DEFAULT_API_BASE_URL;
  return trimmed.replace(/\/$/, "");
}

export class ShopmonkeyClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly locationId?: string;

  constructor(credentials: ShopmonkeyCredentials) {
    this.baseUrl = normalizeBaseUrl(credentials.apiBaseUrl);
    this.apiKey = credentials.apiKey.trim();
    this.locationId = credentials.locationId?.trim() || undefined;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getLocationId(): string | undefined {
    return this.locationId;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
        ...(init.headers ?? {}),
      },
    });

    if (!response.ok) {
      let message = `Shopmonkey request failed with status ${response.status}`;

      try {
        const body = (await response.json()) as { message?: string };
        if (body.message) {
          message = body.message;
        }
      } catch {
        const text = await response.text();
        if (text) {
          message = text;
        }
      }

      throw new ShopmonkeyClientError(message, response.status);
    }

    return response.json() as Promise<T>;
  }

  async checkApiKeyStatus(): Promise<ShopmonkeyApiKeyStatusResponse> {
    return this.request<ShopmonkeyApiKeyStatusResponse>("/auth/api_key/status");
  }

  async listLocations(): Promise<ShopmonkeyLocation[]> {
    const response = await this.request<ShopmonkeyLocationsResponse>("/location");

    if (response.success === false) {
      throw new ShopmonkeyClientError(response.message ?? "Unable to load Shopmonkey locations.", 400);
    }

    return response.data ?? [];
  }

  async resolveLocation(): Promise<ShopmonkeyLocation | null> {
    const locations = await this.listLocations();

    if (locations.length === 0) {
      return null;
    }

    if (this.locationId) {
      return (
        locations.find(
          (location) => location.id === this.locationId || String(location.id) === this.locationId,
        ) ?? null
      );
    }

    return locations[0] ?? null;
  }
}

export function createShopmonkeyClient(credentials: ShopmonkeyCredentials): ShopmonkeyClient {
  return new ShopmonkeyClient(credentials);
}
