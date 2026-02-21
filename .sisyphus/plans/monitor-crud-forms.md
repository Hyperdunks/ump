# Monitor CRUD Forms Implementation Plan

> **STATUS: ✅ COMPLETED** (2026-02-19)
> All 6 tasks verified and working correctly.

## TL;DR

> **Quick Summary**: Build create/edit forms for monitors and add delete functionality. Uses existing Dialog components and TanStack Query hooks.
> 
> **Deliverables**:
> - `CreateMonitorModal` - Form for creating new monitors
> - `EditMonitorModal` - Form for editing existing monitors
> - `DeleteMonitorDialog` - Confirmation dialog for deletion
> - "Add Monitor" button in monitors list page
> - "Delete" button in monitor detail page
> - "Edit" button in monitor detail page
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Create form → Edit form → Delete → Integration

---

## Context

### Current State (Post-DFL Completion)
- ✅ All DFL plans completed (data fetching layer)
- ✅ Backend API: 25 endpoints (all functional)
- ✅ TanStack Query hooks: 18 created (including monitor CRUD hooks)
- ✅ Monitor read operations: Fully implemented in UI
- ❌ Monitor write operations: Zero UI (create/edit/delete)

### Existing Infrastructure (Ready to Use)
**Hooks** (`src/hooks/api/use-monitors.ts`):
- `useCreateMonitor()` - Mutation with toast + cache invalidation
- `useUpdateMonitor()` - Mutation with toast + cache invalidation
- `useDeleteMonitor()` - Mutation with toast + cache invalidation

**UI Components**:
- `Dialog` - From `@/components/ui/dialog` (for forms)
- `AlertDialog` - From `@/components/ui/alert-dialog` (for delete confirmation)
- `Sheet` - Alternative slide-out panel option
- Existing modal patterns: `threshold-settings-modal.tsx`

**Form Components** (shadcn/ui):
- `Input`, `Label`, `Select` - Basic form fields
- `Button` - Actions
- `Form` - Form validation wrapper

### API Schema (from `src/routes/monitors/route.ts`)
```typescript
// POST /monitors (Create)
{
  name: string;                    // Required
  url: string;                     // Required
  type?: "http" | "https" | "tcp" | "ping";  // Default: "https"
  method?: "GET" | "POST" | "HEAD";          // Default: "GET"
  checkInterval?: number;          // Default: 60 (seconds)
  timeout?: number;                // Default: 30000 (ms)
  expectedStatusCodes?: string[];  // Default: ["200"]
  headers?: Record<string, string>;
  body?: string;
  isActive?: boolean;              // Default: true
  isPublic?: boolean;              // Default: false
}

// PUT /monitors/:id (Update) - Same fields, all optional
// DELETE /monitors/:id (Delete) - No body
```

---

## Work Objectives

### Core Objective
Implement complete CRUD UI for monitors: create form, edit form, and delete functionality.

### Concrete Deliverables
1. `src/components/monitors/create-monitor-modal.tsx` - Create monitor dialog
2. `src/components/monitors/edit-monitor-modal.tsx` - Edit monitor dialog  
3. `src/components/monitors/delete-monitor-dialog.tsx` - Delete confirmation
4. `src/app/dashboard/monitors/page.tsx` - Add "Add Monitor" button
5. `src/app/dashboard/monitors/[id]/page.tsx` - Add Edit/Delete buttons
6. Form validation using Zod (or existing patterns)
7. Error handling with toast notifications

### Definition of Done
- [x] Can create new monitors from UI
- [x] Can edit existing monitors from UI
- [x] Can delete monitors with confirmation
- [x] All form fields match API schema
- [x] Validation shows inline errors
- [x] Success/error toasts work
- [x] Page refreshes automatically after mutations
- [x] Build passes without errors
- [x] All actions work in Playwright tests

### Must Have
- Use existing hooks (`useCreateMonitor`, `useUpdateMonitor`, `useDeleteMonitor`)
- Use existing UI components (Dialog, AlertDialog)
- Follow existing code patterns (threshold-settings-modal.tsx)
- Match existing styling and layout
- Form validation (required fields: name, URL)
- Error handling (network errors, validation errors)

