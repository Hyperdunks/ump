"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useUpdateIncident } from "@/hooks/api/use-incidents";

interface EditIncidentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident: {
    id: string;
    cause?: string | null;
    postmortem?: string | null;
  };
}

export function EditIncidentModal({
  open,
  onOpenChange,
  incident,
}: EditIncidentModalProps) {
  const updateIncident = useUpdateIncident();

  const [formData, setFormData] = useState({
    cause: incident.cause ?? "",
    postmortem: incident.postmortem ?? "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        cause: incident.cause ?? "",
        postmortem: incident.postmortem ?? "",
      });
    }
  }, [open, incident]);

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await updateIncident.mutateAsync({
      id: incident.id,
      data: {
        cause: formData.cause || undefined,
        postmortem: formData.postmortem || undefined,
      },
    });

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Incident</DialogTitle>
            <DialogDescription>
              Update the cause and postmortem for this incident.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Field>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                Cause
              </FieldLabel>
              <Textarea
                value={formData.cause}
                onChange={(e) => handleChange("cause", e.target.value)}
                placeholder="What caused this incident?"
                rows={3}
              />
            </Field>

            <Field>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                Postmortem
              </FieldLabel>
              <Textarea
                value={formData.postmortem}
                onChange={(e) => handleChange("postmortem", e.target.value)}
                placeholder="Post-incident analysis and lessons learned"
                rows={5}
              />
            </Field>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={updateIncident.isPending}>
              {updateIncident.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
