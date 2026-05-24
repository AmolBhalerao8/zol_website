import { ReactNode } from "react";

import { protectPlatformRoute } from "@/features/auth";
import { getCustomerStats } from "@/features/customers/queries/get-customers";
import { DashboardShell } from "@/features/dashboard";
import { getConversationStats } from "@/features/conversations/queries/get-conversations";
import { requireWorkspace } from "@/features/workspace";

export const dynamic = "force-dynamic";

export default async function CustomersLayout({ children }: { children: ReactNode }) {
  await protectPlatformRoute();
  const currentWorkspace = await requireWorkspace();
  const [conversationStats, customerStats] = await Promise.all([
    getConversationStats(currentWorkspace.workspace.id),
    getCustomerStats(currentWorkspace.workspace.id),
  ]);

  return (
    <DashboardShell
      workspaceName={currentWorkspace.workspace.name}
      conversationCount={conversationStats.conversationCount}
      customerCount={customerStats.customerCount}
    >
      {children}
    </DashboardShell>
  );
}
