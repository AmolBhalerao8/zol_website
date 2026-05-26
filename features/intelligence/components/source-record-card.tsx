import Link from "next/link";
import {
  Brain,
  CalendarDays,
  MessageSquareText,
  UserRound,
  Wrench,
  ClipboardList,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { IntelligenceSourceRecord } from "@/features/intelligence/types/intelligence-types";
import { cn } from "@/lib/utils";

const SOURCE_ICONS = {
  conversation: MessageSquareText,
  customer: UserRound,
  appointment: CalendarDays,
  repair_order: Wrench,
  memory: Brain,
  action_item: ClipboardList,
} as const;

type SourceRecordCardProps = {
  source: IntelligenceSourceRecord;
};

export function SourceRecordCard({ source }: SourceRecordCardProps) {
  const Icon = SOURCE_ICONS[source.type];

  const content = (
    <Card className="border-zinc-200 shadow-none transition hover:border-emerald-200 hover:bg-emerald-50/30">
      <CardContent className="flex gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-zinc-950">{source.title}</p>
          <p className="mt-2 text-sm leading-7 text-zinc-600">{source.summary}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (source.href) {
    return (
      <Link href={source.href} className={cn("block")}>
        {content}
      </Link>
    );
  }

  return content;
}
