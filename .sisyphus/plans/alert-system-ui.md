# Alert System UI Implementation Plan

## TL;DR

> **Quick Summary**: Implement alert configuration UI for monitors. Create/edit/delete alert channels (email, webhook, Slack, Discord) with failure threshold settings.
> 
> **Deliverables**:
> - `AlertList` component displaying alerts per monitor
> - `CreateAlertModal` - Form for creating new alerts
> - `EditAlertModal` - Form for editing existing alerts
> - `DeleteAlertDialog` - Confirmation dialog for deletion
> - Alerts section added to monitor detail page
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Alert modals → Alert list → Integration → Testing

---

## Context

### Original Request
Implement Alert System UI to allow users to configure alert channels for their monitors.

### Interview Summary
**Key Decisions**:
- Alerts as new section on monitor detail page (no tabs)
- Configuration CRUD only (no history, no test alerts)
- Keep threshold settings separate from alert configs
- Follow existing modal patterns from monitor CRUD

**Research Findings**:
- Backend API complete: GET/POST/PUT/DELETE for alert configs
- Hooks ready: useAlerts, useCreateAlert, useUpdateAlert, useDeleteAlert
- Existing patterns: create-monitor-modal, edit-monitor-modal, delete-monitor-dialog
- Channel types: email, webhook, slack, discord

### Metis Review
**Critical Insights**:
- Place alerts as section between stats and charts on monitor detail page
- No tabs or separate routes - alerts are per-monitor context
- Channel-specific validation needed (email format, webhook URLs)
- Failure threshold default: 3 consecutive failures
- Empty state needed when no alerts configured

---

## Work Objectives

### Core Objective
Implement complete CRUD UI for alert configurations, embedded in monitor detail page.

### Concrete Deliverables
1. `src/components/alerts/alert-list.tsx` - Display alerts with edit/delete actions
2. `src/components/alerts/create-alert-modal.tsx` - Create alert form
3. `src/components/alerts/edit-alert-modal.tsx` - Edit alert form
4. `src/components/alerts/delete-alert-dialog.tsx` - Delete confirmation
5. `src/app/dashboard/monitors/[id]/page.tsx` - Add alerts section

### Definition of Done
- [ ] Can view all alerts for a monitor
- [ ] Can create new alerts with channel configuration
- [ ] Can edit existing alert settings
- [ ] Can delete alerts with confirmation
- [ ] Channel-specific validation works
- [ ] Empty state shows when no alerts configured
- [ ] Toast notifications on success/failure
- [ ] Build passes without errors

### Must Have
- Use existing hooks (useAlerts, useCreateAlert, useUpdateAlert, useDeleteAlert)
- Follow existing modal/dialog patterns
- Match existing styling and layout
- Channel selector (email/webhook/slack/discord)
- Failure threshold setting
- Enable/disable toggle per alert

### Must NOT Have (Guardrails)
- **NO new API routes** - Use existing endpoints
- **NO new hooks** - Use existing hooks
- **NO tabs on monitor detail page** - Single scroll layout
- **NO separate /alerts route** - Alerts are per-monitor
- **NO Zod or react-hook-form** - Use controlled components with useState
- **NO alert history/firing logic** - Configuration CRUD only
- **NO test alert feature** - Out of scope
- **NO merge with threshold-settings** - Keep separate concerns

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
| Alert list | Playwright | Navigate, verify alerts display |
| Create modal | Playwright | Fill form, submit, verify alert created |
| Edit modal | Playwright | Modify fields, save, verify changes |
| Delete dialog | Playwright | Click delete, confirm, verify removed |
| Channel validation | Playwright | Test invalid endpoints per channel |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Components - Independent):
├── Task 1: Create alert-list component [visual-engineering]
├── Task 2: Create create-alert-modal component [unspecified-high]
├── Task 3: Create edit-alert-modal component [quick]
└── Task 4: Create delete-alert-dialog component [quick]

Wave 2 (Integration - After Wave 1):
├── Task 5: Integrate alerts section into monitor detail page [quick]
└── Task 6: Final testing & build verification [quick]

Critical Path: Task 1,2,3,4 → Task 5 → Task 6
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 4 (Wave 1)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|------------|--------|------|
| 1 | — | 5 | 1 |
| 2 | — | 5 | 1 |
| 3 | — | 5 | 1 |
| 4 | — | 5 | 1 |
| 5 | 1,2,3,4 | 6 | 2 |
| 6 | 5 | — | 2 |

