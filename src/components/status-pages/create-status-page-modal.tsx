"use client";

import { Globe } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateMonitor } from "@/hooks/api/use-monitors";

interface Monitor {
  id: string;
  name: string;
  isPublic: boolean;
}

interface CreateStatusPageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  monitors: Monitor[];
}

export function CreateStatusPageModal({
  open,
  onOpenChange,
  monitors,
}: CreateStatusPageModalProps) {
  const [selectedMonitorId, setSelectedMonitorId] = useState<string>();
  const updateMonitor = useUpdateMonitor();

  async function handleCreate() {
    if (!selectedMonitorId) return;

    await updateMonitor.mutateAsync({
      id: selectedMonitorId,
      data: { isPublic: true },
    });

    setSelectedMonitorId(undefined);
    onOpenChange(false);
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      setSelectedMonitorId(undefined);
    }
    onOpenChange(newOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-muted p-2">
              <Globe className="size-5" />
            </div>
            <div>
              <DialogTitle>Create Status Page</DialogTitle>
              <DialogDescription>
                Make a monitor public to create a status page.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Field>
            <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
              Select Monitor
            </FieldLabel>
            <Select
              value={selectedMonitorId}
              onValueChange={setSelectedMonitorId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a monitor..." />
              </SelectTrigger>
              <SelectContent>
                {monitors.map((monitor) => (
                  <SelectItem key={monitor.id} value={monitor.id}>
                    <div className="flex items-center gap-2">
                      <span>{monitor.name}</span>
                      {monitor.isPublic && (
                        <span className="text-xs text-muted-foreground">
                          (Public)
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {selectedMonitorId && (
            <p className="text-sm text-muted-foreground">
              This will make the selected monitor publicly visible on its status
              page.
            </p>
          )}
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            onClick={handleCreate}
            disabled={updateMonitor.isPending || !selectedMonitorId}
          >
            {updateMonitor.isPending ? "Creating..." : "Create Status Page"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
