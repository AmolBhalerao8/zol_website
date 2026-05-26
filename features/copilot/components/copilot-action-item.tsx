"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type CopilotActionItemProps = {
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
  copyText?: string;
};

export function CopilotActionItem({
  title,
  description,
  href,
  linkLabel = "View details",
  copyText,
}: CopilotActionItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!copyText) {
      return;
    }
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-zinc-950">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-zinc-600">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {copyText ? (
          <Button variant="secondary" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy message"}
          </Button>
        ) : null}
        {href ? (
          <Button variant="ghost" size="sm" asChild>
            <Link href={href}>
              {linkLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
