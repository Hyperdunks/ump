# Remaining Tasks & Issues

> **Status**: Active Development Tracking
> **Last Updated**: 2026-02-21
> **Inspiration**: [openstatus.dev](https://github.com/openstatusHQ/openstatus) (~75% UI inspiration)

---

## UI Philosophy

> "We need information more from monitors, so we show more info and less toggles."

- Dashboard/Overview should show: monitors count, status pages, incidents, alerts (whatever backend provides)
- Quick overview of monitors should be prominent
- Remove non-implemented features (Reports, Maintenance) from dashboard
- Show maximum information that backend provides

---

## 📋 Task Categories Overview

| Priority | Category | Estimated Tasks | Status |
|----------|----------|-----------------|--------|
| **P0** | Dashboard Overview Cleanup | 3 | 🔴 Not Started |
| **P0** | Sidebar Navigation Fixes | 4 | 🔴 Not Started |
| **P1** | Monitors Page Improvements | 5 | 🔴 Not Started |
| **P1** | Settings Consolidation | 4 | 🔴 Not Started |
| **P2** | Public Status Pages Enhancement | 3 | 🔴 Not Started |
| **P3** | Admin Panel | 5 | ⏸️ Deferred |

---

## ✅ P0: Dashboard Overview Cleanup (COMPLETED 2026-02-21)

**Problem**: Dashboard showed hardcoded stubs for unimplemented features (Reports, Maintenance).

### Tasks

- [x] **D1. Remove Reports Section**
  - Location: `src/app/dashboard/page.tsx`
  - Removed from `sections` array

- [x] **D2. Remove Maintenance Section**
  - Location: `src/app/dashboard/page.tsx`
  - Removed from `sections` array

- [x] **D3. Remove Stub Summary Cards**
  - Removed "Status Pages" card (hardcoded "0")
  - Removed "Last Report" card (hardcoded "None")
  - Removed "Last Maintenance" card (hardcoded "None")
  - Kept: Monitors count, Recent Incidents count

**Acceptance Criteria**:
- [x] Dashboard only shows implemented features
- [x] No "Reports" or "Maintenance" sections visible
- [x] Summary cards reflect real data only

**Commit**: `aed7ebc refactor(dashboard): remove unimplemented Reports and Maintenance sections`

---

## 🔴 P0: Sidebar Navigation Fixes

**Problem**: Sidebar has missing navigation items and broken functionality.

### Tasks

- [ ] **S1. Add Incidents Navigation Item**
  - Location: `src/components/app-sidebar.tsx` lines 22-27
  - The `/dashboard/incidents/[id]` route exists but is NOT accessible from sidebar
  - Add to `navItems` array:
    ```tsx
    { href: "/dashboard/incidents", label: "Incidents", icon: AlertTriangle }
    ```
  - Move Monitors above Status Pages in order

- [ ] **S2. Fix Monitors "+" Button**
  - Location: `src/components/app-sidebar.tsx` lines 106-108
  - Current code has NO click handler:
    ```tsx
    <Button variant="ghost" size="icon-sm" className="size-6">
      <Plus className="size-3" />
    </Button>
    ```
  - Fix: Add click handler to open CreateMonitorModal or navigate to create page

- [ ] **S3. Fix or Remove Status Pages "+" Button**
  - Location: `src/components/app-sidebar.tsx` lines 91-93
  - Same issue as Monitors - no click handler
  - Option A: Link to public status pages
  - Option B: Remove the button entirely

- [ ] **S4. Fix Status Pages Navigation Link**
  - Location: `src/components/app-sidebar.tsx` line 25
  - Links to `/dashboard/status-pages` which does NOT exist
  - Option A: Create a dashboard status-pages management page
  - Option B: Change link to `/status` (public status pages)
  - Option C: Remove from navigation entirely

**Acceptance Criteria**:
- [ ] Incidents accessible from sidebar
- [ ] "+" buttons functional (open modals or navigate)
- [ ] All navigation links point to existing pages
- [ ] Monitors appears before Status Pages

---

## 🟡 P1: Monitors Page Improvements

**Problem**: Multiple display issues and missing functionality on monitors pages.

### Tasks

- [ ] **M1. Fix "Last Checked" Column in List**
  - Location: `src/app/dashboard/monitors/page.tsx` lines 142, 301, 337
  - Shows "—" for ALL monitors (hardcoded)
  - Root cause: `GET /monitors` API doesn't return `latestCheck`
  - Options:
    - A: Modify API to include latestCheck per monitor
    - B: Remove the column entirely
    - C: Fetch latest checks separately (N+1 issue, not recommended)

- [ ] **M2. Decide on P50/P75/P90/P95/P99 Metrics**
  - Location: `src/app/dashboard/monitors/page.tsx` lines 143-145, 302-304, 338-340
  - Table columns show "—" (hardcoded)
  - Detail page cards also show "—" (lines 150-156 in `[id]/page.tsx`)
  - **Decision needed**:
    - Option A: Calculate percentiles in backend API (recommended for performance)
    - Option B: Remove P50/P75/P90/P95/P99 from UI entirely
    - Option C: Calculate client-side from check data (current chart approach)
  - **Note**: Latency chart already calculates P50/P99 client-side from `useMonitorChecks`

- [ ] **M3. Add Breadcrumb Dropdown for Alerts**
  - Location: `src/app/dashboard/monitors/[id]/page.tsx`
  - Add dropdown in breadcrumb to access:
    - Incidents for this monitor
    - Alerts configuration
    - Health checks history
  - Reference pattern provided in original file

- [ ] **M4. Reorder Sections on Monitor Detail Page**
  - Location: `src/app/dashboard/monitors/[id]/page.tsx`
  - Current order: Stats → Latency → Alerts → Charts
  - Desired order: Stats → Uptime Chart → Latency Chart → Alerts
  - Move alerts section to bottom

- [ ] **M5. Verify Uptime Chart Works Correctly**
  - Location: `src/components/monitors/uptime-chart.tsx`
  - Uses `useMonitorChecks` hook correctly
  - Check if "green" display issue is real or data-dependent
  - Verify bucket calculations are correct

**Acceptance Criteria**:
- [ ] "Last Checked" shows real data OR column removed
- [ ] Percentile metrics decision made and implemented
- [ ] Breadcrumb provides quick access to alerts/incidents
- [ ] Alerts section at bottom of page
- [ ] Uptime chart displays correctly

---

## 🟡 P1: Settings Consolidation

**Problem**: Settings are scattered across multiple routes with overlapping functionality.

### Current Architecture

| Route | Purpose | Status |
|-------|---------|--------|
| `/account` | Profile (name, email) | Custom UI |
| `/account/settings` | Security (password, sessions) | better-auth UI |
| `/dashboard/settings` | Workspace/Team | **STUB** - no backend |
| Per-monitor | Alert integrations | Works |

### Tasks

- [ ] **SET1. Create Unified Settings Page**
  - Consolidate into `/dashboard/settings` with tabs:
    - **Account**: Avatar, Name, Email (from `/account`)
    - **Security**: Password, Sessions (from better-auth)
    - **Integrations**: Discord, Slack, Webhook (NEW)
  - Remove `/account` and `/account/settings` routes (redirect to `/dashboard/settings`)

- [ ] **SET2. Remove Workspace/Team Stub Sections**
  - Remove "Workspace name" section (no backend)
  - Remove "Team members" section (no backend)
  - Remove "Pro Plan Upgrade" button (no billing)

- [ ] **SET3. Add Integrations Tab**
  - Create centralized integration management
  - Allow configuring default Discord/Slack/Webhook endpoints
  - Show connected services status
  - Reuse channel configuration from alert modals

- [ ] **SET4. Add Email Verification Prompt**
  - Non-verified users should see verification prompt first
  - Use better-auth's email verification flow

**Acceptance Criteria**:
- [ ] Single settings page at `/dashboard/settings`
- [ ] Tab navigation: Account, Security, Integrations
- [ ] No stub sections (workspace, team, pro plan)
- [ ] Email verification prompt for unverified users
- [ ] Old routes redirect to new location

---

## 🟢 P2: Public Status Pages Enhancement

**Problem**: Limited functionality for public status page discovery and sharing.

### Tasks

- [ ] **PUB1. Add Monitor Lookup on `/status`**
  - Current: Shows hardcoded public monitors
  - Enhancement: Add input field for monitorId or URL
  - If monitorId entered: Check if public, show status
  - If URL entered: Show info (optional, lower priority)

- [ ] **PUB2. Add Share Functionality**
  - Location: Monitor detail page (`/dashboard/monitors/[id]`)
  - Add "Share" button when `isPublic === true`
  - Show public URL: `/status/{monitorId}`
  - Copy-to-clipboard functionality
  - Add Open Graph metadata for social sharing

- [ ] **PUB3. Fix Hardcoded Domain References**
  - Location: `src/emails/reset-password.tsx`, `src/emails/verify-email.tsx`
  - Replace hardcoded "harzh.xyz" with `NEXT_PUBLIC_APP_URL` environment variable
  - Ensure email templates use configurable URLs

**Acceptance Criteria**:
- [ ] Users can look up public monitors by ID
- [ ] Share button shows public URL for public monitors
- [ ] Email templates use environment variables for URLs

---

## 🐛 Bugs

### BUG1: Sonner Toast Mono Font
- **Location**: Toast/sonner component
- **Issue**: Toast notifications don't use monospace font
- **Fix**: Add mono font class to Sonner Toaster component

### BUG2: Responsive Sidebar Length
- **Issue**: Sidebar in responsive mode is too long, userButton doesn't take correct space
- **Location**: `src/components/app-sidebar.tsx` responsive behavior
- **Fix**: Adjust sidebar height in mobile/offcanvas mode

---

## ⏸️ P3: Admin Panel (Deferred)

**Status**: Backend 100% ready, UI 0% - Low priority internal tool

### When Ready to Implement

| Component | Effort | Files to Create |
|-----------|--------|-----------------|
| Admin dashboard layout | Medium | `src/app/dashboard/admin/layout.tsx` |
| Monitors management table | Low | `src/app/dashboard/admin/monitors/page.tsx` |
| Users management table | Low | `src/app/dashboard/admin/users/page.tsx` |
| Role assignment | Low | Component in users page |
| System stats | Low | Dashboard cards |

**Hooks Ready**: `useAdminMonitors`, `useAdminUsers`, `useAdminStats`, `useUpdateUserRole`

---

## 📊 Summary

### What's Complete (From Previous Plans)
- ✅ DFL Data Fetching - All pages use TanStack Query
- ✅ DFL Cleanup - Auth fixes, N+1 query fix, settings nav
- ✅ Monitor CRUD - Create/Edit/Delete modals working
- ✅ Alert System - Full CRUD for alerts
- ✅ Incident Management - State transitions, detail page

### What's Remaining
- 🔴 Dashboard cleanup (remove stubs)
- 🔴 Sidebar navigation fixes
- 🟡 Monitors page improvements
- 🟡 Settings consolidation
- 🟢 Public status enhancements
- ⏸️ Admin panel (deferred)

---

*Document reorganized by Prometheus - 2026-02-21*
