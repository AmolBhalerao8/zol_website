"use server";

import { executeIntelligenceQuery } from "@/features/intelligence/services/execute-intelligence-query";
import type { IntelligenceQueryResult } from "@/features/intelligence/types/intelligence-types";
import { requireWorkspace } from "@/features/workspace";

export type IntelligenceActionState = {
  error?: string;
  result?: IntelligenceQueryResult;
  query?: string;
  sessionId?: string;
  turnId?: number;
};

export async function runIntelligenceQuery(
  _prevState: IntelligenceActionState,
  formData: FormData,
): Promise<IntelligenceActionState> {
  try {
    const currentWorkspace = await requireWorkspace();
    const query = formData.get("query");
    const sessionIdField = formData.get("sessionId");
    const turnIdField = formData.get("turnId");

    if (typeof query !== "string" || !query.trim()) {
      return { error: "Enter a question about your business operations." };
    }

    const turnId =
      typeof turnIdField === "string" && turnIdField.trim()
        ? Number.parseInt(turnIdField, 10)
        : undefined;

    const response = await executeIntelligenceQuery({
      workspaceId: currentWorkspace.workspace.id,
      workspaceName: currentWorkspace.workspace.name,
      query,
      sessionId: typeof sessionIdField === "string" ? sessionIdField : null,
    });

    return {
      result: response.result,
      query: response.query,
      sessionId: response.sessionId,
      turnId: Number.isFinite(turnId) ? turnId : undefined,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to process your operational query.",
    };
  }
}
