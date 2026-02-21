# Draft: Incident Management UI Implementation

## Requirements (confirmed)
- User wants incident state management UI (Acknowledge, Resolve buttons)
- User wants incident detail page for viewing/editing incidents
- Backend API is complete (3 endpoints)
- Hooks are ready (useIncidents, useIncident, useUpdateIncident)

## Technical Decisions
- **State Flow**: detected → investigating → resolved
- **Auto-timestamps**: Backend auto-sets acknowledgedAt/resolvedAt on state change
- **UI Location**: Incident detail page + state buttons in notifications list

## Research Findings
- Backend: `src/routes/incidents/route.ts` - 3 endpoints complete
- Hooks: `src/hooks/api/use-incidents.ts` - All hooks ready
- Current UI: `src/app/dashboard/notifications/page.tsx` - Read-only notifications
- Schema: Incident has state, cause, postmortem, timestamps

## Incident Schema
```typescript
{
  id: string;
  monitorId: string;
  state: "detected" | "investigating" | "resolved";
  detectedAt: Date;
  acknowledgedAt: Date | null;
  resolvedAt: Date | null;
  cause: string | null;
  postmortem: string | null;
}
```

## State Transitions
| Current State | Available Actions |
|---------------|-------------------|
| detected | Acknowledge (→ investigating) |
| investigating | Resolve (→ resolved) |
| resolved | None (terminal state) |

## Scope Boundaries
- INCLUDE: State management buttons, incident detail page, cause/postmortem editing
- EXCLUDE: New incident states, automated incident creation, incident timeline/history

## Requirements Clarified (2026-02-20)

**Page Route**: `/dashboard/incidents/[id]`
- Dedicated page for full incident view with state buttons
- Cause/postmortem editable fields

**Actions**: Acknowledge + Resolve
- `detected → investigating` (Acknowledge button)
- `investigating → resolved` (Resolve button)

**Editing**: Yes, in detail page
- Cause field (text input, editable during incident)
- Postmortem field (textarea, editable after resolution)

## Final Approach (Confirmed 2026-02-20)
1. New page: `/dashboard/incidents/[id]` with full incident view
2. State buttons in page header (Acknowledge / Resolve)
3. Cause and postmortem as editable fields
4. "View Details" button in notifications list → incident detail

## Clarified Decisions
- **State transitions**: Linear only (detected → investigating → resolved, no reopening)
- **Field editing**: Both cause and postmortem always editable (no state restrictions)
- **Navigation**: Add "View Details" button in notifications list

## Guardrails from Metis Review
- NO incident deletion (explicitly out of scope)
- NO incident creation UI (auto-created by health checks)
- NO bulk operations
- NO timeline/history (no audit log exists)
- NO comments/notes system
