"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { refreshCopilotRecommendations } from "@/features/copilot/actions/refresh-copilot-recommendations";

export function CopilotRefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(async () => {
      await refreshCopilotRecommendations({ scope: "workspace" });
      router.refresh();
    });
  };

  return (
    <Button variant="secondary" onClick={handleRefresh} disabled={isPending}>
      <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
      {isPending ? "Updating…" : "Update suggestions"}
    </Button>
  );
}
