const RETRYABLE_CODES = new Set(["P1001", "P1002", "P1008", "P1017", "P2024"]);

function isRetryableDbError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const code = "code" in error ? String((error as { code?: string }).code) : "";
  if (RETRYABLE_CODES.has(code)) {
    return true;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("connection") ||
    message.includes("timeout") ||
    message.includes("pool") ||
    message.includes("max clients") ||
    message.includes("emaxconnsession") ||
    message.includes("too many connections") ||
    message.includes("can't reach database server")
  );
}

export async function withDbRetry<T>(operation: () => Promise<T>, retries = 2): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === retries || !isRetryableDbError(error)) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }

  throw lastError;
}
