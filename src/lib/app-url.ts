const LOCALHOST_URL = "http://localhost:3000";

function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

export function getAppUrl(): string {
  const resolvedUrl =
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : LOCALHOST_URL);

  return trimTrailingSlash(resolvedUrl);
}

export const appUrl = getAppUrl();
