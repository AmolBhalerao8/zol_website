import { ReactNode } from "react";

import { protectPlatformRoute } from "@/features/auth";
import { requireWorkspace } from "@/features/workspace";

export const dynamic = "force-dynamic";

export default async function VoiceChannelSetupLayout({ children }: { children: ReactNode }) {
  await protectPlatformRoute();
  await requireWorkspace();

  return children;
}
