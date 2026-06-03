import type { OutboundMessageWithRelations } from "@/features/messages/types/message-types";
import {
  MESSAGE_CHANNEL_LABELS,
  MESSAGE_STATUS_LABELS,
  MESSAGE_TYPE_LABELS,
} from "@/features/messages/types/message-types";
import { getCustomerDisplayName } from "@/features/customers/utils/normalize-customer-identity";

type MessageHistoryTableProps = {
  messages: OutboundMessageWithRelations[];
};

function formatTimestamp(value: Date | null | undefined): string {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function MessageHistoryTable({ messages }: MessageHistoryTableProps) {
  if (messages.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-zinc-200 bg-white p-10 text-center">
        <p className="text-sm text-zinc-500">No communication history yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
            <tr>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Type</th>
              <th className="px-5 py-4">Channel</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Sent</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message) => {
              const customerLabel = message.customer
                ? getCustomerDisplayName(message.customer)
                : message.conversation?.customerName ?? message.recipient;

              return (
                <tr key={message.id} className="border-b border-zinc-100 last:border-b-0">
                  <td className="px-5 py-4">
                    <p className="font-medium text-zinc-900">{customerLabel}</p>
                    <p className="mt-1 line-clamp-2 text-zinc-500">{message.content}</p>
                  </td>
                  <td className="px-5 py-4 text-zinc-600">{MESSAGE_TYPE_LABELS[message.type]}</td>
                  <td className="px-5 py-4 text-zinc-600">{MESSAGE_CHANNEL_LABELS[message.channel]}</td>
                  <td className="px-5 py-4 text-zinc-600">{MESSAGE_STATUS_LABELS[message.status]}</td>
                  <td className="px-5 py-4 text-zinc-600">
                    {formatTimestamp(message.sentAt ?? message.createdAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
