import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

import { AuthShell } from "@/features/auth/layouts/auth-shell";

export function SignInPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your ZOL workspace"
      description="Access conversations, customer memory, operational insights, and your AI employee dashboard."
      footer={
        <>
          New to ZOL?{" "}
          <Link href="/sign-up" className="font-semibold text-emerald-700 hover:text-emerald-800">
            Create your workspace
          </Link>
        </>
      }
    >
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        forceRedirectUrl="/onboarding"
        appearance={{
          elements: {
            rootBox: "mx-auto w-full",
            cardBox: "w-full shadow-none",
            card: "w-full border-0 bg-transparent p-0 shadow-none",
            headerTitle: "text-zinc-950",
            headerSubtitle: "text-zinc-500",
            formButtonPrimary:
              "bg-zinc-950 text-white hover:bg-zinc-800 rounded-full shadow-card",
            footerActionLink: "text-emerald-700 hover:text-emerald-800",
            formFieldInput: "rounded-2xl border-zinc-200 focus:border-emerald-500",
            footer: "hidden",
          },
        }}
      />
    </AuthShell>
  );
}
