type DemoRequestNotification = {
  name: string;
  email: string;
  phone: string;
  business: string;
};

export async function notifyDemoRequest(input: DemoRequestNotification): Promise<void> {
  const notificationEmail = process.env.DEMO_NOTIFICATION_EMAIL?.trim();
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.DEMO_FROM_EMAIL?.trim() ?? "ZOL <onboarding@resend.dev>";

  if (!notificationEmail || !resendApiKey) {
    console.info("[demo-request] New submission (email notification not configured):", input);
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [notificationEmail],
      subject: `New ZOL demo request — ${input.business}`,
      text: [
        "A new demo request was submitted on zol-website.",
        "",
        `Name: ${input.name}`,
        `Email: ${input.email}`,
        `Phone: ${input.phone}`,
        `Business: ${input.business}`,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("[demo-request] Failed to send notification email:", errorBody);
  }
}
