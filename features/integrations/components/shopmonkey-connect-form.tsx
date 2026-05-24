"use client";

import { useActionState, useEffect } from "react";
import type { IntegrationStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  connectShopmonkey,
  testShopmonkeyConnectionAction,
} from "@/features/integrations/actions/connect-shopmonkey";
import { getDefaultShopmonkeyApiBaseUrl } from "@/features/integrations/schemas/shopmonkey-connect-schema";
import type { IntegrationActionState } from "@/features/integrations/types/action-state";

type ShopmonkeyConnectFormProps = {
  status: IntegrationStatus;
  locationId?: string;
  onConnected?: () => void;
  onCancel?: () => void;
};

const initialState: IntegrationActionState = {};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1.5 text-sm text-red-600">{message}</p>;
}

export function ShopmonkeyConnectForm({
  status,
  locationId = "",
  onConnected,
  onCancel,
}: ShopmonkeyConnectFormProps) {
  const [connectState, connectAction, connectPending] = useActionState(connectShopmonkey, initialState);
  const [testState, testAction, testPending] = useActionState(
    testShopmonkeyConnectionAction,
    initialState,
  );

  const feedback = connectState.error || connectState.message || testState.error || testState.message;
  const feedbackIsError = Boolean(connectState.error || testState.error);

  useEffect(() => {
    if (connectState.success) {
      onConnected?.();
    }
  }, [connectState.success, onConnected]);

  return (
    <form action={connectAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="shopmonkey-apiKey">API key</Label>
        <Input
          id="shopmonkey-apiKey"
          name="apiKey"
          type="password"
          placeholder={status === "CONNECTED" ? "••••••••••••••" : "From Shopmonkey Settings → Integration → API Keys"}
          required
          autoComplete="off"
        />
        <FieldError message={connectState.fieldErrors?.apiKey?.[0]} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="shopmonkey-locationId">Location ID (optional)</Label>
        <Input
          id="shopmonkey-locationId"
          name="locationId"
          defaultValue={locationId}
          placeholder="Only needed for multi-location shops"
        />
        <FieldError message={connectState.fieldErrors?.locationId?.[0]} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="shopmonkey-apiBaseUrl">API URL (optional)</Label>
        <Input
          id="shopmonkey-apiBaseUrl"
          name="apiBaseUrl"
          placeholder={getDefaultShopmonkeyApiBaseUrl()}
        />
        <FieldError message={connectState.fieldErrors?.apiBaseUrl?.[0]} />
      </div>

      {feedback ? (
        <p className={`text-sm ${feedbackIsError ? "text-red-600" : "text-emerald-700"}`}>
          {feedback}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          formAction={testAction}
          variant="secondary"
          disabled={testPending || connectPending}
        >
          {testPending ? "Testing connection..." : "Test connection"}
        </Button>
        <Button type="submit" variant="accent" disabled={connectPending || testPending}>
          {connectPending ? "Saving connection..." : "Save integration"}
        </Button>
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  );
}
