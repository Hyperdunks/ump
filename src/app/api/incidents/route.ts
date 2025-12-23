import { db } from "@/db";
import { incident, monitor } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { betterAuthPlugin } from "../[[...slug]]/auth";
import { paginationQuery, idParam } from "@/lib/params";

export const incidentRouter = new Elysia({ prefix: "/incidents" })
  .use(betterAuthPlugin)
  .get(
    "/",
    async ({ user, query }) => {
      const page = query.page ?? 1;
      const limit = query.limit ?? 20;
      const offset = (page - 1) * limit;

      const incidents = await db
        .select({ incident, monitorName: monitor.name })
        .from(incident)
        .innerJoin(monitor, eq(incident.monitorId, monitor.id))
        .where(eq(monitor.userId, user.id))
        .orderBy(desc(incident.detectedAt))
        .limit(limit)
        .offset(offset);

      return {
        data: incidents.map((row) => ({
          ...row.incident,
          monitorName: row.monitorName,
        })),
      };
    },
    { auth: true, query: paginationQuery },
  )

  // Get incident
  .get(
    "/:id",
    async ({ user, params, status }) => {
      const [inc] = await db
        .select({
          incident,
          monitorUserId: monitor.userId,
          monitorName: monitor.name,
        })
        .from(incident)
        .innerJoin(monitor, eq(incident.monitorId, monitor.id))
        .where(eq(incident.id, params.id));

      if (!inc || inc.monitorUserId !== user.id)
        return status(404, { message: "Incident not found" });

      return { ...inc.incident, monitorName: inc.monitorName };
    },
    { auth: true, params: idParam },
  )

  // Update incident
  .put(
    "/:id",
    async ({ user, params, body, status }) => {
      const [inc] = await db
        .select({ incident, monitorUserId: monitor.userId })
        .from(incident)
        .innerJoin(monitor, eq(incident.monitorId, monitor.id))
        .where(eq(incident.id, params.id));

      if (!inc || inc.monitorUserId !== user.id)
        return status(404, { message: "Incident not found" });

      const updateData: Record<string, unknown> = { ...body };
      if (body.state === "investigating" && !inc.incident.acknowledgedAt)
        updateData.acknowledgedAt = new Date();
      if (body.state === "resolved" && !inc.incident.resolvedAt)
        updateData.resolvedAt = new Date();

      const [updated] = await db
        .update(incident)
        .set(updateData)
        .where(eq(incident.id, params.id))
        .returning();
      return { data: updated };
    },
    {
      auth: true,
      params: idParam,
      body: t.Object({
        state: t.Optional(
          t.Union([
            t.Literal("detected"),
            t.Literal("investigating"),
            t.Literal("resolved"),
          ]),
        ),
        cause: t.Optional(t.String()),
        postmortem: t.Optional(t.String()),
      }),
    },
  );
