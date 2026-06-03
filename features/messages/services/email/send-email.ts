export type SendEmailInput = {
  to: string;
  subject: string;
  content: string;
  fromName?: string;
};

export type SendEmailResult = {
  success: boolean;
  providerMessageId?: string;
  error?: string;
  mock?: boolean;
};

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const provider = process.env.EMAIL_PROVIDER?.trim().toLowerCase() ?? "";
  const apiKey = process.env.EMAIL_API_KEY?.trim();
  const fromEmail =
    process.env.EMAIL_FROM?.trim() ??
    process.env.DEMO_FROM_EMAIL?.trim() ??
    "ZOL <onboarding@resend.dev>";

  if (!provider || !apiKey) {
    console.info("[outbound-email:mock]", {
      to: input.to,
      subject: input.subject,
      preview: input.content.slice(0, 120),
    });

    return {
      success: true,
      providerMessageId: `mock-email-${Date.now()}`,
      mock: true,
    };
  }

  if (provider === "resend") {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [input.to],
        subject: input.subject,
        text: input.content,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return { success: false, error: errorBody || "Email send failed" };
    }

    const payload = (await response.json()) as { id?: string };
    return { success: true, providerMessageId: payload.id };
  }

  console.info("[outbound-email:unsupported-provider]", provider);
  return {
    success: true,
    providerMessageId: `mock-email-${Date.now()}`,
    mock: true,
  };
}