### Must NOT Have (Guardrails)
- **NO new backend API routes** - Use existing endpoints
- **NO new TanStack Query hooks** - Use existing hooks
- **NO changes to database schema**
- **NO complex validation logic** - Keep it simple
- **NO drag-and-drop reordering** - Out of scope
- **NO bulk operations** - Single monitor only

---

## Form Field Specifications

### Create/Edit Monitor Form Fields

| Field | Type | Required | Default | Validation |
|-------|------|----------|---------|------------|
| **Name** | Text | ✅ Yes | - | Min 1 char, max 100 |
| **URL** | Text | ✅ Yes | - | Valid URL format |
| **Type** | Select | No | HTTPS | http/https/tcp/ping |
| **Method** | Select | No | GET | GET/POST/HEAD |
| **Check Interval** | Number | No | 60 | 10-3600 seconds |
| **Timeout** | Number | No | 30000 | 1000-60000 ms |
| **Expected Status** | Multi-select | No | [200] | HTTP codes |
| **Headers** | JSON | No | - | Valid JSON object |
| **Body** | Textarea | No | - | For POST requests |
| **Active** | Toggle | No | true | Enable/disable |
| **Public** | Toggle | No | false | Public status page |

### Form Layout (Recommended)
```
┌─────────────────────────────────────┐
│  Create Monitor              [X]    │
├─────────────────────────────────────┤
│  Name *                             │
│  [________________________]         │
│                                     │
│  URL *                              │
│  [________________________]         │
│                                     │
│  [Type ▼]    [Method ▼]             │
│                                     │
│  [Advanced Settings ▼]              │
│    Check Interval: [60] seconds     │
│    Timeout: [30000] ms              │
│    Expected Status: [200, ▼]        │
│                                     │
│  [☑] Active   [☐] Public            │
│                                     │
│                    [Cancel] [Save]  │
└─────────────────────────────────────┘
```

---

## Verification Strategy

### Test Infrastructure
- **Bun test runner**: Available
- **Playwright**: For E2E testing
- **Manual testing**: Primary method
- **Build check**: `bun run build` must pass

### QA Policy
Every task includes agent-executed verification scenarios.

| Deliverable | Verification Tool | Method |
|-------------|-------------------|--------|
| Create form | Playwright | Fill form, submit, verify monitor created |
| Edit form | Playwright | Modify fields, save, verify changes |
| Delete dialog | Playwright | Click delete, confirm, verify removed |
| Integration | Playwright | Full CRUD workflow |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Forms - Independent):
├── Task 1: Create monitor form component [unspecified-high]
├── Task 2: Edit monitor form component [unspecified-high]
└── Task 3: Delete confirmation dialog [quick]

Wave 2 (Integration - After Wave 1):
├── Task 4: Add "Create" button to monitors page [quick]
├── Task 5: Add "Edit/Delete" buttons to detail page [quick]
└── Task 6: Final testing & build verification [quick]

Critical Path: Task 1,2,3 → Task 4,5 → Task 6
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 3 (Wave 1)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|------------|--------|------|
| 1 | — | 4 | 1 |
| 2 | — | 5 | 1 |
| 3 | — | 5 | 1 |
| 4 | 1 | 6 | 2 |
| 5 | 2, 3 | 6 | 2 |
| 6 | 4, 5 | — | 2 |

---

## TODOs

