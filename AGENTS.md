# AGENTS.md - AI Coding Agent Guidelines

This document provides guidelines for AI agents working on this codebase.

## Project Overview

**Sentinel** is an uptime monitoring platform built with:
- **Framework**: Next.js 16 with App Router (React 19)
- **Runtime**: Bun (not npm/pnpm)
- **API**: Elysia.js with Eden Treaty client
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: better-auth with email/password
- **Styling**: Tailwind CSS v4, class-variance-authority (cva)
- **State**: TanStack Query for data fetching
- **Email**: React Email + Resend

## Build / Lint / Test Commands

- Check first that if its running already or not. Then after try to run start dev commands.

```bash
# Development
bun run dev              # Start Next.js dev server

# Build
bun run build            # Production build

# Linting & Formatting
bun run lint             # Run Biome linter
bun run format           # Format with Biome

# Database
bun run db:generate      # Generate Drizzle migrations
bun run db:migrate       # Apply migrations
bun run db:push          # Push schema directly (dev only)
bun run db:studio        # Open Drizzle Studio

# No test framework configured - add tests with:
# bun add -d vitest @testing-library/react
```

## Code Style Guidelines

### Formatting (Biome)
- **Indentation**: 2 spaces (not tabs)
- **Semicolons**: Required (Biome default)
- **Quotes**: Double quotes for strings
- **Imports**: Auto-organized by Biome on save/format
- Run `bun run format` before committing

### TypeScript
- Strict mode enabled
- Use `type` imports: `import type { Foo } from "./bar"`
- Export types alongside implementations in same file
- Infer types from Drizzle schema: `typeof table.$inferSelect`
- Path alias: `@/*` maps to `./src/*`

### Naming Conventions
- **Files**: kebab-case for all files (`health-check-worker.ts`)
- **Components**: PascalCase (`DashboardPage`)
- **Functions**: camelCase (`runHealthChecks`)
- **Constants**: camelCase for config, UPPER_CASE for true constants
- **Database tables**: snake_case columns (`user_id`, `created_at`)
- **Types**: PascalCase, suffix with purpose (`AuthUser`, `NewMonitor`)
- **Enums**: camelCase name, string literals (`userRoleEnum`)

### Imports Order (Auto-organized by Biome)
1. External packages (react, next, etc.)
2. Internal aliases (`@/db`, `@/lib/*`)
3. Relative imports

```typescript
import { desc, eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { betterAuthPlugin } from "@/app/api/[[...slug]]/auth";
import { db } from "@/db";
import { nanoid } from "@/lib/nanoid";
```

### React Components
- Use function declarations for components
- Mark client components with `"use client"` directive
- Prefer server components when possible (no directive needed)
- Use shadcn/ui patterns for UI components
- Component files in `src/components/ui/` for primitives

```typescript
"use client";

export default function DashboardPage() {
  // ...
}
```

### API Routes (Elysia)
- Routes defined in `src/routes/*/route.ts`
- Use `betterAuthPlugin` macro for auth: `{ auth: true }`
- Validate with Typebox schemas (`t.Object`, `t.String`, etc.)
- Return structured responses: `{ data: ... }` or `{ message: "..." }`
- Use `status()` helper for error responses

```typescript
.get(
  "/:id",
  async ({ user, params, status }) => {
    const [item] = await db.select()...;
    if (!item) return status(404, { message: "Not found" });
    return { data: item };
  },
  { auth: true, params: idParam }
)
```

### Database (Drizzle)
- Schema in `src/db/schema.ts`
- Use nanoid for primary keys: `id: text("id").primaryKey()`
- Always add indexes for foreign keys and common queries
- Use `$onUpdate(() => new Date())` for `updatedAt` columns
- Export inferred types: `export type Monitor = typeof monitor.$inferSelect`

### Error Handling
- Use `APIError` class for API errors with status codes
- Catch async errors with try/catch, log with `console.error`
- Fire-and-forget patterns use `.catch(console.error)`
- Worker errors logged with `[WorkerName]` prefix

```typescript
try {
  await operation();
} catch (error) {
  console.error("[Context] Error message:", error);
  throw new APIError("User-facing message", 500);
}
```

### ID Generation
- Use `nanoid()` (21 chars) for entity IDs
- Use `shortId()` (12 chars) for shorter identifiers
- Both use alphanumeric alphabet (no special chars)

### Environment Variables
Required in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - 32+ char random secret
- `BETTER_AUTH_URL` - Base URL of app
- `RESEND_API_KEY` - For email sending
- `CRON_SECRET` - For GitHub Actions cron auth

## Project Structure

```
src/
  app/                    # Next.js App Router
    (auth)/               # Auth pages (login, register)
    (dashboard)/          # Dashboard pages
    api/
      [[...slug]]/        # Elysia API catch-all
      cron/               # Health check cron endpoint
  components/
    ui/                   # UI primitives (shadcn-style)
    providers.tsx         # Root providers
  db/
    index.ts              # Database connection
    schema.ts             # Drizzle schema
  emails/                 # React Email templates
  lib/
    workers/              # Background job logic
    auth.ts               # better-auth config
    auth-client.ts        # Client-side auth
    client.ts             # Eden Treaty API client
    utils.ts              # Utilities (cn helper)
  routes/                 # Elysia route modules
    monitors/
    incidents/
    alerts/
    admin/
```

## Common Patterns

### API Client Usage (Client-side)
```typescript
import { api } from "@/lib/client";

const { data, error } = await api.monitors.get();
```

### Database Queries
```typescript
const monitors = await db
  .select()
  .from(monitor)
  .where(eq(monitor.userId, user.id))
  .orderBy(desc(monitor.createdAt));
```

### Component with cva variants
```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", outline: "..." },
    size: { default: "...", sm: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});
```

## Do's and Don'ts

**Do:**
- Use Bun for all package management
- Follow existing patterns in codebase
- Add indexes for new foreign key columns
- Use path aliases (`@/...`) not relative paths for deep imports
- Validate all API inputs with Typebox

**Don't:**
- Use npm/yarn/pnpm commands
- Create `.env` files with real secrets
- Skip auth checks on protected routes
- Use `any` type - prefer `unknown` with type guards
- Commit without running `bun run lint`
