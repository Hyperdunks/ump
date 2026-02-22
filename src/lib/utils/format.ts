/**
 * Formats a date as a relative time string (e.g., "just now", "5 minutes ago")
 * @param date - The date to format, can be Date, string, null, or undefined
 * @returns A human-readable relative time string, or "—" for null/undefined
 */
export function formatRelativeTime(
  date: Date | string | null | undefined,
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

/**
 * Formats milliseconds to a human-readable string
 * @param ms - The milliseconds to format, or undefined
 * @returns A formatted string like "150ms", "1.2s", or "5m", or "—" for undefined
 */
export function formatMs(ms: number | undefined): string {
  if (ms === undefined) return "—";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms / 60000)}m`;
}
