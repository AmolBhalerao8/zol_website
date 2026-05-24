"use client";

import { useState } from "react";
import { Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { disconnectTekmetric } from "@/features/integrations/actions/connect-tekmetric";
import { IntegrationStatusBadge } from "@/features/integrations/components/integration-status-badge";
import { TekmetricConnectForm } from "@/features/integrations/components/tekmetric-connect-form";
import type { SafeIntegration } from "@/features/integrations/queries/get-integrations";
import { getTekmetricShopName } from "@/features/integrations/utils/integration-credentials";

type IntegrationCardProps = {
  integration: SafeIntegration | null;
  canManage: boolean;
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

function getShopId(integration: SafeIntegration | null): string {
  if (!integration?.metadata || typeof integration.metadata !== "object") {
    return "";
  }

  const shopId = (integration.metadata as Record<string, unknown>).shopId;
  return typeof shopId === "string" ? shopId : "";
}

export function IntegrationCard({ integration, canManage }: IntegrationCardProps) {
  const [showForm, setShowForm] = useState(integration?.status !== "CONNECTED");

  const status = integration?.status ?? "NOT_CONNECTED";
  const shopName = getTekmetricShopName(integration);
  const shopId = getShopId(integration);

  return (
    <Card className="overflow-hidden border-zinc-200 bg-white shadow-card">
      <CardHeader className="border-b border-zinc-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-950 text-white">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">Tekmetric</CardTitle>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
                Connect customer, vehicle, repair order, and appointment data from your shop
                management platform.
              </p>
            </div>
          </div>
          <IntegrationStatusBadge status={status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {status === "CONNECTED" && !showForm ? (
          <div className="space-y-4">
            <dl className="grid gap-3 sm:grid-cols-2">
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
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:col-span-2">
                <dt className="text-xs uppercase tracking-[0.16em] text-zinc-500">Last connected</dt>
                <dd className="mt-1 text-sm font-semibold text-zinc-950">
                  {formatTimestamp(integration?.lastConnectedAt)}
                </dd>
              </div>
            </dl>

            {canManage ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="secondary" onClick={() => setShowForm(true)}>
                  Update connection
                </Button>
                <form action={disconnectTekmetric}>
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
          </div>
        ) : canManage ? (
          <TekmetricConnectForm
            status={status}
            shopId={shopId}
            onConnected={() => setShowForm(false)}
            onCancel={status === "CONNECTED" ? () => setShowForm(false) : undefined}
          />
        ) : (
          <p className="text-sm leading-7 text-zinc-600">
            Tekmetric is not connected yet. Ask a workspace owner or admin to connect your shop
            management system.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
