import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Elysia } from "elysia";

// User type with role from our database
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

export const betterAuthPlugin = new Elysia({ name: "better-auth" })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({ headers });
        if (!session) return status(401, { message: "Unauthorized" });

        // Fetch role from database since better-auth doesn't include custom fields
        const [dbUser] = await db
          .select({ role: userTable.role })
          .from(userTable)
          .where(eq(userTable.id, session.user.id));

        return {
          user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            role: dbUser?.role ?? "user",
          } as AuthUser,
          session: session.session,
        };
      },
    },
  });

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
  getPaths: (prefix = "/auth/api") =>
    getSchema().then(({ paths }) => {
      const reference: typeof paths = Object.create(null);

      for (const path of Object.keys(paths)) {
        const key = prefix + path;
        reference[key] = paths[path];

        for (const method of Object.keys(paths[path])) {
          const operation = (reference[key] as any)[method];
          operation.tags = ["Better Auth"];
        }
      }

      return reference;
    }) as Promise<any>,
  components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;