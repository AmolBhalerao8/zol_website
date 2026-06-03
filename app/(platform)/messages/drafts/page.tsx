import { MessagesDraftsPage, getMessageDrafts } from "@/features/messages";
import { canManageMessages } from "@/features/messages/utils/can-manage-messages";
import { generateWorkflowMessageDraftsForWorkspace } from "@/features/messages/services/generate-workflow-message-drafts";
import { requireWorkspace } from "@/features/workspace";

export default async function DraftsPage() {
  const currentWorkspace = await requireWorkspace();
  const workspaceId = currentWorkspace.workspace.id;

  try {
    await generateWorkflowMessageDraftsForWorkspace(workspaceId);
  } catch (error) {
    console.error("Workflow message draft generation failed:", error);
  }

  const drafts = await getMessageDrafts(workspaceId);

  return (
    <MessagesDraftsPage
      drafts={drafts}
      canManage={canManageMessages(currentWorkspace.role)}
    />
  );
}
