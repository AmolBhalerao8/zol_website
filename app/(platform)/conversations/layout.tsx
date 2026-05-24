import { ReactNode } from "react";

import { protectPlatformRoute } from "@/features/auth";
import { DashboardShell } from "@/features/dashboard";
import { getDashboardShellProps } from "@/features/dashboard/queries/get-dashboard-shell-props";
import { requireWorkspace } from "@/features/workspace";

export const dynamic = "force-dynamic";

export default async function ConversationsLayout({ children }: { children: ReactNode }) {
  await protectPlatformRoute();
  const currentWorkspace = await requireWorkspace();
  const shellProps = await getDashboardShellProps(currentWorkspace.workspace.id);

  return (
    <DashboardShell workspaceName={currentWorkspace.workspace.name} {...shellProps}>
      {children}
    </DashboardShell>
  );
}
