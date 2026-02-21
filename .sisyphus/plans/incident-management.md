# Incident Management UI Implementation Plan

## TL;DR

> **Quick Summary**: Implement incident state management UI with Acknowledge/Resolve buttons and dedicated incident detail page for viewing/editing incidents.
> 
> **Deliverables**:
> - Incident detail page at `/dashboard/incidents/[id]`
> - State transition buttons (Acknowledge, Resolve)
> - Editable cause and postmortem fields
> - "View Details" button in notifications list
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Incident detail page → State buttons → Edit fields → Notifications link

---

## Context

### Original Request
Implement incident management UI to allow users to acknowledge and resolve incidents, view incident details, and edit cause/postmortem fields.

### Interview Summary
**Key Decisions**:
- Page route: `/dashboard/incidents/[id]` - dedicated page for full incident view
- State transitions: Linear only (detected → investigating → resolved)
- Actions: Acknowledge button (detected → investigating), Resolve button (investigating → resolved)
- Editable fields: Both cause and postmortem always editable (no state restrictions)
- Navigation: "View Details" button in notifications list

**Research Findings**:
- Backend API complete: GET/PUT endpoints for incidents
- Hooks ready: useIncident(id), useUpdateIncident()
- Notifications page exists with read-only display
- State colors defined: Red=detected, Yellow=investigating, Green=resolved

### Metis Review
**Critical Insights**:
- Add monitor context display (name with link to monitor)
- Include breadcrumb navigation
- Handle invalid incident ID with error state
- Follow monitor detail page structure exactly

**Guardrails Applied**:
- NO incident deletion (out of scope)
- NO incident creation UI (auto-created by health checks)
- NO bulk operations
- NO timeline/history (no audit log exists)

---

## Work Objectives

### Core Objective
Implement complete incident management UI: detail page with state transitions and editable fields.

### Concrete Deliverables
1. `src/app/dashboard/incidents/[id]/page.tsx` - Incident detail page
2. `src/components/incidents/incident-state-buttons.tsx` - State transition buttons
3. `src/components/incidents/edit-incident-modal.tsx` - Edit cause/postmortem modal
4. `src/app/dashboard/notifications/page.tsx` - Add "View Details" button

### Definition of Done
- [ ] Incident detail page renders with all incident data
- [ ] State buttons appear based on current state (Acknowledge for detected, Resolve for investigating)
- [ ] Clicking Acknowledge transitions to "investigating"
- [ ] Clicking Resolve transitions to "resolved"
- [ ] Cause field editable and saves correctly
- [ ] Postmortem field editable and saves correctly
- [ ] "View Details" button navigates to incident detail
- [ ] Build passes without errors

### Must Have
- Use existing hooks (useIncident, useUpdateIncident)
- Follow monitor detail page structure
- Match existing styling and layout
- Handle loading/error states
- Include breadcrumb navigation
- Show monitor context with link

### Must NOT Have (Guardrails)
- **NO incident deletion** - Out of scope
- **NO incident creation UI** - Auto-created by health checks
- **NO bulk operations** - Single incident only
- **NO timeline/history** - No audit log exists
- **NO state going backwards** - Linear transitions only
- **NO new API routes** - Use existing endpoints
- **NO new hooks** - Use existing hooks

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: YES (Bun test runner)
- **Automated tests**: NO - Manual + Playwright verification
- **Focus**: TypeScript compilation + UI functionality

### QA Policy
Every task includes agent-executed verification scenarios.

| Deliverable | Verification Tool | Method |
|-------------|-------------------|--------|
| Incident detail page | Playwright | Navigate, verify data displays |
| State buttons | Playwright | Click button, verify state change |
| Edit fields | Playwright | Edit, save, verify persistence |
| Notifications link | Playwright | Click "View Details", verify navigation |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — Components):
├── Task 1: Create incident detail page [visual-engineering]
├── Task 2: Create incident state buttons component [quick]
└── Task 3: Create edit incident modal component [quick]

Wave 2 (After Wave 1 — Integration):
├── Task 4: Add "View Details" button to notifications [quick]
└── Task 5: Final testing & build verification [quick]

