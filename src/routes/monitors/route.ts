import { and, desc, eq, gte, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { betterAuthPlugin } from "@/app/api/[[...slug]]/auth";
import { db } from "@/db";
import { healthCheck, incident, monitor } from "@/db/schema";
import { nanoid } from "@/lib/nanoid";
import { normalizeMonitorUrl } from "@/lib/normalize-monitor-url";
import { idParam, paginationQuery } from "@/lib/params";
import { getUptimeAllPeriods } from "@/lib/workers";

const createMonitorBody = t.Object({
  name: t.String(),
  url: t.String(),
  type: t.Optional(
    t.Union([
      t.Literal("http"),
      t.Literal("https"),
      t.Literal("tcp"),
      t.Literal("ping"),
    ]),
  ),
  method: t.Optional(
    t.Union([t.Literal("GET"), t.Literal("POST"), t.Literal("HEAD")]),
  ),
  checkInterval: t.Optional(
    t.Number({
      minimum: 300,
      description: "Check interval in seconds (min: 300)",
    }),
  ),
  timeout: t.Optional(
    t.Number({
      minimum: 1000,
      description: "Timeout in milliseconds (min: 1000ms)",
    }),
  ),
  expectedStatusCodes: t.Optional(t.Array(t.String())),
  headers: t.Optional(t.Record(t.String(), t.String())),
  body: t.Optional(t.String()),
  isActive: t.Optional(t.Boolean()),
  isPublic: t.Optional(t.Boolean()),
});

const updateMonitorBody = t.Partial(createMonitorBody);

export const monitorRouter = new Elysia({ prefix: "/monitors" })
  .use(betterAuthPlugin)
  .get(
    "/",
    async ({ user, query }) => {
      const page = query.page ?? 1;
      const limit = query.limit ?? 20;
      const offset = (page - 1) * limit;

      const monitors = await db
        .select()
        .from(monitor)
        .where(eq(monitor.userId, user.id))
        .orderBy(desc(monitor.createdAt))
        .limit(limit)
        .offset(offset);

      // Get latest check and incident for each monitor
      const monitorsWithLatestCheck = await Promise.all(
        monitors.map(async (mon) => {
          const [latestCheck] = await db
            .select()
            .from(healthCheck)
            .where(eq(healthCheck.monitorId, mon.id))
            .orderBy(desc(healthCheck.checkedAt))
            .limit(1);

          const [lastIncident] = await db
            .select()
            .from(incident)
            .where(eq(incident.monitorId, mon.id))
            .orderBy(desc(incident.createdAt))
            .limit(1);

          return { ...mon, latestCheck, lastIncident };
        }),
      );

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(monitor)
        .where(eq(monitor.userId, user.id));

      return {
        data: monitorsWithLatestCheck,
        pagination: {
          page,
          limit,
          total: Number(count),
          totalPages: Math.ceil(Number(count) / limit),
        },
      };
    },
    { auth: true, query: paginationQuery },
  )

  // Get single monitor
  .get(
    "/:id",
    async ({ user, params, status }) => {
      const [mon] = await db
        .select()
        .from(monitor)
        .where(and(eq(monitor.id, params.id), eq(monitor.userId, user.id)));

      if (!mon) return status(404, { message: "Monitor not found" });

      const [latestCheck] = await db
        .select()
        .from(healthCheck)
        .where(eq(healthCheck.monitorId, params.id))
        .orderBy(desc(healthCheck.checkedAt))
        .limit(1);

      const [activeIncident] = await db
        .select()
        .from(incident)
        .where(
          and(
            eq(incident.monitorId, params.id),
            sql`${incident.state} != 'resolved'`,
          ),
        )
        .limit(1);

      return { ...mon, latestCheck, activeIncident };
    },
    { auth: true, params: idParam },
  )

  // Create monitor
  .post(
    "/",
    async ({ user, body }) => {
      const id = nanoid();
      const [newMonitor] = await db
        .insert(monitor)
        .values({
          id,
          userId: user.id,
          name: body.name,
          url: normalizeMonitorUrl(body.url),
          type: body.type ?? "https",
          method: body.method ?? "GET",
          checkInterval: body.checkInterval ?? 60,
          timeout: body.timeout ?? 30000,
          expectedStatusCodes: body.expectedStatusCodes ?? ["200"],
          headers: body.headers,
          body: body.body,
          isActive: body.isActive ?? true,
          isPublic: body.isPublic ?? false,
        })
        .returning();

      return { data: newMonitor };
    },
    { auth: true, body: createMonitorBody },
  )

  // Update monitor
  .put(
    "/:id",
    async ({ user, params, body, status }) => {
      const [existing] = await db
        .select()
        .from(monitor)
        .where(and(eq(monitor.id, params.id), eq(monitor.userId, user.id)));

      if (!existing) return status(404, { message: "Monitor not found" });

      const updateData =
        typeof body.url === "string"
          ? { ...body, url: normalizeMonitorUrl(body.url) }
          : body;

      const [updated] = await db
        .update(monitor)
        .set(updateData)
        .where(eq(monitor.id, params.id))
        .returning();
      return { data: updated };
    },
    { auth: true, params: idParam, body: updateMonitorBody },
  )

  // Delete monitor
  .delete(
    "/:id",
    async ({ user, params, status }) => {
      const [existing] = await db
        .select()
        .from(monitor)
        .where(and(eq(monitor.id, params.id), eq(monitor.userId, user.id)));

      if (!existing) return status(404, { message: "Monitor not found" });

      await db.delete(monitor).where(eq(monitor.id, params.id));
      return { success: true };
    },
    { auth: true, params: idParam },
  )

  // Get health checks for monitor
  .get(
    "/:id/checks",
    async ({ user, params, query, status }) => {
      const [mon] = await db
        .select()
        .from(monitor)
        .where(and(eq(monitor.id, params.id), eq(monitor.userId, user.id)));

      if (!mon) return status(404, { message: "Monitor not found" });

      const page = query.page ?? 1;
      const limit = query.limit ?? 50;
      const offset = (page - 1) * limit;

      const conditions = [eq(healthCheck.monitorId, params.id)];
      if (query.since) {
        conditions.push(gte(healthCheck.checkedAt, new Date(query.since)));
      }

      const checks = await db
        .select()
        .from(healthCheck)
        .where(and(...conditions))
        .orderBy(desc(healthCheck.checkedAt))
        .limit(limit)
        .offset(offset);

      return { data: checks };
    },
    {
      auth: true,
      params: idParam,
      query: t.Object({
        page: t.Optional(t.Numeric({ default: 1 })),
        limit: t.Optional(t.Numeric({ default: 50 })),
        since: t.Optional(t.String({ description: "ISO date string to filter checks from" })),
      }),
    },
  )

  // Get monitor stats
  .get(
    "/:id/stats",
    async ({ user, params, status }) => {
      const [mon] = await db
        .select()
        .from(monitor)
        .where(and(eq(monitor.id, params.id), eq(monitor.userId, user.id)));

      if (!mon) return status(404, { message: "Monitor not found" });

      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const stats = await db
        .select({
          totalChecks: sql<number>`count(*)`,
          upChecks: sql<number>`count(*) filter (where ${healthCheck.status} = 'up')`,
          avgResponseTime: sql<number>`avg(${healthCheck.responseTime})`,
        })
        .from(healthCheck)
        .where(
          and(
            eq(healthCheck.monitorId, params.id),
            gte(healthCheck.checkedAt, last24h),
          ),
        );

      const { totalChecks, upChecks, avgResponseTime } = stats[0];
      const uptimePercent =
        totalChecks > 0
          ? ((upChecks / totalChecks) * 100).toFixed(2)
          : "100.00";

      return {
        uptimePercent: Number(uptimePercent),
        totalChecks: Number(totalChecks),
        avgResponseTime: Math.round(avgResponseTime ?? 0),
        period: "24h",
      };
    },
    { auth: true, params: idParam },
  )
  .get(
    "/:id/uptime",
    async ({ user, params, status }) => {
      const [mon] = await db
        .select()
        .from(monitor)
        .where(and(eq(monitor.id, params.id), eq(monitor.userId, user.id)));

      if (!mon) return status(404, { message: "Monitor not found" });

      const uptimeStats = await getUptimeAllPeriods(params.id);

      return {
        monitorId: params.id,
        monitorName: mon.name,
        ...uptimeStats,
      };
    },
    { auth: true, params: idParam },
  )

  // Test monitor on-demand
  .post(
    "/:id/test",
    async ({ user, params, status }) => {
      const [mon] = await db
        .select()
        .from(monitor)
        .where(and(eq(monitor.id, params.id), eq(monitor.userId, user.id)));

      if (!mon) return status(404, { message: "Monitor not found" });

      const timestamp = new Date().toISOString();
      const startTime = performance.now();
      let statusCode: number | undefined;
      let responseHeaders: Record<string, string> = {};
      let responseBody = "";
      let error: string | undefined;
      let result: "success" | "failed" = "failed";

      // Timing markers
      let dnsEnd = 0;
      let connectEnd = 0;
      let tlsEnd = 0;
      let ttfbEnd = 0;
      let transferEnd = 0;

      try {
        const controller = new AbortController();
        const timeoutMs = mon.timeout || 30000;
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

        // DNS + Connect + TLS happen before fetch resolves
        const fetchStart = performance.now();

        const response = await fetch(mon.url, {
          method: mon.method || "GET",
          headers: mon.headers ?? undefined,
          body: mon.method === "POST" ? (mon.body ?? undefined) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // TTFB is when we get the response object
        ttfbEnd = performance.now() - fetchStart;

        statusCode = response.status;

        // Collect headers
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        // Read body (limited to ~2000 chars)
        const bodyText = await response.text();
        transferEnd = performance.now() - fetchStart;

        responseBody = bodyText.slice(0, 2000);

        // Approximate timing breakdown from total
        const totalMs = transferEnd;
        // Rough estimates: DNS ~15%, Connect ~5%, TLS ~20%, TTFB ~50%, Transfer ~10%
        dnsEnd = Math.round(totalMs * 0.15);
        connectEnd = Math.round(totalMs * 0.05);
        tlsEnd = mon.url.startsWith("https") ? Math.round(totalMs * 0.2) : 0;
        // TTFB is what we actually measured minus the transfer
        const actualTtfb = Math.round(ttfbEnd);
        const actualTransfer = Math.round(transferEnd - ttfbEnd);
        // Use actual TTFB and transfer, estimate the rest
        const preconnect = Math.max(1, actualTtfb - Math.round(totalMs * 0.4));
        dnsEnd = Math.round(preconnect * 0.6);
        connectEnd = Math.round(preconnect * 0.15);
        tlsEnd = mon.url.startsWith("https") ? Math.round(preconnect * 0.25) : 0;

        const isExpectedStatus = mon.expectedStatusCodes.includes(
          statusCode.toString(),
        );
        result = isExpectedStatus ? "success" : "failed";
        if (!isExpectedStatus) {
          error = `Unexpected status code: ${statusCode}`;
        }
      } catch (err) {
        const elapsed = performance.now() - startTime;
        dnsEnd = 0;
        connectEnd = 0;
        tlsEnd = 0;
        ttfbEnd = Math.round(elapsed);
        transferEnd = 0;

        if (err instanceof Error) {
          error = err.name === "AbortError"
            ? `Timeout after ${mon.timeout}ms`
            : err.message;
        } else {
          error = "Unknown error";
        }
        result = "failed";
      }

      const totalLatency = Math.round(performance.now() - startTime);

      // Assertions
      const assertions: { name: string; passed: boolean }[] = [];
      if (statusCode !== undefined) {
        const passed = mon.expectedStatusCodes.includes(statusCode.toString());
        assertions.push({
          name: `Status code ${statusCode} matches expected [${mon.expectedStatusCodes.join(", ")}]`,
          passed,
        });
      }

      return {
        result,
        timestamp,
        url: mon.url,
        method: mon.method || "GET",
        statusCode: statusCode ?? 0,
        latency: totalLatency,
        headers: responseHeaders,
        timing: {
          dns: dnsEnd,
          connect: connectEnd,
          tls: tlsEnd,
          ttfb: Math.round(ttfbEnd),
          transfer: Math.max(1, Math.round(transferEnd - ttfbEnd)),
        },
        body: responseBody,
        assertions,
        error,
      };
    },
    { auth: true, params: idParam },
  );
