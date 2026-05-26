import { CopilotContextPanel } from "@/features/copilot/components/copilot-context-panel";
import { CopilotPanel } from "@/features/copilot/components/copilot-panel";
import { RecommendationCard } from "@/features/copilot/components/recommendation-card";
import { getCopilotRecommendations } from "@/features/copilot/queries/get-copilot-recommendations";
import { buildOperationalContext } from "@/features/copilot/services/build-operational-context";
import { generateDailyOperationalInsights } from "@/features/copilot/services/generate-daily-operational-insights";
import { requireWorkspace } from "@/features/workspace";

const COPILOT_CAPABILITIES = [
  {
    title: "Suggested replies",
    body: "Professional response drafts grounded in conversation context and your business tone.",
  },
  {
    title: "Follow-up drafts",
    body: "Ready-to-copy check-in messages for pending appointments, issues, and open action items.",
  },
  {
    title: "Operational recommendations",
    body: "Workflow actions, escalation hints, and customer insights from live workspace data.",
  },
];

export async function CopilotPage() {
  const currentWorkspace = await requireWorkspace();
  const workspaceId = currentWorkspace.workspace.id;

  const [recommendations, context, dailyInsights] = await Promise.all([
    getCopilotRecommendations(workspaceId, { scope: "workspace" }),
    buildOperationalContext(workspaceId, { scope: "workspace" }),
    generateDailyOperationalInsights(workspaceId),
  ]);

  const dailyInsightItems = [
    ...dailyInsights.highlights.map((content) => ({ label: "Highlight", content })),
    ...dailyInsights.customerIssues.map((content) => ({ label: "Customer issue", content })),
    ...dailyInsights.unresolvedConcerns.map((content) => ({ label: "Unresolved concern", content })),
    ...dailyInsights.workflowBottlenecks.map((content) => ({ label: "Workflow bottleneck", content })),
    ...(dailyInsights.appointmentLoad
      ? [{ label: "Appointment load", content: dailyInsights.appointmentLoad }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section>
        <div className="mb-3 inline-flex rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700">
          Operational assistance
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Operational Copilot
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-8 text-zinc-600">
          ZOL helps your team respond faster, follow up intelligently, and manage operational
          workflows. Copilot assists your staff — it does not send messages or take autonomous
          action.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {COPILOT_CAPABILITIES.map((item) => (
          <div
            key={item.title}
            className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-card"
          >
            <h2 className="text-sm font-semibold text-zinc-950">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-600">{item.body}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-950">Daily operational insights</h2>
          <div className="space-y-3">
            {dailyInsightItems.map((item) => (
              <RecommendationCard
                key={`${item.label}-${item.content}`}
                recommendation={{
                  id: `${item.label}-${item.content}`,
                  workspaceId,
                  type: "DAILY_INSIGHT",
                  title: item.label,
                  content: item.content,
                  sourceConversationId: null,
                  sourceCustomerId: null,
                  sourceWorkflowId: null,
                  metadata: null,
                  createdAt: new Date(),
                }}
              />
            ))}
          </div>
        </section>

        <div className="space-y-4">
          <CopilotContextPanel context={context} />
          <CopilotPanel
            title="Recommendation feed"
            description="AI-generated operational suggestions grounded in conversations, workflows, and synced shop data."
            recommendations={recommendations}
            scope={{ scope: "workspace" }}
          />
        </div>
      </div>
    </div>
  );
}
