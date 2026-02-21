# Dashboard Cleanup Plan

## TL;DR

> **Quick Summary**: Remove hardcoded stub sections (Reports, Maintenance) and stub summary cards from the dashboard overview page. Clean up imports and layout.
> 
> **Deliverables**:
> - Dashboard shows only implemented features
> - No Reports/Maintenance sections visible
> - Summary cards show only real data (Monitors, Incidents)
> - Unused imports removed
> 
> **Estimated Effort**: Quick (~30 minutes)
> **Parallel Execution**: NO - Single file modification
> **Critical Path**: Remove sections → Remove cards → Clean imports

---

## Context

### Original Request
Clean up the dashboard overview page by removing hardcoded stub sections for features that don't have backend implementation.

### Research Findings
- **Reports Section** (lines 24-28): Hardcoded stub showing "No reports found" - no backend API exists
- **Maintenance Section** (lines 31-35): Hardcoded stub showing "No maintenances found" - no backend API exists
- **Summary Cards** (lines 51, 57-58): "Status Pages", "Last Report", "Last Maintenance" show hardcoded "0"/"None"
- **Real Data**: Only `Monitors` (useMonitors) and `Recent Incidents` (useIncidents) fetch real data

### Metis Review
**Critical Insights**:
- Keep Incidents section - it's real (though currently empty state only)
- Remove FileText and Wrench icons after removing sections
- Update grid from 5 columns to 2 columns (Monitors, Incidents only)
- Consider showing incidents list in Incidents section instead of just empty state

**Guardrails**:
- NO adding new features
- NO modifying API routes
- NO changing the page layout structure

---

## Work Objectives

### Core Objective
Remove non-implemented features from dashboard to show only real, functional data.

### Concrete Deliverables
1. Updated `src/app/dashboard/page.tsx` with:
   - Only Incidents section (Reports/Maintenance removed)
   - Only Monitors and Recent Incidents summary cards
   - Clean imports (no unused icons)
   - Adjusted grid layout

### Definition of Done
- [x] Reports section removed from `sections` array
- [x] Maintenance section removed from `sections` array
- [x] Status Pages card removed from `summaryCards`
- [x] Last Report card removed from `summaryCards`
- [x] Last Maintenance card removed from `summaryCards`
- [x] Unused imports (FileText, Wrench) removed
- [x] Grid columns adjusted from 5 to 2
- [x] Build passes without errors
- [x] Page renders correctly with only real data

### Must Have
- Keep Incidents section (real data exists via useIncidents)
- Keep Monitors and Recent Incidents summary cards
- Remove all hardcoded stub content
- Clean up unused imports

### Must NOT Have (Guardrails)
- **NO new features** - Just cleanup
- **NO API modifications** - Use existing endpoints
- **NO layout changes** - Keep same structure, just fewer items
- **NO adding incident list** - Keep as empty state for now

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: YES (Bun test runner)
- **Automated tests**: NO - Manual verification
- **Focus**: TypeScript compilation + UI verification

### QA Policy
Simple cleanup task - verify build passes and UI looks correct.

---

## Execution Strategy

### Sequential Execution (Single File)

```
Task 1: Remove stub sections from sections array
Task 2: Remove stub cards from summaryCards array  
Task 3: Clean imports and adjust grid layout
Task 4: Final verification
```

---

## TODOs

- [x] 1. Remove Reports and Maintenance Sections

  **What to do**:
  - Open `src/app/dashboard/page.tsx`
  - Remove the Reports section from `sections` array (lines 23-28):
    ```typescript
    // DELETE THIS:
    {
      title: "Reports",
      subtitle: "Reports over the last 7 days.",
      emptyText: "No reports found",
      emptyDescription: "You have no reports recorded in the last 7 days.",
      icon: FileText,
    },
    ```
  - Remove the Maintenance section from `sections` array (lines 30-35):
    ```typescript
    // DELETE THIS:
    {
      title: "Maintenance",
      subtitle: "Maintenance over the last 7 days.",
      emptyText: "No maintenances found",
      emptyDescription: "You have no maintenance windows in the last 7 days.",
      icon: Wrench,
    },
    ```
  - Keep only the Incidents section (lines 16-22)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple deletion task
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Task 2
  - **Blocked By**: None

  **References**:
  - `src/app/dashboard/page.tsx` lines 15-37 - The sections array

  **Acceptance Criteria**:
  - [ ] Reports section removed
  - [ ] Maintenance section removed
  - [ ] Only Incidents section remains
  - [ ] File compiles without errors

  **Commit**: NO (groups with Task 3)

---

