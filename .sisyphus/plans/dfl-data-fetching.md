# DFL Data Fetching Layer Implementation Plan

## TL;DR

> **Quick Summary**: Connect existing TanStack Query hooks to dashboard pages (replacing hardcoded data), remove tags UI, and create public status page listing.
> 
> **Deliverables**:
> - 6 pages updated to use TanStack Query hooks
> - Tags UI completely removed from monitors page
> - New `/status` page listing all public monitors
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Dashboard overview → Monitors list → Monitor detail → Charts

---

## Context

### Original Request
Implement DFL (Data Fetching Layer) using TanStack Query, remove tags UI, and add public status listing page.

### Interview Summary
**Key Decisions**:
- DFL = Connect existing hooks to UI (NOT a service layer)
- Tags removal: UI-only (no backend exists)
- Public status: Server component pattern (no new hook needed)
- Reports: OUT OF SCOPE
- Maintenance windows: OUT OF SCOPE

**Research Findings**:
- 21 TanStack Query hooks exist in `src/hooks/api/` - mostly unused
- Only `useMonitors` and `useIncidents` are used (in monitor-dashboard.tsx)
- 6 pages have hardcoded mock data
- `/status/[monitorId]` works via server component (direct DB query)

### Metis Review
**Critical Insights**:
- `/status` listing should be server component (same pattern as `/status/[monitorId]`)
- No hook needed for public monitors - use direct DB query
- Need to verify API response shapes match hardcoded data fields
- Tags removal confirmed UI-only (no DB column to remove)

---

## Work Objectives

### Core Objective
Replace all hardcoded mock data in dashboard pages with real API calls via TanStack Query hooks, remove tags UI, and create public status listing.

### Concrete Deliverables
- `src/app/dashboard/page.tsx` - Uses `useMonitors`, `useIncidents`
- `src/app/dashboard/monitors/page.tsx` - Uses `useMonitors`, tags removed
- `src/app/dashboard/monitors/[id]/page.tsx` - Uses `useMonitor`, `useMonitorStats`, `useMonitorUptime`
- `src/app/dashboard/notifications/page.tsx` - Uses `useIncidents`
- `src/components/monitors/uptime-chart.tsx` - Uses `useMonitorChecks`
- `src/components/monitors/latency-chart.tsx` - Uses `useMonitorChecks`
- `src/app/status/page.tsx` - NEW: Lists all public monitors

### Definition of Done
- [ ] All 6 pages use TanStack Query hooks (no hardcoded data)
- [ ] Tags UI completely removed (button, table column, mock data)
- [ ] `/status` page lists public monitors with links
- [ ] All pages compile without TypeScript errors
- [ ] Empty states show when no data available
- [ ] Loading states show while fetching

### Must Have
- Use existing hooks from `@/hooks/api/`
- Preserve existing UI structure and styling
- Handle loading/error states gracefully
- Server component pattern for `/status` (no auth required)

### Must NOT Have (Guardrails)
- **NO new API routes** - Public status uses server component with direct DB query
- **NO new hooks** - Use existing hooks only
- **NO modification to `/status/[monitorId]`** - Already works
- **NO test file modifications** - Unless tests fail
- **NO changes to hook implementations** - Only use them
- **NO reports or maintenance features** - Out of scope

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: YES (Bun test runner)
- **Automated tests**: NO - Manual verification
- **Focus**: TypeScript compilation + UI verification

### QA Policy
Every task includes agent-executed QA scenarios.

| Deliverable Type | Verification Tool | Method |
|------------------|-------------------|--------|
| Dashboard pages | Playwright | Navigate, verify data loads, check for hardcoded values |
| Status page | Playwright | Navigate to /status, verify public monitors listed |
| Tags removal | Bash (grep) | Search for "tags" in monitors page - should return nothing |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — Tags + Status Page):
├── Task 1: Remove tags UI from monitors page [quick]
├── Task 2: Create /status public listing page [quick]
└── Task 3: Verify API response shapes match hardcoded data [quick]

Wave 2 (After Wave 1 — Dashboard Pages):
├── Task 4: Integrate hooks into dashboard overview [quick]
├── Task 5: Integrate hooks into monitors list page [quick]
├── Task 6: Integrate hooks into notifications page [quick]
└── Task 7: Integrate hooks into monitor detail page [deep]

Wave 3 (After Wave 2 — Charts):
├── Task 8: Integrate hooks into uptime chart [quick]
└── Task 9: Integrate hooks into latency chart [quick]

