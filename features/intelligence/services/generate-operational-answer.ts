import type {
  ClassifiedIntelligenceQuery,
  IntelligenceQueryResult,
  IntelligenceRetrievalResult,
} from "@/features/intelligence/types/intelligence-types";

function buildFallbackAnswer(
  query: string,
  retrieval: IntelligenceRetrievalResult,
): IntelligenceQueryResult {
  const count = retrieval.recordCount;

  if (count === 0) {
    return {
      query,
      queryType: retrieval.queryType,
      answer: "I couldn't find enough operational data to answer that yet.",
      summary: null,
      followUpInsights: [
        "Try syncing Tekmetric or capturing more customer conversations first.",
      ],
      sources: [],
      dataAvailable: false,
    };
  }

  let answer = `I found ${count} relevant record${count === 1 ? "" : "s"} in your workspace.`;

  if (retrieval.queryType === "appointments") {
    answer = `There ${count === 1 ? "is" : "are"} ${count} scheduled appointment${count === 1 ? "" : "s"} matching your question.`;
  } else if (retrieval.queryType === "customers") {
    answer = `I found ${count} customer${count === 1 ? "" : "s"} with relevant follow-up or activity context.`;
  } else if (retrieval.queryType === "conversations") {
    answer = `I found ${count} conversation${count === 1 ? "" : "s"} that match your operational question.`;
  } else if (retrieval.queryType === "repair_orders") {
    answer = `There ${count === 1 ? "is" : "are"} ${count} repair order${count === 1 ? "" : "s"} in scope for this question.`;
  } else if (retrieval.queryType === "operational_trends") {
    answer = `I reviewed recent conversations and operational signals across ${count} recent records.`;
  } else if (retrieval.queryType === "memory") {
    answer = `I found ${count} stored customer memory item${count === 1 ? "" : "s"} related to your question.`;
  }

  return {
    query,
    queryType: retrieval.queryType,
    answer,
    summary: answer,
    followUpInsights: [],
    sources: retrieval.sources,
    dataAvailable: true,
  };
}

export async function generateOperationalAnswer(input: {
  query: string;
  classified: ClassifiedIntelligenceQuery;
  retrieval: IntelligenceRetrievalResult;
  workspaceName: string;
}): Promise<IntelligenceQueryResult> {
  if (input.retrieval.recordCount === 0) {
    return buildFallbackAnswer(input.query, input.retrieval);
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return buildFallbackAnswer(input.query, input.retrieval);
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
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: [
              "You are ZOL operational intelligence for a business workspace.",
              "Answer ONLY using the retrieved operational data provided.",
              "Do not invent counts, customers, appointments, or repair orders.",
              "If the retrieved data is insufficient, say: \"I couldn't find enough operational data to answer that yet.\"",
              "Return JSON: {\"answer\":\"...\",\"summary\":\"...\",\"followUpInsights\":[\"...\"]}",
              "Tone: clear, operational, business-aware. Avoid chatbot language.",
            ].join(" "),
          },
          {
            role: "user",
            content: JSON.stringify({
              workspaceName: input.workspaceName,
              query: input.query,
              queryType: input.classified.queryType,
              timeframe: input.classified.timeframe?.label ?? null,
              retrievedData: input.retrieval.payload,
              sourceCount: input.retrieval.recordCount,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      return buildFallbackAnswer(input.query, input.retrieval);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return buildFallbackAnswer(input.query, input.retrieval);
    }

    const parsed = JSON.parse(content) as {
      answer?: string;
      summary?: string;
      followUpInsights?: string[];
    };

    const answer = parsed.answer?.trim();
    if (!answer || answer.toLowerCase().includes("couldn't find enough operational data")) {
      return buildFallbackAnswer(input.query, input.retrieval);
    }

    return {
      query: input.query,
      queryType: input.retrieval.queryType,
      answer,
      summary: parsed.summary?.trim() ?? null,
      followUpInsights: Array.isArray(parsed.followUpInsights)
        ? parsed.followUpInsights.filter((item) => typeof item === "string").slice(0, 3)
        : [],
      sources: input.retrieval.sources,
      dataAvailable: true,
    };
  } catch {
    return buildFallbackAnswer(input.query, input.retrieval);
  }
}
