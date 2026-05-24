import type { ClassifiedIntelligenceQuery, IntelligenceRetrievalResult } from "@/features/intelligence/types/intelligence-types";
import { prisma } from "@/lib/prisma";

function formatWhen(value: Date | null | undefined): string {
  if (!value) {
    return "Unscheduled";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export async function retrieveAppointments(
  workspaceId: string,
  classified: ClassifiedIntelligenceQuery,
): Promise<IntelligenceRetrievalResult> {
  const where: {
    workspaceId: string;
    scheduledAt?: { gte?: Date; lte?: Date };
  } = { workspaceId };

  if (classified.timeframe?.start || classified.timeframe?.end) {
    where.scheduledAt = {};
    if (classified.timeframe.start) {
      where.scheduledAt.gte = classified.timeframe.start;
    }
    if (classified.timeframe.end) {
      where.scheduledAt.lte = classified.timeframe.end;
    }
  }

  const appointments = await prisma.tekmetricAppointment.findMany({
    where,
    orderBy: { scheduledAt: "asc" },
    take: 25,
    select: {
      id: true,
      externalId: true,
      scheduledAt: true,
      status: true,
      summary: true,
      zolCustomerId: true,
    },
  });

  return {
    queryType: "appointments",
    recordCount: appointments.length,
    payload: {
      appointments: appointments.map((appointment) => ({
        id: appointment.id,
        scheduledAt: appointment.scheduledAt?.toISOString() ?? null,
        status: appointment.status,
        summary: appointment.summary,
        zolCustomerId: appointment.zolCustomerId,
      })),
    },
    sources: appointments.map((appointment) => ({
      id: appointment.id,
      type: "appointment" as const,
      title: formatWhen(appointment.scheduledAt),
      summary: appointment.summary ?? "Scheduled appointment",
      metadata: {
        status: appointment.status ?? "Unknown",
        externalId: appointment.externalId,
      },
    })),
  };
}