Wave 4 (After Wave 3 — Verification):
├── Task 10: TypeScript compilation check [quick]
├── Task 11: Playwright QA - all pages [unspecified-high]
└── Task 12: Final cleanup + verification [quick]

Critical Path: Task 3 → Task 4 → Task 5 → Task 7 → Task 10 → Task 11
Parallel Speedup: ~50% faster than sequential
Max Concurrent: 4 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|------------|--------|------|
| 1 | — | — | 1 |
| 2 | — | 11 | 1 |
| 3 | — | 4-9 | 1 |
| 4 | 3 | 10 | 2 |
| 5 | 3 | 10 | 2 |
| 6 | 3 | 10 | 2 |
| 7 | 3 | 10 | 2 |
| 8 | 3 | 10 | 3 |
| 9 | 3 | 10 | 3 |
| 10 | 4-9 | 11 | 4 |
| 11 | 2, 10 | 12 | 4 |
| 12 | 11 | — | 4 |

---

## TODOs

- [ ] 1. Remove Tags UI from Monitors Page

  **What to do**:
  - Remove Tags button from filter bar (lines 145-148)
  - Remove Tags table header column (line 161)
  - Remove Tags table cell display (lines 198-200)
  - Remove `tags: []` from mock data (line 71)
  - Verify no other tag references remain

  **Must NOT do**:
  - Don't touch any backend files (no tags column exists)
  - Don't modify the monitor type definitions

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple deletion task, no complex logic
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: None
  - **Blocked By**: None

  **References**:
  - `src/app/dashboard/monitors/page.tsx` - File to modify

  **Acceptance Criteria**:
  - [ ] No "Tags" button in filter bar
  - [ ] No "Tags" column in table header
  - [ ] No tags display in table cells
  - [ ] File compiles without errors

  **QA Scenarios**:
  ```
  Scenario: Tags completely removed
    Tool: Bash
    Steps:
      1. grep -n "tags\|Tags" src/app/dashboard/monitors/page.tsx
    Expected Result: No matches found
    Evidence: .sisyphus/evidence/task-01-tags-removed.txt
  ```

  **Commit**: NO (groups with task 2-3)

---

- [ ] 2. Create /status Public Listing Page

  **What to do**:
  - Create `src/app/status/page.tsx` as a **server component**
  - Query all monitors where `isPublic === true` directly from DB
  - Display list of public monitors with:
    - Name, URL, status indicator
    - Link to individual status page `/status/[monitorId]`
  - Handle empty state (no public monitors)
  - Follow same styling pattern as `/status/[monitorId]`

  **Must NOT do**:
  - Don't create a new API route
  - Don't create a new hook for public monitors
  - Don't modify `/status/[monitorId]` page

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Following existing server component pattern
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 11
  - **Blocked By**: None

  **References**:
  - `src/app/status/[monitorId]/page.tsx` - Pattern to follow (server component)
  - `src/db/schema.ts` - Monitor table with `isPublic` field
  - `src/db/index.ts` - DB connection to use

  **Acceptance Criteria**:
  - [ ] Page exists at `src/app/status/page.tsx`
  - [ ] Shows list of public monitors
  - [ ] Each monitor links to `/status/[id]`
  - [ ] Empty state shown when no public monitors

  **QA Scenarios**:
  ```
  Scenario: Public status page works without auth
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/status
      2. Verify page loads without authentication
      3. Check for monitor list or empty state
    Expected Result: Page loads, shows public monitors or empty message
    Evidence: .sisyphus/evidence/task-02-status-page.png
  ```

  **Commit**: NO

---

- [ ] 3. Verify API Response Shapes

  **What to do**:
  - Read the API route responses in `src/routes/`
  - Compare with hardcoded data structures in pages
  - Document any field name mismatches
  - Verify hook return types match page expectations

  **Pages to check**:
  - `/dashboard/page.tsx` - summaryCards fields vs useMonitors response
  - `/dashboard/monitors/page.tsx` - monitors array fields vs useMonitors response
  - `/dashboard/monitors/[id]/page.tsx` - statCards fields vs useMonitorStats response

  **Must NOT do**:
  - Don't modify any code in this task

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Analysis task, no code changes
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 4-9
  - **Blocked By**: None

  **References**:
  - `src/routes/monitors/route.ts` - API response shapes
  - `src/hooks/api/use-monitors.ts` - Hook return types
  - `src/app/dashboard/monitors/page.tsx` - Hardcoded data structure

  **Acceptance Criteria**:
  - [ ] Document created with field mappings
  - [ ] Any mismatches identified

  **QA Scenarios**:
  ```
  Scenario: API shapes documented
    Tool: Read
    Steps:
      1. Compare route responses with page expectations
    Expected Result: Clear mapping or list of mismatches
    Evidence: .sisyphus/evidence/task-03-api-shapes.md
  ```

  **Commit**: YES
  - Message: `chore: remove tags UI, add public status page`
  - Files: `src/app/dashboard/monitors/page.tsx`, `src/app/status/page.tsx`

