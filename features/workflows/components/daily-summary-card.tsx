import Link from "next/link";
import { ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Workflow } from "@prisma/client";

type DailySummaryCardProps = {
  activeCount: number;
  dailySummary: Workflow | null;
  appointmentsTomorrow: number;
};

export function DailySummaryCard({
  activeCount,
  dailySummary,
  appointmentsTomorrow,
}: DailySummaryCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-zinc-500">Daily operational summary</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
            {activeCount} active workflow{activeCount === 1 ? "" : "s"}
          </h3>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
          <ClipboardList className="h-5 w-5" />
        </div>
      </div>

      {dailySummary ? (
        <p className="mt-5 text-sm leading-7 text-zinc-600">{dailySummary.description}</p>
      ) : (
        <p className="mt-5 text-sm leading-7 text-zinc-600">
          ZOL will compile today&apos;s operational highlights after the next workflow scan.
        </p>
      )}

      {appointmentsTomorrow > 0 ? (
        <p className="mt-3 text-sm font-medium text-zinc-700">
          {appointmentsTomorrow} appointment{appointmentsTomorrow === 1 ? "" : "s"} scheduled
          tomorrow
        </p>
      ) : null}

      <Button className="mt-6" asChild>
        <Link href="/workflows">Open workflows</Link>
      </Button>
    </Card>
  );
}
