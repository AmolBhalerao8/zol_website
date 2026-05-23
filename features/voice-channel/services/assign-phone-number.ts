import { assignVapiPhoneNumber, type VapiPhoneNumber } from "./vapi";

type AssignPhoneNumberInput = {
  assistantId: string;
  workspaceName: string;
  areaCode: string;
};

export async function assignPhoneNumber({
  assistantId,
  workspaceName,
  areaCode,
}: AssignPhoneNumberInput): Promise<VapiPhoneNumber> {
  return assignVapiPhoneNumber({
    assistantId,
    name: `${workspaceName} communication line`,
    areaCode,
  });
}
