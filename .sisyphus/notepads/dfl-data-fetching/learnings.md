# Learnings - Data Fetching Layer

## Task 03: API Response Shapes Analysis (2026-02-19)

### Key Findings

1. **API Response Structure**
   - All list endpoints return `{ data: T[], pagination?: {...} }`
   - Single item endpoints return the item directly with optional related data
   - Consistent use of snake_case in DB, camelCase in API responses

2. **Monitor Status vs isActive**
   - API uses `isActive: boolean` for monitor state
   - Pages expect `status: "active" | "inactive"` string
   - Transformation required: `isActive ? "active" : "inactive"`

3. **Health Check Status Enum**
   - API: `"up" | "down" | "degraded"`
   - This maps to page status cards: Normal (up), Failing (down), Degraded

4. **Uptime Stats Available**
   - `GET /monitors/:id/uptime` returns comprehensive stats for 24h, 7d, 30d
   - Includes: uptimePercent, totalChecks, upChecks, downChecks, degradedChecks, avgResponseTime
   - Missing: Percentile calculations (P50, P75, P90, P95, P99)

5. **Missing Data for Pages**
   - Tags field not in Monitor schema
   - Percentile stats not calculated by any endpoint
   - Aggregation endpoints for dashboard summary don't exist

### Transformation Functions Needed

```typescript
// Boolean to status string
const mapIsActiveToStatus = (isActive: boolean): "active" | "inactive" => 
  isActive ? "active" : "inactive";

// Date to relative time
const formatRelativeTime = (date: Date): string => {
  // Use date-fns formatDistanceToNow
};

// Number to percentage string
const formatPercent = (value: number): string => 
  `${value.toFixed(2)}%`;
```

### Hook Usage Patterns

```typescript
// Monitors list page
const { data } = useMonitors({ page: 1, limit: 20 });
// data.data: Monitor[]
// data.pagination: { page, limit, total, totalPages }

// Monitor detail page
const monitor = useMonitor(id);
// monitor.data: Monitor & { latestCheck?, activeIncident? }

const uptime = useMonitorUptime(id);
// uptime.data: { monitorId, monitorName, "24h": UptimeStats, ... }
```

## Task 04: Dashboard Overview Integration (2026-02-19)

### Implementation Summary

1. **Hook Integration Pattern**
   - Import hooks from `@/hooks/api` barrel export
   - Use destructuring for data and loading state: `const { data, isLoading } = useMonitors()`
   - Combine loading states: `const isLoading = monitorsLoading || incidentsLoading`

2. **Data Access Pattern**
   - Monitors count: `monitorsData?.pagination?.total?.toString() ?? "0"`
   - Incidents count: `incidentsData?.data?.length?.toString() ?? "0"`
   - Use optional chaining and nullish coalescing for safety

3. **Loading State Pattern**
   - Show Skeleton component while loading
   - Use consistent skeleton sizing: `<Skeleton className="h-6 w-12" />`
   - Skeleton replaces the value, not the entire card

4. **Client Component Requirement**
   - Pages using hooks must have `"use client"` directive at top
   - This is required for TanStack Query hooks to work

5. **Out of Scope Items**
   - Status Pages, Reports, Maintenance remain as empty states
   - These require additional API endpoints not yet implemented

## Task: Notifications Page Integration (2026-02-19)

### Implementation Summary

1. **Incident to Notification Mapping**
   - `useIncidents()` returns `{ data: Incident[] }` where each incident has `monitorName` joined from monitor table
   - Map incident state to notification type:
     - `detected` → `error` (red XCircle icon)
     - `investigating` → `warning` (yellow AlertTriangle icon)
     - `resolved` → `success` (green CheckCircle2 icon)

2. **Local State Pattern for Read/Archived**
   - Use `useState<Record<string, { read: boolean; archived: boolean }>>({})` for local UI state
   - Default values based on incident state: resolved incidents are read/archived by default
   - This allows local UI changes without mutating server data

3. **Relative Time Formatting**
   - Simple inline function for relative time: minutes, hours, days ago
   - No external library needed for basic use case

