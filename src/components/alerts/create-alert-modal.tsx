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
import { Switch } from "@/components/ui/switch";
import { useCreateAlert } from "@/hooks/api/use-alerts";
import { useSession } from "@/lib/auth-client";

const CHANNEL_TYPES = ["email", "webhook", "slack", "discord"] as const;
type Channel = (typeof CHANNEL_TYPES)[number];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const channelLabels: Record<Channel, string> = {
  email: "Email",
  webhook: "Webhook",
  slack: "Slack",
  discord: "Discord",
};

const endpointPlaceholders: Record<Channel, string> = {
  email: "alerts@company.com",
  webhook: "https://api.example.com/webhook",
  slack: "https://hooks.slack.com/services/...",
  discord: "https://discord.com/api/webhooks/...",
};

interface CreateAlertModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  monitorId: string;
}

export function CreateAlertModal({
  open,
  onOpenChange,
  monitorId,
}: CreateAlertModalProps) {
  const { data: session } = useSession();
  const createAlert = useCreateAlert();

  const [name, setName] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<Set<Channel>>(
    new Set(["email"]),
  );
  const [endpoints, setEndpoints] = useState<Record<Channel, string>>({
    email: "",
    webhook: "",
    slack: "",
    discord: "",
  });
  const [failureThreshold, setFailureThreshold] = useState<number | "">(3);
  const [isEnabled, setIsEnabled] = useState(true);
  const [endpointTouched, setEndpointTouched] = useState<
    Record<Channel, boolean>
  >({
    email: false,
    webhook: false,
    slack: false,
    discord: false,
  });

  const userEmail =
    session?.user?.emailVerified && session?.user?.email
      ? session.user.email
      : "";

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setName("");
      setSelectedChannels(new Set(["email"]));
      setEndpoints({
        email: userEmail,
        webhook: "",
        slack: "",
        discord: "",
      });
      setFailureThreshold(3);
      setIsEnabled(true);
      setEndpointTouched({
        email: false,
        webhook: false,
        slack: false,
        discord: false,
      });
    }
  }, [open, userEmail]);

  function toggleChannel(channel: Channel) {
    setSelectedChannels((prev) => {
      const next = new Set(prev);
      if (next.has(channel)) {
        next.delete(channel);
      } else {
        next.add(channel);
        if (channel === "email" && userEmail && !endpoints.email) {
          setEndpoints((e) => ({ ...e, email: userEmail }));
        }
      }
      return next;
    });
  }

  function updateEndpoint(channel: Channel, value: string) {
    setEndpoints((prev) => ({ ...prev, [channel]: value }));
    setEndpointTouched((prev) => ({ ...prev, [channel]: true }));
  }

  function getEmailError(channel: Channel): boolean {
    return (
      channel === "email" &&
      endpointTouched.email &&
      endpoints.email.length > 0 &&
      !emailRegex.test(endpoints.email)
    );
  }

  const hasValidEndpoints = Array.from(selectedChannels).every((ch) => {
    if (!endpoints[ch].trim()) return false;
    if (ch === "email" && !emailRegex.test(endpoints[ch])) return false;
    return true;
  });

  const canSubmit =
    name.trim() &&
    selectedChannels.size > 0 &&
    hasValidEndpoints &&
    !createAlert.isPending;

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!canSubmit) return;

    // Create one alert config per selected channel
    const channels = Array.from(selectedChannels);
    await Promise.all(
      channels.map((channel) =>
        createAlert.mutateAsync({
          monitorId,
          data: {
            name: channels.length > 1 ? `${name} (${channelLabels[channel]})` : name,
            channel,
            endpoint: endpoints[channel],
            failureThreshold: Number(failureThreshold),
            isEnabled,
          },
        }),
      ),
    );

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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                  Channels
                </FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {CHANNEL_TYPES.map((channel) => (
                    <Button
                      key={channel}
                      type="button"
                      variant={
                        selectedChannels.has(channel) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => toggleChannel(channel)}
                    >
                      {channelLabels[channel]}
                    </Button>
                  ))}
                </div>
              </Field>

              {Array.from(selectedChannels).map((channel) => (
                <Field key={channel}>
                  <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                    {channelLabels[channel]} Endpoint *
                  </FieldLabel>
                  <Input
                    placeholder={endpointPlaceholders[channel]}
                    value={endpoints[channel]}
                    onChange={(e) => updateEndpoint(channel, e.target.value)}
                    onBlur={() =>
                      setEndpointTouched((prev) => ({
                        ...prev,
                        [channel]: true,
                      }))
                    }
                    required
                    className={getEmailError(channel) ? "border-destructive" : ""}
                  />
                  {getEmailError(channel) && (
                    <p className="text-xs text-destructive mt-1">
                      Please enter a valid email address.
                    </p>
                  )}
                </Field>
              ))}
            </div>

            <Field>
              <FieldLabel className="text-[10px] font-bold uppercase tracking-wider">
                Failure Threshold
              </FieldLabel>
              <Input
                type="number"
                min={1}
                max={10}
                value={failureThreshold}
                onChange={(e) => {
                  const val = e.target.value;
                  setFailureThreshold(val === "" ? "" : Number(val));
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
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
                size="default"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={!canSubmit}>
              {createAlert.isPending ? (
                "Creating..."
              ) : (
                <>
                  <Plus className="mr-2 size-4" />
                  Create Alert{selectedChannels.size > 1 ? "s" : ""}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