- [x] 2. Remove Stub Summary Cards

  **What to do**:
  - Remove "Status Pages" card (line 51):
    ```typescript
    // DELETE THIS:
    { label: "Status Pages", value: "0", icon: FileText },
    ```
  - Remove "Last Report" card (line 57):
    ```typescript
    // DELETE THIS:
    { label: "Last Report", value: "None", icon: FileText },
    ```
  - Remove "Last Maintenance" card (line 58):
    ```typescript
    // DELETE THIS:
    { label: "Last Maintenance", value: "None", icon: Wrench },
    ```
  - Keep only "Monitors" (lines 46-50) and "Recent Incidents" (lines 52-56)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Task 3
  - **Blocked By**: Task 1

  **References**:
  - `src/app/dashboard/page.tsx` lines 45-59 - The summaryCards array

  **Acceptance Criteria**:
  - [ ] Status Pages card removed
  - [ ] Last Report card removed
  - [ ] Last Maintenance card removed
  - [ ] Only Monitors and Recent Incidents cards remain

  **Commit**: NO (groups with Task 3)

---

- [x] 3. Clean Imports and Adjust Grid Layout

  **What to do**:
  - Remove unused imports from line 3:
    ```typescript
    // BEFORE:
    import { Activity, AlertTriangle, FileText, Wrench } from "lucide-react";
    
    // AFTER:
    import { Activity, AlertTriangle } from "lucide-react";
    ```
  - Update grid columns from 5 to 2 (line 72):
    ```typescript
    // BEFORE:
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
    
    // AFTER:
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    ```
  - Alternative: Keep responsive grid but cap at 2 columns:
    ```typescript
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    ```

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential
  - **Blocks**: Task 4
  - **Blocked By**: Task 2

  **References**:
  - `src/app/dashboard/page.tsx` line 3 - Imports
  - `src/app/dashboard/page.tsx` line 72 - Grid layout

  **Acceptance Criteria**:
  - [ ] FileText import removed
  - [ ] Wrench import removed
  - [ ] Grid columns adjusted to 2
  - [ ] No TypeScript errors

  **Commit**: YES
  - Message: `refactor(dashboard): remove unimplemented Reports and Maintenance sections`
  - Files: `src/app/dashboard/page.tsx`
  - Pre-commit: `bun run format`

---

- [x] 4. Final Verification

  **What to do**:
  - Run `bun run build` - verify no TypeScript errors
  - Run `bun run lint` - verify no linting issues
  - Run `bun run format` - ensure code formatted
  - Verify dashboard loads at `/dashboard`
  - Verify only Monitors and Recent Incidents cards show
  - Verify only Incidents section shows

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (last)
  - **Blocks**: None
  - **Blocked By**: Task 3

  **Acceptance Criteria**:
  - [ ] `bun run build` passes
  - [ ] `bun run lint` passes
  - [ ] Dashboard shows only real data
  - [ ] No stub content visible

  **QA Scenarios**:
  ```
  Scenario: Dashboard shows only implemented features
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard
      2. Verify Monitors card shows real count
      3. Verify Recent Incidents card shows real count
      4. Verify Incidents section visible
      5. Verify NO "Reports" text on page
      6. Verify NO "Maintenance" text on page
      7. Verify NO "Status Pages" text on page
    Expected Result: Only implemented features visible
    Evidence: .sisyphus/evidence/task-04-dashboard-cleanup.png
  ```

  **Commit**: NO (already committed in Task 3)

---

## Final Verification Wave

- [x] F1. **Build Verification** — `quick`
  Run `bun run build` + `bun run lint`
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | VERDICT`

- [x] F2. **UI Verification** — `unspecified-high`
  Navigate to /dashboard, verify only Monitors and Incidents visible
  Output: `Cards [2/2] | Sections [1/1] | VERDICT`

---

## Commit Strategy

| After Task | Message | Files |
|------------|---------|-------|
| 3 | `refactor(dashboard): remove unimplemented Reports and Maintenance sections` | `src/app/dashboard/page.tsx` |

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

# Verify dashboard loads
curl http://localhost:3000/dashboard
# Expected: Returns HTML without "Reports" or "Maintenance" text
```

### Final Checklist
- [x] Reports section removed
- [x] Maintenance section removed
- [x] Status Pages card removed
- [x] Last Report card removed
- [x] Last Maintenance card removed
- [x] Unused imports removed
- [x] Grid layout adjusted
- [x] Build passes
- [x] Lint passes

---

## Expected Result

**Before**:
```
Dashboard Overview
├── Summary Cards (5): Monitors, Status Pages, Recent Incidents, Last Report, Last Maintenance
└── Sections (3): Incidents, Reports, Maintenance
```

**After**:
```
Dashboard Overview
├── Summary Cards (2): Monitors, Recent Incidents
└── Sections (1): Incidents
```

---

*Plan generated by Prometheus. Execute with `/start-work` command.*
