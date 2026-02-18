import { notFound } from "next/navigation";
import { db } from "@/db";
import { eq, and, desc, gte } from "drizzle-orm";
import { monitor, healthCheck } from "@/db/schema";
import { CheckCircle2, XCircle, Clock, Activity, Globe } from "lucide-react";

interface PageProps {
  params: Promise<{ monitorId: string }>;
}

async function getPublicMonitor(monitorId: string) {
  const [mon] = await db
    .select()
    .from(monitor)
    .where(and(eq(monitor.id, monitorId), eq(monitor.isPublic, true)));

  return mon || null;
}

async function getRecentChecks(monitorId: string) {
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const checks = await db
    .select()
    .from(healthCheck)
    .where(
      and(
        eq(healthCheck.monitorId, monitorId),
        gte(healthCheck.checkedAt, last24h),
      ),
    )
    .orderBy(desc(healthCheck.checkedAt))
    .limit(100);

  return checks;
}

function calculateUptime(checks: { status: string }[]) {
  if (checks.length === 0) return 100;
  const upChecks = checks.filter((c) => c.status === "up").length;
  return Math.round((upChecks / checks.length) * 10000) / 100;
}

function getAverageResponseTime(checks: { responseTime: number | null }[]) {
  const validTimes = checks
    .map((c) => c.responseTime)
    .filter((t): t is number => t !== null);
  if (validTimes.length === 0) return 0;
  return Math.round(validTimes.reduce((a, b) => a + b, 0) / validTimes.length);
}

export default async function PublicStatusPage({ params }: PageProps) {
  const { monitorId } = await params;
  const mon = await getPublicMonitor(monitorId);

  if (!mon) {
    notFound();
  }

  const recentChecks = await getRecentChecks(monitorId);
  const uptime = calculateUptime(recentChecks);
  const avgResponseTime = getAverageResponseTime(recentChecks);
  const latestCheck = recentChecks[0];
  const isUp = latestCheck?.status === "up";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-muted-foreground" />
            <h1 className="text-2xl font-bold">{mon.name}</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{mon.url}</p>
        </div>
      </header>

      {/* Current Status */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-card rounded-lg border border-border p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isUp ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-2xl font-semibold text-green-600 dark:text-green-400">
                    Operational
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-2xl font-semibold text-red-600 dark:text-red-400">
                    Down
                  </span>
                </div>
              )}
            </div>
            {latestCheck && (
              <div className="text-sm text-muted-foreground">
                Last checked: {new Date(latestCheck.checkedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="text-sm text-muted-foreground">
                Uptime (24h)
              </span>
            </div>
            <div className="text-3xl font-bold">{uptime}%</div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">
                Avg Response
              </span>
            </div>
            <div className="text-3xl font-bold">{avgResponseTime}ms</div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-muted-foreground">
                Checks (24h)
              </span>
            </div>
            <div className="text-3xl font-bold">{recentChecks.length}</div>
          </div>
        </div>

        {/* Recent Checks */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold">Recent Checks</h2>
          </div>
          <div className="divide-y divide-border max-h-[400px] overflow-auto">
            {recentChecks.slice(0, 20).map((check) => (
              <div
                key={check.id}
                className="px-6 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {check.status === "up" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    {check.status === "up" ? "Up" : "Down"}
                    {check.statusCode && ` (${check.statusCode})`}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  {check.responseTime && <span>{check.responseTime}ms</span>}
                  <span>{new Date(check.checkedAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
            {recentChecks.length === 0 && (
              <div className="px-6 py-8 text-center text-muted-foreground">
                No recent checks available
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>Powered by Sentinel Uptime Monitoring</p>
        </footer>
      </main>
    </div>
  );
}
