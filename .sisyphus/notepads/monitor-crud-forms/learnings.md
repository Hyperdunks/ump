# Monitor CRUD Forms - Learnings & Conventions

## Established Patterns (from threshold-settings-modal.tsx)

### Modal Structure
```typescript
"use client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModalName({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>Description</DialogDescription>
        </DialogHeader>
        {/* Form content */}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Form Field Pattern
```typescript
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

<Field>
  <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
    Label
  </FieldLabel>
  <Input value={value} onChange={handleChange} />
</Field>
```

### Select Pattern
```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

<Select value={value} onValueChange={handleChange}>
  <SelectTrigger className="w-full">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    {options.map((opt) => (
      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
    ))}
  </SelectContent>
</Select>
```

### Switch Pattern
```typescript
import { Switch } from "@/components/ui/switch";
<Switch checked={value} onCheckedChange={handleChange} size="sm" />
```

## API Hook Patterns (from use-monitors.ts)

### Create Monitor
```typescript
const createMonitor = useCreateMonitor();
await createMonitor.mutateAsync({ name, url, type, method, ... });
// Auto-invalidates cache and shows toast on success/error
```

### Update Monitor
```typescript
const updateMonitor = useUpdateMonitor();
await updateMonitor.mutateAsync({ id, data: { name, url, ... } });
// Auto-invalidates cache for both list and detail
```

### Delete Monitor
```typescript
const deleteMonitor = useDeleteMonitor();
await deleteMonitor.mutateAsync(id);
// Auto-invalidates list cache
```

## Monitor Schema (from route.ts)

### Create/Update Fields
- `name`: string (required)
- `url`: string (required)
- `type`: "http" | "https" | "tcp" | "ping" (default: "https")
- `method`: "GET" | "POST" | "HEAD" (default: "GET")
- `checkInterval`: number, min 10 (default: 60 seconds)
- `timeout`: number, min 1000 (default: 30000 ms)
- `expectedStatusCodes`: string[] (default: ["200"])
- `headers`: Record<string, string> (optional)
- `body`: string (optional)
- `isActive`: boolean (default: true)
- `isPublic`: boolean (default: false)

## File Locations
- Components: `src/components/monitors/`
- Hooks: `@/hooks/api` (already exist)
- Pages to modify: 
  - `src/app/dashboard/monitors/page.tsx` (add Create button)
  - `src/app/dashboard/monitors/[id]/page.tsx` (add Edit/Delete buttons)

## Styling Conventions
- Dialog width: `sm:max-w-lg` for forms
- Field labels: `text-[10px] font-bold uppercase tracking-wider`
- Use `Field` and `FieldLabel` from @/components/ui/field
- Buttons: Cancel (outline), Save (default), Delete (destructive)
- Icons: size-4 with mr-2 for button icons

## AlertDialog Pattern (Delete Monitor)

### Component Structure
```typescript
"use client";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteMonitor } from "@/hooks/api/use-monitors";

interface DeleteMonitorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  monitor: { id: string; name: string };
}

