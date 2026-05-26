import Link from "next/link";
import type { MemoryCategory } from "@prisma/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemoryCategoryBadge } from "@/features/memory/components/memory-category-badge";
import { MEMORY_CATEGORY_ORDER } from "@/features/memory/utils/memory-category-labels";

type CustomerMemoryItem = {
  id: string;
  content: string;
  category: MemoryCategory;
  createdAt: Date;
  conversation: {
    id: string;
    summary: string | null;
    createdAt: Date;
  } | null;
};

function formatTimestamp(value: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

type CustomerMemoryListProps = {
  memories: CustomerMemoryItem[];
};

export function CustomerMemoryList({ memories }: CustomerMemoryListProps) {
  if (memories.length === 0) {
    return (
      <Card className="border-zinc-200 bg-white shadow-card">
        <CardContent className="p-8 text-center">
          <p className="text-sm leading-7 text-zinc-600">
            ZOL will remember useful details here after more calls with this customer.
          </p>
        </CardContent>
      </Card>
    );
  }

  const grouped = MEMORY_CATEGORY_ORDER.map((category) => ({
    category,
    items: memories.filter((memory) => memory.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="space-y-5">
      {grouped.map((group) => (
        <Card key={group.category} className="border-zinc-200 bg-white shadow-card">
          <CardHeader className="border-b border-zinc-200">
            <CardTitle className="flex items-center gap-3 text-lg">
              <MemoryCategoryBadge category={group.category} />
              <span className="text-sm font-normal text-zinc-500">
                {group.items.length} remembered
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {group.items.map((memory) => (
              <div
                key={memory.id}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
              >
                <p className="text-sm leading-7 text-zinc-800">{memory.content}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                  <span>{formatTimestamp(memory.createdAt)}</span>
                  {memory.conversation ? (
                    <Link
                      href={`/conversations/${memory.conversation.id}`}
                      className="font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      From call
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
