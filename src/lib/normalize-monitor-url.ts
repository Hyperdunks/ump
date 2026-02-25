const PROTOCOL_PREFIX_REGEX = /^[a-zA-Z][a-zA-Z\d+.-]*:\/\//;

export function normalizeMonitorUrl(input: string): string {
  const value = input.trim();

  if (!value) return value;
  if (PROTOCOL_PREFIX_REGEX.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;

  return `https://${value}`;
}
