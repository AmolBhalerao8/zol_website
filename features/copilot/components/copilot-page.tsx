import Link from "next/link";

import { CopilotActionItem } from "@/features/copilot/components/copilot-action-item";
import { CopilotEmptyState, CopilotQuickLinks } from "@/features/copilot/components/copilot-empty-state";
import { CopilotRefreshButton } from "@/features/copilot/components/copilot-refresh-button";
import {
  getCopilotPageStats,
  getOpenFollowUpsForCopilot,
} from "@/features/copilot/queries/get-copilot-action-items";
import { getCopilotRecommendations } from "@/features/copilot/queries/get-copilot-recommendations";
import { getActiveWorkflows } from "@/features/workflows/queries/get-workflows";
import { requireWorkspace } from "@/features/workspace";

function buildTodaySummary(stats: {
  conversationCount: number;
  followUpCount: number;
  urgentCount: number;
  appointmentsTomorrow: number;
}): string[] {
  const lines: string[] = [];

  if (stats.followUpCount > 0) {
    lines.push(
      `${stats.followUpCount} customer${stats.followUpCount === 1 ? "" : "s"} waiting for a follow-up.`,
    );
  }

  if (stats.urgentCount > 0) {
    lines.push(
      `${stats.urgentCount} urgent item${stats.urgentCount === 1 ? "" : "s"} need attention today.`,
    );
  }

  if (stats.appointmentsTomorrow > 0) {
    lines.push(
      `${stats.appointmentsTomorrow} appointment${stats.appointmentsTomorrow === 1 ? "" : "s"} scheduled for tomorrow.`,
    );
  }

  if (stats.conversationCount > 0 && lines.length === 0) {
    lines.push(
      `ZOL has captured ${stats.conversationCount} customer conversation${stats.conversationCount === 1 ? "" : "s"}. Everything looks calm for now.`,
    );
  }

  if (lines.length === 0) {
    lines.push("ZOL is ready. Suggestions will appear as customer calls and shop activity come in.");
  }

  return lines.slice(0, 3);
}

export async function CopilotPage() {
  const currentWorkspace = await requireWorkspace();
  const workspaceId = currentWorkspace.workspace.id;

  const [stats, workflows, followUps, recommendations] = await Promise.all([
    getCopilotPageStats(workspaceId),
    getActiveWorkflows(workspaceId),
    getOpenFollowUpsForCopilot(workspaceId),
    getCopilotRecommendations(workspaceId, { scope: "workspace" }),
  ]);

  const todaySummary = buildTodaySummary(stats);

  const attentionWorkflows = workflows
    .filter((workflow) => workflow.type !== "DAILY_SUMMARY")
    .slice(0, 5);

  const draftMessages = recommendations.filter(
    (item) => item.type === "REPLY_DRAFT" || item.type === "FOLLOW_UP",
  );

  const hasAttention = attentionWorkflows.length > 0 || followUps.length > 0;
  const hasContent = hasAttention || draftMessages.length > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Copilot</h1>
          <p className="mt-2 max-w-xl text-base leading-8 text-zinc-600">
            Who to follow up with and what to say — based on your customer calls and shop activity.
          </p>
        </div>
        <CopilotRefreshButton />
      </section>

      <section className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/60 p-6">
        <h2 className="text-sm font-semibold text-emerald-900">Today</h2>
        <ul className="mt-3 space-y-2">
          {todaySummary.map((line) => (
            <li key={line} className="flex gap-2 text-sm leading-7 text-emerald-950">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              {line.includes("waiting for a follow-up") ? (
                <Link href="/workflows" className="font-medium underline underline-offset-2">
                  {line}
                </Link>
              ) : (
                line
              )}
            </li>
          ))}
        </ul>
        {stats.followUpCount > 0 ? (
          <p className="mt-4 text-sm leading-7 text-emerald-900/80">
            These are customers ZOL flagged from recent calls — open{" "}
            <Link href="/workflows" className="font-medium underline underline-offset-2">
              Follow-ups
            </Link>{" "}
            below to see who they are and what to do next.
          </p>
        ) : null}
      </section>

      {!hasContent ? <CopilotEmptyState /> : null}

      {hasAttention ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-950">Needs your attention</h2>
          {attentionWorkflows.map((workflow) => (
            <CopilotActionItem
              key={workflow.id}
              title={workflow.title}
              description={workflow.description}
              href={
                workflow.sourceConversation
                  ? `/conversations/${workflow.sourceConversation.id}`
                  : workflow.sourceCustomer
                    ? `/customers/${workflow.sourceCustomer.id}`
                    : "/workflows"
              }
              linkLabel={
                workflow.sourceConversation
                  ? "View call"
                  : workflow.sourceCustomer
                    ? "View customer"
                    : "View follow-ups"
              }
            />
          ))}
          {followUps.map((item) => (
            <CopilotActionItem
              key={item.id}
              title={item.title}
              description={
                item.conversation.customerName
                  ? `From ${item.conversation.customerName}'s call — ${item.conversation.summary?.slice(0, 120) ?? "open follow-up"}`
                  : item.description ?? "Open follow-up from a recent conversation."
              }
              href={`/conversations/${item.conversation.id}`}
              linkLabel="View call"
            />
          ))}
        </section>
      ) : null}

      {draftMessages.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-950">Messages you can send</h2>
          <p className="text-sm text-zinc-600">
            Copy a draft and send it yourself — ZOL never sends messages automatically.
          </p>
          {draftMessages.map((item) => (
            <CopilotActionItem
              key={item.id}
              title={item.title}
              description={item.content}
              copyText={item.content}
              href={
                item.sourceConversationId
                  ? `/conversations/${item.sourceConversationId}`
                  : item.sourceCustomerId
                    ? `/customers/${item.sourceCustomerId}`
                    : undefined
              }
              linkLabel="View context"
            />
          ))}
        </section>
      ) : null}

      <CopilotQuickLinks show={hasContent} />

      {hasContent ? (
        <p className="text-center text-xs text-zinc-500">
          For message drafts on a specific call, open that{" "}
          <Link href="/conversations" className="font-medium text-zinc-700 underline">
            call
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}
