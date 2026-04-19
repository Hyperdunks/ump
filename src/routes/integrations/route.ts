import { and, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { betterAuthPlugin } from "@/app/api/[[...slug]]/auth";
import { db } from "@/db";
import { userIntegration } from "@/db/schema";
import { nanoid } from "@/lib/nanoid";
import { idParam } from "@/lib/params";

const createIntegrationBody = t.Object({
  channel: t.Union([
    t.Literal("email"),
    t.Literal("webhook"),
    t.Literal("slack"),
    t.Literal("discord"),
  ]),
  endpoint: t.String(),
  isEnabled: t.Optional(t.Boolean()),
});

const updateIntegrationBody = t.Partial(createIntegrationBody);

export const integrationsRouter = new Elysia({ prefix: "/integrations" })
  .use(betterAuthPlugin)

  // List all integrations for current user
  .get(
    "/",
    async ({ user }) => {
      const integrations = await db
        .select()
        .from(userIntegration)
        .where(eq(userIntegration.userId, user.id));
      return { data: integrations };
    },
    { auth: true },
  )

  // Create integration
  .post(
    "/",
    async ({ user, body }) => {
      const id = nanoid();
      const [created] = await db
        .insert(userIntegration)
        .values({
          id,
          userId: user.id,
          channel: body.channel,
          endpoint: body.endpoint,
          isEnabled: body.isEnabled ?? true,
        })
        .returning();

      return { data: created };
    },
    { auth: true, body: createIntegrationBody },
  )

  // Update integration
  .put(
    "/:id",
    async ({ user, params, body, status }) => {
      const [existing] = await db
        .select()
        .from(userIntegration)
        .where(
          and(
            eq(userIntegration.id, params.id),
            eq(userIntegration.userId, user.id),
          ),
        );

      if (!existing) return status(404, { message: "Integration not found" });

      const [updated] = await db
        .update(userIntegration)
        .set(body)
        .where(eq(userIntegration.id, params.id))
        .returning();

      return { data: updated };
    },
    { auth: true, params: idParam, body: updateIntegrationBody },
  )

  // Delete integration
  .delete(
    "/:id",
    async ({ user, params, status }) => {
      const [existing] = await db
        .select()
        .from(userIntegration)
        .where(
          and(
            eq(userIntegration.id, params.id),
            eq(userIntegration.userId, user.id),
          ),
        );

      if (!existing) return status(404, { message: "Integration not found" });

      await db.delete(userIntegration).where(eq(userIntegration.id, params.id));

      return { success: true };
    },
    { auth: true, params: idParam },
  );
