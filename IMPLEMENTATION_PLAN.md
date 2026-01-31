Implementation Plan - Sentinel Uptime Monitoring Platform
Last Updated: 2026-01-31

NOTE

This document serves as the master reference for continuing development on Sentinel. It captures the current state of the codebase and outlines all remaining work.

Project Overview
Sentinel is an uptime monitoring platform built with:

Frontend: Next.js 16 (App Router), React 19, TailwindCSS v4, Shadcn UI
Backend: Elysia.js API routes
Database: PostgreSQL with Drizzle ORM
Auth: Better-Auth (email/password + Google OAuth)
Data Fetching: TanStack Query + Eden Treaty Client
Emails: React Email + Resend
Current State (85% Complete)
✅ Completed Components
Component	Status	Key Files
Database Schema	✅ 100%	
schema.ts
 - 9 tables
API Routes	✅ 100%	
routes/
 - 5 modules
Authentication	✅ 100%	
auth.ts
TanStack Query Hooks	✅ 100%	
hooks/api/
 - 6 files
UI Components	✅ 100%	
components/ui/
 - 57 components
Email Templates	✅ 100%	
emails/
 - 8 templates
Workers	✅ 100%	
lib/workers/
 - 5 services
Dashboard Data	✅ 100%	
monitor-dashboard.tsx
 - Real API hooks
Public Status	✅ 100%	
app/status/[monitorId]/
 - Public page
Testing	✅ 100%	
bun test
 - 11 tests
Remaining Work
✅ Priority 1: Dashboard Real Data Integration (COMPLETE)
Completed: Replaced mock data with real API calls.

[MODIFIED] monitor-dashboard.tsx
- Imported useMonitors and useIncidents hooks
- Added loading states with <Skeleton /> component
- Added error states with ServerCrash icon
- Added empty states with Inbox icon
- Computed stats from real API data
Priority 2: Uptime Charts Implementation
Goal: Add real-time visualizations for uptime and response times.

[MODIFY] 
monitor-dashboard.tsx
Replace the placeholder on line 151-153:

<div className="h-64 flex items-center justify-center text-muted-foreground text-sm mb-4">
  [shadcn area chart goes here]
</div>
With actual Recharts implementation using:

useMonitorChecks(monitorId)
 for health check data
useMonitorStats(monitorId)
 for 24h statistics
useMonitorUptime(monitorId)
 for uptime percentages
Reference: 
chart.tsx
 - shadcn chart component ready to use

Priority 3: Create Monitor Flow
Goal: Allow users to add new monitors.

[NEW] src/components/create-monitor-dialog.tsx
Create a dialog/modal with form fields:

Name (required)
URL (required)
Type (http/https/tcp/ping)
Method (GET/POST/HEAD)
Check interval (seconds)
Timeout (ms)
Expected status codes
Headers (key-value)
Is Active toggle
Is Public toggle
Use 
useCreateMonitor()
 mutation from 
use-monitors.ts

Priority 4: Incidents Page
Goal: Full incidents management page.

[NEW] src/app/dashboard/incidents/page.tsx
Features needed:

List all incidents using 
useIncidents()
Show incident status (detected/investigating/resolved)
Show associated monitor name
Show timestamps (detected, acknowledged, resolved)
Allow updating incident state using 
useUpdateIncident()
Show cause and postmortem fields
Priority 5: Alerts Configuration Page
Goal: Allow users to configure alert channels per monitor.

[NEW] src/app/dashboard/alerts/page.tsx
Features needed:

List alerts per monitor using 
useAlerts(monitorId)
Create new alerts with 
useCreateAlert()
Support channels: email, webhook, slack, discord
Configure failure threshold
Enable/disable alerts
Priority 6: Monitor Details Page
Goal: Detailed view for individual monitors.

[NEW] src/app/dashboard/monitors/[id]/page.tsx
Features needed:

Monitor info using 
useMonitor(id)
Health check history using 
useMonitorChecks(id)
Uptime statistics using 
useMonitorUptime(id)
Active incidents
Alert configurations
Edit/delete actions
✅ Priority 7: Public Status Pages (COMPLETE)
Completed: Public-facing status page for monitors marked as public.

[CREATED] src/app/status/[monitorId]/page.tsx
- Shows current status (Operational/Down)
- Displays 24h uptime percentage
- Shows average response time
- Lists recent health checks
- No auth required for isPublic=true monitors
✅ Priority 8: Testing Framework (COMPLETE)
Completed: Set up Bun's built-in test runner.

[CREATED] src/test/setup.ts - HappyDOM registration
[CREATED] src/routes/monitors/route.test.ts - API validation tests
[CREATED] src/lib/nanoid.test.ts - Utility tests
[MODIFIED] package.json - Added test scripts

Installed: @happy-dom/global-registrator
Run: bun test (11 tests passing)
File Structure Reference
src/
├── app/
│   ├── (auth)/              # Auth pages (complete)
│   ├── dashboard/
│   │   ├── page.tsx         # Main dashboard (needs work)
│   │   ├── incidents/       # [NEW] Incidents page
│   │   ├── alerts/          # [NEW] Alerts page
│   │   └── monitors/[id]/   # [NEW] Monitor details
│   └── status/[id]/         # [NEW] Public status page
├── components/
│   ├── ui/                  # 57 shadcn components (complete)
│   ├── monitor-dashboard.tsx # Needs real data
│   └── create-monitor-dialog.tsx # [NEW]
├── db/
│   └── schema.ts            # 9 tables (complete)
├── emails/                  # 8 templates (complete)
├── hooks/api/               # 6 hook files (complete)
├── lib/
│   ├── auth.ts              # Better-Auth (complete)
│   ├── resend.ts            # Email service (complete)
│   └── workers/             # 5 workers (complete)
└── routes/                  # 5 API modules (complete)
Development Commands
bun run dev              # Start dev server
bun run build            # Production build
bun run lint             # Run Biome linter
bun run format           # Format with Biome
bun run db:generate      # Generate Drizzle migrations
bun run db:migrate       # Apply migrations
bun run db:push          # Push schema directly (dev only)
bun run db:studio        # Open Drizzle Studio
bun run mail             # Preview email templates on port 6767
bun test                 # Run all tests
bun test --watch         # Run tests in watch mode
Estimated Effort
Task	Status	Hours
Dashboard real data	✅ Done	-
Uptime charts	Pending	1-2
Create monitor flow	Pending	2-3
Incidents page	Pending	2-3
Alerts page	Pending	2-3
Monitor details	Pending	1-2
Public status pages	✅ Done	-
Testing setup	✅ Done	-
Remaining		9-15