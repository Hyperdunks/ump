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

export function DeleteMonitorDialog({
  open,
  onOpenChange,
  monitor,
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
            Are you sure you want to delete &quot;{monitor.name}&quot;? This
            action cannot be undone. All check history will be permanently
            removed.
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
