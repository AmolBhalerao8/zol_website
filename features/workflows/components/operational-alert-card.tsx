import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type OperationalAlertCardProps = {
  urgentCount: number;
  followUpCount: number;
};

export function OperationalAlertCard({
  urgentCount,
  followUpCount,
}: OperationalAlertCardProps) {
  if (urgentCount === 0 && followUpCount === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50/50 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-orange-800">Urgent operational alerts</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
            {urgentCount > 0
              ? `${urgentCount} urgent issue${urgentCount === 1 ? "" : "s"} unresolved`
              : `${followUpCount} follow-up${followUpCount === 1 ? "" : "s"} waiting`}
          </h3>
          <p className="mt-4 text-sm leading-7 text-zinc-600">
            ZOL detected operational work that may need attention from your team.
          </p>
        </div>
        <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
          <AlertTriangle className="h-5 w-5" />
        </div>
      </div>
      <Button className="mt-6" variant="secondary" asChild>
        <Link href="/workflows">Review workflows</Link>
      </Button>
    </Card>
  );
}