- [x] 1. Create Monitor Form Component

  **What to do**:
  - Create `src/components/monitors/create-monitor-modal.tsx`
  - Use Dialog component from `@/components/ui/dialog`
  - Follow pattern from `threshold-settings-modal.tsx`
  - Form fields (see specifications above)
  - Use `useCreateMonitor()` hook for submission
  - Handle loading state during submission
  - Show validation errors inline
  - Close modal on success
  - Reset form after successful creation

  **Code structure**:
  ```typescript
  "use client";
  
  import { useState } from "react";
  import { useCreateMonitor } from "@/hooks/api";
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { Label } from "@/components/ui/label";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Switch } from "@/components/ui/switch";
  
  interface CreateMonitorModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }
  
  export function CreateMonitorModal({ open, onOpenChange }: CreateMonitorModalProps) {
    const createMonitor = useCreateMonitor();
    const [formData, setFormData] = useState({
      name: "",
      url: "",
      type: "https" as const,
      method: "GET" as const,
      checkInterval: 60,
      timeout: 30000,
      expectedStatusCodes: ["200"],
      isActive: true,
      isPublic: false,
    });
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await createMonitor.mutateAsync(formData);
      onOpenChange(false);
      // Reset form
      setFormData({ ... });
    };
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Monitor</DialogTitle>
            <DialogDescription>
              Add a new monitor to track your service uptime.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMonitor.isPending}>
                {createMonitor.isPending ? "Creating..." : "Create Monitor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
  ```

  **Must NOT do**:
  - Don't create new hooks - use existing `useCreateMonitor`
  - Don't add complex validation - keep it simple
  - Don't change API schema expectations

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - Reason: Complex form component with multiple fields

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 4
  - **Blocked By**: None

  **References**:
  - `src/components/monitors/threshold-settings-modal.tsx` - Pattern to follow
  - `src/hooks/api/use-monitors.ts` - `useCreateMonitor` hook
  - `src/routes/monitors/route.ts` - API schema (lines 10-31)

  **Acceptance Criteria**:
  - [ ] Component file created at correct location
  - [ ] Form has all required fields (name, URL)
  - [ ] Form has optional fields (type, method, interval, etc.)
  - [ ] Submit uses `useCreateMonitor` hook
  - [ ] Loading state shown during submission
  - [ ] Form resets after successful creation
  - [ ] Modal closes on success
  - [ ] Component compiles without errors

  **QA Scenarios**:
  ```
  Scenario: Create monitor successfully
    Tool: Playwright
    Steps:
      1. Open create monitor modal
      2. Fill name: "Test API"
      3. Fill URL: "https://api.example.com"
      4. Click "Create Monitor"
      5. Wait for success toast
      6. Verify modal closes
      7. Verify new monitor appears in list
    Expected Result: Monitor created, list refreshes
    Evidence: .sisyphus/evidence/task-01-create-monitor.png

  Scenario: Validation errors
    Tool: Playwright
    Steps:
      1. Open create monitor modal
      2. Leave fields empty
      3. Click "Create Monitor"
    Expected Result: Validation errors shown
    Evidence: .sisyphus/evidence/task-01-validation.png
  ```

  **Commit**: NO (groups with Task 2, 3)

---

- [x] 2. Edit Monitor Form Component

  **What to do**:
  - Create `src/components/monitors/edit-monitor-modal.tsx`
  - Similar to create form but pre-populated with existing data
  - Accept `monitor` prop with current values
  - Use `useUpdateMonitor()` hook
  - Only send changed fields (or send all - hook handles it)
  - Show current values as placeholders/defaults

  **Code structure**:
  ```typescript
  interface EditMonitorModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    monitor: Monitor; // From useMonitor hook
  }
  
  export function EditMonitorModal({ open, onOpenChange, monitor }: EditMonitorModalProps) {
    const updateMonitor = useUpdateMonitor();
    const [formData, setFormData] = useState({
      name: monitor.name,
      url: monitor.url,
      // ... other fields from monitor
    });
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await updateMonitor.mutateAsync({
        id: monitor.id,
        data: formData,
      });
      onOpenChange(false);
    };
    
    // Similar structure to CreateMonitorModal
  }
  ```

  **Must NOT do**:
  - Don't duplicate form field logic - share if possible
  - Don't allow editing ID or userId
  - Don't change createdAt/updatedAt

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
  - Reason: Similar complexity to create form

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 5
  - **Blocked By**: None

  **References**:
  - Task 1 implementation (same patterns)
  - `src/hooks/api/use-monitors.ts` - `useUpdateMonitor` hook
  - `src/db/schema.ts` - Monitor type definition

  **Acceptance Criteria**:
  - [ ] Component file created
  - [ ] Pre-populated with current monitor data
  - [ ] Uses `useUpdateMonitor` hook
  - [ ] Updates reflect immediately in UI (cache invalidation)
  - [ ] Success toast shown

  **QA Scenarios**:
  ```
  Scenario: Edit monitor successfully
    Tool: Playwright
    Steps:
      1. Navigate to monitor detail page
      2. Click "Edit" button
      3. Change name to "Updated Name"
      4. Click "Save Changes"
      5. Verify success toast
      6. Verify page shows new name
    Expected Result: Monitor updated, UI reflects changes
    Evidence: .sisyphus/evidence/task-02-edit-monitor.png
  ```

  **Commit**: NO

