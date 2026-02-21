# Sidebar Navigation Fix Plan

## TL;DR

> **Quick Summary**: Comprehensive sidebar fix with live monitor status, functional "+" buttons, dedicated Incidents page, and proper navigation.
> 
> **Deliverables**:
> - Status Pages link → `/status`
> - Monitors "+" → Opens CreateMonitorModal
> - Status Pages "+" → Opens CreateStatusPageModal (new)
> - Bottom sections show live monitors/status pages with status colors
> - New `/dashboard/incidents` page for monitor incidents
> - Keep Notifications as global notification center
> 
> **Estimated Effort**: Medium-Large (~2-3 hours)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Data hooks → Sidebar sections → Modal integration → Incidents page

---

## Context

### Original Request
Fix sidebar navigation with live data display, functional buttons, and proper page structure.

### User Decisions (Confirmed)
1. **Status Pages nav** → Link to `/status` (public page)
2. **Monitors "+"** → Opens CreateMonitorModal
3. **Status Pages "+"** → Opens CreateStatusPageModal (NEW modal needed)
4. **Bottom sections** → Show live list (max 4 each) with status colors
   - Green: Operational
   - Yellow: Degraded
   - Red: Down (with soft blink/pulse)
   - Monitors section first, then Status Pages
5. **Incidents vs Notifications** → Keep BOTH:
   - Notifications: Global notification center (existing)
   - Incidents: New page for monitor-specific incidents

### Reference
- Sidebar patterns: https://ui.shadcn.com/docs/components/base/sidebar
- Status colors: Green (operational), Yellow (degraded), Red (down)

---

## Work Objectives

### Core Objective
Transform sidebar into a live, functional navigation hub with real-time status indicators.

### Concrete Deliverables
1. **Sidebar Data Integration**
   - Use `useMonitors()` hook in sidebar for live monitor list
   - Create `useStatusPages()` hook or query for public monitors
   - Show status colors with soft pulse animation

2. **Modal Functionality**
   - Monitors "+" → Opens `CreateMonitorModal`
   - Status Pages "+" → Opens new `CreateStatusPageModal`

3. **New Page**
   - `/dashboard/incidents` - Monitor incidents list page
   - Keep `/dashboard/notifications` as global notifications

4. **Navigation Updates**
   - Add Incidents nav item
   - Status Pages nav → `/status`
   - Proper order: Overview, Monitors, Incidents, Status Pages

### Definition of Done
- [ ] Sidebar shows live monitors with status colors (max 4, scrollable)
- [ ] Sidebar shows live status pages (max 4, scrollable)
- [ ] Monitors "+" opens CreateMonitorModal
- [ ] Status Pages "+" opens CreateStatusPageModal
- [ ] Incidents nav item added
- [ ] `/dashboard/incidents` page created
- [ ] Notifications kept as global center
- [ ] Status Pages nav links to `/status`
- [ ] Build passes without errors

### Must Have
- Use existing `useMonitors()` hook
- Create minimal `CreateStatusPageModal` (just `isPublic` toggle for now)
- Status indicators with pulse animation for down status
- Scrollable sections if more than 4 items

### Must NOT Have (Guardrails)
- **NO complex status page management** - Just toggle public/private for now
- **NO new backend routes** - Use existing endpoints
- **NO over-engineering** - Keep it simple

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: YES (Bun test runner)
- **Automated tests**: NO - Manual + Playwright verification
- **Focus**: TypeScript compilation + UI functionality

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — Hooks & Data):
├── Task 1: Add hooks to sidebar for monitors/status pages [quick]
├── Task 2: Create CreateStatusPageModal component [quick]
└── Task 3: Create /dashboard/incidents page [quick]

Wave 2 (After Wave 1 — UI Sections):
├── Task 4: Implement live monitors section with status colors [visual-engineering]
├── Task 5: Implement live status pages section [visual-engineering]
└── Task 6: Add modal state management to sidebar [unspecified-high]

