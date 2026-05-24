export type IntegrationActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  success?: boolean;
  message?: string;
  shopName?: string;
  locationName?: string;
};