4. **Loading State with Skeleton**
   - Full page skeleton while loading
   - Mimics the layout structure: header, tabs, notification items

5. **useMemo for Derived Data**
   - Use `useMemo` to transform incidents to notifications
  - Dependencies: `incidentsData` and `localState`
  - Prevents unnecessary recalculations

## Task: Monitors List Page Integration (2026-02-19)

### Implementation Summary

1. **Status Cards from Real Data**
   - Compute status counts from `data.data` array
   - Use `isActive` field: inactive monitors counted separately
   - Active monitors shown as "normal" (list endpoint lacks `latestCheck` data)
   - Degraded/Failing counts require individual monitor fetches (not implemented)

2. **Pagination with Real Data**
   - Use `pagination.total` and `pagination.totalPages` from API
   - Client-side page state with `useState(1)`
   - Smart pagination display: show first, last, current, and adjacent pages
   - Disable prev/next buttons at boundaries

3. **Loading State Pattern**
   - Full page skeleton while loading
   - Use static array keys for skeleton items: `["a", "b", "c", "d", "e"].map((id) => ...)`
   - Avoids biome's `noArrayIndexKey` lint rule

4. **Empty State Handling**
   - Check `monitors.length === 0` for no monitors at all
   - Check `filtered.length === 0` for search with no results
   - Different messages for each case

5. **Error State**
   - Simple error message with retry suggestion
   - Keep header visible for context

6. **Known Limitation**
   - List endpoint doesn't include `latestCheck` or `activeIncident`
   - P50/P90/P95 percentiles not available from API
   - These show as "—" until backend provides the data

## Task: Monitor Detail Page Integration (2026-02-19)

### Implementation Summary

1. **URL Params with useParams**
   - Use `useParams()` from `next/navigation` to get monitor ID
   - Cast to string: `const monitorId = params.id as string`
   - Hooks use this ID with `enabled: !!id` for safety

2. **Multiple Hooks in Parallel**
   - `useMonitor(monitorId)` for monitor details + latestCheck + activeIncident
   - `useMonitorUptime(monitorId)` for 24h/7d/30d stats
   - Combine loading states: `const isLoading = isLoadingMonitor || isLoadingUptime`

3. **Stat Cards from Uptime Data**
   - Access 24h stats: `uptimeData?.["24h"]`
   - UPTIME: `formatPercent(stats24h?.uptimePercent)`
   - DEGRADED: `stats24h?.degradedChecks?.toString()`
   - FAILING: `stats24h?.downChecks?.toString()`
   - REQUESTS: `stats24h?.totalChecks`
   - Sub-values calculated as percentage of total checks

4. **Last Checked from latestCheck**
   - Available on monitor detail: `monitorData?.latestCheck?.checkedAt`
   - Format with relative time function

5. **Error State (404)**
   - Check `monitorError` from hook
   - Show friendly message with link back to monitors list
   - Use inline styled Link instead of Button with asChild (not supported)

6. **P50-P99 Percentiles**
   - NOT available from any API endpoint
   - Show "—" placeholder with comment explaining why
   - Badge hidden when change is "—"

7. **Button Component Limitation**
   - Base UI Button doesn't support `asChild` prop
   - Use styled Link directly for navigation buttons

## Task: Uptime Chart Integration (2026-02-19)

### Implementation Summary

1. **Component Props Pattern**
   - Accept `monitorId` as prop: `{ monitorId }: { monitorId: string }`
   - Parent page already has `monitorId` from `useParams()`

2. **Hook Usage for Checks**
   - `useMonitorChecks(monitorId, { limit: 500 })` fetches health check history
   - Returns `{ data: { data: HealthCheck[] } }` structure
   - Access checks: `data?.data ?? []`

3. **Time Bucketing Algorithm**
   - Create 48 buckets for 24 hours (30-minute intervals)
   - Initialize all buckets with zero counts first
   - Then populate with actual check data
   - Use `Math.floor(timestamp / bucketMs) * bucketMs` for bucket alignment

4. **Status Counting**
   - HealthCheck.status: `"up" | "down" | "degraded"`
   - Map to chart: `up` → success, `down` → error, `degraded` → degraded
   - Increment counts in each bucket