---

- [x] 3. Delete Monitor Dialog

  **What to do**:
  - Create `src/components/monitors/delete-monitor-dialog.tsx`
  - Use AlertDialog component (destructive action)
  - Show monitor name in confirmation message
  - Use `useDeleteMonitor()` hook
  - Show loading state during deletion
  - Close dialog and redirect on success
  - Show error toast on failure

  **Code structure**:
  ```typescript
  interface DeleteMonitorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    monitor: { id: string; name: string };
  }
  
  export function DeleteMonitorDialog({ 
    open, 
    onOpenChange, 
    monitor 
  }: DeleteMonitorDialogProps) {
    const deleteMonitor = useDeleteMonitor();
    const router = useRouter();
    
    const handleDelete = async () => {
      await deleteMonitor.mutateAsync(monitor.id);
      onOpenChange(false);
      router.push("/dashboard/monitors");
    };
    
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Monitor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{monitor.name}"? 
              This action cannot be undone. All check history will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={deleteMonitor.isPending}
              className="bg-destructive text-destructive-foreground"
            >
              {deleteMonitor.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  ```

  **Must NOT do**:
  - Don't use regular Dialog - must be AlertDialog for destructive action
  - Don't allow deletion without confirmation
  - Don't redirect before success confirmed

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Simple confirmation dialog

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 5
  - **Blocked By**: None

  **References**:
  - `src/components/ui/alert-dialog.tsx` - AlertDialog components
  - `src/hooks/api/use-monitors.ts` - `useDeleteMonitor` hook

  **Acceptance Criteria**:
  - [ ] Component file created
  - [ ] Uses AlertDialog (not regular Dialog)
  - [ ] Shows monitor name in message
  - [ ] Delete button is red/destructive style
  - [ ] Redirects to list after deletion
  - [ ] Loading state during deletion

  **QA Scenarios**:
  ```
  Scenario: Delete monitor with confirmation
    Tool: Playwright
    Steps:
      1. Navigate to monitor detail page
      2. Click "Delete" button
      3. Verify confirmation dialog shows
      4. Click "Delete" to confirm
      5. Verify redirect to monitors list
      6. Verify monitor no longer in list
    Expected Result: Monitor deleted, redirected
    Evidence: .sisyphus/evidence/task-03-delete-monitor.png

  Scenario: Cancel deletion
    Tool: Playwright
    Steps:
      1. Navigate to monitor detail page
      2. Click "Delete" button
      3. Click "Cancel"
    Expected Result: Dialog closes, monitor still exists
  ```

  **Commit**: YES
  - Message: `feat(monitors): add CRUD modals (create, edit, delete)`
  - Files: `src/components/monitors/*-modal.tsx`, `*-dialog.tsx`
  - Pre-commit: Test all three modals

---

