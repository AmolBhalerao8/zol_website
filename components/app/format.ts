/**
 * Formatting helpers. Locale is pinned to en-US so server-rendered output is
 * deterministic and hydration never disagrees with the markup.
 */

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const number = new Intl.NumberFormat("en-US");

const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const dateOnly = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatCurrency(value: number): string {
  return currency.format(value);
}

export function formatNumber(value: number): string {
  return number.format(value);
}

export function formatDateTime(value: Date): string {
  return dateTime.format(value);
}

export function formatDate(value: Date): string {
  return dateOnly.format(value);
}

export function formatMiles(value: number): string {
  return `${number.format(value)} mi`;
}

export function formatHours(value: number): string {
  return `${value.toFixed(1)} hr`;
}

/** Coarse "how long ago", good enough for list rows. */
export function formatRelative(value: Date, now: Date = new Date()): string {
  const minutes = Math.round((now.getTime() - value.getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}
