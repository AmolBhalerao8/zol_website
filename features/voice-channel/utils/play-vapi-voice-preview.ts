"use client";

const PREVIEW_SAMPLE_RATE = 16000;
const INITIAL_BUFFER_MS = 120;
const MERGE_INTERVAL_MS = 60;
const MAX_PREVIEW_MS = 10000;

type PcmStreamPlayer = {
  start: () => Promise<void>;
  push: (chunk: ArrayBuffer) => void;
  flush: () => void;
  stop: () => Promise<void>;
  getRemainingDuration: () => number;
};

type PreviewSession = {
  controller: AbortController;
  player: PcmStreamPlayer | null;
};

let activePreviewSession: PreviewSession | null = null;

function createPcmStreamPlayer(): PcmStreamPlayer {
  const audioContext = new AudioContext();
  let nextStartTime = 0;
  let playbackStarted = false;
  let closed = false;
  const sources = new Set<AudioBufferSourceNode>();
  const pendingChunks: Float32Array[] = [];
  let mergeTimer: number | null = null;

  function pcmToFloats(arrayBuffer: ArrayBuffer): Float32Array {
    const pcm = new Int16Array(arrayBuffer);
    const floats = new Float32Array(pcm.length);

    for (let index = 0; index < pcm.length; index += 1) {
      floats[index] = pcm[index] / 32768;
    }

    return floats;
  }

  function scheduleMergedBuffer(samples: Float32Array) {
    if (closed || samples.length === 0) {
      return;
    }

    const buffer = audioContext.createBuffer(1, samples.length, PREVIEW_SAMPLE_RATE);
    buffer.getChannelData(0).set(samples);

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);

    const now = audioContext.currentTime;
    const leadTime = playbackStarted ? 0.04 : 0.08;
    const startAt = Math.max(nextStartTime, now + leadTime);

    source.start(startAt);
    nextStartTime = startAt + buffer.duration;
    playbackStarted = true;
    sources.add(source);

    source.onended = () => {
      sources.delete(source);
    };
  }

  function flushPending() {
    if (pendingChunks.length === 0) {
      return;
    }

    const totalLength = pendingChunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const merged = new Float32Array(totalLength);
    let offset = 0;

    for (const chunk of pendingChunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    pendingChunks.length = 0;
    scheduleMergedBuffer(merged);
  }

  function scheduleFlush(delayMs: number) {
    if (mergeTimer !== null || closed) {
      return;
    }

    mergeTimer = window.setTimeout(() => {
      mergeTimer = null;
      flushPending();
    }, delayMs);
  }

  return {
    async start() {
      nextStartTime = audioContext.currentTime;

      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }
    },

    push(chunk) {
      if (closed) {
        return;
      }

      pendingChunks.push(pcmToFloats(chunk));
      scheduleFlush(playbackStarted ? MERGE_INTERVAL_MS : INITIAL_BUFFER_MS);
    },

    flush() {
      if (mergeTimer !== null) {
        window.clearTimeout(mergeTimer);
        mergeTimer = null;
      }

      flushPending();
    },

    async stop() {
      if (closed) {
        return;
      }

      closed = true;

      if (mergeTimer !== null) {
        window.clearTimeout(mergeTimer);
        mergeTimer = null;
      }

      pendingChunks.length = 0;

      for (const source of sources) {
        try {
          source.stop();
        } catch {
          // Source may already be stopped.
        }
      }

      sources.clear();

      if (audioContext.state !== "closed") {
        await audioContext.close();
      }
    },

    getRemainingDuration() {
      return Math.max(0, nextStartTime - audioContext.currentTime);
    },
  };
}

function waitForPlaybackEnd(player: PcmStreamPlayer, maxWaitMs: number): Promise<void> {
  return new Promise((resolve) => {
    const startedAt = Date.now();

    const tick = () => {
      const remainingMs = Math.ceil(player.getRemainingDuration() * 1000);
      const elapsedMs = Date.now() - startedAt;

      if (remainingMs <= 20 || elapsedMs >= maxWaitMs) {
        resolve();
        return;
      }

      window.setTimeout(tick, Math.min(remainingMs, 120));
    };

    tick();
  });
}

export function stopActiveVoicePreview() {
  if (!activePreviewSession) {
    return;
  }

  const session = activePreviewSession;
  activePreviewSession = null;
  session.controller.abort();
  void session.player?.stop();
}

export async function playVapiVoicePreview(voiceId: string): Promise<void> {
  stopActiveVoicePreview();

  const controller = new AbortController();
  activePreviewSession = { controller, player: null };

  let player: PcmStreamPlayer | null = null;
  let previewTimeout: number | null = null;

  try {
    const response = await fetch("/api/voice-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voiceId }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("Unable to play voice preview.");
    }

    const data = (await response.json()) as { websocketCallUrl?: string };

    if (!data.websocketCallUrl) {
      throw new Error("Voice preview is unavailable.");
    }

    player = createPcmStreamPlayer();

    if (activePreviewSession?.controller === controller) {
      activePreviewSession.player = player;
    }

    await player.start();

    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(data.websocketCallUrl!);
      ws.binaryType = "arraybuffer";
      let settled = false;

      const finish = (mode: "resolve" | "reject", error?: Error) => {
        if (settled) {
          return;
        }

        settled = true;

        if (previewTimeout !== null) {
          window.clearTimeout(previewTimeout);
          previewTimeout = null;
        }

        controller.signal.removeEventListener("abort", onAbort);

        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }

        if (mode === "reject" && error) {
          reject(error);
          return;
        }

        resolve();
      };

      const onAbort = () => {
        finish("resolve");
      };

      controller.signal.addEventListener("abort", onAbort);

      previewTimeout = window.setTimeout(() => {
        finish("resolve");
      }, MAX_PREVIEW_MS);

      ws.onmessage = (event) => {
        if (typeof event.data === "string" || !player) {
          return;
        }

        player.push(event.data as ArrayBuffer);
      };

      ws.onerror = () => {
        finish("reject", new Error("Voice preview connection failed."));
      };

      ws.onclose = () => {
        if (!player) {
          finish("resolve");
          return;
        }

        player.flush();

        void waitForPlaybackEnd(player, MAX_PREVIEW_MS).then(() => {
          finish("resolve");
        });
      };
    });
  } finally {
    if (previewTimeout !== null) {
      window.clearTimeout(previewTimeout);
    }

    if (player) {
      await player.stop();
    }

    if (activePreviewSession?.controller === controller) {
      activePreviewSession = null;
    }
  }
}
