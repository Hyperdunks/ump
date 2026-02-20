"use client";

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
import { useDeleteAlert } from "@/hooks/api/use-alerts";

interface DeleteAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alert: { id: string; name: string } | null;
}

export function DeleteAlertDialog({
  open,
  onOpenChange,
  alert,
}: DeleteAlertDialogProps) {
  const deleteAlert = useDeleteAlert();

  const handleDelete = async () => {
    if (!alert) return;
    await deleteAlert.mutateAsync(alert.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Alert</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{alert?.name}&quot;? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteAlert.isPending}
            className="bg-destructive text-destructive-foreground"
          >
            {deleteAlert.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
