"use client";

import { useState } from "react";
import type { IntegrationProvider } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { disconnectShopmonkey } from "@/features/integrations/actions/connect-shopmonkey";
import { disconnectTekmetric } from "@/features/integrations/actions/connect-tekmetric";
import { TekmetricSyncControls } from "@/features/integrations/components/tekmetric-sync-controls";
import { ShopmonkeyConnectForm } from "@/features/integrations/components/shopmonkey-connect-form";
import { TekmetricConnectForm } from "@/features/integrations/components/tekmetric-connect-form";
import type { TekmetricSyncStatusSummary } from "@/features/integrations/queries/get-tekmetric-sync-status";
import type { SafeIntegration } from "@/features/integrations/queries/get-integrations";
import {
  getIntegrationMetadataValue,
  getShopmonkeyLocationName,
  getTekmetricShopName,
} from "@/features/integrations/utils/integration-credentials";
import {
  getIntegrationProviderDefinition,
  getProviderStatus,
} from "@/features/integrations/utils/integration-providers";

type IntegrationConnectPanelProps = {
  provider: IntegrationProvider;
  integration: SafeIntegration | null;
  canManage: boolean;
  tekmetricSyncStatus?: TekmetricSyncStatusSummary | null;
  onClose: () => void;
};

function formatTimestamp(value: Date | null | undefined): string {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function IntegrationConnectPanel({
  provider,
  integration,
  canManage,
  tekmetricSyncStatus,
  onClose,
}: IntegrationConnectPanelProps) {
  const providerDefinition = getIntegrationProviderDefinition(provider);
  const status = getProviderStatus(integration);
  const [isEditing, setIsEditing] = useState(status !== "CONNECTED");

  const shopName = getTekmetricShopName(integration);
  const locationName = getShopmonkeyLocationName(integration);
  const shopId = getIntegrationMetadataValue(integration, "shopId");
  const locationId = getIntegrationMetadataValue(integration, "locationId");

  const handleConnected = () => {
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden border-zinc-200 bg-white shadow-card">
      <CardHeader className="border-b border-zinc-200">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">Connect {providerDefinition.name}</CardTitle>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              Link your shop management system so ZOL can prepare for future operational sync.
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {status === "CONNECTED" && !isEditing ? (
          <div className="space-y-4">
            <dl className="grid gap-3 sm:grid-cols-2">
              {provider === "TEKMETRIC" ? (
                <>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Shop</dt>
                    <dd className="mt-1 text-sm font-semibold text-zinc-950">
                      {shopName ?? "Connected shop"}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Shop ID</dt>
                    <dd className="mt-1 text-sm font-semibold text-zinc-950">{shopId || "—"}</dd>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Location</dt>
                    <dd className="mt-1 text-sm font-semibold text-zinc-950">
                      {locationName ?? "Connected location"}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Location ID</dt>
                    <dd className="mt-1 text-sm font-semibold text-zinc-950">
                      {locationId || "—"}
                    </dd>
                  </div>
                </>
              )}
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:col-span-2">
                <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Last connected</dt>
                <dd className="mt-1 text-sm font-semibold text-zinc-950">
                  {formatTimestamp(integration?.lastConnectedAt)}
                </dd>
              </div>
            </dl>

            {canManage ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="secondary" onClick={() => setIsEditing(true)}>
                  Update connection
                </Button>
                <form action={provider === "TEKMETRIC" ? disconnectTekmetric : disconnectShopmonkey}>
                  <Button type="submit" variant="secondary">
                    Disconnect
                  </Button>
                </form>
              </div>
            ) : (
              <p className="text-sm text-zinc-600">
                You can view this connection, but only workspace owners and admins can change it.
              </p>
            )}

            {provider === "TEKMETRIC" && tekmetricSyncStatus ? (
              <div className="space-y-3 border-t border-zinc-200 pt-6">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-950">Operational data sync</h3>
                  <p className="mt-2 text-sm leading-7 text-zinc-600">
                    Pull customer, vehicle, appointment, and repair order context from your connected
                    shop system.
                  </p>
                </div>
                <TekmetricSyncControls
                  syncStatus={tekmetricSyncStatus}
                  canManage={canManage}
                />
              </div>
            ) : null}
          </div>
        ) : canManage ? (
          provider === "TEKMETRIC" ? (
            <TekmetricConnectForm
              status={status}
              shopId={shopId}
              onConnected={handleConnected}
              onCancel={status === "CONNECTED" ? () => setIsEditing(false) : undefined}
            />
          ) : (
            <ShopmonkeyConnectForm
              status={status}
              locationId={locationId}
              onConnected={handleConnected}
              onCancel={status === "CONNECTED" ? () => setIsEditing(false) : undefined}
            />
          )
        ) : (
          <p className="text-sm leading-7 text-zinc-600">
            {providerDefinition.name} is not connected yet. Ask a workspace owner or admin to connect
            your shop management system.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
