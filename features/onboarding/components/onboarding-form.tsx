"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BUSINESS_TYPES,
  DEFAULT_TIMEZONE,
  TIMEZONES,
} from "@/features/onboarding/schemas/onboarding-schema";
import {
  createWorkspaceAction,
  type CreateWorkspaceState,
} from "@/features/workspace/actions/create-workspace";

const initialState: CreateWorkspaceState = {};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1.5 text-sm text-red-600">{message}</p>;
}

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState(createWorkspaceAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Business name</Label>
        <Input
          id="name"
          name="name"
          placeholder="North Valley Auto Repair"
          required
          autoComplete="organization"
        />
        <FieldError message={state.fieldErrors?.name?.[0]} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessType">Business type</Label>
        <select
          id="businessType"
          name="businessType"
          required
          defaultValue=""
          className="flex h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-950 shadow-sm transition-colors focus-visible:border-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
        >
          <option value="" disabled>
            Select a business type
          </option>
          {BUSINESS_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <FieldError message={state.fieldErrors?.businessType?.[0]} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Business phone (optional)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="(555) 123-4567"
          autoComplete="tel"
        />
        <FieldError message={state.fieldErrors?.phone?.[0]} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website (optional)</Label>
        <Input id="website" name="website" type="url" placeholder="https://yourbusiness.com" />
        <FieldError message={state.fieldErrors?.website?.[0]} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timezone">Timezone</Label>
        <select
          id="timezone"
          name="timezone"
          required
          defaultValue={DEFAULT_TIMEZONE}
          className="flex h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-950 shadow-sm transition-colors focus-visible:border-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20"
        >
          {TIMEZONES.map((timezone) => (
            <option key={timezone.value} value={timezone.value}>
              {timezone.label}
            </option>
          ))}
        </select>
        <FieldError message={state.fieldErrors?.timezone?.[0]} />
      </div>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Creating workspace..." : "Create Workspace"}
      </Button>
    </form>
  );
}
