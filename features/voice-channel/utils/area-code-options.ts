const US_AREA_CODE_PATTERN = /^[2-9]\d{2}$/;

export function normalizeAreaCodeInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 3);
}

export function isUsAreaCodeFormat(value: string): boolean {
  return US_AREA_CODE_PATTERN.test(value);
}

export function getDefaultAreaCode(workspacePhone?: string | null): string {
  if (workspacePhone) {
    const digits = workspacePhone.replace(/\D/g, "");

    if (digits.length === 11 && digits.startsWith("1")) {
      return digits.slice(1, 4);
    }

    if (digits.length === 10) {
      return digits.slice(0, 3);
    }
  }

  const configured =
    process.env.VAPI_DEFAULT_AREA_CODE?.trim() ||
    process.env.NEXT_PUBLIC_DEFAULT_AREA_CODE?.trim();

  if (configured && isUsAreaCodeFormat(configured)) {
    return configured;
  }

  return "";
}

export function formatAreaCodeLabel(code: string): string {
  return `Area code ${code}`;
}
