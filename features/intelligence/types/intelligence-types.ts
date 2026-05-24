export type IntelligenceQueryType =
  | "appointments"
  | "customers"
  | "conversations"
  | "repair_orders"
  | "operational_trends"
  | "memory";

export type IntelligenceTimeframe = {
  label: string;
  start?: Date;
  end?: Date;
};

export type ClassifiedIntelligenceQuery = {
  queryType: IntelligenceQueryType;
  entities: string[];
  timeframe: IntelligenceTimeframe | null;
  filters: Record<string, string>;
  confidence: number;
};

export type IntelligenceSourceType =
  | "conversation"
  | "customer"
  | "appointment"
  | "repair_order"
  | "memory"
  | "action_item";

export type IntelligenceSourceRecord = {
  id: string;
  type: IntelligenceSourceType;
  title: string;
  summary: string;
  href?: string;
  metadata?: Record<string, string>;
};

export type IntelligenceRetrievalResult = {
  queryType: IntelligenceQueryType;
  payload: Record<string, unknown>;
  sources: IntelligenceSourceRecord[];
  recordCount: number;
};

export type IntelligenceQueryResult = {
  query: string;
  queryType: IntelligenceQueryType;
  answer: string;
  summary: string | null;
  followUpInsights: string[];
  sources: IntelligenceSourceRecord[];
  dataAvailable: boolean;
};

export const SUGGESTED_INTELLIGENCE_QUERIES = [
  "What conversations were urgent this week?",
  "Which customers need follow-up?",
  "What appointments are scheduled tomorrow?",
  "What were the most common customer requests?",
  "Which repair orders are still open?",
] as const;