---

- [ ] 4. Integrate Hooks into Dashboard Overview

  **What to do**:
  - Import `useMonitors` and `useIncidents` from `@/hooks/api`
  - Replace hardcoded `summaryCards` with real data:
    - Monitors count from `useMonitors.data.pagination.total`
    - Recent Incidents from `useIncidents.data.data.length`
  - Add loading states (Skeleton components)
  - Handle empty states
  - Note: Reports and Maintenance sections stay as empty states (out of scope)

  **Must NOT do**:
  - Don't change the page structure or styling
  - Don't add new features (reports, maintenance)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward hook integration
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 10
  - **Blocked By**: Task 3

  **References**:
  - `src/hooks/api/use-monitors.ts` - `useMonitors` hook
  - `src/hooks/api/use-incidents.ts` - `useIncidents` hook
  - `src/components/monitor-dashboard.tsx` - Example of hook usage

  **Acceptance Criteria**:
  - [ ] Page uses `useMonitors` and `useIncidents` hooks
  - [ ] Summary cards show real counts
  - [ ] Loading skeletons shown while fetching
  - [ ] Page compiles without errors

  **QA Scenarios**:
  ```
  Scenario: Dashboard shows real data
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard
      2. Verify monitors count matches database
      3. Verify incidents count matches database
    Expected Result: Real data displayed, no hardcoded values
    Evidence: .sisyphus/evidence/task-04-dashboard-real-data.png
  ```

  **Commit**: NO

---

- [ ] 5. Integrate Hooks into Monitors List Page

  **What to do**:
  - Import `useMonitors` from `@/hooks/api`
  - Replace hardcoded `monitors` array with `useMonitors().data.data`
  - Replace hardcoded `statusCards` with computed stats from monitors data
  - Add loading skeletons
  - Handle empty state (no monitors)
  - Update pagination to use real data

  **Must NOT do**:
  - Don't re-add tags (already removed in Task 1)
  - Don't change table structure

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Following pattern from monitor-dashboard.tsx
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 10
  - **Blocked By**: Task 3

  **References**:
  - `src/hooks/api/use-monitors.ts` - `useMonitors` hook
  - `src/components/monitor-dashboard.tsx` - Example pattern
  - Current page structure to preserve

  **Acceptance Criteria**:
  - [ ] Monitors list from API
  - [ ] Status cards computed from real data
  - [ ] Loading state while fetching
  - [ ] Empty state when no monitors

  **QA Scenarios**:
  ```
  Scenario: Monitors list shows real data
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard/monitors
      2. Verify monitors list matches API response
      3. Verify status cards reflect actual counts
    Expected Result: Real monitors displayed
    Evidence: .sisyphus/evidence/task-05-monitors-real-data.png
  ```

  **Commit**: NO

---

- [ ] 6. Integrate Hooks into Notifications Page

  **What to do**:
  - Import `useIncidents` from `@/hooks/api`
  - Replace hardcoded `initialNotifications` with incidents data
  - Map incident data to notification format:
    - type: based on incident state
    - title: monitor name + incident state
    - timestamp: detectedAt
  - Handle loading/empty states

  **Must NOT do**:
  - Don't create a new notifications-specific hook
  - Don't change the notification card structure

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Similar to other hook integrations
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 10
  - **Blocked By**: Task 3

  **References**:
  - `src/hooks/api/use-incidents.ts` - `useIncidents` hook
  - `src/db/schema.ts:Incident` - Incident type to map from

  **Acceptance Criteria**:
  - [ ] Notifications from incidents API
  - [ ] Loading state while fetching
  - [ ] Empty state handled

  **QA Scenarios**:
  ```
  Scenario: Notifications show incident data
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard/notifications
      2. Verify notifications match incidents
    Expected Result: Real incident notifications
    Evidence: .sisyphus/evidence/task-06-notifications-real-data.png
  ```

  **Commit**: NO

---

