"use client";

import { useActionState, useEffect } from "react";
import type { IntegrationStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  connectTekmetric,
  testTekmetricConnectionAction,
  type IntegrationActionState,
} from "@/features/integrations/actions/connect-tekmetric";
import { getDefaultTekmetricApiBaseUrl } from "@/features/integrations/schemas/tekmetric-connect-schema";

type TekmetricConnectFormProps = {
  status: IntegrationStatus;
  shopId?: string;
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

export function TekmetricConnectForm({
  status,
  shopId = "",
  onConnected,
  onCancel,
}: TekmetricConnectFormProps) {
  const [connectState, connectAction, connectPending] = useActionState(connectTekmetric, initialState);
  const [testState, testAction, testPending] = useActionState(
    testTekmetricConnectionAction,
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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="clientId">Client ID</Label>
          <Input id="clientId" name="clientId" placeholder="From Tekmetric API access" required />
          <FieldError message={connectState.fieldErrors?.clientId?.[0]} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shopId">Shop ID</Label>
          <Input
            id="shopId"
            name="shopId"
            defaultValue={shopId}
            placeholder="Your Tekmetric shop ID"
            required
          />
          <FieldError message={connectState.fieldErrors?.shopId?.[0]} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiKey">API key</Label>
        <Input
          id="apiKey"
          name="apiKey"
          type="password"
          placeholder={status === "CONNECTED" ? "••••••••••••••" : "Your Tekmetric API key"}
          required
          autoComplete="off"
        />
        <FieldError message={connectState.fieldErrors?.apiKey?.[0]} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="apiBaseUrl">API URL (optional)</Label>
        <Input id="apiBaseUrl" name="apiBaseUrl" placeholder={getDefaultTekmetricApiBaseUrl()} />
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
