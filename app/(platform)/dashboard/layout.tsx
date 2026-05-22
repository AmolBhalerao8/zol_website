import { ReactNode } from "react";

import { protectPlatformRoute } from "@/features/auth";
import { DashboardShell } from "@/features/dashboard";
import { requireWorkspace } from "@/features/workspace";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await protectPlatformRoute();
  const currentWorkspace = await requireWorkspace();

  return (
    <DashboardShell workspaceName={currentWorkspace.workspace.name}>
      {children}
    </DashboardShell>
  );
}
