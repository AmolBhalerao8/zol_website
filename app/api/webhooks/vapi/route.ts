import { NextRequest, NextResponse } from "next/server";

import { processVapiWebhook } from "@/features/conversations/actions/process-vapi-webhook";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const result = await processVapiWebhook(rawBody, request.headers);

  return NextResponse.json(result.body, { status: result.status });
}
