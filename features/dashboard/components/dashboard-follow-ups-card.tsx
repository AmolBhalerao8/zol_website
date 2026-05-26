import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type DashboardFollowUpsCardProps = {
  followUpCount: number;
  urgentCount: number;
};

export function DashboardFollowUpsCard({
  followUpCount,
  urgentCount,
}: DashboardFollowUpsCardProps) {
  if (followUpCount === 0 && urgentCount === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50/40 p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-950">Needs your attention</h3>
          {urgentCount > 0 ? (
            <p className="mt-2 text-sm leading-7 text-zinc-700">
              {urgentCount} urgent item{urgentCount === 1 ? "" : "s"} from recent customer calls.
            </p>
          ) : null}
          {followUpCount > 0 ? (
            <p className="mt-1 text-sm leading-7 text-zinc-700">
              {followUpCount} customer{followUpCount === 1 ? "" : "s"} waiting for a follow-up.
            </p>
          ) : null}
          <Button className="mt-4" variant="secondary" asChild>
            <Link href="/workflows">View follow-ups</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
