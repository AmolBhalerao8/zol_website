const PAGE_TITLES: Array<{ prefix: string; title: string }> = [
  { prefix: "/conversations/", title: "Call details" },
  { prefix: "/customers/", title: "Customer" },
  { prefix: "/conversations", title: "Calls" },
  { prefix: "/customers", title: "Customers" },
  { prefix: "/integrations", title: "Connections" },
  { prefix: "/intelligence", title: "Ask ZOL" },
  { prefix: "/copilot", title: "Copilot" },
  { prefix: "/workflows", title: "Follow-ups" },
  { prefix: "/setup/ai-employee", title: "ZOL setup" },
  { prefix: "/setup/voice-channel", title: "Phone line" },
  { prefix: "/dashboard", title: "Home" },
];

export function getDashboardPageTitle(pathname: string): string {
  const match = PAGE_TITLES.find((entry) => pathname.startsWith(entry.prefix));
  return match?.title ?? "Home";
}

export function getSidebarStatusCopy(input: {
  isVoiceChannelActive: boolean;
  isAIConfigured: boolean;
}): { title: string; body: string } {
  if (input.isVoiceChannelActive) {
    return {
      title: "ZOL is answering calls",
      body: "Customer calls are being saved for your team.",
    };
  }

  if (input.isAIConfigured) {
    return {
      title: "Almost ready",
      body: "Turn on your phone line to start receiving calls through ZOL.",
    };
  }

  return {
    title: "Getting started",
    body: "Tell ZOL about your business, then choose a phone number.",
  };
}
