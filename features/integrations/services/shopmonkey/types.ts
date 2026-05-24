export const SHOPMONKEY_DEFAULT_API_BASE_URL = "https://api.shopmonkey.cloud/v3";

export type ShopmonkeyCredentials = {
  apiKey: string;
  locationId?: string;
  apiBaseUrl?: string;
};

export type ShopmonkeyLocation = {
  id?: string;
  name?: string;
  companyId?: string;
  companyName?: string | null;
};

export type ShopmonkeyLocationsResponse = {
  success?: boolean;
  message?: string;
  data?: ShopmonkeyLocation[];
};

export type ShopmonkeyApiKeyStatusResponse = {
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>;
};

export type ShopmonkeyConnectionMetadata = {
  locationId?: string | null;
  locationName?: string | null;
  apiBaseUrl: string;
  connectedAt?: string;
};

export type ShopmonkeyConnectionTestResult =
  | {
      success: true;
      locationId?: string;
      locationName?: string;
      apiBaseUrl: string;
    }
  | {
      success: false;
      message: string;
    };