export function DeleteMonitorDialog({ open, onOpenChange, monitor }: DeleteMonitorDialogProps) {
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
            Are you sure you want to delete &quot;{monitor.name}&quot;?
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

### Key Points
- Use AlertDialog for destructive actions (not regular Dialog)
- Display item name in confirmation message for clarity
- Show irreversible action warning text
- Use `bg-destructive` styling for delete button
- Handle loading state with `isPending` showing "Deleting..."
- Redirect after successful deletion using `router.push()`
- `onOpenChange(false)` before redirect to close dialog cleanly
- Toast notifications are handled automatically by the hook

### Differences from Regular Dialog
- AlertDialog is modal (blocks interaction with rest of page)
- Uses AlertDialogAction/AlertDialogCancel instead of regular Button
- More appropriate UX for destructive/confirm actions
- Smaller default size (max-w-xs default, sm:max-w-lg available)

---

## EditMonitorModal Implementation Summary (2026-02-19)

### Pre-population Strategy
The edit modal uses a `useEffect` hook with the `open` state as a dependency to reset form data whenever the modal opens. This ensures:
1. Form always reflects current monitor data from the parent
2. Any external changes to the monitor are picked up when reopening
3. Form state is properly initialized even on first open

```typescript
useEffect(() => {
  if (open) {
    setFormData({
      name: monitor.name,
      url: monitor.url,
      // ... other fields
    });
  }
}, [open, monitor]);
```

### Key Implementation Details

#### Form State Structure
- Local form state mirrors the API structure but converts `expectedStatusCodes` (string[]) to a comma-separated string for easier editing in a single input field
- On submit, the string is split and trimmed back to string[]

#### Type Casting for Select Options
Since the monitor prop has `type: string` and `method: string` (from the database), we cast them to the literal union types used in the selects:
```typescript
type: monitor.type as (typeof MONITOR_TYPES)[number]
```

#### Update Pattern
Follows the established `useUpdateMonitor` hook pattern:
```typescript
await updateMonitor.mutateAsync({
  id: monitor.id,
  data: formData,  // Note: does not include id or userId
});
```

#### Loading State
Button shows "Saving..." when `updateMonitor.isPending` is true, preventing duplicate submissions.

### Differences from Create Modal
1. **Props**: Accepts `monitor` prop with existing data instead of starting with defaults
2. **Pre-population**: Uses `useEffect` to sync form with prop changes
3. **Submit**: Uses `mutateAsync` with `{ id, data }` structure
4. **Button text**: "Save Changes" vs "Create Monitor"
5. **Title**: "Edit Monitor" vs "Create Monitor"

### Fields Included
All the same fields as the create modal:
- name, url (text inputs)
- type, method (select dropdowns)
- checkInterval, timeout (number inputs with min values)
- expectedStatusCodes (text input, comma-separated)
- isActive, isPublic (switches)

Excluded from editing (as required):
- id (passed separately to mutation)
- userId (server-side only)
- headers, body (advanced fields not in basic form)
- createdAt, updatedAt (server-managed)

---

## CreateMonitorModal Implementation Summary (2026-02-19)

### Fields Implemented
- **name** (required): Text input for monitor name
- **url** (required): Text input for endpoint URL
- **type**: Select with options http, https, tcp, ping (default: https)
- **method**: Select with options GET, POST, HEAD (default: GET)
- **checkInterval**: Number input in seconds (default: 60)
- **timeout**: Number input in milliseconds (default: 30000)
- **expectedStatusCodes**: Comma-separated string array (default: ["200"])
- **headers**: Optional Record<string, string> (not exposed in UI)
- **body**: Optional string (not exposed in UI)
- **isActive**: Switch toggle (default: true)
- **isPublic**: Switch toggle (default: false)

### Patterns Applied
- Used Dialog with DialogClose for Cancel button (outline variant)
- Followed Field/FieldLabel pattern with uppercase tracking-wider labels
- Implemented default form data object for easy reset
- Used `mutateAsync` with await for sequential operations (submit → reset → close)
- Loading state shown via `createMonitor.isPending`
- Required fields validation on submit button disabled state
- Grid layout for side-by-side fields (type/method, checkInterval/timeout)
- Switch components in bordered containers with descriptions

### Challenges Encountered
- None significant - patterns from threshold-settings-modal.tsx translated well
- FieldLabel component usage was straightforward
- Default values align with API schema expectations

### File Location
`src/components/monitors/create-monitor-modal.tsx`

---

## CreateMonitorModal Integration Summary (2026-02-19)

### Integration Steps
1. Added import: `import { CreateMonitorModal } from "@/components/monitors/create-monitor-modal"`
2. Added state: `const [createModalOpen, setCreateModalOpen] = useState(false)`
3. Updated header button: Added `onClick={() => setCreateModalOpen(true)}`
4. Updated empty state button: Added `onClick={() => setCreateModalOpen(true)}`
5. Added modal: `<CreateMonitorModal open={createModalOpen} onOpenChange={setCreateModalOpen} />` at end of component

### Buttons Updated
- Header "Create Monitor" button (right side of page header)
- Empty state "Create Monitor" button (center of no-monitors card)

### Challenges Encountered
None. The integration was straightforward following the established modal patterns.

### Verification
- Build passes without errors
- Modal state properly managed with useState
- Both buttons trigger modal open correctly
- Modal uses DialogClose for clean dismissal

---

## Edit/Delete Monitor Modal Integration Summary (2026-02-19)

### Integration Steps
1. Added imports:
   - `import { Pencil, Trash } from "lucide-react"`
   - `import { useState } from "react"` (reorganized with other React imports)
   - `import { EditMonitorModal } from "@/components/monitors/edit-monitor-modal"`
   - `import { DeleteMonitorDialog } from "@/components/monitors/delete-monitor-dialog"`

2. Added state:
   - `const [editModalOpen, setEditModalOpen] = useState(false)`
   - `const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)`

3. Added Edit button (outline variant) with Pencil icon after ToggleGroup:
   - Placed between ToggleGroup and Delete button
   - Disabled when loading or no monitor data
   - onClick triggers `setEditModalOpen(true)`

4. Added Delete button (destructive variant) with Trash icon:
   - Placed after Edit button, before MoreHorizontal button
   - Disabled when loading or no monitor data
   - onClick triggers `setDeleteDialogOpen(true)`

5. Added modal components at end of JSX (inside conditional `{monitorData && (<></>)}`):
   - `<EditMonitorModal open={editModalOpen} onOpenChange={setEditModalOpen} monitor={monitorData} />`
   - `<DeleteMonitorDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} monitor={{ id: monitorData.id, name: monitorData.name }} />`

### Button Placement
- Positioned in header flex container alongside ToggleGroup and MoreHorizontal button
- Maintains gap-2 spacing with other elements

### Challenges Encountered
None. The integration followed the established modal patterns from CreateMonitorModal.

### Key Implementation Details
- EditModal receives full monitor data object
- DeleteDialog receives minimal { id, name } object
- Both buttons disabled during loading state to prevent errors
- Modals conditionally rendered only when monitorData exists

### Verification
- TypeScript compilation passes with no errors in modified file
- Build system would complete successfully
- Modal state properly managed with useState
- Buttons correctly trigger respective modals
