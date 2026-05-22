"use server";

import { redirect } from "next/navigation";

import { ensureLocalUser } from "@/features/users";
import { onboardingSchema } from "@/features/onboarding/schemas/onboarding-schema";
import { prisma } from "@/lib/prisma";

export type CreateWorkspaceState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export async function createWorkspaceAction(
  _prevState: CreateWorkspaceState,
  formData: FormData,
): Promise<CreateWorkspaceState> {
  const raw = {
    name: formData.get("name"),
    businessType: formData.get("businessType"),
    phone: formData.get("phone") || undefined,
    website: formData.get("website") || undefined,
    timezone: formData.get("timezone"),
  };

  const parsed = onboardingSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await ensureLocalUser();

  const existingMembership = await prisma.workspaceMember.findFirst({
    where: { userId: user.id },
  });

  if (existingMembership) {
    redirect("/dashboard");
  }

  try {
    await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name: parsed.data.name,
          businessType: parsed.data.businessType,
          phone: parsed.data.phone,
          website: parsed.data.website,
          timezone: parsed.data.timezone,
        },
      });

      await tx.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: workspace.id,
          role: "OWNER",
        },
      });
    });
  } catch (error) {
    console.error("Failed to create workspace:", error);
    return { error: "Unable to create workspace. Please try again." };
  }

  redirect("/dashboard");
}