Wave 3 (After Wave 2 — Integration):
├── Task 7: Update nav items (Incidents, Status Pages link) [quick]
└── Task 8: Final verification [quick]

Critical Path: Task 1,2,3 → Task 4,5,6 → Task 7 → Task 8
Parallel Speedup: ~50% faster than sequential
Max Concurrent: 3 (Wave 1)
```

---

## TODOs

- [x] 1. Add Hooks to Sidebar for Data

  **What to do**:
  - Modify `src/components/app-sidebar.tsx`
  - Import `useMonitors` from `@/hooks/api`
  - Add `useMonitors()` call at top of component
  - Extract monitors data and loading state
  - For status pages: Query monitors where `isPublic === true` (or use existing monitors data filtered)

  ```typescript
  // Add imports
  import { useMonitors } from "@/hooks/api";
  
  // In component:
  const { data: monitorsData } = useMonitors();
  const monitors = monitorsData?.data ?? [];
  const publicMonitors = monitors.filter(m => m.isPublic);
  ```

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1

  **References**:
  - `src/hooks/api/use-monitors.ts`
  - `src/components/app-sidebar.tsx`

  **Acceptance Criteria**:
  - [x] useMonitors imported and called
  - [x] monitors data available in component
  - [x] publicMonitors filtered for status pages

  **Commit**: NO

---

- [x] 2. Create CreateStatusPageModal Component

  **What to do**:
  - Create `src/components/status-pages/create-status-page-modal.tsx`
  - For MVP: Just a modal that toggles a monitor's `isPublic` field
  - Props: `open`, `onOpenChange`
  - Content:
    - Title: "Create Status Page"
    - Description: "Make a monitor public to create a status page"
    - Dropdown to select a monitor (from monitors list)
    - Toggle to set `isPublic: true`
    - Uses `useUpdateMonitor()` hook

  ```typescript
  // Simplified MVP structure
  export function CreateStatusPageModal({ open, onOpenChange }: Props) {
    const [selectedMonitorId, setSelectedMonitorId] = useState<string>();
    const updateMonitor = useUpdateMonitor();
    
    const handleCreate = async () => {
      await updateMonitor.mutateAsync({
        id: selectedMonitorId,
        data: { isPublic: true }
      });
      onOpenChange(false);
    };
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* Form content */}
      </Dialog>
    );
  }
  ```

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1

  **References**:
  - `src/components/monitors/create-monitor-modal.tsx` - Pattern to follow
  - `src/hooks/api/use-monitors.ts` - useUpdateMonitor hook

  **Acceptance Criteria**:
  - [ ] Component created
  - [ ] Select dropdown for monitors
  - [ ] Toggle sets isPublic on selected monitor
  - [ ] Uses useUpdateMonitor hook

  **Commit**: NO

---

- [x] 3. Create /dashboard/incidents Page

  **What to do**:
  - Create `src/app/dashboard/incidents/page.tsx`
  - Page shows all incidents across all monitors
  - Use `useIncidents()` hook
  - Display similar to notifications page but focused on incidents
  - Include monitor name, status, timestamps

  ```typescript
  export default function IncidentsPage() {
    const { data, isLoading } = useIncidents();
    
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-semibold">Incidents</h1>
        {/* Incident list */}
      </div>
    );
  }
  ```

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1

  **References**:
  - `src/app/dashboard/notifications/page.tsx` - Pattern to follow
  - `src/hooks/api/use-incidents.ts`

  **Acceptance Criteria**:
  - [ ] Page created at correct location
  - [ ] Uses useIncidents hook
  - [ ] Shows incident list with monitor names
  - [ ] Links to incident detail page

  **Commit**: NO

---

- [x] 4. Implement Live Monitors Section with Status Colors

  **What to do**:
  - Update the sidebar "Monitors" section to show live data
  - Show max 4 monitors, scrollable if more
  - Status indicators:
    - Green circle: Operational (status === "up")
    - Yellow circle: Degraded (status === "degraded")
    - Red circle with pulse: Down (status === "down")
  - Use CSS animation for pulse on down status

  ```typescript
  {/* Monitors Section */}
  <SidebarGroup>
    <div className="flex items-center justify-between px-2">
      <SidebarGroupLabel className="p-0">
        Monitors ({monitors.length})
      </SidebarGroupLabel>
      <Button variant="ghost" size="icon-sm" onClick={() => setCreateMonitorOpen(true)}>
        <Plus className="size-3" />
      </Button>
    </div>
    <SidebarGroupContent>
      <ScrollArea className="max-h-32">
        {monitors.slice(0, 4).map((monitor) => (
          <SidebarMenuButton key={monitor.id} render={<Link href={`/dashboard/monitors/${monitor.id}`} />}>
            <span className={cn(
              "size-2 rounded-full",
              monitor.latestCheck?.status === "up" && "bg-green-500",
              monitor.latestCheck?.status === "degraded" && "bg-yellow-500",
              monitor.latestCheck?.status === "down" && "bg-red-500 animate-pulse"
            )} />
            <span className="truncate">{monitor.name}</span>
          </SidebarMenuButton>
        ))}
      </ScrollArea>
    </SidebarGroupContent>
  </SidebarGroup>
  ```

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
  - Reason: Status indicators with animations

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocked By**: Task 1

  **References**:
  - `src/components/ui/scroll-area.tsx`
  - Tailwind `animate-pulse` class

  **Acceptance Criteria**:
  - [ ] Shows live monitors (not hardcoded)
  - [ ] Max 4 visible, scrollable
  - [ ] Green/Yellow/Red status indicators
  - [ ] Pulse animation on down status
  - [ ] Click navigates to monitor detail

  **Commit**: NO

---

- [x] 5. Implement Live Status Pages Section

  **What to do**:
  - Similar to monitors section but for public monitors (status pages)
  - Show monitors where `isPublic === true`
  - Same status color indicators
  - Max 4, scrollable

  ```typescript
  {/* Status Pages Section */}
  <SidebarGroup>
    <div className="flex items-center justify-between px-2">
      <SidebarGroupLabel className="p-0">
        Status Pages ({publicMonitors.length})
      </SidebarGroupLabel>
      <Button variant="ghost" size="icon-sm" onClick={() => setCreateStatusPageOpen(true)}>
        <Plus className="size-3" />
      </Button>
    </div>
    <SidebarGroupContent>
      <ScrollArea className="max-h-32">
        {publicMonitors.slice(0, 4).map((monitor) => (
          <SidebarMenuButton key={monitor.id} render={<Link href={`/status/${monitor.id}`} />}>
            <span className={cn(
              "size-2 rounded-full",
              monitor.latestCheck?.status === "up" && "bg-green-500",
              monitor.latestCheck?.status === "degraded" && "bg-yellow-500",
              monitor.latestCheck?.status === "down" && "bg-red-500 animate-pulse"
            )} />
            <span className="truncate">{monitor.name}</span>
          </SidebarMenuButton>
        ))}
        {publicMonitors.length === 0 && (
          <p className="px-3 py-2 text-sm text-muted-foreground">No public status pages</p>
        )}
      </ScrollArea>
    </SidebarGroupContent>
  </SidebarGroup>
  ```

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocked By**: Task 1

  **Acceptance Criteria**:
  - [ ] Shows public monitors only
  - [ ] Max 4 visible, scrollable
  - [ ] Status color indicators
  - [ ] Click navigates to public status page
  - [ ] Empty state when no status pages

  **Commit**: NO

---

- [x] 6. Add Modal State Management to Sidebar

  **What to do**:
  - Add state for both modals in sidebar component
  - Import and render CreateMonitorModal
  - Import and render CreateStatusPageModal
  - Connect "+" buttons to open respective modals

  ```typescript
  // Add state
  const [createMonitorOpen, setCreateMonitorOpen] = useState(false);
  const [createStatusPageOpen, setCreateStatusPageOpen] = useState(false);
  
  // In return, add modals at end
  <CreateMonitorModal open={createMonitorOpen} onOpenChange={setCreateMonitorOpen} />
  <CreateStatusPageModal open={createStatusPageOpen} onOpenChange={setCreateStatusPageOpen} />
  ```

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocked By**: Task 2

  **Acceptance Criteria**:
  - [ ] Modal state added
  - [ ] CreateMonitorModal rendered and connected
  - [ ] CreateStatusPageModal rendered and connected
  - [ ] "+" buttons open respective modals

  **Commit**: NO

---

- [x] 7. Update Navigation Items

  **What to do**:
  - Update `navItems` array
  - Add Incidents nav item
  - Change Status Pages href to `/status`
  - Import AlertTriangle icon

  ```typescript
  import { Activity, AlertTriangle, Bell, Files, LayoutGrid, Plus } from "lucide-react";
  
  const navItems = [
    { href: "/dashboard", label: "Overview", icon: LayoutGrid },
    { href: "/dashboard/monitors", label: "Monitors", icon: Activity },
    { href: "/dashboard/incidents", label: "Incidents", icon: AlertTriangle },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { href: "/status", label: "Status Pages", icon: Files },
  ] as const;
  ```

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3
  - **Blocked By**: Tasks 4, 5, 6

  **Acceptance Criteria**:
  - [ ] Incidents nav item added
  - [ ] Status Pages href is `/status`
  - [ ] Notifications kept
  - [ ] AlertTriangle imported

  **Commit**: YES
  - Message: `feat(sidebar): add live monitor status, incidents page, and modal functionality`
  - Files: All modified files

---

- [ ] 8. Final Verification

  **What to do**:
  - Run `bun run build`
  - Run `bun run lint`
  - Run `bun run format`
  - Test all navigation
  - Test modal open/close
  - Verify status colors display

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright`]

  **Acceptance Criteria**:
  - [ ] Build passes
  - [ ] Lint passes
  - [ ] All nav items work
  - [ ] Modals open/close correctly
  - [ ] Status colors show correctly

  **Commit**: NO

