# AGENTS.md - AI Coding Agent Guidelines

**Sentinel** is an uptime monitoring platform: Next.js 16 (App Router, React 19), Bun runtime, Elysia.js API, PostgreSQL with Drizzle ORM, better-auth, Tailwind CSS v4, TanStack Query, React Email + Resend.

## Commands

```bash
# Development & Build
bun run dev              # Start dev server (check if running first)
bun run build            # Production build
bun run start            # Start production server

# Linting & Formatting
bun run lint             # Run Biome linter (check only)
bun run format           # Format with Biome (writes changes)

# Database (Drizzle)
bun run db:generate      # Generate Drizzle migrations
bun run db:migrate       # Apply migrations
bun run db:push          # Push schema directly (dev only)
bun run db:studio        # Open Drizzle Studio

# Testing (Bun built-in test runner)
bun test                 # Run all tests
bun test --watch         # Run tests in watch mode
bun test <file-path>     # Run single test file

# Email
bun run mail             # Start React Email dev server on port 6767
```

## Code Style

**Formatting**: 2 spaces, semicolons required, double quotes. Biome auto-organizes imports. Run `bun run format` before committing.

**TypeScript**: Strict mode. Use `import type { Foo }` for type-only imports. Path alias: `@/*` → `./src/*`.

**Naming Conventions**:
- Files: kebab-case (`health-check-worker.ts`)
- Components: PascalCase (`DashboardPage`)
- Functions: camelCase (`runHealthChecks`)
- Database tables: snake_case columns (`user_id`, `created_at`)
- Types: PascalCase with purpose suffix (`AuthUser`, `NewMonitor`)

**Import Order** (enforced by Biome):
1. External packages
2. Internal aliases (`@/db`, `@/lib/*`, `@/components/*`)
3. Relative imports

## React Patterns

**Components**: Use function declarations (not arrow functions). Client components need `"use client"` at top.

**Server vs Client**: Prefer Server Components. Use Client Components only when needed (hooks, browser APIs).

**UI Primitives**: Located in `src/components/ui/`. Use cva for variants:
```typescript
const buttonVariants = cva("base-classes", {
  variants: { variant: { default: "...", outline: "..." } },
  defaultVariants: { variant: "default" }
});
```

## API Routes (Elysia)

**Location**: `src/routes/*/route.ts`

**Pattern**:
```typescript
export const router = new Elysia({ prefix: "/resource" })
  .use(betterAuthPlugin)
  .get("/", async ({ user }) => {
    return { data: results };
  }, { auth: true });
```

**Validation**: Use Typebox via Elysia's `t` object:
```typescript
const body = t.Object({ name: t.String() });
```

**Auth**: Use `betterAuthPlugin` with `{ auth: true }` option for protected routes.

**Errors**: Use `status()` helper for HTTP errors: `return status(404, { message: "Not found" })`.

## Database (Drizzle ORM)

**Schema Location**: `src/db/schema.ts`

**Table Pattern**:
```typescript
export const table = pgTable("table_name", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => [
  index("table_userId_idx").on(table.userId),
]);
```

**Keys**: Use `nanoid()` (21 chars) for entity IDs, `shortId()` (12 chars) for short identifiers.

**Types**: Export inferred types:
```typescript
export type Table = typeof table.$inferSelect;
export type NewTable = typeof table.$inferInsert;
```

**Relations**: Define using Drizzle relations helper for complex associations.

**Indexes**: Always add indexes for foreign keys and frequently queried columns.

## Error Handling

**API Errors**: Use `APIError` class from `@/lib/api-error`:
```typescript
throw new APIError("Message", 400, "ERROR_CODE");
```

**Async**: Always catch errors with try/catch, log with `console.error`.

**Fire-and-forget**: Use `.catch(console.error)` for unawaited promises.

**Worker Errors**: Prefix logs with `[WorkerName]`, e.g., `[HealthCheckWorker] error message`.

## Common Patterns

**API Client**:
```typescript
import { api } from "@/lib/client";
const { data, error } = await api.monitors.get();
```

**DB Query**:
```typescript
await db.select().from(monitor)
  .where(eq(monitor.userId, user.id))
  .orderBy(desc(monitor.createdAt));
```

**Class Variance Authority (cva)**:
```typescript
import { cva } from "class-variance-authority";
const variants = cva("base", { variants: { size: { sm: "...", lg: "..." } } });
```

**Tailwind Classes**: Use `cn()` utility from `@/lib/utils` for conditional classes.

## Project Structure

```
src/app/                # Next.js App Router
  (auth)/              # Auth pages (grouped)
  (dashboard)/         # Dashboard pages (grouped)
  api/[[...slug]]/     # Elysia API catch-all route
  api/cron/            # Health check cron job
src/components/
  ui/                  # UI primitives (shadcn-style)
  *.tsx                # Feature components
src/db/                # Drizzle schema, connection
src/emails/            # React Email templates
src/lib/               # Utilities, workers, auth client
src/routes/            # Elysia route modules
```

## Do's and Don'ts

**Do**:
- Use Bun (not npm/pnpm/yarn)
- Follow existing patterns in similar files
- Add indexes for foreign keys in DB schema
- Use `@/` aliases for imports outside current directory
- Validate API inputs with Typebox
- Run `bun run format` before committing
- Use function declarations for components

**Don't**:
- Use npm/yarn/pnpm commands
- Create `.env` with real secrets (use `.env.example`)
- Skip auth checks on protected routes
- Use `any` type (prefer `unknown` or proper types)
- Use arrow functions for React components
- Commit without running lint
- Forget to add `"use client"` for client components
