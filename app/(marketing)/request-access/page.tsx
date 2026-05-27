import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookDemoForm } from "@/features/landing/components/book-demo-form";

export default function RequestAccessPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-14">
      <section className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
          Request access
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-8 text-zinc-600">
          ZOL is currently invite-only. Share your details and we will review your request.
        </p>
        <div className="mt-5">
          <Button variant="secondary" asChild>
            <Link href="/sign-in">Already approved? Sign in</Link>
          </Button>
        </div>
      </section>

      <Card className="p-6 sm:p-8">
        <BookDemoForm mode="access" />
      </Card>
    </div>
  );
}
