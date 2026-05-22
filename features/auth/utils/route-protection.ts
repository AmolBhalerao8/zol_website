import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const hasClerkKeys =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

export async function redirectAuthenticatedUser() {
  if (!hasClerkKeys) {
    return;
  }

  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }
}

export async function protectPlatformRoute() {
  if (!hasClerkKeys) {
    redirect("/sign-in");
  }

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
}
