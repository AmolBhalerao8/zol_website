"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  saveAIEmployeeSettings,
  type SaveAIEmployeeSettingsState,
} from "@/features/ai-employee/actions/save-ai-employee-settings";
import { BusinessHoursEditor } from "@/features/ai-employee/components/business-hours-editor";
import { EnabledCapabilitiesSelector } from "@/features/ai-employee/components/enabled-capabilities-selector";
import {
  COMMUNICATION_TONE_DESCRIPTIONS,
  COMMUNICATION_TONE_LABELS,
  COMMUNICATION_TONES,
  DEFAULT_COMMON_SCENARIOS_PLACEHOLDER,
  type BusinessHours,
} from "@/features/ai-employee/schemas/ai-employee-settings-schema";
import { toInitialValues } from "@/features/ai-employee/utils/initial-values";
import type { AIEmployeeSettings } from "@prisma/client";

const initialActionState: SaveAIEmployeeSettingsState = {};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1.5 text-sm text-red-600">{message}</p>;
}

type AIEmployeeSetupFormProps = {
  settings: AIEmployeeSettings | null;
  canManage: boolean;
};

export function AIEmployeeSetupForm({ settings, canManage }: AIEmployeeSetupFormProps) {
  const defaults = toInitialValues(settings);
  const [state, formAction, pending] = useActionState(saveAIEmployeeSettings, initialActionState);
  const [businessHours, setBusinessHours] = useState<BusinessHours>(defaults.businessHours);
  const [enabledCapabilities, setEnabledCapabilities] = useState<string[]>(
    defaults.enabledCapabilities,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="businessHours" value={JSON.stringify(businessHours)} />

      {!canManage ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          You can review AI employee settings, but only workspace owners and admins can make
          changes.
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>AI Employee Identity</CardTitle>
          <p className="text-sm leading-6 text-zinc-600">
            The name and opening message customers experience when ZOL handles communication.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="displayName">AI employee name</Label>
            <Input
              id="displayName"
              name="displayName"
              defaultValue={defaults.displayName}
              disabled={!canManage}
              required
            />
            <FieldError message={state.fieldErrors?.displayName?.[0]} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="greetingMessage">Greeting message</Label>
            <Textarea
              id="greetingMessage"
              name="greetingMessage"
              defaultValue={defaults.greetingMessage}
              disabled={!canManage}
              required
            />
            <FieldError message={state.fieldErrors?.greetingMessage?.[0]} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Communication Style</CardTitle>
          <p className="text-sm leading-6 text-zinc-600">
            How ZOL should sound when managing customer communication.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="communicationTone">Communication tone</Label>
            <select
              id="communicationTone"
              name="communicationTone"
              defaultValue={defaults.communicationTone}
              disabled={!canManage}
              required
              className="flex h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-950 shadow-sm focus-visible:border-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 disabled:opacity-60"
            >
              {COMMUNICATION_TONES.map((tone) => (
                <option key={tone} value={tone}>
                  {COMMUNICATION_TONE_LABELS[tone]} — {COMMUNICATION_TONE_DESCRIPTIONS[tone]}
                </option>
              ))}
            </select>
            <FieldError message={state.fieldErrors?.communicationTone?.[0]} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Context</CardTitle>
          <p className="text-sm leading-6 text-zinc-600">
            Give ZOL the context it needs to understand your business, customers, and daily
            operations.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="businessContext">What should ZOL know about your business?</Label>
            <Textarea
              id="businessContext"
              name="businessContext"
              defaultValue={defaults.businessContext ?? ""}
              disabled={!canManage}
              placeholder="Example: We are an apparel store that sells custom streetwear through Shopify. Customers usually ask about order status, sizing, returns, product availability, and delivery timelines."
              className="min-h-[140px]"
            />
            <FieldError message={state.fieldErrors?.businessContext?.[0]} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common Customer Scenarios</CardTitle>
          <p className="text-sm leading-6 text-zinc-600">
            Share the situations ZOL should recognize and handle with operational intelligence.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="commonScenarios">Common customer scenarios</Label>
            <Textarea
              id="commonScenarios"
              name="commonScenarios"
              defaultValue={defaults.commonScenarios}
              disabled={!canManage}
              placeholder={DEFAULT_COMMON_SCENARIOS_PLACEHOLDER}
              className="min-h-[160px]"
            />
            <FieldError message={state.fieldErrors?.commonScenarios?.[0]} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
          <p className="text-sm leading-6 text-zinc-600">
            ZOL can operate at all times, but business hours help it understand timing, urgency,
            and availability.
          </p>
        </CardHeader>
        <CardContent>
          <BusinessHoursEditor
            value={businessHours}
            onChange={setBusinessHours}
            disabled={!canManage}
          />
          <FieldError message={state.fieldErrors?.businessHours?.[0]} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Escalation Contacts</CardTitle>
          <p className="text-sm leading-6 text-zinc-600">
            ZOL handles customer interactions on its own, but can route urgent situations to the
            right person when needed.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="escalationPhone">Escalation phone (optional)</Label>
            <Input
              id="escalationPhone"
              name="escalationPhone"
              type="tel"
              defaultValue={defaults.escalationPhone}
              disabled={!canManage}
              placeholder="(555) 123-4567"
            />
            <FieldError message={state.fieldErrors?.escalationPhone?.[0]} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="escalationEmail">Escalation email (optional)</Label>
            <Input
              id="escalationEmail"
              name="escalationEmail"
              type="email"
              defaultValue={defaults.escalationEmail}
              disabled={!canManage}
              placeholder="operations@yourbusiness.com"
            />
            <FieldError message={state.fieldErrors?.escalationEmail?.[0]} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ZOL Capabilities</CardTitle>
          <p className="text-sm leading-6 text-zinc-600">
            ZOL is designed to operate across customer communication and business workflows. You
            can adjust capabilities later.
          </p>
        </CardHeader>
        <CardContent>
          <EnabledCapabilitiesSelector
            value={enabledCapabilities}
            onChange={setEnabledCapabilities}
            disabled={!canManage}
            error={state.fieldErrors?.enabledCapabilities?.[0]}
          />
        </CardContent>
      </Card>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      {canManage ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="secondary" asChild>
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
          <Button type="submit" size="lg" disabled={pending} className="sm:min-w-48">
            {pending
              ? "Saving configuration..."
              : settings
                ? "Save changes"
                : "Save AI Employee"}
          </Button>
        </div>
      ) : null}
    </form>
  );
}
