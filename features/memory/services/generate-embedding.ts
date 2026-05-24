const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;

export type EmbeddingVector = number[];

export function hasEmbeddingConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export async function generateEmbedding(text: string): Promise<EmbeddingVector | null> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const cleaned = text.trim();

  if (!apiKey || !cleaned) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: cleaned,
      dimensions: EMBEDDING_DIMENSIONS,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `OpenAI embeddings request failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    data?: Array<{ embedding?: number[] }>;
  };

  const embedding = data.data?.[0]?.embedding;

  if (!embedding || embedding.length !== EMBEDDING_DIMENSIONS) {
    return null;
  }

  return embedding;
}

export function embeddingToSqlVector(embedding: EmbeddingVector): string {
  return `[${embedding.join(",")}]`;
}
