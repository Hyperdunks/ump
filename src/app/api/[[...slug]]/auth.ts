import { eq } from "drizzle-orm";
import { Elysia } from "elysia";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { auth } from "@/lib/auth";

// Cache for user roles: userId -> { role, expiresAt }
const roleCache = new Map<string, { role: string; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCachedRole(userId: string): string | null {
  const cached = roleCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.role;
  }
  roleCache.delete(userId);
  return null;
}

function setCachedRole(userId: string, role: string): void {
  roleCache.set(userId, { role, expiresAt: Date.now() + CACHE_TTL });
}
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

        // Check cache first
        let userRole = getCachedRole(session.user.id);

        // Fetch role from database if not cached
        if (!userRole) {
          const [dbUser] = await db
            .select({ role: userTable.role })
            .from(userTable)
            .where(eq(userTable.id, session.user.id));

          userRole = dbUser?.role ?? "user";
          setCachedRole(session.user.id, userRole);
        }

        return {
          user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            role: userRole,
          } as AuthUser,
          session: session.session,
        };
      },
    },
  });

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
  getPaths: (prefix = "/api/auth") =>
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
