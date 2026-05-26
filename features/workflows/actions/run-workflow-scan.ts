"use server";

import { revalidatePath } from "next/cache";

import { runOperationalWorkflowScan } from "@/features/workflows/services/run-operational-workflow-scan";
import { requireWorkspace } from "@/features/workspace";

export async function runWorkflowScan() {
  const currentWorkspace = await requireWorkspace();
  const result = await runOperationalWorkflowScan(currentWorkspace.workspace.id);

  revalidatePath("/workflows");
  revalidatePath("/dashboard");

  return result;
}
