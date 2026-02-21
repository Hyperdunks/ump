# API Response Shapes Analysis

**Task**: Verify API Response Shapes  
**Date**: 2026-02-19  
**Status**: Complete

---

## 1. API Response Shapes

### 1.1 GET /monitors

**Endpoint**: `src/routes/monitors/route.ts` (lines 37-68)

```typescript
// Response Shape
{
  data: Monitor[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

**Monitor Type** (from `src/db/schema.ts`):
| Field | Type | Notes |
|-------|------|-------|
| id | string | Primary key (nanoid) |
| name | string | Required |
| url | string | Required |
| type | "http" \| "https" \| "tcp" \| "ping" | Default: "https" |
| method | "GET" \| "POST" \| "HEAD" | Default: "GET" |
| checkInterval | number | Seconds, default: 60 |
| timeout | number | Milliseconds, default: 30000 |
| expectedStatusCodes | string[] | Default: ["200"] |
| headers | Record<string, string> \| null | Optional |
| body | string \| null | Optional |
| isActive | boolean | Default: true |
| isPublic | boolean | Default: false |
| userId | string | Foreign key to user |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-updated |

---

### 1.2 GET /monitors/:id

**Endpoint**: `src/routes/monitors/route.ts` (lines 71-102)

```typescript
// Response Shape
{
  ...Monitor,
  latestCheck?: HealthCheck,
  activeIncident?: Incident
}
```

**HealthCheck Type** (from `src/db/schema.ts`):
| Field | Type | Notes |
|-------|------|-------|
| id | string | Primary key |
| monitorId | string | Foreign key |
| status | "up" \| "down" \| "degraded" | Required |
| statusCode | number \| null | HTTP status code |
| responseTime | number \| null | Milliseconds |
| error | string \| null | Error message if failed |
| checkedAt | Date | Timestamp |

**Incident Type** (from `src/db/schema.ts`):
| Field | Type | Notes |
|-------|------|-------|
| id | string | Primary key |
| monitorId | string | Foreign key |
| state | "detected" \| "investigating" \| "resolved" | Required |
| detectedAt | Date | When incident started |
| acknowledgedAt | Date \| null | When acknowledged |
| resolvedAt | Date \| null | When resolved |
| cause | string \| null | Root cause |
| postmortem | string \| null | Post-incident analysis |
| createdAt | Date | Auto-generated |
| updatedAt | Date | Auto-updated |

---

### 1.3 GET /monitors/:id/stats

**Endpoint**: `src/routes/monitors/route.ts` (lines 199-240)

```typescript
// Response Shape
{
  uptimePercent: number,    // e.g., 99.95
  totalChecks: number,      // Total checks in 24h
  avgResponseTime: number,  // Average response time in ms
  period: "24h"             // Always 24h for this endpoint
}
```

---

### 1.4 GET /monitors/:id/uptime

**Endpoint**: `src/routes/monitors/route.ts` (lines 241-260)

```typescript
// Response Shape
{
  monitorId: string,
  monitorName: string,
  "24h": UptimeStats,
  "7d": UptimeStats,
  "30d": UptimeStats
}
```

**UptimeStats Type** (from `src/lib/workers/uptime-service.ts`):
| Field | Type | Notes |
|-------|------|-------|
| uptimePercent | number | Percentage (0-100) |
| totalChecks | number | Total checks in period |
| upChecks | number | Successful checks |
| downChecks | number | Failed checks |
| degradedChecks | number | Degraded checks |
| avgResponseTime | number | Average response time in ms |
| period | string | "24h", "7d", or "30d" |

---

### 1.5 GET /monitors/:id/checks

**Endpoint**: `src/routes/monitors/route.ts` (lines 172-197)

```typescript
// Response Shape
{
  data: HealthCheck[]
}
```

---

## 2. Page Hardcoded Data Analysis

### 2.1 Dashboard Overview (`src/app/dashboard/page.tsx`)

**Hardcoded Data**:
```typescript
// Summary Cards (lines 12-18)
const summaryCards = [
  { label: "Monitors", value: "1", icon: Activity },
  { label: "Status Pages", value: "0", icon: FileText },
  { label: "Recent Incidents", value: "None", icon: AlertTriangle },
  { label: "Last Report", value: "None", icon: FileText },
  { label: "Last Maintenance", value: "None", icon: Wrench },
];
```

**Required API Data**:
| Card | Required Data | API Available? |
|------|---------------|----------------|
| Monitors | Count of monitors | YES - from GET /monitors pagination.total |
| Status Pages | Count of status pages | NO - endpoint doesn't exist |
| Recent Incidents | Count of recent incidents | NO - needs incidents endpoint |
| Last Report | Last report timestamp | NO - reports endpoint doesn't exist |
| Last Maintenance | Last maintenance timestamp | NO - maintenance endpoint doesn't exist |

---

### 2.2 Monitors List (`src/app/dashboard/monitors/page.tsx`)

**Hardcoded Data** (lines 65-78):
```typescript
const monitors = [
  {
    id: "clx1abc",
    name: "Harsh Website",
    url: "https://harsh.dev",
    status: "active" as const,
    tags: [] as string[],
    lastIncident: null,
    lastChecked: "2 min ago",
    p50: "120ms",
    p90: "240ms",
    p95: "310ms",
  },
];
```

**Field Mapping Table**:
| Page Field | API Field | Match? | Transformation Needed |
|------------|-----------|--------|----------------------|
| id | monitor.id | YES | None |
| name | monitor.name | YES | None |
| url | monitor.url | YES | None |
| status | monitor.isActive | NO | Boolean to "active"/"inactive" string |
| tags | N/A | MISSING | Tags not in schema - needs DB migration |
| lastIncident | activeIncident | PARTIAL | Object to formatted string or null |
| lastChecked | latestCheck.checkedAt | PARTIAL | Date to relative time string |
| p50 | N/A | MISSING | Percentile not calculated by API |
| p90 | N/A | MISSING | Percentile not calculated by API |
| p95 | N/A | MISSING | Percentile not calculated by API |

**Status Cards** (lines 37-62):
```typescript
const statusCards = [
  { label: "Normal", value: "1", color: "..." },    // Count of monitors with status "up"
  { label: "Degraded", value: "0", color: "..." },  // Count of monitors with status "degraded"
  { label: "Failing", value: "0", color: "..." },   // Count of monitors with status "down"
  { label: "Inactive", value: "0", color: "..." },  // Count of monitors with isActive=false
];
```

**Required API Data**:
| Card | Required Data | API Available? |
|------|---------------|----------------|
| Normal | Count of monitors with latestCheck.status="up" | NO - needs aggregation |
| Degraded | Count of monitors with latestCheck.status="degraded" | NO - needs aggregation |
| Failing | Count of monitors with latestCheck.status="down" | NO - needs aggregation |
| Inactive | Count of monitors with isActive=false | NO - needs aggregation |

---

### 2.3 Monitor Detail (`src/app/dashboard/monitors/[id]/page.tsx`)

**Hardcoded Data** (lines 22-25):
```typescript
const monitor = {
  name: "Harsh Website",
  url: "https://www.harzh.xyz/",
};
```

**Stat Cards** (lines 27-46):
```typescript
const statCards = [
  { label: "UPTIME", value: "100.00%", subValue: "0%", color: "green" },
  { label: "DEGRADED", value: "0", subValue: "0%", color: "yellow" },
  { label: "FAILING", value: "0", subValue: "0%", color: "red" },
];
```

**Latency Cards** (lines 48-54):
```typescript
const latencyCards = [
  { label: "P50", value: "46 ms", change: "2.1%" },
  { label: "P75", value: "61 ms", change: "4.7%" },
  { label: "P90", value: "72 ms", change: "12.2%" },
  { label: "P95", value: "94 ms", change: "11.3%" },
  { label: "P99", value: "287 ms", change: "12.8%" },
];
```

**Field Mapping Table**:
| Page Field | API Field | Match? | Transformation Needed |
|------------|-----------|--------|----------------------|
| name | monitor.name | YES | None |
| url | monitor.url | YES | None |
| UPTIME value | uptimeStats["24h"].uptimePercent | PARTIAL | Number to "100.00%" format |
| UPTIME subValue | N/A | MISSING | Downtime % not directly available |
| DEGRADED value | uptimeStats["24h"].degradedChecks | YES | Number to string |
| DEGRADED subValue | N/A | MISSING | Percentage calculation needed |
| FAILING value | uptimeStats["24h"].downChecks | YES | Number to string |
| FAILING subValue | N/A | MISSING | Percentage calculation needed |
| REQUESTS | uptimeStats["24h"].totalChecks | YES | Number to string |
| LAST CHECKED | latestCheck.checkedAt | PARTIAL | Date to relative time string |
| P50-P99 | N/A | MISSING | Percentiles not calculated by API |
| change | N/A | MISSING | Comparison with previous period |

---

## 3. Hook Return Types

**File**: `src/hooks/api/use-monitors.ts`

| Hook | Returns | API Endpoint |
|------|---------|--------------|
| useMonitors(params) | `{ data: Monitor[], pagination: {...} }` | GET /monitors |
| useMonitor(id) | `Monitor & { latestCheck?, activeIncident? }` | GET /monitors/:id |
| useMonitorChecks(id, params) | `{ data: HealthCheck[] }` | GET /monitors/:id/checks |
| useMonitorStats(id) | `{ uptimePercent, totalChecks, avgResponseTime, period }` | GET /monitors/:id/stats |
| useMonitorUptime(id) | `{ monitorId, monitorName, "24h": UptimeStats, "7d": UptimeStats, "30d": UptimeStats }` | GET /monitors/:id/uptime |

---

## 4. Summary of Mismatches

### Critical (Blocks Implementation)
| Issue | Page | Description |
|-------|------|-------------|
| Tags field missing | Monitors List | `tags` field not in Monitor schema - needs DB migration |
| Percentile stats missing | Monitors List, Detail | P50, P75, P90, P95, P99 not calculated by any API |
| Status aggregation missing | Monitors List | No endpoint for counts by status (Normal/Degraded/Failing/Inactive) |

### Transformations Required
| Field | Source | Target | Transformation |
|-------|--------|--------|----------------|
| status | isActive: boolean | "active" \| "inactive" | Boolean to string |
| lastChecked | latestCheck.checkedAt: Date | "2 min ago" | Relative time formatting |
| lastIncident | activeIncident: object \| undefined | string \| null | Format incident or null |
| uptimePercent | 99.95 | "99.95%" | Number to percentage string |

### Missing Endpoints
| Endpoint | Purpose | Used By |
|----------|---------|---------|
| GET /incidents | List incidents with filters | Dashboard Overview |
| GET /status-pages | List status pages | Dashboard Overview |
| GET /maintenance | List maintenance windows | Dashboard Overview |
| GET /reports | List reports | Dashboard Overview |
| GET /monitors/:id/percentiles | P50, P75, P90, P95, P99 stats | Monitor Detail |
| GET /monitors/summary | Aggregated status counts | Monitors List |

---

## 5. Recommendations

### For Wave 2 Implementation

1. **Add transformation layer** in hooks or components:
   - `formatRelativeTime(date: Date): string`
   - `mapIsActiveToStatus(isActive: boolean): "active" | "inactive"`
   - `formatPercentile(value: number): string`

2. **Extend API or add new endpoints**:
   - Add `GET /monitors/:id/percentiles` for latency percentiles
   - Add `GET /monitors/summary` for status card counts
   - Consider adding `tags` field to Monitor schema

3. **Use existing data where possible**:
   - `useMonitorUptime(id)` provides most stats for detail page
   - `useMonitors()` with pagination provides list data
   - `useMonitor(id)` provides latestCheck and activeIncident

4. **Client-side calculations**:
   - Calculate status counts from monitors list data
   - Format dates on client side with libraries like `date-fns`
