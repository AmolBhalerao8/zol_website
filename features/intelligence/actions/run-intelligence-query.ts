"use server";

import { processIntelligenceQuery } from "@/features/intelligence/services/process-intelligence-query";
import type { IntelligenceQueryResult } from "@/features/intelligence/types/intelligence-types";
import { requireWorkspace } from "@/features/workspace";

export type IntelligenceActionState = {
  error?: string;
  result?: IntelligenceQueryResult;
};

export async function runIntelligenceQuery(
  _prevState: IntelligenceActionState,
  formData: FormData,
): Promise<IntelligenceActionState> {
  try {
    const currentWorkspace = await requireWorkspace();
    const query = formData.get("query");

    if (typeof query !== "string" || !query.trim()) {
      return { error: "Enter a question about your business operations." };
    }

    const result = await processIntelligenceQuery({
      workspaceId: currentWorkspace.workspace.id,
      workspaceName: currentWorkspace.workspace.name,
      query,
    });

    return { result };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to process your operational query.",
    };
  }
}
