import { protectPlatformRoute } from "@/features/auth";
import { getCurrentWorkspace } from "@/features/workspace/queries/get-current-workspace";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AuthContinuePage() {
  await protectPlatformRoute();

  const currentWorkspace = await getCurrentWorkspace();

  redirect(currentWorkspace ? "/dashboard" : "/onboarding");
}
