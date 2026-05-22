import { ReactNode } from "react";

import { protectPlatformRoute } from "@/features/auth";
import { redirectIfHasWorkspace } from "@/features/workspace";

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({ children }: { children: ReactNode }) {
  await protectPlatformRoute();
  await redirectIfHasWorkspace();

  return children;
}
