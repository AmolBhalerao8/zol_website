"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export async function ensureLocalUser(): Promise<User> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (existingUser) {
    return existingUser;
  }

  const clerkUser = await currentUser().catch(() => null);

  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses[0]?.emailAddress ??
    `user-${userId}@users.zol.app`;

  const userData = {
    email,
    name: clerkUser?.fullName || clerkUser?.firstName || null,
    imageUrl: clerkUser?.imageUrl || null,
  };

  try {
    return await prisma.user.create({
      data: {
        clerkUserId: userId,
        ...userData,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
      });

      if (user) {
        return user;
      }
    }

    throw error;
  }
}
