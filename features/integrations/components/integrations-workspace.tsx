"use client";

import { useState } from "react";
import type { IntegrationProvider } from "@prisma/client";

import { IntegrationConnectPanel } from "@/features/integrations/components/integration-connect-panel";
import { IntegrationProviderCard } from "@/features/integrations/components/integration-provider-card";
import type { SafeIntegration } from "@/features/integrations/queries/get-integrations";
import type { TekmetricSyncStatusSummary } from "@/features/integrations/queries/get-tekmetric-sync-status";
import {
  INTEGRATION_PROVIDERS,
  getProviderStatus,
} from "@/features/integrations/utils/integration-providers";

type IntegrationsWorkspaceProps = {
  integrations: Partial<Record<IntegrationProvider, SafeIntegration | null>>;
  canManage: boolean;
  tekmetricSyncStatus: TekmetricSyncStatusSummary;
};

export function IntegrationsWorkspace({
  integrations,
  canManage,
  tekmetricSyncStatus,
}: IntegrationsWorkspaceProps) {
  const [selectedProvider, setSelectedProvider] = useState<IntegrationProvider | null>(null);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {INTEGRATION_PROVIDERS.map((provider) => (
          <IntegrationProviderCard
            key={provider.id}
            provider={provider}
            status={getProviderStatus(integrations[provider.id])}
            selected={selectedProvider === provider.id}
            onSelect={setSelectedProvider}
          />
        ))}
      </div>

      {selectedProvider ? (
        <IntegrationConnectPanel
          provider={selectedProvider}
          integration={integrations[selectedProvider] ?? null}
          canManage={canManage}
          tekmetricSyncStatus={tekmetricSyncStatus}
          onClose={() => setSelectedProvider(null)}
        />
      ) : (
        <div className="rounded-[1.75rem] border border-dashed border-zinc-300 bg-white/70 px-6 py-10 text-center">
          <p className="text-sm font-medium text-zinc-700">Select an integration to connect</p>
          <p className="mt-2 text-sm leading-7 text-zinc-500">
            Choose Tekmetric or Shopmonkey above to open the connection setup and test your shop link.
          </p>
        </div>
      )}
    </div>
  );
}