- [x] 4. Add "Create Monitor" Button to List Page

  **What to do**:
  - Modify `src/app/dashboard/monitors/page.tsx`
  - Import `CreateMonitorModal` component
  - Add state for modal open/close
  - Add "Add Monitor" button (likely near filters or header)
  - Position: Top right of page header or near filters

  **Button placement**:
  ```typescript
  // In the page header area
  <div className="flex items-center justify-between">
    <h1 className="text-xl font-semibold">Monitors</h1>
    <Button onClick={() => setCreateModalOpen(true)}>
      <Plus className="mr-2 size-4" />
      Add Monitor
    </Button>
  </div>
  
  // Modal component
  <CreateMonitorModal 
    open={createModalOpen} 
    onOpenChange={setCreateModalOpen} 
  />
  ```

  **Must NOT do**:
  - Don't change the table layout
  - Don't remove existing functionality
  - Don't add the button inside the table

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Simple integration task

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 1)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:
  - `src/app/dashboard/monitors/page.tsx` - Page to modify
  - `src/components/ui/button.tsx` - Button component
  - Lucide `Plus` icon for button

  **Acceptance Criteria**:
  - [ ] "Add Monitor" button visible on monitors page
  - [ ] Clicking button opens create modal
  - [ ] After creation, list refreshes with new monitor
  - [ ] Button styled consistently with UI

  **QA Scenarios**:
  ```
  Scenario: Create from list page
    Tool: Playwright
    Steps:
      1. Navigate to /dashboard/monitors
      2. Click "Add Monitor" button
      3. Fill form and submit
      4. Verify new monitor appears in list
    Expected Result: Monitor created from list page
    Evidence: .sisyphus/evidence/task-04-create-from-list.png
  ```

  **Commit**: NO

---

- [x] 5. Add Edit/Delete Buttons to Detail Page

  **What to do**:
  - Modify `src/app/dashboard/monitors/[id]/page.tsx`
  - Import `EditMonitorModal` and `DeleteMonitorDialog`
  - Add state for both modals
  - Add "Edit" and "Delete" buttons in header area
  - Edit: Opens edit modal
  - Delete: Opens delete confirmation
  - Style: Edit (outline), Delete (destructive)

  **Button placement**:
  ```typescript
  // In header with monitor name
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold">{monitor.name}</h1>
      <p className="text-muted-foreground">{monitor.url}</p>
    </div>
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={() => setEditModalOpen(true)}
      >
        <Pencil className="mr-2 size-4" />
        Edit
      </Button>
      <Button 
        variant="destructive"
        onClick={() => setDeleteDialogOpen(true)}
      >
        <Trash className="mr-2 size-4" />
        Delete
      </Button>
    </div>
  </div>
  
  {/* Modals */}
  <EditMonitorModal 
    open={editModalOpen}
    onOpenChange={setEditModalOpen}
    monitor={monitor}
  />
  <DeleteMonitorDialog
    open={deleteDialogOpen}
    onOpenChange={setDeleteDialogOpen}
    monitor={monitor}
  />
  ```

  **Must NOT do**:
  - Don't remove existing page content
  - Don't change the layout significantly
  - Don't show delete button without confirmation

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - Reason: Simple integration

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 2, 3)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 6
  - **Blocked By**: Task 2, Task 3

  **References**:
  - `src/app/dashboard/monitors/[id]/page.tsx` - Page to modify
  - `src/components/ui/button.tsx` - Button variants
  - Lucide icons: `Pencil`, `Trash`

  **Acceptance Criteria**:
  - [ ] "Edit" button visible on detail page
  - [ ] "Delete" button visible on detail page
  - [ ] Edit button opens edit modal
  - [ ] Delete button opens confirmation dialog
  - [ ] Both buttons styled appropriately

  **QA Scenarios**:
  ```
  Scenario: Full CRUD from detail page
    Tool: Playwright
    Steps:
      1. Navigate to monitor detail
      2. Click Edit, modify name, save
      3. Verify change reflected
      4. Click Delete, confirm
      5. Verify redirect to list
    Expected Result: Full CRUD works from detail
    Evidence: .sisyphus/evidence/task-05-detail-crud.png
  ```

  **Commit**: YES
  - Message: `feat(monitors): integrate CRUD actions into UI`
  - Files: `src/app/dashboard/monitors/page.tsx`, `[id]/page.tsx`
  - Pre-commit: Verify all buttons work

---