Critical Path: Task 1 → Task 2,3 → Task 4 → Task 5
Parallel Speedup: ~50% faster than sequential
Max Concurrent: 3 (Wave 1)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|------------|--------|------|
| 1 | — | 2, 3, 4 | 1 |
| 2 | 1 | 4 | 1 |
| 3 | 1 | 4 | 1 |
| 4 | 1, 2, 3 | 5 | 2 |
| 5 | 4 | — | 2 |

---

## TODOs

- [ ] 1. Create Incident Detail Page

  **What to do**:
  - Create `src/app/dashboard/incidents/[id]/page.tsx`
  - Use `useIncident(id)` hook to fetch incident data
  - Page structure (follow monitor detail pattern):
    - Breadcrumb: `Incidents > [Monitor Name] - [State]`
    - Header: Monitor name, state badge, state buttons
    - Info section: Detected at, acknowledged at, resolved at timestamps
    - Monitor context: Monitor name with link to `/dashboard/monitors/[id]`
    - Details section: Cause field, postmortem field (display only here)
  - Handle loading state with Skeleton components
  - Handle 404 error state ("Incident not found" with link to notifications)
  - State badge colors: Red=detected, Yellow=investigating, Green=resolved

  **Must NOT do**:
  - Don't create new hooks - use existing `useIncident`
  - Don't add incident creation form
  - Don't add incident deletion button
  - Don't change the overall layout pattern

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Full page UI component with styling
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Page layout and visual consistency

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Tasks 2, 3, 4
  - **Blocked By**: None

  **References**:
  - `src/app/dashboard/monitors/[id]/page.tsx` - Page structure to follow
  - `src/hooks/api/use-incidents.ts` - useIncident hook
  - `src/app/dashboard/notifications/page.tsx:58-83` - State color mapping functions
  - `src/components/ui/badge.tsx` - Badge component for state display

  **Acceptance Criteria**:
  - [ ] Page file created at `src/app/dashboard/incidents/[id]/page.tsx`
  - [ ] Uses useIncident hook for data fetching
  - [ ] Shows breadcrumb navigation
  - [ ] Displays monitor name with link
  - [ ] Shows state badge with correct color
  - [ ] Shows timestamps (detected, acknowledged, resolved)
  - [ ] Loading state with skeletons
  - [ ] Error state for invalid ID
  - [ ] Page compiles without errors

  **QA Scenarios**:
  ```
  Scenario: Incident detail page displays correctly
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard/incidents/[valid-incident-id]
      2. Verify page loads with incident data
      3. Verify monitor name is displayed
      4. Verify state badge shows correct color
      5. Verify timestamps displayed
    Expected Result: Page renders with all incident data
    Evidence: .sisyphus/evidence/task-01-incident-detail.png

  Scenario: Invalid incident ID shows error
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard/incidents/invalid-id
      2. Verify "Incident not found" message shows
      3. Verify link back to notifications
    Expected Result: Error state with navigation option
    Evidence: .sisyphus/evidence/task-01-invalid-id.png
  ```

  **Commit**: NO (groups with Tasks 2, 3)

---

- [ ] 2. Create Incident State Buttons Component

  **What to do**:
  - Create `src/components/incidents/incident-state-buttons.tsx`
  - Props: `incidentId`, `currentState`, `onStateChange` callback
  - Buttons logic:
    - State "detected": Show "Acknowledge" button (yellow/warning style)
    - State "investigating": Show "Resolve" button (green/success style)
    - State "resolved": Show no buttons (terminal state)
  - Use `useUpdateIncident()` hook for mutations
  - Show loading state on button during mutation
  - Toast notifications handled by hook (already implemented)
  - Button placement: In page header next to state badge

  **Must NOT do**:
  - Don't allow state going backwards (no Reopen button)
  - Don't add confirmation dialog for transitions
  - Don't create optimistic updates

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple component with conditional rendering
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 4
  - **Blocked By**: Task 1 (for integration pattern)

  **References**:
  - `src/hooks/api/use-incidents.ts` - useUpdateIncident hook
  - `src/components/ui/button.tsx` - Button variants
  - State mapping: detected → Acknowledge, investigating → Resolve

  **Acceptance Criteria**:
  - [ ] Component file created at `src/components/incidents/incident-state-buttons.tsx`
  - [ ] Acknowledge button shows for "detected" state
  - [ ] Resolve button shows for "investigating" state
  - [ ] No buttons for "resolved" state
  - [ ] Button shows loading state during mutation
  - [ ] State change triggers toast notification

  **QA Scenarios**:
  ```
  Scenario: Acknowledge incident
    Tool: Playwright
    Steps:
      1. Navigate to incident in "detected" state
      2. Verify "Acknowledge" button visible
      3. Click "Acknowledge"
      4. Wait for success toast
      5. Verify state changed to "investigating"
      6. Verify "Resolve" button now visible
    Expected Result: State transitions to investigating
    Evidence: .sisyphus/evidence/task-02-acknowledge.png

  Scenario: Resolve incident
    Tool: Playwright
    Steps:
      1. Navigate to incident in "investigating" state
      2. Verify "Resolve" button visible
      3. Click "Resolve"
      4. Wait for success toast
      5. Verify state changed to "resolved"
      6. Verify no state buttons visible
    Expected Result: State transitions to resolved
    Evidence: .sisyphus/evidence/task-02-resolve.png
  ```

  **Commit**: NO (groups with Task 1, 3)

