import type { MessageChannel } from "@prisma/client";

type RecipientInput = {
  primaryPhone?: string | null;
  primaryEmail?: string | null;
  conversationPhone?: string | null;
  preferredChannel?: MessageChannel;
};

export function resolveRecipient(input: RecipientInput): {
  channel: MessageChannel;
  recipient: string;
} | null {
  const phone = input.primaryPhone?.trim() || input.conversationPhone?.trim();
  const email = input.primaryEmail?.trim();

  if (input.preferredChannel === "EMAIL" && email) {
    return { channel: "EMAIL", recipient: email };
  }

  if (input.preferredChannel === "SMS" && phone) {
    return { channel: "SMS", recipient: phone };
  }

  if (phone) {
    return { channel: "SMS", recipient: phone };
  }

  if (email) {
    return { channel: "EMAIL", recipient: email };
  }

  return null;
}
