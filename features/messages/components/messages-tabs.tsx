import Link from "next/link";

import { cn } from "@/lib/utils";
import type { MessageStatus } from "@prisma/client";

const tabs: Array<{ label: string; href: string; status?: MessageStatus | MessageStatus[] }> = [
  { label: "All", href: "/messages" },
  { label: "Drafts", href: "/messages/drafts", status: "DRAFT" },
  { label: "Approved", href: "/messages?tab=approved", status: "APPROVED" },
  { label: "Sent", href: "/messages/history", status: "SENT" },
  { label: "Failed", href: "/messages?tab=failed", status: "FAILED" },
];

type MessagesTabsProps = {
  activeHref: string;
};

export function MessagesTabs({ activeHref }: MessagesTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = activeHref === tab.href || activeHref.startsWith(`${tab.href}?`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
