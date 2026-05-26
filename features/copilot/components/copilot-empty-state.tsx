import Link from "next/link";
import { MessageSquareText, UsersRound, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CopilotEmptyState() {
  return (
    <Card className="border-dashed border-zinc-200 p-10 text-center">
      <p className="text-lg font-semibold text-zinc-950">Nothing to act on yet</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-zinc-600">
        When ZOL captures customer calls and detects follow-ups, you&apos;ll see who to contact
        and suggested messages here.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button variant="secondary" asChild>
          <Link href="/conversations">
            <MessageSquareText className="h-4 w-4" />
            View conversations
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/setup/voice-channel">Activate phone line</Link>
        </Button>
      </div>
    </Card>
  );
}

type CopilotQuickLinksProps = {
  show?: boolean;
};

export function CopilotQuickLinks({ show = true }: CopilotQuickLinksProps) {
  if (!show) {
    return null;
  }

  return (
    <section className="flex flex-wrap gap-3 border-t border-zinc-200 pt-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/conversations">
          <MessageSquareText className="h-4 w-4" />
          Conversations
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/customers">
          <UsersRound className="h-4 w-4" />
          Customers
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/workflows">
          <Workflow className="h-4 w-4" />
          Follow-ups
        </Link>
      </Button>
    </section>
  );
}
