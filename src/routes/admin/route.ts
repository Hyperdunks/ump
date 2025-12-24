import { db } from "@/db";
import { monitor, user as userTable, incident } from "@/db/schema";
import { paginationQuery, idParam, updateRoleBody } from "@/lib/params";
import { desc, eq, sql } from "drizzle-orm";
import { Elysia } from "elysia";
import { betterAuthPlugin } from "@/app/api/[[...slug]]/auth";

export const adminRouter = new Elysia({ prefix: "/admin" })
  .use(betterAuthPlugin)
  .get(
    "/monitors",
    async ({ user, query, status }) => {
      if (user.role !== "admin")
        return status(403, { message: "Admin access required" });

      const page = query.page ?? 1;
      const limit = query.limit ?? 50;
      const offset = (page - 1) * limit;

      const monitors = await db
        .select()
        .from(monitor)
        .orderBy(desc(monitor.createdAt))
        .limit(limit)
        .offset(offset);

      return { data: monitors };
    },
    { auth: true, query: paginationQuery },
  )

  // Admin: List all users
  .get(
    "/users",
    async ({ user: currentUser, query, status }) => {
      if (currentUser.role !== "admin")
        return status(403, { message: "Admin access required" });

      const page = query.page ?? 1;
      const limit = query.limit ?? 50;
      const offset = (page - 1) * limit;

      const users = await db
        .select({
          id: userTable.id,
          name: userTable.name,
          email: userTable.email,
          role: userTable.role,
          createdAt: userTable.createdAt,
        })
        .from(userTable)
        .orderBy(desc(userTable.createdAt))
        .limit(limit)
        .offset(offset);

      return { data: users };
    },
    { auth: true, query: paginationQuery },
  )

  // Admin: Update user role
  .put(
    "/users/:id/role",
    async ({ user: currentUser, params, body, status }) => {
      if (currentUser.role !== "admin")
        return status(403, { message: "Admin access required" });

      const [existing] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, params.id));
      if (!existing) return status(404, { message: "User not found" });

      const [updated] = await db
        .update(userTable)
        .set({ role: body.role })
        .where(eq(userTable.id, params.id))
        .returning({
          id: userTable.id,
          name: userTable.name,
          email: userTable.email,
          role: userTable.role,
        });

      return { data: updated };
    },
    { auth: true, params: idParam, body: updateRoleBody },
  )

  // Admin: System stats
  .get(
    "/stats",
    async ({ user, status }) => {
      if (user.role !== "admin")
        return status(403, { message: "Admin access required" });

      const [
        [userCount],
        [monitorCount],
        [activeMonitorCount],
        [openIncidentCount],
      ] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(userTable),
        db.select({ count: sql<number>`count(*)` }).from(monitor),
        db
          .select({ count: sql<number>`count(*)` })
          .from(monitor)
          .where(eq(monitor.isActive, true)),
        db
          .select({ count: sql<number>`count(*)` })
          .from(incident)
          .where(sql`${incident.state} != 'resolved'`),
      ]);

      return {
        users: Number(userCount.count),
        monitors: Number(monitorCount.count),
        activeMonitors: Number(activeMonitorCount.count),
        openIncidents: Number(openIncidentCount.count),
      };
    },
    { auth: true },
  );
