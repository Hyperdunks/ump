import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { healthCheck } from "@/db/schema";

export interface UptimeStats {
  uptimePercent: number;
  totalChecks: number;
  upChecks: number;
  downChecks: number;
  degradedChecks: number;
  avgResponseTime: number;
  period: string;
}

/**
 * Calculate uptime statistics for a monitor over a given time period
 */
export async function calculateUptime(
  monitorId: string,
  periodMs: number,
  periodLabel: string,
): Promise<UptimeStats> {
  const since = new Date(Date.now() - periodMs);

  const stats = await db
    .select({
      totalChecks: sql<number>`count(*)`,
      upChecks: sql<number>`count(*) filter (where ${healthCheck.status} = 'up')`,
      downChecks: sql<number>`count(*) filter (where ${healthCheck.status} = 'down')`,
      degradedChecks: sql<number>`count(*) filter (where ${healthCheck.status} = 'degraded')`,
      avgResponseTime: sql<number>`coalesce(avg(${healthCheck.responseTime}), 0)`,
    })
    .from(healthCheck)
    .where(
      and(
        eq(healthCheck.monitorId, monitorId),
        gte(healthCheck.checkedAt, since),
      ),
    );

  const { totalChecks, upChecks, downChecks, degradedChecks, avgResponseTime } =
    stats[0];

  const total = Number(totalChecks);
  const up = Number(upChecks);

  const uptimePercent =
    total > 0 ? Number(((up / total) * 100).toFixed(2)) : 100;

  return {
    uptimePercent,
    totalChecks: total,
    upChecks: up,
    downChecks: Number(downChecks),
    degradedChecks: Number(degradedChecks),
    avgResponseTime: Math.round(Number(avgResponseTime)),
    period: periodLabel,
  };
}

// Time period constants
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/**
 * Get uptime for the last 24 hours
 */
export function getUptime24h(monitorId: string): Promise<UptimeStats> {
  return calculateUptime(monitorId, DAY, "24h");
}

/**
 * Get uptime for the last 7 days
 */
export function getUptime7d(monitorId: string): Promise<UptimeStats> {
  return calculateUptime(monitorId, 7 * DAY, "7d");
}

/**
 * Get uptime for the last 30 days
 */
export function getUptime30d(monitorId: string): Promise<UptimeStats> {
  return calculateUptime(monitorId, 30 * DAY, "30d");
}

/**
 * Get comprehensive uptime stats for all common periods
 */
export async function getUptimeAllPeriods(monitorId: string): Promise<{
  "24h": UptimeStats;
  "7d": UptimeStats;
  "30d": UptimeStats;
}> {
  const [h24, d7, d30] = await Promise.all([
    getUptime24h(monitorId),
    getUptime7d(monitorId),
    getUptime30d(monitorId),
  ]);

  return {
    "24h": h24,
    "7d": d7,
    "30d": d30,
  };
}
