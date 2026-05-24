import {
  getMockTekmetricAppointments,
  getMockTekmetricCustomers,
  getMockTekmetricRepairOrders,
  getMockTekmetricVehicles,
} from "@/features/integrations/services/tekmetric/mock-tekmetric-data";
import {
  TEKMETRIC_DEFAULT_API_BASE_URL,
  type TekmetricCredentials,
  type TekmetricListResponse,
  type TekmetricRawAppointment,
  type TekmetricRawCustomer,
  type TekmetricRawRepairOrder,
  type TekmetricRawVehicle,
  type TekmetricShop,
  type TekmetricShopsResponse,
  type TekmetricTokenResponse,
} from "@/features/integrations/services/tekmetric/types";
import { isTekmetricMockMode } from "@/features/integrations/utils/tekmetric-mock-mode";

export class TekmetricClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "TekmetricClientError";
    this.status = status;
  }
}

function normalizeBaseUrl(apiBaseUrl?: string): string {
  const trimmed = apiBaseUrl?.trim() || TEKMETRIC_DEFAULT_API_BASE_URL;
  return trimmed.replace(/\/$/, "");
}

export class TekmetricClient {
  private readonly baseUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly shopId: string;
  private accessToken: string | null = null;

  constructor(credentials: TekmetricCredentials) {
    this.baseUrl = normalizeBaseUrl(credentials.apiBaseUrl);
    this.clientId = credentials.clientId.trim();
    this.clientSecret = credentials.apiKey.trim();
    this.shopId = credentials.shopId.trim();
  }

  getShopId(): string {
    return this.shopId;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/api/v1${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(init.headers ?? {}),
      },
    });

    if (!response.ok) {
      const body = await response.text();
      throw new TekmetricClientError(
        body || `Tekmetric request failed with status ${response.status}`,
        response.status,
      );
    }

    return response.json() as Promise<T>;
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    const basicAuth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");

    const response = await fetch(`${this.baseUrl}/api/v1/oauth/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const body = await response.text();
      throw new TekmetricClientError(
        body || `Tekmetric authentication failed with status ${response.status}`,
        response.status,
      );
    }

    const data = (await response.json()) as TekmetricTokenResponse;

    if (!data.access_token) {
      throw new TekmetricClientError("Tekmetric authentication did not return an access token", 401);
    }

    this.accessToken = data.access_token;
    return this.accessToken;
  }

  async listShops(): Promise<TekmetricShop[]> {
    const response = await this.request<TekmetricShop[] | TekmetricShopsResponse>("/shops");

    if (Array.isArray(response)) {
      return response;
    }

    return response.data ?? response.content ?? [];
  }

  async getShop(): Promise<TekmetricShop | null> {
    const shops = await this.listShops();
    const shopIdNumber = Number(this.shopId);

    return (
      shops.find((shop) => shop.id === shopIdNumber || String(shop.id) === this.shopId) ?? null
    );
  }

  private unwrapList<T>(response: TekmetricListResponse<T>): T[] {
    if (Array.isArray(response)) {
      return response;
    }

    return response.data ?? response.content ?? [];
  }

  async getCustomers(): Promise<TekmetricRawCustomer[]> {
    if (isTekmetricMockMode()) {
      return getMockTekmetricCustomers();
    }

    const response = await this.request<TekmetricListResponse<TekmetricRawCustomer>>(
      `/shops/${this.shopId}/customers`,
    );
    return this.unwrapList(response);
  }

  async getVehicles(): Promise<TekmetricRawVehicle[]> {
    if (isTekmetricMockMode()) {
      return getMockTekmetricVehicles();
    }

    const response = await this.request<TekmetricListResponse<TekmetricRawVehicle>>(
      `/shops/${this.shopId}/vehicles`,
    );
    return this.unwrapList(response);
  }

  async getAppointments(): Promise<TekmetricRawAppointment[]> {
    if (isTekmetricMockMode()) {
      return getMockTekmetricAppointments();
    }

    const response = await this.request<TekmetricListResponse<TekmetricRawAppointment>>(
      `/shops/${this.shopId}/appointments`,
    );
    return this.unwrapList(response);
  }

  async getRepairOrders(): Promise<TekmetricRawRepairOrder[]> {
    if (isTekmetricMockMode()) {
      return getMockTekmetricRepairOrders();
    }

    const response = await this.request<TekmetricListResponse<TekmetricRawRepairOrder>>(
      `/shops/${this.shopId}/repair-orders`,
    );
    return this.unwrapList(response);
  }
}

export function createTekmetricClient(credentials: TekmetricCredentials): TekmetricClient {
  return new TekmetricClient(credentials);
}
