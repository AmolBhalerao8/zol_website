import { ReactNode } from "react";

import { protectPlatformRoute } from "@/features/auth";
import { DashboardShell } from "@/features/dashboard";
import { getConversationStats } from "@/features/conversations/queries/get-conversations";
import { requireWorkspace } from "@/features/workspace";

export const dynamic = "force-dynamic";

export default async function ConversationsLayout({ children }: { children: ReactNode }) {
  await protectPlatformRoute();
  const currentWorkspace = await requireWorkspace();
  const stats = await getConversationStats(currentWorkspace.workspace.id);

  return (
    <DashboardShell
      workspaceName={currentWorkspace.workspace.name}
      conversationCount={stats.conversationCount}
    >
      {children}
    </DashboardShell>
  );
}
