"use server";

import { revalidatePath } from "next/cache";

import { syncTekmetricData } from "@/features/integrations/services/tekmetric/sync-tekmetric-data";
import { requireManageAccess } from "@/features/integrations/utils/require-manage-access";
import { prisma } from "@/lib/prisma";

export type TekmetricSyncActionState = {
  error?: string;
  success?: boolean;
  message?: string;
};

export async function syncTekmetricNow(
  _prevState: TekmetricSyncActionState,
  _formData: FormData,
): Promise<TekmetricSyncActionState> {
  try {
    const currentWorkspace = await requireManageAccess();

    const integration = await prisma.integration.findUnique({
      where: {
        workspaceId_provider: {
          workspaceId: currentWorkspace.workspace.id,
          provider: "TEKMETRIC",
        },
      },
    });

    if (!integration || integration.status !== "CONNECTED") {
      return {
        error: "Connect Tekmetric before syncing operational data.",
      };
    }

    const result = await syncTekmetricData({
      workspaceId: currentWorkspace.workspace.id,
      integration,
    });

    revalidatePath("/integrations");
    revalidatePath("/integrations/tekmetric");
    revalidatePath("/dashboard");
    revalidatePath("/customers");

    if (!result.success) {
      return {
        error: result.message,
      };
    }

    const { recordsSynced } = result;
    const message = result.mockMode
      ? `Demo sync complete — ${recordsSynced.customers} customers, ${recordsSynced.vehicles} vehicles, ${recordsSynced.appointments} appointments, ${recordsSynced.repairOrders} repair orders.`
      : `Sync complete — ${recordsSynced.customers} customers, ${recordsSynced.vehicles} vehicles, ${recordsSynced.appointments} appointments, ${recordsSynced.repairOrders} repair orders.`;

    return {
      success: true,
      message,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to sync Tekmetric data.",
    };
  }
}
