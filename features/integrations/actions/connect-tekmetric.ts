"use server";

import { revalidatePath } from "next/cache";

import {
  tekmetricConnectSchema,
  tekmetricTestSchema,
} from "@/features/integrations/schemas/tekmetric-connect-schema";
import { testTekmetricConnection } from "@/features/integrations/services/tekmetric/test-connection";
import type { TekmetricCredentials } from "@/features/integrations/services/tekmetric/types";
import { canManageIntegrations } from "@/features/integrations/utils/can-manage-integrations";
import { encryptTekmetricCredentials } from "@/features/integrations/utils/integration-credentials";
import { getCurrentWorkspace } from "@/features/workspace/queries/get-current-workspace";
import { hasEncryptionConfigured } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type IntegrationActionState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  success?: boolean;
  message?: string;
  shopName?: string;
};

function parseTekmetricFormData(formData: FormData) {
  return {
    clientId: formData.get("clientId"),
    apiKey: formData.get("apiKey"),
    shopId: formData.get("shopId"),
    apiBaseUrl: formData.get("apiBaseUrl") || undefined,
  };
}

function toCredentials(input: {
  clientId: string;
  apiKey: string;
  shopId: string;
  apiBaseUrl?: string;
}): TekmetricCredentials {
  return {
    clientId: input.clientId,
    apiKey: input.apiKey,
    shopId: input.shopId,
    apiBaseUrl: input.apiBaseUrl,
  };
}

async function requireManageAccess() {
  const currentWorkspace = await getCurrentWorkspace();

  if (!currentWorkspace) {
    throw new Error("Workspace required");
  }

  if (!canManageIntegrations(currentWorkspace.role)) {
    throw new Error("You do not have permission to manage integrations.");
  }

  return currentWorkspace;
}

export async function testTekmetricConnectionAction(
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

  const parsed = tekmetricTestSchema.safeParse(parseTekmetricFormData(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const result = await testTekmetricConnection(toCredentials(parsed.data));

  if (!result.success) {
    return {
      error: result.message,
    };
  }

  return {
    success: true,
    message: result.shopName
      ? `Connected to ${result.shopName}.`
      : "Tekmetric connection verified.",
    shopName: result.shopName,
  };
}

export async function connectTekmetric(
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
      error: "Secure credential storage is not configured. Add ENCRYPTION_KEY to the environment.",
    };
  }

  const parsed = tekmetricConnectSchema.safeParse(parseTekmetricFormData(formData));

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
        provider: "TEKMETRIC",
      },
    },
    create: {
      workspaceId,
      provider: "TEKMETRIC",
      status: "CONNECTING",
    },
    update: {
      status: "CONNECTING",
    },
  });

  const testResult = await testTekmetricConnection(credentials);

  const metadata: Prisma.InputJsonValue = {
    shopId: credentials.shopId,
    shopName: testResult.success ? testResult.shopName ?? null : null,
    apiBaseUrl: testResult.success ? testResult.apiBaseUrl : credentials.apiBaseUrl ?? null,
    connectedAt: testResult.success ? new Date().toISOString() : null,
  };

  if (!testResult.success) {
    await prisma.integration.update({
      where: {
        workspaceId_provider: {
          workspaceId,
          provider: "TEKMETRIC",
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
        provider: "TEKMETRIC",
      },
    },
    data: {
      status: "CONNECTED",
      credentialsEncrypted: encryptTekmetricCredentials(credentials),
      metadata,
      lastConnectedAt: new Date(),
    },
  });

  revalidatePath("/integrations");

  return {
    success: true,
    message: testResult.shopName
      ? `Tekmetric connected to ${testResult.shopName}.`
      : "Tekmetric connected successfully.",
    shopName: testResult.shopName,
  };
}

export async function disconnectTekmetric(): Promise<void> {
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
      provider: "TEKMETRIC",
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
