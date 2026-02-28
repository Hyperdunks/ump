"use client";

import { BellPlus, Plus } from "lucide-react";
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
import { useCreateAlert } from "@/hooks/api/use-alerts";
import { useSession } from "@/lib/auth-client";

const CHANNEL_TYPES = ["email", "webhook", "slack", "discord"] as const;
const COMING_SOON_CHANNELS: ReadonlySet<string> = new Set(["slack", "discord"]);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const endpointPlaceholders = {
  email: "alerts@company.com",
  webhook: "https://api.example.com/webhook",
  slack: "https://hooks.slack.com/services/...",
  discord: "https://discord.com/api/webhooks/...",
} as const;

interface CreateAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  monitorId: string;
}

const defaultFormData = {
  name: "",
  channel: "email" as const,
  endpoint: "",
  failureThreshold: 3 as number | "",
  isEnabled: true,
};

export function CreateAlertModal({
  open,
  onOpenChange,
  monitorId,
}: CreateAlertModalProps) {
  const { data: session } = useSession();
  const [formData, setFormData] = useState(defaultFormData);
  const [endpointTouched, setEndpointTouched] = useState(false);
  const createAlert = useCreateAlert();

  // Auto-fill user email when modal opens with email channel
  const userEmail =
    session?.user?.emailVerified && session?.user?.email
      ? session.user.email
      : "";

  function handleInputChange(field: keyof typeof formData, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function handleChannelChange(val: (typeof CHANNEL_TYPES)[number]) {
    handleInputChange("channel", val);
    if (val === "email" && userEmail) {
      handleInputChange("endpoint", userEmail);
      setEndpointTouched(false);
    } else {
      handleInputChange("endpoint", "");
      setEndpointTouched(false);
    }
  }

  // Reset form and pre-fill email when modal opens
  useEffect(() => {
    if (open) {
      const initial = { ...defaultFormData };
      if (userEmail) {
        initial.endpoint = userEmail;
      }
      setFormData(initial);
      setEndpointTouched(false);
    }
  }, [open, userEmail]);

  const emailError =
    formData.channel === "email" &&
    endpointTouched &&
    formData.endpoint.length > 0 &&
    !emailRegex.test(formData.endpoint);

  const isEmailInvalid =
    formData.channel === "email" &&
    formData.endpoint.length > 0 &&
    !emailRegex.test(formData.endpoint);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (isEmailInvalid) return;
    await createAlert.mutateAsync({
      monitorId,
      data: {
        name: formData.name,
        channel: formData.channel,
        endpoint: formData.endpoint,
        failureThreshold: Number(formData.failureThreshold),
        isEnabled: formData.isEnabled,
      },
    });
    setFormData(defaultFormData);
    setEndpointTouched(false);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-muted p-2">
                <BellPlus className="size-5" />
              </div>
              <div>
                <DialogTitle>Create Alert</DialogTitle>
                <DialogDescription>
                  Configure a new alert notification for this monitor.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-4">
              <Field>
                <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                  Name *
                </FieldLabel>
                <Input
                  placeholder="Production Alert"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
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
                    handleChannelChange(val as (typeof CHANNEL_TYPES)[number])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CHANNEL_TYPES.map((channel) => (
                      <SelectItem
                        key={channel}
                        value={channel}
                        disabled={COMING_SOON_CHANNELS.has(channel)}
                      >
                        {channel.toUpperCase()}
                        {COMING_SOON_CHANNELS.has(channel)
                          ? " (Coming Soon)"
                          : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                  Endpoint *
                </FieldLabel>
                <Input
                  placeholder={endpointPlaceholders[formData.channel]}
                  value={formData.endpoint}
                  onChange={(e) => {
                    handleInputChange("endpoint", e.target.value);
                    setEndpointTouched(true);
                  }}
                  onBlur={() => setEndpointTouched(true)}
                  required
                  className={emailError ? "border-destructive" : ""}
                />
                {emailError && (
                  <p className="text-xs text-destructive mt-1">
                    Please enter a valid email address.
                  </p>
                )}
              </Field>
            </div>

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
                  handleInputChange(
                    "failureThreshold",
                    val === "" ? "" : Number(val),
                  );
                }}
                required
              />
            </Field>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                  Enabled
                </FieldLabel>
                <p className="text-xs text-muted-foreground">
                  Enable alert notifications immediately
                </p>
              </div>
              <Switch
                checked={formData.isEnabled}
                onCheckedChange={(checked) =>
                  handleInputChange("isEnabled", checked)
                }
                size="default"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button
              type="submit"
              disabled={
                createAlert.isPending ||
                !formData.name ||
                !formData.endpoint ||
                isEmailInvalid
              }
            >
              {createAlert.isPending ? (
                "Creating..."
              ) : (
                <>
                  <Plus className="mr-2 size-4" />
                  Create Alert
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
