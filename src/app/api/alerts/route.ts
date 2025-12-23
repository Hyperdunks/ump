import { db } from "@/db";
import { monitor, alertConfig } from "@/db/schema";
import { nanoid } from "@/lib/nanoid";
import { and, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { betterAuthPlugin } from "../[[...slug]]/auth";
import { idParam } from "@/lib/params";

const monitorIdParam = t.Object({
  monitorId: t.String(),
});

const createAlertBody = t.Object({
  name: t.String(),
  channel: t.Union([
    t.Literal("email"),
    t.Literal("webhook"),
    t.Literal("slack"),
    t.Literal("discord"),
  ]),
  endpoint: t.String(),
  failureThreshold: t.Optional(t.Number()),
  isEnabled: t.Optional(t.Boolean()),
});

const updateAlertBody = t.Partial(createAlertBody);

export const alertsRouter = new Elysia({ prefix: "/alerts" })
  .use(betterAuthPlugin)
  .get(
    "/alerts/monitor/:monitorId",
    async ({ user, params, status }) => {
      const [mon] = await db
        .select()
        .from(monitor)
        .where(
          and(eq(monitor.id, params.monitorId), eq(monitor.userId, user.id)),
        );

      if (!mon) return status(404, { message: "Monitor not found" });

      const alerts = await db
        .select()
        .from(alertConfig)
        .where(eq(alertConfig.monitorId, params.monitorId));
      return { data: alerts };
    },
    { auth: true, params: monitorIdParam },
  )

  // Create alert
  .post(
    "/alerts/monitor/:monitorId",
    async ({ user, params, body, status }) => {
      const [mon] = await db
        .select()
        .from(monitor)
        .where(
          and(eq(monitor.id, params.monitorId), eq(monitor.userId, user.id)),
        );

      if (!mon) return status(404, { message: "Monitor not found" });

      const id = nanoid();
      const [newAlert] = await db
        .insert(alertConfig)
        .values({
          id,
          monitorId: params.monitorId,
          name: body.name,
          channel: body.channel,
          endpoint: body.endpoint,
          failureThreshold: body.failureThreshold ?? 3,
          isEnabled: body.isEnabled ?? true,
        })
        .returning();

      return { data: newAlert };
    },
    { auth: true, params: monitorIdParam, body: createAlertBody },
  )

  // Update alert
  .put(
    "/alerts/:id",
    async ({ user, params, body, status }) => {
      const [alert] = await db
        .select({ alertConfig, monitorUserId: monitor.userId })
        .from(alertConfig)
        .innerJoin(monitor, eq(alertConfig.monitorId, monitor.id))
        .where(eq(alertConfig.id, params.id));

      if (!alert || alert.monitorUserId !== user.id)
        return status(404, { message: "Alert not found" });

      const [updated] = await db
        .update(alertConfig)
        .set(body)
        .where(eq(alertConfig.id, params.id))
        .returning();
      return { data: updated };
    },
    { auth: true, params: idParam, body: updateAlertBody },
  )

  .delete(
    "/alerts/:id",
    async ({ user, params, status }) => {
      const [alert] = await db
        .select({ alertConfig, monitorUserId: monitor.userId })
        .from(alertConfig)
        .innerJoin(monitor, eq(alertConfig.monitorId, monitor.id))
        .where(eq(alertConfig.id, params.id));

      if (!alert || alert.monitorUserId !== user.id)
        return status(404, { message: "Alert not found" });

      await db.delete(alertConfig).where(eq(alertConfig.id, params.id));
      return { success: true };
    },
    { auth: true, params: idParam },
  );