---

- [ ] 3. Create Edit Incident Modal Component

  **What to do**:
  - Create `src/components/incidents/edit-incident-modal.tsx`
  - Use Dialog component from `@/components/ui/dialog`
  - Props: `open`, `onOpenChange`, `incident` (with id, cause, postmortem)
  - Form fields:
    - Cause: Textarea (optional, placeholder: "What caused this incident?")
    - Postmortem: Textarea (optional, placeholder: "Post-incident analysis and lessons learned")
  - Use `useUpdateIncident()` hook for saving
  - Pre-populate fields with existing values
  - Show loading state during save
  - Close modal on success

  **Must NOT do**:
  - Don't add field validation beyond optional
  - Don't restrict editing based on state
  - Don't add character limits
  - Don't use react-hook-form or Zod

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple form modal following existing patterns
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 4
  - **Blocked By**: Task 1 (for integration pattern)

  **References**:
  - `src/components/monitors/edit-monitor-modal.tsx` - Pattern to follow
  - `src/hooks/api/use-incidents.ts` - useUpdateIncident hook
  - `src/components/ui/textarea.tsx` - Textarea component

  **Acceptance Criteria**:
  - [ ] Component file created at `src/components/incidents/edit-incident-modal.tsx`
  - [ ] Cause textarea pre-populated with existing value
  - [ ] Postmortem textarea pre-populated with existing value
  - [ ] Save button shows loading during mutation
  - [ ] Modal closes on successful save
  - [ ] Toast notification shows on save

  **QA Scenarios**:
  ```
  Scenario: Edit cause and postmortem
    Tool: Playwright
    Steps:
      1. Navigate to incident detail page
      2. Click "Edit" button
      3. Enter cause: "Database connection timeout"
      4. Enter postmortem: "Root cause: connection pool exhaustion"
      5. Click "Save Changes"
      6. Verify success toast
      7. Verify modal closes
      8. Verify values displayed on page
    Expected Result: Fields save and display correctly
    Evidence: .sisyphus/evidence/task-03-edit-modal.png

  Scenario: Empty fields allowed
    Tool: Playwright
    Steps:
      1. Open edit modal
      2. Clear both textareas
      3. Click "Save Changes"
      4. Verify save succeeds (no validation error)
    Expected Result: Empty values save correctly
    Evidence: .sisyphus/evidence/task-03-empty-fields.png
  ```

  **Commit**: YES
  - Message: `feat(incidents): add incident detail page and state management`
  - Files: `src/app/dashboard/incidents/*`, `src/components/incidents/*`
  - Pre-commit: `bun run format`

---

