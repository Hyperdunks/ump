# DFL Cleanup & Final Fixes Plan

> **STATUS: ✅ COMPLETED** (2026-02-19)
> All 7 tasks verified and working correctly.

## TL;DR

> **Quick Summary**: Complete the remaining 5% of DFL work: fix account page auth, add DB performance index, fix N+1 query, polish latency chart, and resolve settings page consolidation.
> 
> **Deliverables**:
> - Account page using real session data
> - Database index on `monitor.isPublic`
> - Fixed N+1 query in status page
> - Cleaned up latency chart legend
> - Consolidated settings to `/account/settings`
> - Verified public status pages work without auth
> 
> **Estimated Effort**: Small
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Auth routing check → Account page → DB index → N+1 fix

---

## Context

### Original DFL Plan Status
The DFL (Data Fetching Layer) implementation is **95% complete**:
- ✅ All dashboard pages use TanStack Query hooks
- ✅ Tags UI completely removed
- ✅ Public status pages created and working
- ✅ Charts using real health check data
- ✅ Build passing, no TypeScript errors

### Infrastructure Fixes Already Applied ✅
**Health Check Worker Timeout Fix** (Completed outside plan):
- Fixed: `mon.timeout * 1000` → `mon.timeout` (now correctly uses milliseconds)
- Fixed: Error message shows "ms" instead of "s"
- Impact: Timeout: 30000 now correctly = 30 seconds (was 30,000 seconds!)
- Status: ✅ Applied to `src/lib/workers/health-check-worker.ts`

**Database Index Added** (Completed):
- ✅ `monitor_isPublic_idx` added to schema
- ✅ Migration generated and applied

### Remaining Work Identified
1. **Account page** has hardcoded user data with TODO comment
2. **Performance**: N+1 query in status page (index added, query fix pending)
3. **UI Polish**: Latency chart has misleading legend
4. **Settings consolidation**: Two settings pages need cleanup
5. **Auth routing**: Public status pages may have auth issues

