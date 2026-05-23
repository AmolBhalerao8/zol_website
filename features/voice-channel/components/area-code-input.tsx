"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  checkAreaCodeAvailability,
  type CheckAreaCodeAvailabilityState,
} from "@/features/voice-channel/actions/check-area-code-availability";
import {
  normalizeAreaCodeInput,
  isUsAreaCodeFormat,
} from "@/features/voice-channel/utils/area-code-options";
import { extractSuggestedAreaCodesFromError } from "@/features/voice-channel/utils/parse-vapi-phone-error";

const initialCheckState: CheckAreaCodeAvailabilityState = {};

type AreaCodeInputProps = {
  defaultValue?: string;
  disabled?: boolean;
  locked?: boolean;
  activationError?: string;
  name?: string;
};

export function AreaCodeInput({
  defaultValue = "",
  disabled = false,
  locked = false,
  activationError,
  name = "areaCode",
}: AreaCodeInputProps) {
  const [areaCode, setAreaCode] = useState(defaultValue);
  const [checkState, checkAction, isChecking] = useActionState(
    checkAreaCodeAvailability,
    initialCheckState,
  );

  const suggestedFromActivation = extractSuggestedAreaCodesFromError(activationError);
  const suggestedAreaCodes =
    checkState.suggestedAreaCodes && checkState.suggestedAreaCodes.length > 0
      ? checkState.suggestedAreaCodes
      : suggestedFromActivation;

  useEffect(() => {
    setAreaCode(defaultValue);
  }, [defaultValue]);

  if (locked && defaultValue) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.16em] text-emerald-700">Locked area code</p>
        <p className="mt-1 text-sm font-semibold text-emerald-950">{defaultValue}</p>
        <p className="mt-2 text-sm text-emerald-900/80">
          Your business communication number is assigned to this region.
        </p>
        <input type="hidden" name={name} value={defaultValue} />
      </div>
    );
  }

  function handleInputChange(value: string) {
    setAreaCode(normalizeAreaCodeInput(value));
  }

  function applySuggestedCode(code: string) {
    setAreaCode(code);
  }

  const checkMatchesCurrent = checkState.checkedAreaCode === areaCode;
  const verifiedForCurrent = checkState.available === true && checkMatchesCurrent;
  const unavailableFromCheck = checkState.available === false && checkMatchesCurrent;
  const showVerified = verifiedForCurrent && Boolean(checkState.message);
  const showUnavailable =
    unavailableFromCheck ||
    Boolean(checkState.error) ||
    (Boolean(activationError) && !verifiedForCurrent);

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={areaCode} />

      <div className="space-y-2">
        <Label htmlFor="areaCode">US area code</Label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            id="areaCode"
            inputMode="numeric"
            autoComplete="tel-area-code"
            placeholder="e.g. 530"
            maxLength={3}
            value={areaCode}
            disabled={disabled || isChecking}
            onChange={(event) => handleInputChange(event.target.value)}
            className="sm:max-w-[160px] text-lg tracking-[0.2em]"
          />
          <Button
            type="submit"
            formAction={checkAction}
            variant="secondary"
            disabled={disabled || isChecking || !isUsAreaCodeFormat(areaCode)}
          >
            {isChecking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify availability"
            )}
          </Button>
        </div>
        <p className="text-sm text-zinc-500">
          Enter a 3-digit US area code, then verify availability with Vapi before activating.
        </p>
      </div>

      {showVerified && checkState.message ? (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{checkState.message}</p>
        </div>
      ) : null}

      {showUnavailable ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {checkState.error ??
            checkState.message ??
            activationError ??
            "This area code is not available right now."}
        </div>
      ) : null}

      {suggestedAreaCodes.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-700">Try one of these available area codes</p>
          <div className="flex flex-wrap gap-2">
            {suggestedAreaCodes.map((code) => (
              <button
                key={code}
                type="button"
                disabled={disabled}
                onClick={() => applySuggestedCode(code)}
                className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
              >
                Use {code}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
