import { processIntelligenceQuery } from "@/features/intelligence/services/process-intelligence-query";
import {
  ensureIntelligenceSession,
  saveIntelligenceExchange,
} from "@/features/intelligence/services/save-intelligence-chat";
import type { IntelligenceQueryResult } from "@/features/intelligence/types/intelligence-types";

type ExecuteIntelligenceQueryInput = {
  workspaceId: string;
  workspaceName: string;
  query: string;
  sessionId?: string | null;
};

export type ExecuteIntelligenceQueryResult = {
  result: IntelligenceQueryResult;
  query: string;
  sessionId: string;
};

export async function executeIntelligenceQuery({
  workspaceId,
  workspaceName,
  query,
  sessionId,
}: ExecuteIntelligenceQueryInput): Promise<ExecuteIntelligenceQueryResult> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    throw new Error("Enter a question about your business operations.");
  }

  const resolvedSessionId = await ensureIntelligenceSession(workspaceId, sessionId);

  const result = await processIntelligenceQuery({
    workspaceId,
    workspaceName,
    query: trimmedQuery,
  });

  await saveIntelligenceExchange({
    sessionId: resolvedSessionId,
    query: trimmedQuery,
    result,
  });

  return {
    result,
    query: trimmedQuery,
    sessionId: resolvedSessionId,
  };
}
