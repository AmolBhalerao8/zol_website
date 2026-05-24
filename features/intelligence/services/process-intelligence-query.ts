import { classifyIntelligenceQuery } from "@/features/intelligence/services/classify-intelligence-query";
import { generateOperationalAnswer } from "@/features/intelligence/services/generate-operational-answer";
import { retrieveAppointments } from "@/features/intelligence/services/retrieval/retrieve-appointments";
import { retrieveCustomers } from "@/features/intelligence/services/retrieval/retrieve-customers";
import { retrieveConversations } from "@/features/intelligence/services/retrieval/retrieve-conversations";
import {
  retrieveMemories,
  retrieveOperationalTrends,
} from "@/features/intelligence/services/retrieval/retrieve-operational-trends";
import { retrieveRepairOrders } from "@/features/intelligence/services/retrieval/retrieve-repair-orders";
import type { IntelligenceQueryResult } from "@/features/intelligence/types/intelligence-types";

type ProcessIntelligenceQueryInput = {
  workspaceId: string;
  workspaceName: string;
  query: string;
};

async function retrieveForQuery(
  workspaceId: string,
  classified: Awaited<ReturnType<typeof classifyIntelligenceQuery>>,
) {
  switch (classified.queryType) {
    case "appointments":
      return retrieveAppointments(workspaceId, classified);
    case "customers":
      return retrieveCustomers(workspaceId, classified);
    case "conversations":
      return retrieveConversations(workspaceId, classified);
    case "repair_orders":
      return retrieveRepairOrders(workspaceId, classified);
    case "memory":
      return retrieveMemories(workspaceId, classified);
    case "operational_trends":
    default:
      return retrieveOperationalTrends(workspaceId, classified);
  }
}

export async function processIntelligenceQuery({
  workspaceId,
  workspaceName,
  query,
}: ProcessIntelligenceQueryInput): Promise<IntelligenceQueryResult> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      query: "",
      queryType: "operational_trends",
      answer: "Enter an operational question about your business to search.",
      summary: null,
      followUpInsights: [],
      sources: [],
      dataAvailable: false,
    };
  }

  const classified = await classifyIntelligenceQuery(trimmedQuery);
  const retrieval = await retrieveForQuery(workspaceId, classified);
  const result = await generateOperationalAnswer({
    query: trimmedQuery,
    classified,
    retrieval,
    workspaceName,
  });

  return result;
}
