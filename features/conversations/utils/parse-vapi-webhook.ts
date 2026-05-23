import { isCompletedCallEvent } from "./map-vapi-event";

export type ParsedVapiWebhook = {
  eventType: string;
  callId: string | null;
  assistantId: string | null;
  phoneNumberId: string | null;
  customerName: string | null;
  customerPhone: string | null;
  transcript: string | null;
  transcriptUrl: string | null;
  recordingUrl: string | null;
  startedAt: Date | null;
  endedAt: Date | null;
  durationSeconds: number | null;
  callStatus: string | null;
  isCompletedCall: boolean;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function readDate(value: unknown): Date | null {
  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function readDurationSeconds(
  startedAt: Date | null,
  endedAt: Date | null,
  explicitDuration: unknown,
): number | null {
  if (typeof explicitDuration === "number" && Number.isFinite(explicitDuration)) {
    return Math.max(0, Math.round(explicitDuration));
  }

  if (typeof explicitDuration === "string") {
    const parsed = Number(explicitDuration);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.round(parsed));
    }
  }

  if (startedAt && endedAt) {
    return Math.max(0, Math.round((endedAt.getTime() - startedAt.getTime()) / 1000));
  }

  return null;
}

function extractTranscript(payload: Record<string, unknown>): string | null {
  const artifact = asRecord(payload.artifact) ?? asRecord(asRecord(payload.call)?.artifact);
  const analysis = asRecord(payload.analysis) ?? asRecord(asRecord(payload.call)?.analysis);
  const messageRecord = asRecord(payload.message);
  const messageArtifact = messageRecord ? asRecord(messageRecord.artifact) : null;

  return (
    readString(payload.transcript) ??
    readString(artifact?.transcript) ??
    readString(messageArtifact?.transcript) ??
    readString(analysis?.transcript) ??
    readString(asRecord(payload.call)?.transcript)
  );
}

function extractRecordingUrl(payload: Record<string, unknown>): string | null {
  const artifact = asRecord(payload.artifact) ?? asRecord(asRecord(payload.call)?.artifact);
  const recording = asRecord(artifact?.recording);

  return (
    readString(payload.recordingUrl) ??
    readString(recording?.url) ??
    readString(recording?.recordingUrl) ??
    readString(artifact?.recordingUrl)
  );
}

function extractCustomer(payload: Record<string, unknown>) {
  const customer =
    asRecord(payload.customer) ??
    asRecord(asRecord(payload.call)?.customer) ??
    asRecord(asRecord(payload.message)?.customer);

  const customerPhone =
    readString(customer?.number) ??
    readString(customer?.phone) ??
    readString(customer?.phoneNumber) ??
    readString(asRecord(payload.call)?.customerPhoneNumber) ??
    readString(payload.customerPhone);

  const customerName =
    readString(customer?.name) ??
    readString(customer?.firstName) ??
    readString(payload.customerName);

  return { customerName, customerPhone };
}

export function parseVapiWebhookPayload(payload: unknown): ParsedVapiWebhook | null {
  const root = asRecord(payload);

  if (!root) {
    return null;
  }

  const message = asRecord(root.message) ?? root;
  const call = asRecord(message.call) ?? asRecord(root.call);
  const phoneNumber =
    asRecord(message.phoneNumber) ??
    asRecord(root.phoneNumber) ??
    asRecord(call?.phoneNumber);

  const eventType =
    readString(message.type) ??
    readString(root.type) ??
    readString(root.event) ??
    readString(root.messageType) ??
    "unknown";

  const callId =
    readString(call?.id) ??
    readString(message.callId) ??
    readString(root.callId) ??
    readString(root.id);

  const assistantId =
    readString(asRecord(message.assistant)?.id) ??
    readString(asRecord(root.assistant)?.id) ??
    readString(call?.assistantId) ??
    readString(root.assistantId);

  const phoneNumberId =
    readString(phoneNumber?.id) ??
    readString(call?.phoneNumberId) ??
    readString(root.phoneNumberId);

  const startedAt =
    readDate(message.startedAt) ??
    readDate(root.startedAt) ??
    readDate(call?.startedAt);

  const endedAt =
    readDate(message.endedAt) ??
    readDate(root.endedAt) ??
    readDate(call?.endedAt);

  const durationSeconds = readDurationSeconds(
    startedAt,
    endedAt,
    call?.duration ??
      call?.durationSeconds ??
      message.duration ??
      message.durationSeconds ??
      root.duration ??
      root.durationSeconds,
  );

  const { customerName, customerPhone } = extractCustomer({ ...root, call, message });

  const transcript = extractTranscript({ ...root, call, message });
  const recordingUrl = extractRecordingUrl({ ...root, call, message });

  const transcriptUrl =
    readString(root.transcriptUrl) ??
    readString(asRecord(asRecord(root.artifact) ?? asRecord(call?.artifact))?.transcriptUrl);

  const callStatus =
    readString(call?.status) ??
    readString(message.status) ??
    readString(root.status);

  return {
    eventType,
    callId,
    assistantId,
    phoneNumberId,
    customerName,
    customerPhone,
    transcript,
    transcriptUrl,
    recordingUrl,
    startedAt,
    endedAt,
    durationSeconds,
    callStatus,
    isCompletedCall: isCompletedCallEvent(eventType),
  };
}