---

## TODOs

- [x] 1. Create Alert List Component

  **What to do**:
  - Create `src/components/alerts/alert-list.tsx`
  - Display alerts for a monitor using `useAlerts(monitorId)` hook
  - Show alert cards with:
    - Alert name
    - Channel type (with icon: Mail, Webhook, Slack, Discord)
    - Endpoint (email address or URL)
    - Failure threshold
    - Enabled status (inline toggle switch)
  - Add "Edit" and "Delete" buttons per alert
  - Add "Add Alert" button to create new alert
  - Show empty state when no alerts configured

  **Must NOT do**:
  - Don't create a table - use card-based layout matching existing patterns
  - Don't add optimistic updates
  - Don't add test alert functionality

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI component with visual styling
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Card-based layout with consistent styling

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 5
  - **Blocked By**: None

  **References**:
  - `src/components/monitors/create-monitor-modal.tsx` - Pattern for controlled components
  - `src/hooks/api/use-alerts.ts` - useAlerts hook
  - Lucide icons: Mail, Webhook, MessageSquare (Slack/Discord)
  - `src/components/ui/switch.tsx` - Toggle switch component

  **Acceptance Criteria**:
  - [ ] Component file created at `src/components/alerts/alert-list.tsx`
  - [ ] Uses useAlerts hook to fetch data
  - [ ] Displays alert cards with all required fields
  - [ ] Shows empty state when no alerts
  - [ ] Has Edit and Delete buttons
  - [ ] Has Add Alert button
  - [ ] Component compiles without errors

  **QA Scenarios**:
  ```
  Scenario: Alert list displays alerts
    Tool: Playwright
    Steps:
      1. Navigate to monitor detail page with existing alerts
      2. Verify alerts section visible
      3. Verify each alert shows name, channel, endpoint, threshold
    Expected Result: All alerts displayed correctly
    Evidence: .sisyphus/evidence/task-01-alert-list.png

  Scenario: Empty state when no alerts
    Tool: Playwright
    Steps:
      1. Navigate to monitor with no alerts
      2. Verify "No alerts configured" message shown
      3. Verify "Add Alert" button visible
    Expected Result: Empty state displays correctly
    Evidence: .sisyphus/evidence/task-01-empty-state.png
  ```

  **Commit**: NO (groups with Task 4)

---

- [x] 2. Create Alert Modal Component

  **What to do**:
  - Create `src/components/alerts/create-alert-modal.tsx`
  - Use Dialog component from `@/components/ui/dialog`
  - Follow pattern from `create-monitor-modal.tsx`
  - Form fields:
    - Name (required, text input)
    - Channel (required, dropdown: EMAIL/WEBHOOK/SLACK/DISCORD)
    - Endpoint (required, text input with dynamic placeholder)
    - Failure Threshold (number input, default 3)
    - Enabled (toggle switch, default ON)
  - Dynamic placeholder based on channel:
    - Email: "alerts@company.com"
    - Webhook: "https://api.example.com/webhook"
    - Slack: "https://hooks.slack.com/services/..."
    - Discord: "https://discord.com/api/webhooks/..."
  - Use `useCreateAlert()` hook for submission
  - Handle loading state during submission
  - Close modal on success
  - Reset form after successful creation

  **Must NOT do**:
  - Don't use Zod or react-hook-form
  - Don't add channel-specific URL validation (keep simple for MVP)
  - Don't add test alert button

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex form component with conditional rendering
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 5
  - **Blocked By**: None

  **References**:
  - `src/components/monitors/create-monitor-modal.tsx:1-150` - Pattern to follow
  - `src/hooks/api/use-alerts.ts` - useCreateAlert hook
  - `src/components/ui/select.tsx` - Select dropdown
  - `src/components/ui/switch.tsx` - Toggle switch

  **Acceptance Criteria**:
  - [ ] Component file created at `src/components/alerts/create-alert-modal.tsx`
  - [ ] Form has all required fields
  - [ ] Channel dropdown with all 4 options
  - [ ] Dynamic placeholder changes based on channel
  - [ ] Submit uses useCreateAlert hook
  - [ ] Loading state shown during submission
  - [ ] Form resets after successful creation
  - [ ] Modal closes on success

  **QA Scenarios**:
  ```
  Scenario: Create alert successfully
    Tool: Playwright
    Steps:
      1. Open create alert modal
      2. Fill name: "Production Alert"
      3. Select channel: EMAIL
      4. Fill endpoint: "ops@company.com"
      5. Click "Create Alert"
      6. Wait for success toast
      7. Verify modal closes
      8. Verify new alert appears in list
    Expected Result: Alert created, list refreshes
    Evidence: .sisyphus/evidence/task-02-create-alert.png

  Scenario: Dynamic placeholder changes
    Tool: Playwright
    Steps:
      1. Open create alert modal
      2. Select EMAIL - verify email placeholder
      3. Select SLACK - verify Slack webhook placeholder
      4. Select DISCORD - verify Discord webhook placeholder
    Expected Result: Placeholder updates per channel
    Evidence: .sisyphus/evidence/task-02-placeholders.png
  ```

  **Commit**: NO (groups with Task 4)

