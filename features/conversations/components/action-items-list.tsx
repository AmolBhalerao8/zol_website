import type { ActionItem } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UrgencyBadge } from "@/features/conversations/components/urgency-badge";

type ActionItemsListProps = {
  actionItems: ActionItem[];
};

export function ActionItemsList({ actionItems }: ActionItemsListProps) {
  if (actionItems.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Follow-ups</CardTitle>
        <p className="text-sm leading-6 text-zinc-600">
          Things your team may want to do based on this call.
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {actionItems.map((item) => (
          <div key={item.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-zinc-950">{item.title}</h3>
              {item.priority === "HIGH" || item.priority === "URGENT" ? (
                <UrgencyBadge
                  urgency={item.priority === "URGENT" ? "URGENT" : "HIGH"}
                />
              ) : null}
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