- [ ] 7. Integrate Hooks into Monitor Detail Page

  **What to do**:
  - Get monitorId from URL params
  - Import and use hooks:
    - `useMonitor(monitorId)` for monitor details
    - `useMonitorStats(monitorId)` for stat cards
    - `useMonitorUptime(monitorId)` for uptime data
  - Replace all hardcoded data:
    - `monitor` object → `useMonitor.data`
    - `statCards` → computed from `useMonitorStats`
    - `latencyCards` → computed from stats
  - Handle loading states
  - Handle 404 when monitor not found

  **Must NOT do**:
  - Don't change the page layout
  - Don't add new features

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Most complex integration, multiple hooks
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 10
  - **Blocked By**: Task 3

  **References**:
  - `src/hooks/api/use-monitors.ts` - Multiple hooks
  - `src/routes/monitors/route.ts` - API response shapes
  - Current page structure

  **Acceptance Criteria**:
  - [ ] Monitor details from API
  - [ ] Stats from useMonitorStats
  - [ ] Loading states
  - [ ] 404 handling for invalid ID

  **QA Scenarios**:
  ```
  Scenario: Monitor detail shows real data
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard/monitors/[valid-id]
      2. Verify monitor name, URL from API
      3. Verify stats reflect real data
    Expected Result: Real monitor data displayed
    Evidence: .sisyphus/evidence/task-07-detail-real-data.png
  ```

  **Commit**: YES
  - Message: `feat(dashboard): integrate TanStack Query hooks`
  - Files: All modified dashboard pages

---

- [ ] 8. Integrate Hooks into Uptime Chart

  **What to do**:
  - Accept `monitorId` as prop
  - Import `useMonitorChecks` from `@/hooks/api`
  - Replace hardcoded `uptimeData` with real check data
  - Transform check data to chart format:
    - time: checkedAt bucketed
    - success: count of status === 'up'
    - error: count of status === 'down'
    - degraded: count of status === 'degraded'

  **Must NOT do**:
  - Don't change chart styling

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Data transformation only
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 10
  - **Blocked By**: Task 3

  **References**:
  - `src/hooks/api/use-monitors.ts` - `useMonitorChecks` hook
  - `src/db/schema.ts:HealthCheck` - Check data structure

  **Acceptance Criteria**:
  - [ ] Chart uses real health check data
  - [ ] Loading state while fetching

  **QA Scenarios**:
  ```
  Scenario: Uptime chart shows real data
    Tool: Playwright
    Steps:
      1. Navigate to monitor detail page
      2. Verify uptime chart renders with data
    Expected Result: Chart shows real check data
    Evidence: .sisyphus/evidence/task-08-uptime-chart.png
  ```

  **Commit**: NO

---

- [ ] 9. Integrate Hooks into Latency Chart

  **What to do**:
  - Accept `monitorId` as prop
  - Import `useMonitorChecks` from `@/hooks/api`
  - Replace hardcoded `latencyData` with real response time data
  - Transform check data to chart format:
    - time: checkedAt bucketed
    - p50: median responseTime in bucket
    - p99: 99th percentile responseTime in bucket

  **Must NOT do**:
  - Don't change chart styling

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Data transformation only
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 10
  - **Blocked By**: Task 3

  **References**:
  - `src/hooks/api/use-monitors.ts` - `useMonitorChecks` hook
  - `src/db/schema.ts:HealthCheck` - Check data with responseTime

  **Acceptance Criteria**:
  - [ ] Chart uses real latency data
  - [ ] Loading state while fetching

  **QA Scenarios**:
  ```
  Scenario: Latency chart shows real data
    Tool: Playwright
    Steps:
      1. Navigate to monitor detail page
      2. Verify latency chart renders with data
    Expected Result: Chart shows real response time data
    Evidence: .sisyphus/evidence/task-09-latency-chart.png
  ```

  **Commit**: YES
  - Message: `feat(charts): integrate real health check data`
  - Files: `src/components/monitors/uptime-chart.tsx`, `latency-chart.tsx`

---

- [ ] 10. TypeScript Compilation Check

  **What to do**:
  - Run `bun run build` to check for TypeScript errors
  - Run `bun run lint` to check for linting errors
  - Fix any errors that arise
  - Verify all imports are correct

  **Must NOT do**:
  - Don't use `any` types to bypass errors
  - Don't skip error fixes

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Verification task
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (after tasks 4-9)
  - **Blocks**: Task 11
  - **Blocked By**: Tasks 4-9

  **References**:
  - None needed

  **Acceptance Criteria**:
  - [ ] `bun run build` succeeds with no errors
  - [ ] `bun run lint` passes

  **QA Scenarios**:
  ```
  Scenario: Clean build
    Tool: Bash
    Steps:
      1. Run `bun run build`
      2. Run `bun run lint`
    Expected Result: Both commands succeed
    Evidence: .sisyphus/evidence/task-10-build-success.txt
  ```

  **Commit**: NO

