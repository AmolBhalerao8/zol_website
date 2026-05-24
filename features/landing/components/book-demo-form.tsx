"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BookDemoForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/demo/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, business }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Unable to submit your demo request.");
        return;
      }

      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setBusiness("");
    } catch {
      setError("Unable to submit your demo request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-950">Demo request received</h3>
        <p className="mt-3 text-sm leading-7 text-zinc-600">
          Thanks for your interest in ZOL. Our team will reach out shortly to schedule your demo.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={() => setSubmitted(false)}
        >
          Submit another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Name</span>
          <Input
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Email</span>
          <Input
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@business.com"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Phone number</span>
          <Input
            name="phone"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="(555) 555-0123"
            required
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700">Business</span>
          <Input
            name="business"
            value={business}
            onChange={(event) => setBusiness(event.target.value)}
            placeholder="Your business name"
            required
          />
        </label>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Submitting..." : "Book Demo"}
        {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
      </Button>
    </form>
  );
}
