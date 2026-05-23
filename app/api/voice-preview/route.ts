import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { isValidVapiVoiceId } from "@/features/voice-channel/utils/vapi-voices-catalog";

type VoicePreviewRequest = {
  voiceId?: string;
};

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: VoicePreviewRequest;

  try {
    body = (await request.json()) as VoicePreviewRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.voiceId || !isValidVapiVoiceId(body.voiceId)) {
    return NextResponse.json({ error: "Invalid voice selection." }, { status: 400 });
  }

  const apiKey = process.env.VAPI_PRIVATE_KEY || process.env.VAPI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Voice preview is not configured." }, { status: 503 });
  }

  const response = await fetch("https://api.vapi.ai/call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assistant: {
        firstMessage: `Hi, this is ${body.voiceId}. Here is how I will sound for your customers.`,
        voice: {
          provider: "vapi",
          voiceId: body.voiceId,
        },
        model: {
          provider: "openai",
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content:
                "Deliver a short voice preview. Speak only the first message once, clearly and naturally, then remain silent.",
            },
          ],
        },
      },
      transport: {
        provider: "vapi.websocket",
        audioFormat: {
          format: "pcm_s16le",
          sampleRate: 16000,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Vapi voice preview failed:", errorBody);
    return NextResponse.json({ error: "Unable to start voice preview." }, { status: 502 });
  }

  const call = (await response.json()) as {
    transport?: {
      websocketCallUrl?: string;
    };
  };

  const websocketCallUrl = call.transport?.websocketCallUrl;

  if (!websocketCallUrl) {
    return NextResponse.json({ error: "Voice preview is unavailable." }, { status: 502 });
  }

  return NextResponse.json({ websocketCallUrl });
}
