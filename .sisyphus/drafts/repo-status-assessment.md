# Draft: Sentinel Repository Status Assessment

## User's Request
- Assess current status: what's done vs what's pending
- User mentioned: "DFL layer is remaining" + "UI needs consistency"

---

## ✅ FULLY IMPLEMENTED

### Database Schema
- 9 tables with proper relations (user, session, account, verification, monitor, healthCheck, incident, alertConfig, notification)
- All indexes defined
- Type exports for all tables

### API Routes (Full CRUD)
| Route | Operations |
|-------|------------|
| `/monitors` | List, Create, Detail, Update, Delete, Checks, Stats, Uptime |
| `/alerts` | List, Create, Update, Delete |
| `/incidents` | List, Detail, Update state/cause/postmortem |
| `/user` | Profile, Image upload/delete |
| `/admin` | Monitors list, Users list, Role update, Stats |

### Background Workers
- `health-check-worker.ts` - Periodic HTTP/TCP/Ping checks
- `incident-service.ts` - Track failures, create/resolve incidents
- `notification-service.ts` - Send email/webhook/Slack/Discord
- `uptime-service.ts` - Calculate uptime metrics

### TanStack Query Hooks (ALL READY)
All hooks implemented in `/src/hooks/api/`:
- Monitors: useMonitors, useMonitor, useMonitorChecks, useMonitorStats, useMonitorUptime
- CRUD: useCreateMonitor, useUpdateMonitor, useDeleteMonitor
- Alerts: useAlerts, useCreateAlert, useUpdateAlert, useDeleteAlert
- Incidents: useIncidents
- User: useUser
- Admin: useAdmin

### Other Implemented
- Auth system (better-auth with Google SSO)
- Email notifications (Resend)
- Public status page `/status/[monitorId]`
- 51 UI components (shadcn/ui)

---

## ⚠️ SCAFFOLDED (Needs Work)

### Dashboard Pages - Hardcoded Data
| Page | Issue |
|------|-------|
| `/dashboard` | Hardcoded stats, TODO for TanStack Query |
| `/dashboard/monitors` | Hardcoded mock data, hooks exist but not used |
| `/dashboard/monitors/[id]` | Hardcoded data |
| `/dashboard/notifications` | Mock notifications only |

### TODO Comments Found
```
src/app/account/page.tsx:19              - TODO: Replace with better-auth session data
src/app/dashboard/page.tsx:11             - TODO: Replace with TanStack Query hook
src/app/dashboard/notifications/page.tsx:42 - TODO: Replace with TanStack Query hook
src/app/dashboard/monitors/page.tsx:36   - TODO: Replace with TanStack Query hook
src/components/monitors/uptime-chart.tsx:13 - TODO: Replace with TanStack Query hook
src/components/monitors/latency-chart.tsx:11 - TODO: Replace with TanStack Query hook
```

---

## ❌ MISSING / NOT STARTED

### DFL Layer (User's Main Concern)
**Status: NOT IMPLEMENTED**

Current pattern:
```
Routes → DB (direct Drizzle calls) → Workers (direct)
```

No abstraction layer exists. All routes directly query database.

### Missing Features
- **Reports** - UI placeholder exists
- **Maintenance windows** - UI placeholder exists  
- **Tags system** - UI exists but no backend
- **Monitor create/edit forms** - Button exists, no form
- **Public status page listing** - All public monitors

---

## DFL Layer: What Needs to Be Built

| Layer | Purpose | Location |
|-------|---------|----------|
| Data/Repository | All DB queries | `src/lib/data/` |
| Feature/Service | Business logic | `src/lib/services/` |
| Routes | Thin HTTP handlers | Existing routes refactored |

**Example transformation:**
```typescript
// BEFORE (current)
.get("/", async ({ user }) => {
  const monitors = await db.select().from(monitor).where(eq(monitor.userId, user.id))
})

// AFTER (with DFL)
.get("/", async ({ user }) => {
  return monitorService.getAllByUser(user.id)
})
```

---

## UI Consistency Audit Results

### 10 Specific Inconsistencies Found

| # | Issue | Impact |
|---|-------|--------|
| 1 | **Two table patterns** - Table component vs raw `<table>` | Different styling, maintainability |
| 2 | **Two button patterns** - Button component vs raw `<button>` | Inconsistent hover states, sizing |
| 3 | **Status card colors** - Inline classes vs colorMap object | Maintainability varies |
| 4 | **Three skeleton patterns** - Different implementations per page | No standard loading UX |
| 5 | **Card padding** - 4+ variations (`p-0`, `p-6`, default) | Visual inconsistency |
| 6 | **Tabs styling** - Default vs heavily overridden | Different heights, fonts |
| 7 | **Empty states** - Empty component vs manual divs | Mixed approaches |
| 8 | **Header typography** - `text-xl` vs `text-2xl` for page titles | Visual inconsistency |
| 9 | **Spacing tokens** - `space-y-4/6/8`, `gap-2/4/6` mixed | No design system |
| 10 | **Form fields** - Inconsistent label patterns | UX inconsistency |

### Key Files with Issues
- `src/components/monitor-dashboard.tsx` - Uses raw buttons, raw tables, manual empty states
- `src/app/dashboard/notifications/page.tsx` - Overridden tabs styling
- `src/app/dashboard/settings/page.tsx` - Different header size

### Recommended Standardizations
1. **PageHeader component** - Consistent title + description + breadcrumb
2. **StatCard component** - Unified color handling
3. **DataTable component** - Standard table with skeleton + empty state
4. **LoadingSkeleton component** - Standard patterns per content type
5. **FormField component** - Standard label + input + error handling

---

## Pending Research
- [x] Full codebase implementation status
- [x] UI consistency audit

---

## Prioritized Work Plan

### Priority 1: DFL Layer
1. Create `/src/lib/services/monitor-service.ts`
2. Create `/src/lib/services/alert-service.ts`
3. Create `/src/lib/services/incident-service.ts`
4. Refactor routes to use services

### Priority 2: UI Consistency
1. Integrate TanStack Query hooks into dashboard pages
2. Replace hardcoded data with API calls
3. Add loading skeletons
4. Build monitor create/edit forms

### Priority 3: Missing Features
1. Reports
2. Maintenance windows
3. Tags backend
4. Public status listing
