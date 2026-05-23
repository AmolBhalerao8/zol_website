import type { ActionItem } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrgencyBadge } from "@/features/conversations/components/urgency-badge";

const PRIORITY_LABELS = {
  LOW: "Low priority",
  MEDIUM: "Medium priority",
  HIGH: "High priority",
  URGENT: "Urgent priority",
} as const;

type ActionItemsListProps = {
  actionItems: ActionItem[];
};

export function ActionItemsList({ actionItems }: ActionItemsListProps) {
  if (actionItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Action items</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-7 text-zinc-600">
            No action items were extracted from this conversation.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Action items</CardTitle>
        <p className="text-sm leading-6 text-zinc-600">
          Follow-ups ZOL identified from this customer conversation.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {actionItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-zinc-950">{item.title}</h3>
              <span className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                {PRIORITY_LABELS[item.priority]}
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                {item.status.replace("_", " ")}
              </span>
            </div>
            {item.description ? (
              <p className="mt-2 text-sm leading-7 text-zinc-600">{item.description}</p>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ActionItemsPreviewList({ actionItems }: ActionItemsListProps) {
  return (
    <div className="space-y-3">
      {actionItems.slice(0, 3).map((item) => (
        <div key={item.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-zinc-950">{item.title}</p>
            <UrgencyBadge
              urgency={
                item.priority === "URGENT"
                  ? "URGENT"
                  : item.priority === "HIGH"
                    ? "HIGH"
                    : item.priority === "LOW"
                      ? "LOW"
                      : "MEDIUM"
              }
            />
          </div>
          {item.description ? (
            <p className="mt-2 text-sm leading-6 text-zinc-600">{item.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
