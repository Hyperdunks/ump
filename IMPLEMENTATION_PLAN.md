# UI Mock → Shadcn Migration Plan

> **How this works**: This plan is split into phases. Each phase is a single agent run. When a phase is complete, the agent **checks the box** (`[x]`) so the next agent picks up from the next unchecked phase. Always read this file first before doing any work.

---

## Context

Migrate `ui-mock/` (Sentinel uptime dashboard — React+Vite SPA) into the main Next.js 16 project using proper shadcn components. The mock's structure and layout are the reference; the code itself is messy and must be rewritten cleanly.

**Key files to reference**:
- `ui-mock/` — source UI reference (DO NOT copy-paste; rewrite using shadcn)
- `src/components/ui/` — existing shadcn components (60+)
- `AGENTS.md` — project code conventions (function declarations, `"use client"`, `cn()`, `@/` aliases)
- `docs/dashboard.md` — dashboard layout spec (top-nav, Vercel-style — NOT sidebar)
- `components.json` — shadcn config (`base-vega` style)

**Critical rules for ALL phases**:
1. **shadcn MCP first**: Before using any shadcn component, query the shadcn MCP server for its docs (imports, props, variants). If MCP unavailable, read `src/components/ui/<component>.tsx` directly. NEVER guess the API.
2. **Project conventions**: Function declarations, `"use client"` where needed, `@/` aliases, `cn()` for class merging, Biome formatting.
3. **After each file**: Run `bun run build` to verify no type/compile errors.
4. **Mock data**: Use hardcoded placeholder data initially. Mark with `// TODO: Replace with TanStack Query hook`.
5. **Auth**: Use `better-auth` (already in project). Do NOT re-implement the mock's localStorage auth.
6. **Toasts**: Use `sonner` (already installed). Do NOT create custom toast context.

---

## Component Mapping Reference

Agents must use this table when converting mock code:

| Mock Component | → shadcn Replacement |
|---|---|
| `ui/Button.tsx` | `@/components/ui/button` (variants: `default`, `outline`, `secondary`) |
| `ui/Input.tsx` (label+error) | `@/components/ui/field` + `@/components/ui/input` |
| `ui/Toast.tsx` + `ToastContext` | `sonner` — `toast.success()` / `toast.error()` |
| `ui/UptimeChart.tsx` | `@/components/ui/chart` (`ChartContainer`, `ChartTooltip`) + `recharts` |
| `layout/Layout.tsx` + `Sidebar.tsx` | Top-nav layout (see Phase 1) |
| Breadcrumbs (inline) | `@/components/ui/breadcrumb` |
| Tabs (inline) | `@/components/ui/tabs` |
| Tables (MonitorsList) | `@/components/ui/table` |
| Modals (IncidentAnalysis, etc.) | `@/components/ui/dialog` |
| Cards (Overview, Stats) | `@/components/ui/card` |
| Pagination | `@/components/ui/pagination` |
| Dropdowns (user menu) | `@/components/ui/dropdown-menu` |
| Avatar (user initials) | `@/components/ui/avatar` |
| Status labels | `@/components/ui/badge` |
| Checkboxes | `@/components/ui/checkbox` |
| Skeleton loaders | `@/components/ui/skeleton` |
| `AnimatedBeam.tsx` | `@/components/ui/animated-beam` (already exists) |
| Input with icon prefix | `@/components/ui/input-group` |

---

## Phase 1: Dashboard Layout Shell
- [x] **Completed**

### Goal
Build the top-nav dashboard layout that all dashboard pages will use.

### Reference
- Mock: `ui-mock/components/layout/Layout.tsx`, `ui-mock/components/layout/Sidebar.tsx`
- Spec: `docs/dashboard.md` (top-nav, NOT sidebar)

### Steps

1. **Check/install missing shadcn components**:
   ```bash
   # Verify these exist in src/components/ui/, install if missing:
   # navigation-menu, avatar, dropdown-menu, sheet, separator, badge, tooltip
   bunx shadcn@latest add <missing-ones>
   ```

2. **Create `src/components/top-nav.tsx`**:
   - Horizontal nav: Logo (left) → Nav links: Monitors, Incidents, Alerts (center/right) → User avatar + dropdown (far right)
   - shadcn: `NavigationMenu`, `Avatar`, `AvatarFallback`, `DropdownMenu`, `Button`
   - Mobile: hamburger → shadcn `Sheet` for mobile nav
   - Active link state via `usePathname()` from `next/navigation`
   - User data from `better-auth` session (not mock AuthContext)
   - `"use client"` directive

3. **Modify `src/app/dashboard/layout.tsx`**:
   - Import and render `<TopNav>` above `{children}`
   - Max-width content container: `max-w-[1600px] mx-auto`
   - Auth protection (redirect if not authenticated)

