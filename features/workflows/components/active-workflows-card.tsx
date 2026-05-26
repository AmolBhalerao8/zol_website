import Link from "next/link";
import { Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ActiveWorkflowsCardProps = {
  activeCount: number;
  followUpCount: number;
};

export function ActiveWorkflowsCard({
  activeCount,
  followUpCount,
}: ActiveWorkflowsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-500">Operational workflows</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
            {activeCount > 0 ? `${activeCount} active` : "Monitoring operations"}
          </h3>
        </div>
        <div className="rounded-2xl bg-zinc-950 p-3 text-white">
          <Workflow className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 text-zinc-600">
        {followUpCount > 0
          ? `${followUpCount} customer${followUpCount === 1 ? "" : "s"} require follow-up based on ZOL's latest scan.`
          : "ZOL proactively detects follow-ups, urgent issues, and operational gaps for your team."}
      </p>
      <Button className="mt-6" variant="secondary" asChild>
        <Link href="/workflows">View workflows</Link>
      </Button>
    </Card>
  );
}