- [x] 6. Final Testing & Build Verification

  **What to do**:
  - Run `bun run build` - verify no errors
  - Run `bun run lint` - verify no issues
  - Test complete CRUD workflow:
    1. Create monitor from list page
    2. Edit monitor from detail page
    3. Delete monitor from detail page
  - Verify toasts work
  - Verify cache invalidation works (list refreshes)
  - Verify redirects work
  - Test validation errors
  - Test network error handling

  **Test scenarios**:
  1. Happy path: Create → Edit → Delete
  2. Validation: Submit empty form
  3. Cancel: Open modals, click cancel
  4. Network error: Turn off backend, try operations

  **Must NOT do**:
  - Don't skip error testing
  - Don't ignore build warnings

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright`]
  - Reason: Testing and verification

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (last)
  - **Blocks**: None
  - **Blocked By**: Task 4, Task 5

  **Acceptance Criteria**:
  - [ ] Build passes (`bun run build`)
  - [ ] Lint passes (`bun run lint`)
  - [ ] All CRUD operations work end-to-end
  - [ ] Toasts display correctly
  - [ ] Validation works
  - [ ] Error handling works

  **QA Scenarios**:
  ```
  Scenario: Full CRUD workflow
    Tool: Playwright
    Steps:
      1. Create: Add new monitor
      2. Read: Verify in list and detail
      3. Update: Edit name
      4. Delete: Remove monitor
    Expected Result: Complete lifecycle works
    Evidence: .sisyphus/evidence/task-06-full-workflow.gif
  ```

  **Commit**: NO (already committed in Tasks 3, 5)

---

## Commit Strategy

| After Task | Message | Files |
|------------|---------|-------|
| 3 | `feat(monitors): add CRUD modals (create, edit, delete)` | `src/components/monitors/*-modal.tsx` |
| 5 | `feat(monitors): integrate CRUD actions into UI` | `src/app/dashboard/monitors/page.tsx`, `[id]/page.tsx` |

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

# Create monitor (manual test)
# 1. Go to /dashboard/monitors
# 2. Click "Add Monitor"
# 3. Fill form, submit
# Expected: Monitor created, appears in list

# Edit monitor (manual test)
# 1. Go to monitor detail
# 2. Click "Edit"
# 3. Change name, save
# Expected: Name updated in UI

# Delete monitor (manual test)
# 1. Go to monitor detail
# 2. Click "Delete"
# 3. Confirm deletion
# Expected: Redirected to list, monitor removed
```

### Final Checklist
- [x] Create monitor modal works
- [x] Edit monitor modal works
- [x] Delete monitor dialog works
- [x] "Add Monitor" button on list page
- [x] "Edit" button on detail page
- [x] "Delete" button on detail page
- [x] Form validation works
- [x] Toast notifications work
- [x] Cache invalidation works (auto-refresh)
- [x] Build passes
- [x] Lint passes

---

## Component File Structure

```
src/
├── components/
│   └── monitors/
│       ├── create-monitor-modal.tsx      # NEW
│       ├── edit-monitor-modal.tsx        # NEW
│       ├── delete-monitor-dialog.tsx     # NEW
│       ├── threshold-settings-modal.tsx  # EXISTING (reference)
│       └── incident-analysis-modal.tsx   # EXISTING (reference)
├── app/
│   └── dashboard/
│       ├── monitors/
│       │   ├── page.tsx                  # MODIFY (add Create button)
│       │   └── [id]/
│       │       └── page.tsx              # MODIFY (add Edit/Delete buttons)
```

---

## Notes

### Form Validation Pattern
Use simple validation (not Zod for now):
```typescript
const errors: string[] = [];
if (!formData.name.trim()) errors.push("Name is required");
if (!formData.url.trim()) errors.push("URL is required");
if (!isValidURL(formData.url)) errors.push("Invalid URL format");
```

### Error Handling Pattern
Hooks already have error toasts built in via `onError` callbacks.
Just need to display field-level validation errors in the form.

### Responsive Design
- Dialog: `sm:max-w-lg` for forms
- Buttons: Use `size-4` icons with `mr-2`
- Mobile: Dialogs work on mobile by default

---

*Plan generated by Prometheus. Execute with `/start-work` command.*