- [ ] 4. Add "View Details" Button to Notifications Page

  **What to do**:
  - Modify `src/app/dashboard/notifications/page.tsx`
  - Add "View Details" button/link to each notification item
  - Button should navigate to `/dashboard/incidents/[id]`
  - Position: In the notification item, after the timestamp or as a hover action
  - Style: Ghost button or text link
  - Preserve existing "Archive" button functionality
  - Don't interfere with "mark as read" on click

  **Placement options** (choose one):
  - Option A: Add as third action in hover area (alongside Archive)
  - Option B: Add as text link in the title
  - Option C: Add as separate button visible always

  **Recommended**: Option A - Add to hover area with Archive button

  **Must NOT do**:
  - Don't change the notification card layout
  - Don't remove existing mark-as-read functionality
  - Don't change the tab filtering logic
  - Don't make the entire card clickable

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small integration change
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 5
  - **Blocked By**: Task 1 (incident detail page must exist)

  **References**:
  - `src/app/dashboard/notifications/page.tsx:117-177` - NotificationList component
  - `src/app/dashboard/notifications/page.tsx:151-174` - Hover actions area

  **Acceptance Criteria**:
  - [ ] "View Details" button/link added to notifications
  - [ ] Clicking navigates to `/dashboard/incidents/[id]`
  - [ ] Archive button still works
  - [ ] Mark-as-read on click still works
  - [ ] Button styled consistently

  **QA Scenarios**:
  ```
  Scenario: Navigate from notifications to incident detail
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard/notifications
      2. Hover over a notification item
      3. Verify "View Details" button appears
      4. Click "View Details"
      5. Verify navigation to /dashboard/incidents/[id]
      6. Verify correct incident displayed
    Expected Result: Navigation works correctly
    Evidence: .sisyphus/evidence/task-04-notifications-link.png

  Scenario: Archive still works after adding View Details
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard/notifications
      2. Hover over a notification item
      3. Click "Archive" button
      4. Verify item moves to Archived tab
    Expected Result: Archive functionality preserved
    Evidence: .sisyphus/evidence/task-04-archive-works.png
  ```

  **Commit**: YES
  - Message: `feat(notifications): add View Details link to incidents`
  - Files: `src/app/dashboard/notifications/page.tsx`
  - Pre-commit: Test navigation works

---

- [ ] 5. Final Testing & Build Verification

  **What to do**:
  - Run `bun run build` - verify no TypeScript errors
  - Run `bun run lint` - verify no linting issues
  - Test complete incident workflow:
    1. View incident from notifications
    2. Acknowledge incident (detected → investigating)
    3. Edit cause field
    4. Resolve incident (investigating → resolved)
    5. Edit postmortem field
  - Verify toasts work
  - Verify error handling (invalid ID)
  - Verify timestamps update correctly

  **Test scenarios**:
  1. Happy path: View → Acknowledge → Edit → Resolve → Edit
  2. Error: Invalid incident ID
  3. Navigation: Notifications → Incident detail → Monitor detail

  **Must NOT do**:
  - Don't skip error testing
  - Don't ignore build warnings

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Verification task
  - **Skills**: [`playwright`]
    - `playwright`: For E2E testing of incident workflow

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (last)
  - **Blocks**: None
  - **Blocked By**: Task 4

  **Acceptance Criteria**:
  - [ ] `bun run build` passes
  - [ ] `bun run lint` passes
  - [ ] All state transitions work
  - [ ] Field editing works
  - [ ] Navigation works
  - [ ] Error states handled

  **QA Scenarios**:
  ```
  Scenario: Full incident lifecycle
    Tool: Playwright
    Steps:
      1. Start with incident in "detected" state
      2. Navigate from notifications to incident detail
      3. Click "Acknowledge" - verify state → investigating
      4. Edit cause field - verify save
      5. Click "Resolve" - verify state → resolved
      6. Edit postmortem field - verify save
      7. Verify no state buttons visible
    Expected Result: Complete lifecycle works
    Evidence: .sisyphus/evidence/task-05-full-lifecycle.png
  ```

  **Commit**: NO (already committed in Tasks 3, 4)



---

## Commit Strategy

| After Task | Message | Files |
|------------|---------|-------|
| 3 | `feat(incidents): add incident detail page and state management` | `src/app/dashboard/incidents/*`, `src/components/incidents/*` |
| 4 | `feat(notifications): add View Details link to incidents` | `src/app/dashboard/notifications/page.tsx` |

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

# Incident page loads
curl -s http://localhost:3000/dashboard/incidents/[valid-id]
# Expected: Returns HTML with incident data
```

### Final Checklist
- [ ] Incident detail page created
- [ ] State buttons work (Acknowledge, Resolve)
- [ ] Cause field editable and saves
- [ ] Postmortem field editable and saves
- [ ] "View Details" button in notifications
- [ ] Build passes
- [ ] Lint passes

---

*Plan generated by Prometheus. Execute with `/start-work` command.*
