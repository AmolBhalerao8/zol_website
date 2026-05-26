import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

import { AuthShell } from "@/features/auth/layouts/auth-shell";

export function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your ZOL account"
      description="Set up ZOL to answer calls, remember customers, and keep track of follow-ups."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-emerald-700 hover:text-emerald-800">
            Sign in
          </Link>
        </>
      }
    >
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        forceRedirectUrl="/auth/continue"
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
