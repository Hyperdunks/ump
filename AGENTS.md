# AGENTS.md - AI Coding Agent Guidelines

**Sentinel** is an uptime monitoring platform: Next.js 16 (App Router, React 19), Bun runtime, Elysia.js API, PostgreSQL with Drizzle ORM, better-auth, Tailwind CSS v4, TanStack Query, React Email + Resend.

## Commands

```bash
bun run dev              # Start dev server (check if running first)
bun run build            # Production build
bun run lint             # Run Biome linter
bun run format           # Format with Biome
bun run db:generate      # Generate Drizzle migrations
bun run db:migrate       # Apply migrations
bun run db:push          # Push schema directly (dev only)
bun run db:studio        # Open Drizzle Studio
# Tests: No framework configured. Add with: bun add -d vitest @testing-library/react
# Run single test: bun test <test-file-path>
```

## Code Style

**Formatting**: 2 spaces, semicolons required, double quotes. Biome auto-organizes imports. Run `bun run format` before committing.

**TypeScript**: Strict mode. Use `import type { Foo }` for type-only imports. Infer from Drizzle: `typeof table.$inferSelect`. Path alias: `@/*` → `./src/*`.

**Naming**: Files: kebab-case (`health-check-worker.ts`), Components: PascalCase (`DashboardPage`), Functions: camelCase (`runHealthChecks`), DB tables: snake_case columns (`user_id`), Types: PascalCase with purpose suffix (`AuthUser`).

**Import order**: External packages, internal aliases (`@/db`, `@/lib/*`), relative imports.

**React**: Use function declarations. Client components need `"use client"`. Prefer server components. UI primitives in `src/components/ui/`.

**API Routes** (`src/routes/*/route.ts`): Use `betterAuthPlugin` with `{ auth: true }`. Validate with Typebox. Return `{ data: ... }` or `{ message: "..." }`. Use `status()` helper for errors.

**Database** (`src/db/schema.ts`): Use nanoid for primary keys (`text("id").primaryKey()`). Add indexes for foreign keys. Use `$onUpdate(() => new Date())` for `updatedAt`. Export inferred types.

**Error handling**: Use `APIError` class. Catch with try/catch, log with `console.error`. Fire-and-forget: `.catch(console.error)`. Worker errors: `[WorkerName]` prefix.

**IDs**: `nanoid()` (21 chars) for entities, `shortId()` (12 chars) for short identifiers. Both alphanumeric.

## Project Structure

```
src/app/                # Next.js App Router
  (auth)/              # Auth pages
  (dashboard)/         # Dashboard pages
  api/[[...slug]]/     # Elysia API catch-all
  api/cron/            # Health check cron
src/components/ui/     # UI primitives (shadcn-style)
src/db/                # Drizzle schema, connection
src/emails/            # React Email templates
src/lib/               # Workers, auth, client, utils
src/routes/            # Elysia route modules
```

## Common Patterns

**API client**: `import { api } from "@/lib/client"; const { data, error } = await api.monitors.get();`

**DB query**: `await db.select().from(monitor).where(eq(monitor.userId, user.id)).orderBy(desc(monitor.createdAt));`

**cva variants**: `cva("base-classes", { variants: { variant: { default: "...", outline: "..." } }, defaultVariants: { variant: "default" } });`

## Do's and Don'ts

**Do**: Use Bun (not npm/pnpm), follow existing patterns, add indexes for foreign keys, use `@/` aliases for deep imports, validate API inputs with Typebox.

**Don't**: Use npm/yarn/pnpm, create `.env` with real secrets, skip auth checks, use `any` type (prefer `unknown`), commit without running lint.