---

- [ ] 11. Playwright QA - All Pages

  **What to do**:
  - Test all modified pages:
    - `/dashboard` - Overview with real data
    - `/dashboard/monitors` - List with real data, no tags
    - `/dashboard/monitors/[id]` - Detail with real data
    - `/dashboard/notifications` - Notifications from incidents
    - `/status` - Public listing page
    - `/status/[id]` - Existing page still works
  - Verify loading states appear
  - Verify empty states work
  - Take screenshots of each page

  **Must NOT do**:
  - Don't skip any page

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Comprehensive manual QA
  - **Skills**: [`playwright`]

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 12
  - **Blocked By**: Task 2, Task 10

  **References**:
  - All modified pages

  **Acceptance Criteria**:
  - [ ] All pages load without errors
  - [ ] Real data displayed (no hardcoded values)
  - [ ] Loading states work
  - [ ] Empty states work
  - [ ] Tags removed from monitors page
  - [ ] Public status page works

  **QA Scenarios**:
  ```
  Scenario: Full page verification
    Tool: Playwright
    Steps:
      1. Visit each modified page
      2. Verify data loads from API
      3. Take screenshots
    Expected Result: All pages functional with real data
    Evidence: .sisyphus/evidence/task-11-qa-screenshots/
  ```

  **Commit**: NO

---

- [ ] 12. Final Cleanup + Verification

  **What to do**:
  - Remove any remaining TODO comments
  - Remove unused imports
  - Verify no console.log statements added
  - Run final `bun run build` and `bun run lint`
  - Create summary of changes

  **Must NOT do**:
  - Don't add new features

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Cleanup task
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (last)
  - **Blocks**: None
  - **Blocked By**: Task 11

  **References**:
  - All modified files

  **Acceptance Criteria**:
  - [ ] No TODO comments remaining
  - [ ] No unused imports
  - [ ] Build and lint pass

  **QA Scenarios**:
  ```
  Scenario: Clean codebase
    Tool: Bash
    Steps:
      1. grep for "TODO" in modified files
      2. Run build and lint
    Expected Result: Clean codebase
    Evidence: .sisyphus/evidence/task-12-final-cleanup.txt
  ```

  **Commit**: YES
  - Message: `chore: cleanup after DFL integration`
  - Files: Any remaining cleanup

---

## Final Verification Wave (MANDATORY)

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Verify all hardcoded data replaced with hooks, tags removed, public status page created.
  Output: `Hardcoded Data [N/N replaced] | Tags [removed] | Status Page [created] | VERDICT`

- [ ] F2. **TypeScript Quality Review** — `unspecified-high`
  Run `bun run build` + `bun run lint`. Check for `any` types, unused imports.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Types [clean/issues] | VERDICT`

- [ ] F3. **UI Verification** — `unspecified-high` + `playwright`
  Navigate all pages, verify real data loads, verify no hardcoded values visible.
  Output: `Pages [N/N working] | Data [real] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  Verify no new features added, no API routes created, no hooks modified.
  Output: `Scope [compliant] | New Code [none] | VERDICT`

---

## Commit Strategy

| After Task | Message | Files |
|------------|---------|-------|
| 3 | `chore: remove tags UI, add public status page` | monitors/page.tsx, status/page.tsx |
| 7 | `feat(dashboard): integrate TanStack Query hooks` | All dashboard pages |
| 9 | `feat(charts): integrate real health check data` | Chart components |
| 12 | `chore: cleanup after DFL integration` | Any remaining |

---

## Success Criteria

### Verification Commands
```bash
# Build succeeds
bun run build
# Expected: Build completed successfully

# Lint passes
bun run lint
# Expected: No errors

# Type check
bunx tsc --noEmit
# Expected: No errors
```

### Final Checklist
- [ ] All 6 dashboard pages use TanStack hooks
- [ ] Tags UI completely removed
- [ ] Public status page created at `/status`
- [ ] Charts use real health check data
- [ ] Loading states on all pages
- [ ] Empty states handled
- [ ] Build and lint pass
- [ ] No TypeScript errors
- [ ] No hardcoded mock data remaining



