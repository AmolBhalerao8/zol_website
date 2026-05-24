export const TEKMETRIC_DEFAULT_API_BASE_URL = "https://shop.tekmetric.com";

export type TekmetricCredentials = {
  clientId: string;
  apiKey: string;
  shopId: string;
  apiBaseUrl?: string;
};

export type TekmetricShop = {
  id: number;
  name?: string;
  nickname?: string;
};

export type TekmetricConnectionMetadata = {
  shopId: string;
  shopName?: string;
  apiBaseUrl: string;
  connectedAt?: string;
};

export type TekmetricConnectionTestResult =
  | {
      success: true;
      shopName?: string;
      shopId: string;
      apiBaseUrl: string;
    }
  | {
      success: false;
      message: string;
    };

export type TekmetricTokenResponse = {
  access_token?: string;
  token_type?: string;
  scope?: string;
};

export type TekmetricShopsResponse = {
  data?: TekmetricShop[];
  content?: TekmetricShop[];
};