---

- [x] 3. Create Edit Alert Modal Component

  **What to do**:
  - Create `src/components/alerts/edit-alert-modal.tsx`
  - Similar to create form but pre-populated with existing data
  - Accept `alert` prop with current values
  - Use `useUpdateAlert()` hook
  - Pre-fill all fields with existing alert data
  - Show current values as defaults

  **Must NOT do**:
  - Don't duplicate form field logic - can share components if needed
  - Don't allow editing alert ID or monitorId

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Follows create modal pattern closely
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 5
  - **Blocked By**: None

  **References**:
  - Task 2 implementation (same patterns)
  - `src/components/monitors/edit-monitor-modal.tsx` - Edit pattern to follow
  - `src/hooks/api/use-alerts.ts` - useUpdateAlert hook

  **Acceptance Criteria**:
  - [ ] Component file created
  - [ ] Pre-populated with existing alert data
  - [ ] Uses useUpdateAlert hook
  - [ ] Updates reflect immediately in UI
  - [ ] Success toast shown

  **QA Scenarios**:
  ```
  Scenario: Edit alert successfully
    Tool: Playwright
    Steps:
      1. Click Edit on existing alert
      2. Verify all fields pre-populated
      3. Change name to "Updated Alert"
      4. Click "Save Changes"
      5. Verify success toast
      6. Verify alert shows new name in list
    Expected Result: Alert updated, UI reflects changes
    Evidence: .sisyphus/evidence/task-03-edit-alert.png
  ```

  **Commit**: NO (groups with Task 4)

---

- [x] 4. Create Delete Alert Dialog Component

  **What to do**:
  - Create `src/components/alerts/delete-alert-dialog.tsx`
  - Use AlertDialog component (destructive action)
  - Show alert name in confirmation message
  - Use `useDeleteAlert()` hook
  - Show loading state during deletion
  - Close dialog on success

  **Must NOT do**:
  - Don't use regular Dialog - must be AlertDialog
  - Don't allow deletion without confirmation

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple confirmation dialog
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 5
  - **Blocked By**: None

  **References**:
  - `src/components/monitors/delete-monitor-dialog.tsx` - Pattern to follow
  - `src/components/ui/alert-dialog.tsx` - AlertDialog components
  - `src/hooks/api/use-alerts.ts` - useDeleteAlert hook

  **Acceptance Criteria**:
  - [ ] Component file created
  - [ ] Uses AlertDialog
  - [ ] Shows alert name in message
  - [ ] Delete button is destructive style
  - [ ] Loading state during deletion

  **QA Scenarios**:
  ```
  Scenario: Delete alert with confirmation
    Tool: Playwright
    Steps:
      1. Click Delete on alert
      2. Verify confirmation dialog shows alert name
      3. Click "Delete" to confirm
      4. Verify alert removed from list
    Expected Result: Alert deleted successfully
    Evidence: .sisyphus/evidence/task-04-delete-alert.png

  Scenario: Cancel deletion
    Tool: Playwright
    Steps:
      1. Click Delete on alert
      2. Click "Cancel"
      3. Verify dialog closes
      4. Verify alert still exists in list
    Expected Result: Dialog closes, alert preserved
  ```

  **Commit**: YES
  - Message: `feat(alerts): add alert CRUD modals and list component`
  - Files: `src/components/alerts/*`
  - Pre-commit: `bun run format`

---