5. **Loading State**
   - Show `<Skeleton className="h-48 w-full" />` while fetching
   - Matches chart container height

6. **Empty State Handling**
   - Empty checks array produces chart with all zeros
   - Chart still renders (no special empty state needed)

7. **Chart Data Transformation**
   - Sort buckets by time for correct x-axis order
   - Format time labels with `toLocaleTimeString()` for readability

## Task: Latency Chart Integration (2026-02-19)

### Implementation Summary

1. **Percentile Calculation**
   - Create helper function `calculatePercentile(values, percentile)`
   - Sort values and use index formula: `Math.ceil((percentile / 100) * length) - 1`
   - Handle edge case: return 0 for empty arrays

2. **Time Bucketing for Latency**
   - Use 30-minute buckets: `getBucketKey(date)` returns "HH:MM" format
   - Calculate: `Math.floor(minutes / 30) * 30` for bucket alignment
   - Collect response times into each bucket using `Map<string, number[]>`

3. **Data Filtering**
   - Filter out null responseTimes: `checks.filter((c) => c.responseTime !== null)`
   - Type assertion needed: `check.responseTime as number` after null check

4. **Chart Data Structure**
   - Transform Map entries to array: `{ time, p50, p99 }`
   - Sort by time string with `localeCompare()` for correct order
   - p50 = median (50th percentile), p99 = 99th percentile

5. **Loading and Empty States**
   - Loading: `<Skeleton className="h-64 w-full rounded-xl" />`
   - Empty: Centered message in bordered container matching chart height
   - Both maintain visual consistency with chart layout

6. **Hook Usage**
   - `useMonitorChecks(monitorId, { limit: 500 })` for sufficient data points
   - Higher limit needed for accurate percentile calculations

## Task 10: TypeScript Compilation Check (2026-02-19)

### Build Verification

1. **Build Command**
   - `bun run build` compiles successfully with Next.js 16.1.6 (Turbopack)
   - TypeScript compilation passes with no errors
   - All routes generate correctly (static and dynamic)

2. **Pre-existing Lint Issues**
   - Codebase has pre-existing lint issues (import ordering, a11y, non-null assertions)
   - These are NOT introduced by this plan's changes
   - Modified files compile and work correctly despite lint warnings

3. **Modified Files Verified**
   - All 7 modified files compile without TypeScript errors
   - No new `any` types or `@ts-ignore` comments introduced
   - Import paths resolve correctly with `@/` aliases

4. **Evidence File**
   - Created at `.sisyphus/evidence/task-10-build-success.txt`
   - Contains full build output and verification summary

## Task 11: Playwright QA - All Pages (2026-02-19)

### QA Testing Summary

1. **Pages Tested**
   - `/dashboard` - Overview page with real data
   - `/dashboard/monitors` - Monitors list with real data
   - `/dashboard/monitors/[id]` - Monitor detail with real data
   - `/dashboard/notifications` - Notifications from incidents
   - `/status` - Public status listing page
   - `/status/[id]` - Individual status page

2. **All Pages Verified Working**
   - No console errors on any page
   - Loading states appear correctly
   - Empty states work for new users
   - Real data displayed (no hardcoded values)
   - Tags removed from monitors page (as expected)
   - Public status pages work without authentication

3. **Evidence Created**
   - Screenshots saved to `.sisyphus/evidence/task-11-qa-screenshots/`
   - 6 screenshots captured:
     - `01-dashboard.png` - Overview with stats cards
     - `02-monitors.png` - Monitors list (no tags)
     - `03-monitor-detail.png` - Monitor detail with stats
     - `04-notifications.png` - Notifications page
     - `05-status-public.png` - Public status listing
     - `06-status-detail.png` - Individual monitor status

4. **Authentication for Testing**
   - Created test user via sign-up flow
   - Manually verified email in database: `UPDATE user SET email_verified = true`
   - Test monitors created with nanoid for proper ID generation

5. **Key Findings**
   - All pages render without errors
   - Data fetching hooks work correctly
   - Empty states show appropriate messages
   - Loading skeletons display during fetch
   - Public status pages accessible without login
