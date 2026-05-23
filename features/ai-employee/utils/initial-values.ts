import type { AIEmployeeSettings } from "@prisma/client";

import {
  DEFAULT_BUSINESS_HOURS,
  DEFAULT_ENABLED_CAPABILITIES,
  DEFAULT_GREETING_MESSAGE,
  parseBusinessHoursJson,
  parseCommonScenariosJson,
  parseEnabledCapabilitiesJson,
  type AIEmployeeSettingsFormValues,
} from "@/features/ai-employee/schemas/ai-employee-settings-schema";

export function toInitialValues(
  settings: AIEmployeeSettings | null,
): AIEmployeeSettingsFormValues & {
  escalationPhone: string;
  escalationEmail: string;
  commonScenarios: string;
} {
  if (!settings) {
    return {
      displayName: "ZOL",
      greetingMessage: DEFAULT_GREETING_MESSAGE,
      communicationTone: "PROFESSIONAL",
      businessContext: undefined,
      commonScenarios: "",
      businessHours: DEFAULT_BUSINESS_HOURS,
      escalationPhone: "",
      escalationEmail: "",
      enabledCapabilities: [...DEFAULT_ENABLED_CAPABILITIES],
    };
  }

  return {
    displayName: settings.displayName,
    greetingMessage: settings.greetingMessage,
    communicationTone: settings.communicationTone,
    businessContext: settings.businessContext ?? undefined,
    commonScenarios: parseCommonScenariosJson(settings.commonScenarios),
    businessHours: parseBusinessHoursJson(settings.businessHours),
    escalationPhone: settings.escalationPhone ?? "",
    escalationEmail: settings.escalationEmail ?? "",
    enabledCapabilities: parseEnabledCapabilitiesJson(
      settings.enabledCapabilities,
    ) as AIEmployeeSettingsFormValues["enabledCapabilities"],
  };
}
