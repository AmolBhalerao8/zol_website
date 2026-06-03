import { MessagesHistoryPage, getMessageHistory } from "@/features/messages";
import { requireWorkspace } from "@/features/workspace";

export default async function HistoryPage() {
  const currentWorkspace = await requireWorkspace();
  const messages = await getMessageHistory(currentWorkspace.workspace.id);

  return <MessagesHistoryPage messages={messages} />;
}
