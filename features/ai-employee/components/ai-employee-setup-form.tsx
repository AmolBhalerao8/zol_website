"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

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
  const [showAdvanced, setShowAdvanced] = useState(false);

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
          <CardTitle>AI employee identity</CardTitle>
          <p className="text-sm leading-6 text-zinc-600">
            The name and greeting customers hear when ZOL answers your business line.
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
          <CardTitle>About your business</CardTitle>
          <p className="text-sm leading-6 text-zinc-600">
            Help ZOL understand what you do and what customers usually need from you.
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
          <CardTitle>Business hours</CardTitle>
          <p className="text-sm leading-6 text-zinc-600">
            ZOL can answer calls anytime. Business hours help it understand urgency and
            availability.
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
        <button
          type="button"
          onClick={() => setShowAdvanced((current) => !current)}
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        >
          <div>
            <CardTitle className="text-lg">Advanced settings</CardTitle>
            <p className="mt-1 text-sm leading-6 text-zinc-600">
              Common call scenarios, escalation contacts, and optional capabilities.
            </p>
          </div>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
          />
        </button>

        <CardContent className={`space-y-6 border-t border-zinc-200 pt-0 ${showAdvanced ? "" : "hidden"}`}>
          <div className="space-y-2 pt-6">
            <Label htmlFor="commonScenarios">Common customer scenarios</Label>
            <p className="text-sm text-zinc-600">
              Examples of what customers call about — order status, appointments, pricing, and
              support.
            </p>
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

          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-zinc-950">Optional capabilities</p>
              <p className="mt-1 text-sm text-zinc-600">
                Leave these selected unless you want to limit what ZOL can help with on calls.
              </p>
            </div>
            <EnabledCapabilitiesSelector
              value={enabledCapabilities}
              onChange={setEnabledCapabilities}
              disabled={!canManage}
              error={state.fieldErrors?.enabledCapabilities?.[0]}
            />
          </div>
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