4. **Verify**:
   ```bash
   bun run build   # must pass
   bun run typecheck # must pass
   ```

---

## Phase 2: Dashboard Overview Page
- [x] **Completed**

### Goal
Build the main dashboard overview page with summary cards and empty-state sections.

### Reference
- Mock: `ui-mock/pages/Overview.tsx`

### Steps

1. **Modify `src/app/dashboard/page.tsx`**:
   - **CLI Banner**: shadcn `Card` with `Button` ("Learn more")
   - **Header**: "Overview" heading + subtitle
   - **Summary Cards**: Grid (5 cols desktop) of `Card` components:
     - Monitors, Status Pages, Recent Incidents, Last Report, Last Maintenance
     - Each card: `CardHeader` (label) + `CardContent` (value)
   - **Sections**: Incidents / Reports / Maintenance, each with:
     - Heading + subtitle
     - Empty state: dashed border card with "No X found" text (use shadcn `Empty` component if available, otherwise simple styled div)
   - All mock data hardcoded with `// TODO: Replace with TanStack Query hook`

2. **Verify**:
   ```bash
   bun run typecheck
   bun run build
   ```

---

## Phase 3: Monitors List Page
- [x] **Completed**

### Goal
Build the monitors list page with status cards, filters, data table, and pagination.

### Reference
- Mock: `ui-mock/pages/MonitorsList.tsx`

### Steps

1. **Create `src/app/dashboard/monitors/page.tsx`**:
   - **Header**: "Monitors" + "Create Monitor" `Button`
   - **Status Cards**: Grid (5 cols) — Normal (green), Degraded (yellow), Failing (red), Inactive (gray), Slowest P95
     - Use `Card` + `Badge` for colored status
   - **Filter Bar**: `Input` (search) + `Button` (+ Tags)
   - **Data Table**: shadcn `Table`:
     - Columns: Checkbox, Name, Status (`Badge`), Tags, Last Incident, Last Checked, P50, P90, P95, Actions (`DropdownMenu`)
     - Row click navigates to `/dashboard/monitors/[id]`
   - **Pagination**: shadcn `Pagination` component at bottom
   - `"use client"` for interactivity

2. **Verify**:
   ```bash
   bun run typecheck
   bun run build
   ```

---

## Phase 4: Monitor Detail Page
- [x] **Completed**

### Goal
Build the individual monitor detail page with stats, charts, and time filters.

### Reference
- Mock: `ui-mock/pages/MonitorDetail.tsx`

### Steps

1. **Create `src/app/dashboard/monitors/[id]/page.tsx`**:
   - **Breadcrumb**: shadcn `Breadcrumb` → Monitors → Monitor Name → Overview
   - **Header**: Monitor name + URL link + time filter controls (`ButtonGroup` or `ToggleGroup`)
   - **Stat Cards Grid**: Uptime (green), Degraded (yellow), Failing (red), Requests, Last Checked
     - Use `Card` + `Badge` with color variants
   - **Latency Cards Grid**: P50, P75, P90, P95, P99
     - Each with value + change percentage badge
   - `"use client"` for chart interactivity

2. **Create `src/components/monitors/uptime-chart.tsx`**:
   - shadcn `ChartContainer` wrapping recharts `BarChart`
   - `ChartTooltip` + `ChartTooltipContent`
   - Legend: Success (green), Error (red), Degraded (yellow)

3. **Create `src/components/monitors/latency-chart.tsx`**:
   - shadcn `ChartContainer` wrapping recharts `AreaChart` with gradient fills
   - Multiple data series (p50, p99)
   - `ChartTooltip` + `ChartTooltipContent`
   - Legend: DNS, Connect, TLS, TTFB, Transfer

4. **Verify**:
   ```bash
   bun run typecheck
   bun run build
   ```

---

## Phase 5: Settings Page
- [x] **Completed**

### Goal
Build the settings page with workspace config, slug, and team management.
Make sure only implement those components whose features actually exist in the project not just random junk ui.

### Reference
- Mock: `ui-mock/pages/Settings.tsx`

### Steps

1. **Create `src/app/dashboard/settings/page.tsx`**:
   - **Breadcrumb**: shadcn `Breadcrumb` → Settings → General
   - **Workspace Section**: `Card` with `Field` + `Input` (name) + `Button` (Submit) in footer
   - **Slug Section**: `Card` with read-only slug display + copy button
   - **Team Section**: `Card` with:
     - `Tabs` (Members / Pending)
     - Team member table using `Table` component
     - "Add member" `Field` + `Input` (email)
     - Footer: upgrade CTA with `Badge` + `Button` + Lock icon
   - `"use client"` for tabs

2. **Verify**:
   ```bash
   bun run build
   bun run dev   # check /dashboard/settings
   ```

