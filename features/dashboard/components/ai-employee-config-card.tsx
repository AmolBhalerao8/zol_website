"use client";

import Link from "next/link";
import { PencilLine } from "lucide-react";
import type { AIEmployeeSettings } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type AIEmployeeConfigCardProps = {
  settings: AIEmployeeSettings;
  hasBusinessContext: boolean;
  isVoiceChannelActive: boolean;
};

export function AIEmployeeConfigCard({
  settings,
  hasBusinessContext,
}: AIEmployeeConfigCardProps) {
  return (
    <Card className="overflow-hidden border-zinc-200 bg-white shadow-card">
      <div className="flex flex-col gap-6 px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-8">
        <div>
          <p className="text-sm font-semibold text-zinc-500">ZOL setup</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-950">
            {settings.displayName}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
            {hasBusinessContext
              ? "Your business details are saved. Turn on your phone line when you are ready."
              : "Add a short description of your shop so ZOL can answer calls helpfully."}
          </p>
        </div>
        <Button variant="secondary" size="lg" asChild className="shrink-0">
          <Link href="/setup/ai-employee">
            <PencilLine className="h-4 w-4" />
            Edit setup
          </Link>
        </Button>
      </div>
    </Card>
  );
}
