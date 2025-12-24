import { and, desc, eq, gte, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { betterAuthPlugin } from "@/app/api/[[...slug]]/auth";
import { db } from "@/db";
import { healthCheck, incident, monitor } from "@/db/schema";
import { nanoid } from "@/lib/nanoid";
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
  checkInterval: t.Optional(t.Number()),
  timeout: t.Optional(t.Number()),
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

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(monitor)
        .where(eq(monitor.userId, user.id));

      return {
        data: monitors,
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
          url: body.url,
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

      const [updated] = await db
        .update(monitor)
        .set(body)
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

      const checks = await db
        .select()
        .from(healthCheck)
        .where(eq(healthCheck.monitorId, params.id))
        .orderBy(desc(healthCheck.checkedAt))
        .limit(limit)
        .offset(offset);

      return { data: checks };
    },
    { auth: true, params: idParam, query: paginationQuery },
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
  );
