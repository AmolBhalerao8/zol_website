"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import {
  shopmonkeyConnectSchema,
  shopmonkeyTestSchema,
} from "@/features/integrations/schemas/shopmonkey-connect-schema";
import { testShopmonkeyConnection } from "@/features/integrations/services/shopmonkey/test-connection";
import type { ShopmonkeyCredentials } from "@/features/integrations/services/shopmonkey/types";
import type { IntegrationActionState } from "@/features/integrations/types/action-state";
import { encryptShopmonkeyCredentials } from "@/features/integrations/utils/integration-credentials";
import { requireManageAccess } from "@/features/integrations/utils/require-manage-access";
import { hasEncryptionConfigured } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";

function parseShopmonkeyFormData(formData: FormData) {
  return {
    apiKey: formData.get("apiKey"),
    locationId: formData.get("locationId") || undefined,
    apiBaseUrl: formData.get("apiBaseUrl") || undefined,
  };
}

function toCredentials(input: {
  apiKey: string;
  locationId?: string;
  apiBaseUrl?: string;
}): ShopmonkeyCredentials {
  return {
    apiKey: input.apiKey,
    locationId: input.locationId,
    apiBaseUrl: input.apiBaseUrl,
  };
}

export async function testShopmonkeyConnectionAction(
  _prevState: IntegrationActionState,
  formData: FormData,
): Promise<IntegrationActionState> {
  try {
    await requireManageAccess();
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Permission denied.",
    };
  }

  const parsed = shopmonkeyTestSchema.safeParse(parseShopmonkeyFormData(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await testShopmonkeyConnection(toCredentials(parsed.data));

  if (!result.success) {
    return {
      error: result.message,
    };
  }

  return {
    success: true,
    message: result.locationName
      ? `Connected to ${result.locationName}.`
      : "Shopmonkey connection verified.",
    locationName: result.locationName,
  };
}

export async function connectShopmonkey(
  _prevState: IntegrationActionState,
  formData: FormData,
): Promise<IntegrationActionState> {
  let workspaceId: string;

  try {
    const currentWorkspace = await requireManageAccess();
    workspaceId = currentWorkspace.workspace.id;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Permission denied.",
    };
  }

  if (!hasEncryptionConfigured()) {
    return {
      error: "Secure credential storage is not configured. Contact your ZOL administrator.",
    };
  }

  const parsed = shopmonkeyConnectSchema.safeParse(parseShopmonkeyFormData(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const credentials = toCredentials(parsed.data);

  await prisma.integration.upsert({
    where: {
      workspaceId_provider: {
        workspaceId,
        provider: "SHOPMONKEY",
      },
    },
    create: {
      workspaceId,
      provider: "SHOPMONKEY",
      status: "CONNECTING",
    },
    update: {
      status: "CONNECTING",
    },
  });

  const testResult = await testShopmonkeyConnection(credentials);

  const metadata: Prisma.InputJsonValue = {
    locationId: testResult.success ? testResult.locationId ?? credentials.locationId ?? null : credentials.locationId ?? null,
    locationName: testResult.success ? testResult.locationName ?? null : null,
    apiBaseUrl: testResult.success ? testResult.apiBaseUrl : credentials.apiBaseUrl ?? null,
    connectedAt: testResult.success ? new Date().toISOString() : null,
  };

  if (!testResult.success) {
    await prisma.integration.update({
      where: {
        workspaceId_provider: {
          workspaceId,
          provider: "SHOPMONKEY",
        },
      },
      data: {
        status: "FAILED",
        metadata,
      },
    });

    return {
      error: testResult.message,
    };
  }

  await prisma.integration.update({
    where: {
      workspaceId_provider: {
        workspaceId,
        provider: "SHOPMONKEY",
      },
    },
    data: {
      status: "CONNECTED",
      credentialsEncrypted: encryptShopmonkeyCredentials(credentials),
      metadata,
      lastConnectedAt: new Date(),
    },
  });

  revalidatePath("/integrations");

  return {
    success: true,
    message: testResult.locationName
      ? `Shopmonkey connected to ${testResult.locationName}.`
      : "Shopmonkey connected successfully.",
    locationName: testResult.locationName,
  };
}

export async function disconnectShopmonkey(): Promise<void> {
  let workspaceId: string;

  try {
    const currentWorkspace = await requireManageAccess();
    workspaceId = currentWorkspace.workspace.id;
  } catch {
    return;
  }

  await prisma.integration.updateMany({
    where: {
      workspaceId,
      provider: "SHOPMONKEY",
    },
    data: {
      status: "NOT_CONNECTED",
      credentialsEncrypted: null,
      metadata: Prisma.DbNull,
      lastConnectedAt: null,
    },
  });

  revalidatePath("/integrations");
}
