# Incident Management - Learnings

## 2026-02-20 Session Start

### Project Context
- Next.js 16 App Router with React 19
- Bun runtime, Elysia.js API
- PostgreSQL with Drizzle ORM
- better-auth for authentication
- Tailwind CSS v4, TanStack Query

### Existing Patterns
- Monitor detail page at `src/app/dashboard/monitors/[id]/page.tsx` - use as reference
- Edit modal pattern at `src/components/monitors/edit-monitor-modal.tsx`
- State colors: Red=detected, Yellow=investigating, Green=resolved
- Breadcrumb navigation pattern established
- useIncident and useUpdateIncident hooks already exist

### Key Files
- `src/hooks/api/use-incidents.ts` - useIncident(id), useUpdateIncident()
- `src/app/dashboard/notifications/page.tsx` - State color mapping functions
- `src/components/ui/badge.tsx` - Badge component for state display
- `src/components/ui/dialog.tsx` - Dialog component for modals

### API Types
- Incident state: "detected" | "investigating" | "resolved"
- UpdateIncidentData: { state?, cause?, postmortem? }

## 2026-02-20 Edit Incident Modal Created

### Component Created
- `src/components/incidents/edit-incident-modal.tsx` - Modal for editing cause and postmortem

### Pattern Used
- Follows edit-monitor-modal.tsx pattern exactly
- Uses Field and FieldLabel for form structure
- Pre-populates form with useEffect when modal opens
- useUpdateIncident hook handles save with toast notifications
- DialogClose for cancel button with render prop pattern

### Key Implementation Details
- Both cause and postmortem are optional textareas
- Empty strings converted to undefined before save (to allow clearing fields)
- isPending state disables submit button and shows "Saving..." text

