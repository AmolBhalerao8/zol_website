import { NextResponse } from "next/server";

import { notifyDemoRequest } from "@/features/landing/services/notify-demo-request";
import { prisma } from "@/lib/prisma";

type BookDemoRequest = {
  name?: string;
  email?: string;
  phone?: string;
  business?: string;
};

function normalizeField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: BookDemoRequest;

  try {
    body = (await request.json()) as BookDemoRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = normalizeField(body.name);
  const email = normalizeField(body.email);
  const phone = normalizeField(body.phone);
  const business = normalizeField(body.business);

  if (!name) {
    return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (!phone) {
    return NextResponse.json({ error: "Enter your phone number." }, { status: 400 });
  }

  if (!business) {
    return NextResponse.json({ error: "Enter your business name." }, { status: 400 });
  }

  await prisma.demoRequest.create({
    data: {
      name,
      email,
      phone,
      business,
    },
  });

  await notifyDemoRequest({ name, email, phone, business });

  return NextResponse.json({ success: true });
}
