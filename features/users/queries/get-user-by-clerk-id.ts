import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

export async function getUserByClerkId(clerkUserId: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { clerkUserId },
  });
}
