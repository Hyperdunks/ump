"use client";

import { Settings } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUpdateAlert } from "@/hooks/api/use-alerts";

const ALERT_CHANNELS = ["email", "webhook", "slack", "discord"] as const;

interface EditAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alert: {
    id: string;
    name: string;
    channel: "email" | "webhook" | "slack" | "discord";
    endpoint: string;
    failureThreshold: number;
    isEnabled: boolean;
  } | null;
}

export function EditAlertModal({
  open,
  onOpenChange,
  alert,
}: EditAlertModalProps) {
  const updateAlert = useUpdateAlert();

  const [formData, setFormData] = useState({
    name: "",
    channel: "email" as (typeof ALERT_CHANNELS)[number],
    endpoint: "",
    failureThreshold: 3 as number | "",
    isEnabled: true,
  });

  useEffect(() => {
    if (open && alert) {
      setFormData({
        name: alert.name,
        channel: alert.channel,
        endpoint: alert.endpoint,
        failureThreshold: alert.failureThreshold as number | "",
        isEnabled: alert.isEnabled,
      });
    }
  }, [open, alert]);

  function handleChange(field: keyof typeof formData, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!alert) return;

    const data = {
      name: formData.name,
      channel: formData.channel,
      endpoint: formData.endpoint,
      failureThreshold: Number(formData.failureThreshold),
      isEnabled: formData.isEnabled,
    };

    await updateAlert.mutateAsync({
      id: alert.id,
      data,
    });

    onOpenChange(false);
  }

  const channelPlaceholders: Record<(typeof ALERT_CHANNELS)[number], string> = {
    email: "alerts@example.com",
    webhook: "https://hooks.example.com/webhook",
    slack: "https://hooks.slack.com/services/...",
    discord: "https://discord.com/api/webhooks/...",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-muted p-2">
                <Settings className="size-5" />
              </div>
              <div>
                <DialogTitle>Edit Alert</DialogTitle>
                <DialogDescription>
                  Update the configuration for this alert.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Field>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                Name
              </FieldLabel>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Production Alert"
                required
              />
            </Field>

            <Field>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                Channel
              </FieldLabel>
              <Select
                value={formData.channel}
                onValueChange={(val) =>
                  handleChange(
                    "channel",
                    val as (typeof ALERT_CHANNELS)[number],
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALERT_CHANNELS.map((channel) => (
                    <SelectItem key={channel} value={channel}>
                      {channel.charAt(0).toUpperCase() + channel.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                Endpoint
              </FieldLabel>
              <Input
                value={formData.endpoint}
                onChange={(e) => handleChange("endpoint", e.target.value)}
                placeholder={channelPlaceholders[formData.channel]}
                required
              />
            </Field>

            <Field>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                Failure Threshold
              </FieldLabel>
              <Input
                type="number"
                min={1}
                max={10}
                value={formData.failureThreshold}
                onChange={(e) => {
                  const val = e.target.value;
                  handleChange("failureThreshold", val === "" ? "" : Number(val));
                }}
                required
              />
            </Field>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Enabled</p>
                <p className="text-xs text-muted-foreground">
                  Alert is actively sending notifications
                </p>
              </div>
              <Switch
                checked={formData.isEnabled}
                onCheckedChange={(checked) =>
                  handleChange("isEnabled", checked)
                }
                size="sm"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={updateAlert.isPending}>
              {updateAlert.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
