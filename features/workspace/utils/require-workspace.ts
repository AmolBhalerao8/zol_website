import { redirect } from "next/navigation";

import { getCurrentWorkspace } from "@/features/workspace/queries/get-current-workspace";

export async function requireWorkspace() {
  const currentWorkspace = await getCurrentWorkspace();

  if (!currentWorkspace) {
    redirect("/onboarding");
  }

  return currentWorkspace;
}

export async function redirectIfHasWorkspace() {
  const currentWorkspace = await getCurrentWorkspace();

  if (currentWorkspace) {
    redirect("/dashboard");
  }
}
