import { ConversationsList } from "@/features/conversations/components/conversations-list";
import { getCommunicationChannel } from "@/features/voice-channel/queries/get-communication-channel";
import { getConversations } from "@/features/conversations/queries/get-conversations";
import { requireWorkspace } from "@/features/workspace";

export async function ConversationsPage() {
  const currentWorkspace = await requireWorkspace();
  const workspaceId = currentWorkspace.workspace.id;

  const [conversations, communicationChannel] = await Promise.all([
    getConversations(workspaceId),
    getCommunicationChannel(workspaceId),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Calls</h1>
        <p className="mt-2 max-w-2xl text-base leading-8 text-zinc-600">
          Every call ZOL answers is saved here with a summary and any follow-ups for your team.
        </p>
      </section>

      <ConversationsList
        conversations={conversations}
        hasCommunicationChannel={Boolean(communicationChannel)}
      />
    </div>
  );
}
