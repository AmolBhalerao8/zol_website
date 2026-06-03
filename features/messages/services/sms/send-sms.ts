export type SendSmsInput = {
  to: string;
  content: string;
};

export type SendSmsResult = {
  success: boolean;
  providerMessageId?: string;
  error?: string;
  mock?: boolean;
};

export async function sendSms(input: SendSmsInput): Promise<SendSmsResult> {
  const provider = process.env.SMS_PROVIDER?.trim().toLowerCase() ?? "";
  const apiKey = process.env.SMS_API_KEY?.trim();
  const fromNumber = process.env.SMS_FROM_NUMBER?.trim();

  if (!provider || !apiKey) {
    console.info("[outbound-sms:mock]", {
      to: input.to,
      preview: input.content.slice(0, 120),
    });

    return {
      success: true,
      providerMessageId: `mock-sms-${Date.now()}`,
      mock: true,
    };
  }

  if (provider === "twilio" && fromNumber) {
    const accountSid = process.env.SMS_ACCOUNT_SID?.trim() ?? apiKey.split(":")[0];
    const authToken = process.env.SMS_AUTH_TOKEN?.trim() ?? apiKey.split(":")[1] ?? apiKey;
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");

    const body = new URLSearchParams({
      To: input.to,
      From: fromNumber,
      Body: input.content,
    });

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      return { success: false, error: errorBody || "SMS send failed" };
    }

    const payload = (await response.json()) as { sid?: string };
    return { success: true, providerMessageId: payload.sid };
  }

  console.info("[outbound-sms:unsupported-provider]", provider);
  return {
    success: true,
    providerMessageId: `mock-sms-${Date.now()}`,
    mock: true,
  };
}