### Metis Review Insights
**Critical gaps identified**:
- Auth routing issue affects public functionality - needs immediate attention
- Settings workspace/team feature is new feature work, not cleanup
- Latency chart legend fix is cosmetic only (backend doesn't have timing breakdowns)
- Performance fixes should include benchmarks

**Scope decisions needed**:
- Consolidate settings to single location (recommend `/account/settings`)
- Fix latency chart by removing misleading legend (not adding breakdowns)
- Keep workspace settings as minimal UI (no backend implementation)

---

## Work Objectives

### Core Objective
Fix remaining DFL cleanup items: auth integration, performance optimizations, UI polish, and settings consolidation.

### Concrete Deliverables
1. `src/app/account/page.tsx` - Uses `useSession()` hook, no hardcoded data
2. `src/db/schema.ts` - Index added on `monitor.isPublic` field
3. `src/app/status/page.tsx` - Fixed N+1 query with batched query
4. `src/components/monitors/latency-chart.tsx` - Cleaned up misleading legend
5. `src/app/dashboard/settings/page.tsx` - Consolidated/reduced scope
6. Verified `/status/*` routes work without authentication

### Definition of Done
- [x] Account page displays real user data from session
- [x] DB migration created and applied for isPublic index
- [x] Status page uses single query instead of N+1 loop
- [x] Latency chart legend removed or fixed
- [x] Settings navigation simplified
- [x] Public status pages accessible without login
- [x] All pages compile without errors (`bun run build` passes)
- [x] Lint passes (`bun run lint`)

### Must Have
- Use existing `useSession()` from `@/lib/auth-client`
- Follow existing patterns from `dashboard/settings/page.tsx`
- Preserve all existing functionality
- Database changes must include migration
- Test public routes in incognito mode

### Must NOT Have (Guardrails)
- **NO new backend features** (team management, workspace switching)
- **NO timing breakdown visualization** (backend doesn't have this data)
- **NO middleware.ts changes** unless absolutely necessary
- **NO breaking changes** to existing routes
- **NO changes to auth configuration** (keep better-auth setup as-is)

---

## Verification Strategy

### Test Infrastructure
- **Bun test runner**: Available for unit tests if needed
- **Manual verification**: Primary method
- **Build check**: `bun run build` must pass
- **Lint check**: `bun run lint` must pass
- **Format**: `bun run format` applied

### QA Policy
Every task includes agent-executed verification scenarios.

| Deliverable | Verification Tool | Method |
|-------------|-------------------|--------|
| Account page | Playwright | Verify real user data displays |
| DB index | Bash | Verify migration runs, index exists |
| N+1 fix | Bash/logs | Check query count in logs |
| Latency chart | Playwright | Verify legend removed |
| Settings | Playwright | Verify navigation simplified |
| Public status | Playwright (incognito) | Verify no auth required |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - Auth & Account):
├── Task 1: Verify public status pages auth behavior [quick]
├── Task 2: Fix account page with useSession() [quick]
└── Task 3: Consolidate settings navigation [quick]

Wave 2 (After Wave 1 - Performance & Polish):
├── Task 5: Fix N+1 query in status page [unspecified-high]
└── Task 6: Clean up latency chart legend [quick]

Wave 3 (After Wave 2 - Final Verification):
└── Task 7: Final build, lint, format verification [quick]

Note: Task 4 (DB index) already completed ✅

Critical Path: Task 1 → Task 2 → Task 5 → Task 7
Parallel Speedup: ~40% faster than sequential
Max Concurrent: 3 (Wave 1)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave | Status |
|------|------------|--------|------|--------|
| 1 | — | 2 | 1 | ⏳ Pending |
| 2 | 1 | 7 | 1 | ⏳ Pending |
| 3 | — | 7 | 1 | ⏳ Pending |
| 4 | — | — | — | ✅ **COMPLETED** |
| 5 | — | 7 | 2 | ⏳ Pending |
| 6 | — | 7 | 2 | ⏳ Pending |
| 7 | 2,3,5,6 | — | 3 | ⏳ Pending |

---

## TODOs

- [x] 1. Verify Public Status Pages Auth Behavior

  **What to do**:
  - Test `/status` and `/status/[monitorId]` routes in incognito/private browser
  - Verify they load without requiring login
  - Check for any redirect loops or auth errors
  - If issues found, investigate:
    - Check for any auth wrappers in layout hierarchy
    - Verify no middleware intercepting requests
    - Check browser network tab for auth redirects
  - Document findings

  **Must NOT do**:
  - Don't create middleware.ts unless absolutely necessary
  - Don't modify auth configuration
  - Don't add auth checks to status pages

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright`]
  - Reason: Simple navigation and verification task

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 2
  - **Blocked By**: None

  **References**:
  - `src/app/status/page.tsx` - Server component (should be public)
  - `src/app/status/[monitorId]/page.tsx` - Server component (should be public)
  - `src/app/dashboard/layout.tsx` - Has auth wrappers (but shouldn't affect /status)

  **Acceptance Criteria**:
  - [ ] `/status` loads without auth in incognito
  - [ ] `/status/[valid-monitor-id]` loads without auth
  - [ ] No redirect to `/sign-in` observed
  - [ ] Findings documented in evidence

  **QA Scenarios**:
  ```
  Scenario: Public status page accessible without auth
    Tool: Playwright
    Steps:
      1. Open incognito browser
      2. Navigate to http://localhost:3000/status
      3. Verify page loads (200 status, not redirect)
      4. Check for login prompts or auth errors
    Expected Result: Page loads showing public monitors or empty state
    Evidence: .sisyphus/evidence/task-01-public-status.png
  ```

  **Commit**: NO (groups with task 2-3)

---

- [x] 2. Fix Account Page with useSession()

  **What to do**:
  - Replace hardcoded user object in `src/app/account/page.tsx` (lines 19-24)
  - Import `useSession` from `@/lib/auth-client`
  - Use pattern from `src/app/dashboard/settings/page.tsx` (lines 24, 36-39)
  - Add loading state while session loads (Skeleton)
  - Handle case where user is not logged in (redirect to sign-in)
  - Remove TODO comment on line 19

  **Code changes**:
  ```typescript
  // BEFORE:
  // TODO: Replace with better-auth session data
  const user = {
    name: "Harsh Patel",
    email: "harsh@example.com",
    initials: "HP",
  };

  // AFTER:
  const { data: session, isPending } = useSession();
  const user = session?.user;
  
  if (isPending) return <AccountSkeleton />;
  if (!user) return redirect("/sign-in");
  ```

  **Must NOT do**:
  - Don't change the UI structure or styling
  - Don't add new features (image upload, etc - keep simple)
  - Don't use `useUser()` hook from hooks/api (use better-auth's useSession)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Simple hook replacement, existing pattern to follow

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 7
  - **Blocked By**: Task 1 (verify auth works first)

  **References**:
  - `src/app/dashboard/settings/page.tsx:24,36-39` - Pattern to copy
  - `src/lib/auth-client.ts:7` - useSession export
  - `src/app/account/settings/page.tsx` - Uses AccountSettingsCards (keep separate)

  **Acceptance Criteria**:
  - [ ] Account page uses `useSession()` hook
  - [ ] Real user name, email, initials displayed
  - [ ] Loading skeleton shown while loading
  - [ ] Redirects to /sign-in if not logged in
  - [ ] TODO comment removed
  - [ ] Page compiles without errors

  **QA Scenarios**:
  ```
  Scenario: Account page shows real user data
    Tool: Playwright
    Steps:
      1. Log in as test user
      2. Navigate to /account
      3. Verify name and email match logged-in user
      4. Verify initials calculated from name
    Expected Result: Real user data displayed
    Evidence: .sisyphus/evidence/task-02-account-page.png

  Scenario: Account page loading state
    Tool: Playwright
    Steps:
      1. Hard refresh /account page
      2. Observe loading state before data appears
    Expected Result: Skeleton shown while loading
    Evidence: .sisyphus/evidence/task-02-loading-state.png
  ```

  **Commit**: YES
  - Message: `fix(account): use real session data from better-auth`
  - Files: `src/app/account/page.tsx`
  - Pre-commit: `bun run format`

---

- [x] 3. Consolidate Settings Navigation

  **What to do**:
  - Simplify settings options to reduce confusion
  - Update dashboard sidebar navigation
  - Options:
    
    **Option A (Recommended)**: Remove `/dashboard/settings` link from sidebar, keep only Account settings
    - User navigates to settings via UserButton dropdown → Settings
    - Simpler, clearer separation
    
    **Option B**: Keep both but rename for clarity
    - `/dashboard/settings` → "Workspace Settings"
    - `/account/settings` → "Account Settings"
  
  - Implement Option A: Remove settings link from sidebar
  - Keep `/dashboard/settings` page accessible by direct URL (don't delete)
  - The UserButton component from @daveyplate/better-auth-ui already has settings link

  **Must NOT do**:
  - Don't delete `/dashboard/settings` page entirely
  - Don't implement workspace backend features
  - Don't add team management functionality

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Simple navigation change

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 7
  - **Blocked By**: None

  **References**:
  - `src/components/app-sidebar.tsx:30-36` - Navigation items array
  - `src/components/app-sidebar.tsx:138` - UserButton with settings

  **Acceptance Criteria**:
  - [ ] Settings link removed from dashboard sidebar
  - [ ] User can still access settings via UserButton → Settings
  - [ ] `/dashboard/settings` still accessible by direct URL
  - [ ] Navigation feels cleaner

  **QA Scenarios**:
  ```
  Scenario: Settings accessible via UserButton
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard
      2. Click UserButton in sidebar
      3. Click Settings option
      4. Verify navigates to /account/settings
    Expected Result: Settings accessible via UserButton dropdown
    Evidence: .sisyphus/evidence/task-03-settings-nav.png
  ```

  **Commit**: NO (groups with task 2)

---

- [x] 4. Add isPublic Database Index ✅ COMPLETED

  **Status**: Already completed outside plan execution

  **What was done**:
  - ✅ Index added to `src/db/schema.ts` line 158: `index("monitor_isPublic_idx").on(table.isPublic)`
  - ✅ Migration generated and applied
  - ✅ Index visible in database schema

  **Schema** (verified):
  ```typescript
  (table) => [
    index("monitor_userId_idx").on(table.userId),
    index("monitor_isActive_idx").on(table.isActive),
    index("monitor_isPublic_idx").on(table.isPublic), // ✅ ADDED
  ],
  ```

  **Impact**: Improves query performance for public status page

---

- [x] 5. Fix N+1 Query in Status Page

  **What to do**:
  - Refactor `getLatestCheckForMonitors` in `src/app/status/page.tsx`
  - Current: Loops through monitors, queries each individually (N+1 problem)
  - Fix: Use single query with `IN` clause or window function
  
  **Current code (lines 16-36)**:
  ```typescript
  async function getLatestCheckForMonitors(monitorIds: string[]) {
    if (monitorIds.length === 0) return new Map();
    const latestChecks = new Map();
    for (const monId of monitorIds) {  // N+1 LOOP
      const [check] = await db.select()...
        .where(eq(healthCheck.monitorId, monId))
        ...
    }
    return latestChecks;
  }
  ```

  **Better approach**:
  ```typescript
  async function getLatestCheckForMonitors(monitorIds: string[]) {
    if (monitorIds.length === 0) return new Map();
    
    // Single query using window function or subquery
    const checks = await db
      .select({
        ...healthCheck,
        rowNumber: sql`ROW_NUMBER() OVER (PARTITION BY ${healthCheck.monitorId} ORDER BY ${healthCheck.checkedAt} DESC)`.as('row_number')
      })
      .from(healthCheck)
      .where(and(
        inArray(healthCheck.monitorId, monitorIds),
        sql`ROW_NUMBER() OVER (PARTITION BY ${healthCheck.monitorId} ORDER BY ${healthCheck.checkedAt} DESC) = 1`
      ));
    
    // Or use raw SQL with a subquery approach
    
    return new Map(checks.map(c => [c.monitorId, c]));
  }
  ```

  **Alternative simpler approach**:
  ```typescript
  // Get all recent checks for all monitors, then process in memory
  const checks = await db
    .select()
    .from(healthCheck)
    .where(inArray(healthCheck.monitorId, monitorIds))
    .orderBy(desc(healthCheck.checkedAt));
  
  // Take first check for each monitor
  const latestByMonitor = new Map();
  for (const check of checks) {
    if (!latestByMonitor.has(check.monitorId)) {
      latestByMonitor.set(check.monitorId, check);
    }
  }
  ```

  **Must NOT do**:
  - Don't change the function signature (keep same input/output)
  - Don't break the page rendering
  - Test with multiple public monitors

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - Reason: Database query optimization, needs careful testing

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 7
  - **Blocked By**: None (Task 4 already completed)

  **References**:
  - `src/app/status/page.tsx:16-36` - Function to refactor
  - Drizzle ORM docs for `inArray` helper
  - Note: Drizzle has `inArray` in `drizzle-orm`

  **Acceptance Criteria**:
  - [ ] N+1 loop eliminated
  - [ ] Single (or constant number) of queries executed
  - [ ] Same output as before (Map of monitorId → latestCheck)
  - [ ] Page renders correctly with multiple monitors
  - [ ] Performance improved (fewer queries)

  **QA Scenarios**:
  ```
  Scenario: Status page loads with multiple monitors
    Tool: Playwright + browser devtools
    Steps:
      1. Create 5+ public monitors with checks
      2. Navigate to /status
      3. Open browser network tab
      4. Verify page loads with minimal DB queries
    Expected Result: Page loads, all monitors displayed with status
    Evidence: .sisyphus/evidence/task-05-status-performance.png
  ```

  **Commit**: YES
  - Message: `perf(status): fix N+1 query in public status page`
  - Files: `src/app/status/page.tsx`
  - Pre-commit: Test with multiple monitors

---

- [x] 6. Clean Up Latency Chart Legend

  **What to do**:
  - Remove misleading legend from `src/components/monitors/latency-chart.tsx` (lines 131-148)
  - The legend shows DNS/Connect/TLS/TTFB/Transfer but chart only displays P50/P99 percentiles
  - Two options:
    
    **Option A (Recommended)**: Remove legend entirely (simplest)
    
    **Option B**: Replace with P50/P99 legend items
    ```typescript
    <div className="flex items-center justify-center gap-4 text-xs font-medium">
      <span className="flex items-center gap-1 text-muted-foreground">
        <span className="size-2 rounded-sm bg-blue-500" /> P50 (Median)
      </span>
      <span className="flex items-center gap-1 text-muted-foreground">
        <span className="size-2 rounded-sm bg-amber-500" /> P99 (99th percentile)
      </span>
    </div>
    ```

  **Must NOT do**:
  - Don't try to implement timing breakdown visualization (backend doesn't have this data)
  - Don't add new chart data series
  - Don't change the chart itself, only the legend

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Simple UI cleanup

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: Task 7
  - **Blocked By**: None

  **References**:
  - `src/components/monitors/latency-chart.tsx:131-148` - Legend to fix
  - `src/components/monitors/latency-chart.tsx:26-35` - Chart config with colors

  **Acceptance Criteria**:
  - [ ] Misleading DNS/Connect/TLS/TTFB/Transfer legend removed
  - [ ] New legend shows P50/P99 (or no legend if Option A)
  - [ ] Chart still renders correctly

  **QA Scenarios**:
  ```
  Scenario: Latency chart legend fixed
    Tool: Playwright
    Steps:
      1. Navigate to monitor detail page
      2. Scroll to latency chart
      3. Verify legend shows P50/P99 (or is removed)
      4. Verify no DNS/Connect/TLS/TTFB/Transfer labels
    Expected Result: Clean legend matching chart data
    Evidence: .sisyphus/evidence/task-06-latency-legend.png
  ```

  **Commit**: NO (groups with task 7)

---

- [x] 7. Final Build, Lint, and Format Verification

  **What to do**:
  - Run `bun run build` - verify no TypeScript errors
  - Run `bun run lint` - check for any lint issues
  - Run `bun run format` - format all changed files
  - Verify all pages compile
  - Run manual smoke tests:
    - /account (with auth)
    - /status (without auth)
    - /dashboard/monitors/[id] (charts)

  **Must NOT do**:
  - Don't ignore build errors
  - Don't commit without formatting

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Verification task

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (last)
  - **Blocks**: None
  - **Blocked By**: Tasks 2, 3, 4, 5, 6

  **Acceptance Criteria**:
  - [ ] `bun run build` passes with no errors
  - [ ] `bun run lint` passes
  - [ ] `bun run format` applied
  - [ ] All modified pages smoke tested

  **QA Scenarios**:
  ```
  Scenario: Clean build
    Tool: Bash
    Steps:
      1. Run `bun run build`
      2. Run `bun run lint`
      3. Run `bun run format`
    Expected Result: All commands succeed
    Evidence: .sisyphus/evidence/task-07-build.txt
  ```

  **Commit**: YES
  - Message: `chore: final cleanup and formatting`
  - Files: Any remaining changes

---

## Final Verification Wave (MANDATORY)

- [x] F1. **Plan Compliance Audit** — `oracle`
  Verify all items completed:
  - Account page uses real session data
  - DB index on isPublic exists ✅ (already done)
  - N+1 query eliminated
  - Latency legend cleaned
  - Settings consolidated
  - Public status pages work without auth
  - Health check timeout uses milliseconds ✅ (already done)
  Output: `Items [7/7] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `bun run build` + `bun run lint` + `bun run format`
  Check for any TypeScript errors, unused imports, console.logs
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | VERDICT`

- [x] F3. **Auth & Security Check** — `unspecified-high`
  Test all auth-protected routes require login
  Test all public routes work without login
  Verify no sensitive data leaks in public pages
  Output: `Protected [N/N] | Public [N/N] | VERDICT`

- [x] F4. **Performance Verification** — `deep`
  Verify N+1 query fix reduced query count
  Verify DB index is being used (EXPLAIN ANALYZE)
  Check status page load time improved
  Output: `Queries [before/after] | Index [used] | VERDICT`

---

## Commit Strategy

| After Task | Message | Files |
|------------|---------|-------|
| 2 | `fix(account): use real session data from better-auth` | account/page.tsx |
| 4 | `perf(db): add index on monitor.isPublic field` | schema.ts, migrations/* |
| 5 | `perf(status): fix N+1 query in public status page` | status/page.tsx |
| 7 | `chore: final cleanup and formatting` | Any remaining |

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

# Format applied
bun run format
# Expected: Files formatted

# Account page works
curl http://localhost:3000/account
# Expected: Returns HTML (when authenticated)

# Public status works (no auth)
curl http://localhost:3000/status
# Expected: Returns HTML (200, not 302 redirect)
```

### Final Checklist
- [x] Account page displays real user data
- [x] DB migration created and applied ✅ (already done)
- [x] N+1 query eliminated
- [x] Latency chart legend cleaned
- [x] Settings navigation simplified
- [x] Public status pages accessible without auth
- [x] Health check worker uses correct milliseconds ✅ (already done)
- [x] Build passes
- [x] Lint passes
- [x] All smoke tests pass

---

## Notes

### Auth Pattern to Follow
From `src/app/dashboard/settings/page.tsx`:
```typescript
import { useSession } from "@/lib/auth-client";
// ...
const { data: session } = useSession();
const user = session?.user;
const displayName = user?.name || "User";
const displayEmail = user?.email || "user@example.com";
```

### Database Index Pattern
From `src/db/schema.ts` lines 155-158:
```typescript
(table) => [
  index("monitor_userId_idx").on(table.userId),
  index("monitor_isActive_idx").on(table.isActive),
  index("monitor_isPublic_idx").on(table.isPublic), // ADD THIS
],
```

### N+1 Fix Strategy
Use Drizzle's `inArray` helper:
```typescript
import { inArray } from "drizzle-orm";
// ...
.where(inArray(healthCheck.monitorId, monitorIds))
```

---

*Plan generated by Prometheus. Execute with `/start-work` command.*
