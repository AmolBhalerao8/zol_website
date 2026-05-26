"use server";

import { revalidatePath } from "next/cache";

import { ensureCopilotRecommendations } from "@/features/copilot/services/ensure-copilot-recommendations";
import type { CopilotScope } from "@/features/copilot/types/copilot-types";
import { requireWorkspace } from "@/features/workspace";

export async function refreshCopilotRecommendations(scope: CopilotScope) {
  const currentWorkspace = await requireWorkspace();
  const recommendations = await ensureCopilotRecommendations(
    currentWorkspace.workspace.id,
    scope,
    { force: true },
  );

  revalidatePath("/copilot");
  revalidatePath("/dashboard");
  revalidatePath("/conversations");
  revalidatePath("/customers");
  revalidatePath("/workflows");

  if (scope.scope === "conversation") {
    revalidatePath(`/conversations/${scope.conversationId}`);
  }
  if (scope.scope === "customer") {
    revalidatePath(`/customers/${scope.customerId}`);
  }

  return recommendations;
}