---

## Final Verification Wave

- [ ] F1. **Build Verification** — `quick`
  Run `bun run build` + `bun run lint`
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | VERDICT`

- [ ] F2. **Navigation Verification** — `unspecified-high`
  Test all sidebar functionality
  Output: `Nav [5/5] | Modals [2/2] | Sections [live] | VERDICT`

---

## Commit Strategy

| After Task | Message | Files |
|------------|---------|-------|
| 7 | `feat(sidebar): add live monitor status, incidents page, and modal functionality` | All modified files |

---

## Success Criteria

### Final Checklist
- [ ] Sidebar shows live monitors with status colors
- [ ] Sidebar shows live status pages
- [ ] Monitors "+" opens CreateMonitorModal
- [ ] Status Pages "+" opens CreateStatusPageModal
- [ ] Incidents nav item works
- [ ] Incidents page created
- [ ] Notifications kept
- [ ] Status Pages nav links to /status
- [ ] Build passes
- [ ] Lint passes

---

## Expected Result

**Before**:
```
Sidebar
├── Nav items (broken Status Pages link)
├── Status Pages (0) - hardcoded
└── Monitors (0) - hardcoded
```

**After**:
```
Sidebar
├── Overview → /dashboard
├── Monitors → /dashboard/monitors
├── Incidents → /dashboard/incidents (NEW)
├── Notifications → /dashboard/notifications
├── Status Pages → /status
├── ───────────────────────
├── Monitors (3)
│   ├── 🟢 API Server
│   ├── 🔴 Database (pulsing)
│   └── 🟡 Cache Server
└── Status Pages (2)
    ├── 🟢 Public API
    └── 🟢 Website
```

---

*Plan generated by Prometheus. Execute with `/start-work` command.*
