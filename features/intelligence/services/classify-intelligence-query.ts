import type {
  ClassifiedIntelligenceQuery,
  IntelligenceQueryType,
  IntelligenceTimeframe,
} from "@/features/intelligence/types/intelligence-types";

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

function parseTimeframe(query: string): IntelligenceTimeframe | null {
  const now = new Date();

  if (/\btomorrow\b/.test(query)) {
    const start = new Date(now);
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { label: "tomorrow", start, end };
  }

  if (/\bthis week\b|\bpast week\b|\blast 7 days\b/.test(query)) {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    return { label: "this week", start, end: now };
  }

  if (/\btoday\b/.test(query)) {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return { label: "today", start, end };
  }

  if (/\brecently\b|\brecent\b/.test(query)) {
    const start = new Date(now);
    start.setDate(start.getDate() - 14);
    return { label: "recent", start, end: now };
  }

  return null;
}

function extractEntities(query: string): string[] {
  const entities: string[] = [];
  const topicPatterns = [
    "brake",
    "appointment",
    "repair",
    "shipment",
    "follow-up",
    "callback",
    "urgent",
    "estimate",
  ];

  for (const topic of topicPatterns) {
    if (query.includes(topic)) {
      entities.push(topic);
    }
  }

  return entities;
}

function classifyByHeuristics(query: string): ClassifiedIntelligenceQuery | null {
  const normalized = normalizeQuery(query);
  const timeframe = parseTimeframe(normalized);
  const entities = extractEntities(normalized);
  const filters: Record<string, string> = {};

  if (/\bappointment|scheduled|upcoming|tomorrow\b/.test(normalized)) {
    return {
      queryType: "appointments",
      entities,
      timeframe,
      filters,
      confidence: 0.9,
    };
  }

  if (/\bfollow-up|callback|need follow|customers needing\b/.test(normalized)) {
    filters.needsFollowUp = "true";
    return {
      queryType: "customers",
      entities,
      timeframe,
      filters,
      confidence: 0.88,
    };
  }

  if (/\brepair order|open repair|pending work|unresolved service\b/.test(normalized)) {
    filters.openOnly = "true";
    return {
      queryType: "repair_orders",
      entities,
      timeframe,
      filters,
      confidence: 0.9,
    };
  }

  if (
    /\bcommon issue|recurring|most common|trends|complaint|requests this week\b/.test(normalized)
  ) {
    return {
      queryType: "operational_trends",
      entities,
      timeframe: timeframe ?? parseTimeframe("this week"),
      filters,
      confidence: 0.85,
    };
  }

  if (/\bmemory|preference|repeated issue|communication style\b/.test(normalized)) {
    return {
      queryType: "memory",
      entities,
      timeframe,
      filters,
      confidence: 0.82,
    };
  }

  if (/\bconversation|call|urgent|transcript|who called\b/.test(normalized)) {
    if (/\burgent\b/.test(normalized)) {
      filters.urgency = "high";
    }
    return {
      queryType: "conversations",
      entities,
      timeframe,
      filters,
      confidence: 0.86,
    };
  }

  if (/\bcustomer|repeat customer|recent customer\b/.test(normalized)) {
    return {
      queryType: "customers",
      entities,
      timeframe,
      filters,
      confidence: 0.75,
    };
  }

  return null;
}

async function classifyWithOpenAI(query: string): Promise<ClassifiedIntelligenceQuery | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              'Classify an operational business query. Return JSON: {"queryType":"appointments|customers|conversations|repair_orders|operational_trends|memory","entities":[],"timeframeLabel":null,"filters":{},"confidence":0.0}',
          },
          { role: "user", content: query },
        ],
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return null;
    }

    const parsed = JSON.parse(content) as {
      queryType?: IntelligenceQueryType;
      entities?: string[];
      timeframeLabel?: string | null;
      filters?: Record<string, string>;
      confidence?: number;
    };

    const validTypes: IntelligenceQueryType[] = [
      "appointments",
      "customers",
      "conversations",
      "repair_orders",
      "operational_trends",
      "memory",
    ];

    if (!parsed.queryType || !validTypes.includes(parsed.queryType)) {
      return null;
    }

    return {
      queryType: parsed.queryType,
      entities: Array.isArray(parsed.entities) ? parsed.entities.map(String) : [],
      timeframe: parsed.timeframeLabel
        ? parseTimeframe(parsed.timeframeLabel) ?? { label: parsed.timeframeLabel }
        : parseTimeframe(query),
      filters: parsed.filters ?? {},
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.6,
    };
  } catch {
    return null;
  }
}

export async function classifyIntelligenceQuery(
  query: string,
): Promise<ClassifiedIntelligenceQuery> {
  const heuristic = classifyByHeuristics(query);
  if (heuristic && heuristic.confidence >= 0.8) {
    return heuristic;
  }

  const aiResult = await classifyWithOpenAI(query);
  if (aiResult) {
    return aiResult;
  }

  if (heuristic) {
    return heuristic;
  }

  return {
    queryType: "operational_trends",
    entities: extractEntities(normalizeQuery(query)),
    timeframe: parseTimeframe(normalizeQuery(query)) ?? parseTimeframe("this week"),
    filters: {},
    confidence: 0.5,
  };
}