---

## Phase 6: Notifications Page
- [x] **Completed**

### Goal
Build the notifications page with tab filters and notification list.
Make sure only implement those components whose features actually exist in the project not just random junk ui.

### Reference
- Mock: `ui-mock/pages/Notifications.tsx`

### Steps

1. **Create `src/app/dashboard/notifications/page.tsx`**:
   - **Header**: "Notifications" + subtitle
   - **Tab Filter**: shadcn `Tabs` (All / Unread / Archived)
   - **Notification List**: Inside `Card`, each notification row:
     - Status icon (error=red, warning=yellow, success=green, info=blue)
     - Title + unread dot indicator (`Badge` or inline dot)
     - Message text (line-clamp-2)
     - Timestamp with clock icon
     - Archive button (ghost `Button` with `Tooltip`, visible on hover)
   - **Empty State**: shadcn `Empty` or custom empty component
   - `"use client"` for tab/notification state

2. **Verify**:
   ```bash
   bun run typecheck
   bun run build
   ```

---

## Phase 7: Account Page + Feature Modals
- [x] **Completed**

### Goal
Build/update the account page and create the reusable modals (incident analysis, threshold settings).

### Reference
- Mock: `ui-mock/pages/Account.tsx`, `ui-mock/components/IncidentAnalysisModal.tsx`, `ui-mock/components/ThresholdSettingsModal.tsx`

### Steps

1. **Modify `src/app/account/page.tsx`** (or create if minimal):
   - Profile header: shadcn `Avatar` + `AvatarFallback` + user name/email
   - Form: `Field` + `InputGroup` (with icon) + `Input` for name, email
   - Save button: `Button`
   - Data from `better-auth` session

2. **Create `src/components/monitors/incident-analysis-modal.tsx`**:
   - shadcn `Dialog` + `DialogContent` + `DialogHeader` + `DialogTitle`
   - Sections: Root Cause, Impact, Suggested Fix, Estimated Resolution Time
   - Use `Card` or simple styled divs inside dialog for each section

3. **Create `src/components/monitors/threshold-settings-modal.tsx`**:
   - shadcn `Dialog` with form inside
   - Fields: Metric (`Select`), Operator (`Select`), Value (`Input`), Duration (`Input`), Enabled (`Switch`)
   - Validation: value must be positive, duration must be positive integer
   - Error feedback via `Field` component error state
   - Save/Cancel buttons: `Button`

4. **Verify**:
   ```bash
   bun run build
   ```

---

## Phase 8: Polish, Auth Page Styling, Final Verification
- [ ] **Completed**

### Goal
Final polish pass — ensure auth pages match the mock's aesthetic, responsive design works, and everything builds clean.

### Steps

1. **Review `src/app/(auth)/layout.tsx`**:
   - Ensure the auth container matches the mock's centered card aesthetic (rounded-2xl, centered logo, clean spacing)
   - This is styling only — do NOT change auth logic

2. **Responsive check**:
   - Verify top-nav collapses to hamburger on mobile
   - All card grids stack properly on small screens
   - Tables scroll horizontally on mobile
   - Charts are responsive

3. **Consistency pass**:
   - All pages use consistent spacing (`space-y-6`, `space-y-8`)
   - All headings follow same hierarchy (h1 for page title, h2 for sections)
   - All buttons use shadcn `Button` (no inline `<button>` tags)
   - All inputs use shadcn `Field` + `Input` (no raw `<input>` tags)
   - Status colors are consistent (green=up, yellow=degraded, red=down)

4. **Final verification**:
   ```bash
   bun run build    # clean build
   bun run lint     # no warnings
   bun test         # existing tests still pass
   bun run dev      # full walkthrough of every page
   ```

5. **Browser walkthrough** (use browser tool):
   - `/dashboard` — overview cards + sections render
   - `/dashboard/monitors` — table + status cards render
   - `/dashboard/monitors/[id]` — charts + stats render
   - `/dashboard/settings` — tabs + team table render
   - `/dashboard/notifications` — tab filter + list render
   - `/account` — profile form renders
   - Resize to mobile — nav collapses, layout adapts

---

## Notes for Agents

- **Start here**: Read this entire file. Find the first unchecked phase (`- [ ]`). Execute it. Check it off (`- [x]`). Stop.
- **One phase per run**: Each phase is scoped to be completable in a single agent session. Do not attempt multiple phases.
- **If blocked**: If a phase requires a component that doesn't exist yet (e.g., a missing shadcn component), install it with `bunx shadcn@latest add <name>`.
- **If a build fails**: Fix the error before checking off the phase. The phase is not complete until `bun run build` passes.
- **shadcn MCP**: Always query the MCP server before using a component. If the server is unavailable, read `src/components/ui/<component>.tsx` to understand the API.
