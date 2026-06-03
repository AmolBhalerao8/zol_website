import { MessagesPage, getAllMessages } from "@/features/messages";
import { canManageMessages } from "@/features/messages/utils/can-manage-messages";
import { generateWorkflowMessageDraftsForWorkspace } from "@/features/messages/services/generate-workflow-message-drafts";
import { requireWorkspace } from "@/features/workspace";

type MessagesRouteProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function Page({ searchParams }: MessagesRouteProps) {
  const currentWorkspace = await requireWorkspace();
  const workspaceId = currentWorkspace.workspace.id;
  const params = await searchParams;

  try {
    await generateWorkflowMessageDraftsForWorkspace(workspaceId);
  } catch (error) {
    console.error("Workflow message draft generation failed:", error);
  }

  const messages = await getAllMessages(workspaceId);
  const activeTab =
    params.tab === "approved" ? "approved" : params.tab === "failed" ? "failed" : "all";

  return (
    <MessagesPage
      messages={messages}
      canManage={canManageMessages(currentWorkspace.role)}
      activeTab={activeTab}
    />
  );
}
