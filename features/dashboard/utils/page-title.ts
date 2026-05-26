const PAGE_TITLES: Array<{ prefix: string; title: string }> = [
  { prefix: "/conversations/", title: "Conversation" },
  { prefix: "/customers/", title: "Customer" },
  { prefix: "/conversations", title: "Conversations" },
  { prefix: "/customers", title: "Customers" },
  { prefix: "/integrations", title: "Integrations" },
  { prefix: "/intelligence", title: "Operational Intelligence" },
  { prefix: "/workflows", title: "Operational Workflows" },
  { prefix: "/setup/ai-employee", title: "AI Employee" },
  { prefix: "/setup/voice-channel", title: "Voice Channel" },
  { prefix: "/dashboard", title: "Dashboard" },
];

export function getDashboardPageTitle(pathname: string): string {
  const match = PAGE_TITLES.find((entry) => pathname.startsWith(entry.prefix));
  return match?.title ?? "Dashboard";
}

export function getSidebarStatusCopy(input: {
  isVoiceChannelActive: boolean;
  isAIConfigured: boolean;
}): { title: string; body: string } {
  if (input.isVoiceChannelActive) {
    return {
      title: "AI employee is live",
      body: "ZOL is answering calls on your business line and saving conversations for your team.",
    };
  }

  if (input.isAIConfigured) {
    return {
      title: "Almost ready",
      body: "Activate your phone line to start receiving customer calls through ZOL.",
    };
  }

  return {
    title: "Getting started",
    body: "Tell ZOL about your business, then choose a voice and phone number.",
  };
}
