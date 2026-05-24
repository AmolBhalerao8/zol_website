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

export type TekmetricRawCustomer = {
  id: string | number;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  email?: string;
  [key: string]: unknown;
};

export type TekmetricRawVehicle = {
  id: string | number;
  customerId?: string | number;
  year?: string | number;
  make?: string;
  model?: string;
  vin?: string;
  [key: string]: unknown;
};

export type TekmetricRawAppointment = {
  id: string | number;
  customerId?: string | number;
  startTime?: string;
  scheduledAt?: string;
  status?: string;
  description?: string;
  summary?: string;
  [key: string]: unknown;
};

export type TekmetricRawRepairOrder = {
  id: string | number;
  customerId?: string | number;
  status?: string;
  total?: string | number;
  totalAmount?: string | number;
  description?: string;
  summary?: string;
  [key: string]: unknown;
};

export type TekmetricListResponse<T> = T[] | { data?: T[]; content?: T[] };

export type TekmetricSyncRecordCounts = {
  customers: number;
  vehicles: number;
  appointments: number;
  repairOrders: number;
  linkedCustomers: number;
};

export type TekmetricSyncResult =
  | {
      success: true;
      syncLogId: string;
      recordsSynced: TekmetricSyncRecordCounts;
      mockMode: boolean;
    }
  | {
      success: false;
      syncLogId?: string;
      message: string;
      recordsSynced?: Partial<TekmetricSyncRecordCounts>;
      mockMode: boolean;
    };

export type NormalizedTekmetricCustomer = {
  externalId: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  rawData: Record<string, unknown>;
};

export type NormalizedTekmetricVehicle = {
  externalId: string;
  tekmetricCustomerId: string | null;
  year: string | null;
  make: string | null;
  model: string | null;
  vin: string | null;
  rawData: Record<string, unknown>;
};

export type NormalizedTekmetricAppointment = {
  externalId: string;
  tekmetricCustomerId: string | null;
  scheduledAt: Date | null;
  status: string | null;
  summary: string | null;
  rawData: Record<string, unknown>;
};

export type NormalizedTekmetricRepairOrder = {
  externalId: string;
  tekmetricCustomerId: string | null;
  status: string | null;
  totalAmount: string | null;
  summary: string | null;
  rawData: Record<string, unknown>;
};
