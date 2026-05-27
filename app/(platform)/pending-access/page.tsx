import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUserByClerkId } from "@/features/users/queries/get-user-by-clerk-id";

export default async function PendingAccessPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getUserByClerkId(userId);

  if (user?.isApproved) {
    redirect("/auth/continue");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl items-center px-4">
      <Card className="w-full p-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Access request received</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-600">
          Thanks for your interest in ZOL. Your sign-in is active, but workspace access is still
          pending approval.
        </p>
        <p className="mt-2 text-sm leading-7 text-zinc-600">
          We will grant access after review and follow up by email.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </Card>
    </div>
  );
}
