import { and, desc, eq, inArray } from "drizzle-orm";
import { CheckCircle2, ExternalLink, Globe, XCircle } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { MonitorLookup } from "@/components/status/monitor-lookup";
import { db } from "@/db";
import { healthCheck, monitor } from "@/db/schema";
import { auth } from "@/lib/auth";

async function getPublicMonitors(userId?: string) {
  if (!userId) return [];

  const monitors = await db
    .select()
    .from(monitor)
    .where(and(eq(monitor.isPublic, true), eq(monitor.userId, userId)));

  return monitors;
}

async function getLatestCheckForMonitors(monitorIds: string[]) {
  if (monitorIds.length === 0) return new Map();

  // Get all checks for all monitors in a single query, ordered by most recent first
  const checks = await db
    .select()
    .from(healthCheck)
    .where(inArray(healthCheck.monitorId, monitorIds))
    .orderBy(desc(healthCheck.checkedAt));

  // Take first (most recent) check for each monitor
  const latestChecks = new Map<
    string,
    typeof healthCheck.$inferSelect | null
  >();

  for (const check of checks) {
    if (!latestChecks.has(check.monitorId)) {
      latestChecks.set(check.monitorId, check);
    }
  }

  // Ensure all monitor IDs have an entry (null if no checks)
  for (const monId of monitorIds) {
    if (!latestChecks.has(monId)) {
      latestChecks.set(monId, null);
    }
  }

  return latestChecks;
}

export default async function PublicStatusListPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  const monitors = await getPublicMonitors(userId);
  const monitorIds = monitors.map((m) => m.id);
  const latestChecks = await getLatestCheckForMonitors(monitorIds);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-muted-foreground" />
                <h1 className="text-2xl font-bold">Public Status Pages</h1>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {session
                  ? "View the status of your publicly available monitors"
                  : "Look up the status of publicly available monitors"}
              </p>
            </div>
            <MonitorLookup />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {monitors.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">
              {session
                ? "No public monitors available"
                : "Sign in to view your public monitors"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {session
                ? "You don't have any public monitors to display at this time."
                : "You can still use the search bar above to look up public monitors by ID or URL."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {monitors.map((mon) => {
              const latestCheck = latestChecks.get(mon.id);
              const isUp = latestCheck?.status === "up";

              return (
                <Link
                  key={mon.id}
                  href={`/status/${mon.id}`}
                  className="block bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-lg font-semibold truncate">
                          {mon.name}
                        </h2>
                        <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {mon.url}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      {latestCheck ? (
                        <>
                          <div className="flex items-center gap-2">
                            {isUp ? (
                              <>
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                  Operational
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-5 h-5 text-red-500" />
                                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                  Down
                                </span>
                              </>
                            )}
                          </div>
                          <div
                            className={`w-3 h-3 rounded-full animate-pulse ${
                              isUp ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No checks yet
                        </span>
                      )}
                    </div>
                  </div>
                  {latestCheck && (
                    <div className="mt-3 pt-3 border-t border-border flex items-center gap-6 text-sm text-muted-foreground">
                      <span>
                        Last checked:{" "}
                        {new Date(latestCheck.checkedAt).toLocaleString()}
                      </span>
                      {latestCheck.responseTime && (
                        <span>Response: {latestCheck.responseTime}ms</span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        <footer className="mt-8 mb-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-4">
          <p>Powered by Sentinel Uptime Monitoring</p>
          {session && (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors mt-4"
            >
              Go to Dashboard
            </Link>
          )}
        </footer>
      </main>
    </div>
  );
}