- [x] 5. Integrate Alerts Section into Monitor Detail Page

  **What to do**:
  - Modify `src/app/dashboard/monitors/[id]/page.tsx`
  - Import AlertList component and modals
  - Add state for modal open/close
  - Add alerts section between stats and charts
  - Pass monitorId to AlertList
  - Section should include:
    - "Alerts" header with "Add Alert" button
    - AlertList component
    - Create, Edit, Delete modals

  **Placement**:
  ```
  Breadcrumb
  Header (name, URL, Edit/Delete buttons)
  Stats Cards
  Latency Stats
  [NEW] Alerts Section ← Here
  Uptime Chart
  Latency Chart
  ```

  **Must NOT do**:
  - Don't add tabs
  - Don't create separate /alerts route
  - Don't change existing sections

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Integration task, adding component to existing page
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 6
  - **Blocked By**: Tasks 1, 2, 3, 4

  **References**:
  - `src/app/dashboard/monitors/[id]/page.tsx` - Page to modify
  - `src/components/alerts/alert-list.tsx` - Component to add
  - `src/components/alerts/create-alert-modal.tsx` - Modal to add

  **Acceptance Criteria**:
  - [ ] Alerts section visible on monitor detail page
  - [ ] "Add Alert" button works
  - [ ] Full CRUD workflow works from detail page
  - [ ] Page layout preserved

  **QA Scenarios**:
  ```
  Scenario: Alerts section on monitor detail
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard/monitors/[valid-id]
      2. Scroll to alerts section
      3. Verify alerts display
      4. Click "Add Alert" - verify modal opens
      5. Create alert - verify appears in list
      6. Edit alert - verify changes reflected
      7. Delete alert - verify removed
    Expected Result: Full CRUD works from detail page
    Evidence: .sisyphus/evidence/task-05-alerts-section.png
  ```

  **Commit**: YES
  - Message: `feat(monitors): add alerts section to monitor detail page`
  - Files: `src/app/dashboard/monitors/[id]/page.tsx`
  - Pre-commit: Test full workflow

---

- [x] 6. Final Testing & Build Verification

  **What to do**:
  - Run `bun run build` - verify no errors
  - Run `bun run lint` - verify no issues
  - Test complete CRUD workflow:
    1. View alerts on monitor detail page
    2. Create new alert
    3. Edit existing alert
    4. Delete alert
  - Verify toasts work
  - Verify empty state works
  - Verify channel validation

  **Must NOT do**:
  - Don't skip error testing
  - Don't ignore build warnings

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Verification task
  - **Skills**: [`playwright`]
    - `playwright`: For E2E testing of alert UI

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (last)
  - **Blocks**: None
  - **Blocked By**: Task 5

  **Acceptance Criteria**:
  - [ ] `bun run build` passes
  - [ ] `bun run lint` passes
  - [ ] All CRUD operations work end-to-end
  - [ ] Toasts display correctly
  - [ ] Empty state displays correctly

  **QA Scenarios**:
  ```
  Scenario: Full alert CRUD workflow
    Tool: Playwright
    Steps:
      1. Navigate to monitor with no alerts
      2. Verify empty state
      3. Create alert
      4. Verify alert appears
      5. Edit alert
      6. Verify changes
      7. Delete alert
      8. Verify empty state returns
    Expected Result: Complete lifecycle works
    Evidence: .sisyphus/evidence/task-06-full-workflow.png
  ```

  **Commit**: NO (already committed in Tasks 4, 5)


---

## Commit Strategy

| After Task | Message | Files |
|------------|---------|-------|
| 4 | `feat(alerts): add alert CRUD modals and list component` | `src/components/alerts/*` |
| 5 | `feat(monitors): add alerts section to monitor detail page` | `src/app/dashboard/monitors/[id]/page.tsx` |

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

# Alert list displays
curl -s "http://localhost:3000/dashboard/monitors/[test-id]" | grep -o 'Alerts'
# Expected: Output contains "Alerts"
```

### Final Checklist
- [ ] Alert list component created
- [ ] Create alert modal works
- [ ] Edit alert modal works
- [ ] Delete alert dialog works
- [ ] Alerts section on monitor detail page
- [ ] Channel validation works
- [ ] Empty state handled
- [ ] Toast notifications work
- [ ] Build passes
- [ ] Lint passes

---

*Plan generated by Prometheus. Execute with `/start-work` command.*
