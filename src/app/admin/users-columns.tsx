"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { AdminUser } from "@/hooks/api";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
function formatDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function DeleteUserAction({ user }: { user: AdminUser }) {
  const [open, setOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const handleDelete = () => {
    if (emailInput !== user.email) {
      toast.error("Email does not match");
      return;
    }
    toast.success("User deleted successfully!");
    setOpen(false);
    setEmailInput("");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive text-xs" />
        }
      >
        <Trash2 className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription className="space-y-2 pt-2">
            <div>
              This action cannot be undone. This will permanently delete the user account and remove their data from our servers.
            </div>
            <div>
              Please type <strong className="text-foreground">{user.email}</strong> to confirm.
            </div>
          </DialogDescription>
        </DialogHeader>
        <Input
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          placeholder={user.email}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={emailInput !== user.email}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const userColumns: ColumnDef<AdminUser>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge
        variant={row.original.role === "admin" ? "default" : "secondary"}
        className="capitalize"
      >
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.original.createdAt)}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // Don't show delete for admin role if you want, but for fake delete let's just show it.
      return (
        <div className="flex justify-end">
          <DeleteUserAction user={row.original} />
        </div>
      );
    },
  },
];
