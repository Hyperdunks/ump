"use client";

import type { LucideIcon } from "lucide-react";
import {
  Mail,
  Pencil,
  Plus,
  Trash2,
  Webhook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useAlerts } from "@/hooks/api/use-alerts";

export type Alert = {
  id: string;
  monitorId: string;
  name: string;
  channel: "email" | "webhook" | "slack" | "discord";
  endpoint: string;
  failureThreshold: number;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

interface AlertListProps {
  monitorId: string;
  onAddAlert: () => void;
  onEditAlert: (alert: Alert) => void;
  onDeleteAlert: (alert: Alert) => void;
  onToggleAlert?: (alert: Alert, enabled: boolean) => void;
}

const channelConfig: Record<
  Alert["channel"],
  { icon: LucideIcon | React.FC<{ className?: string }>; label: string }
> = {
  email: { icon: Mail, label: "Email" },
  webhook: { icon: Webhook, label: "Webhook" },
  slack: {
    icon: ({ className }: { className?: string }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </svg>
    ),
    label: "Slack",
  },
  discord: {
    icon: ({ className }: { className?: string }) => (
      <svg
        role="img"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
      >
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
      </svg>
    ),
    label: "Discord",
  },
};

function AlertCard({
  alert,
  onEdit,
  onDelete,
  onToggle,
}: {
  alert: Alert;
  onEdit: () => void;
  onDelete: () => void;
  onToggle?: (enabled: boolean) => void;
}) {
  const { icon: ChannelIcon, label: channelLabel } =
    channelConfig[alert.channel];

  return (
    <Card size="sm" className="transition-shadow hover:shadow-md">
      <CardHeader className="border-b pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">{alert.name}</CardTitle>
            <div className="mt-1 flex items-center gap-2 text-muted-foreground">
              <ChannelIcon className="size-4" />
              <span className="text-sm">{channelLabel}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon-sm" onClick={onEdit}>
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field orientation="vertical">
            <FieldLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Endpoint
            </FieldLabel>
            <p className="truncate text-sm">{alert.endpoint}</p>
          </Field>
          <Field orientation="vertical">
            <FieldLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Failure Threshold
            </FieldLabel>
            <p className="text-sm">{alert.failureThreshold} failures</p>
          </Field>
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <span className="text-sm font-medium">
            {alert.isEnabled ? "Enabled" : "Disabled"}
          </span>
          <Switch
            size="sm"
            checked={alert.isEnabled}
            onCheckedChange={onToggle}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function AlertCardSkeleton() {
  return (
    <Card size="sm">
      <CardHeader className="border-b pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <Skeleton className="h-5 w-32" />
            <div className="mt-2 flex items-center gap-2">
              <Skeleton className="size-4 rounded-sm" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="size-8 rounded-md" />
            <Skeleton className="size-8 rounded-md" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-8 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ onAddAlert }: { onAddAlert: () => void }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Mail className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No alerts configured</h3>
        <p className="mt-1 mb-4 text-center text-sm text-muted-foreground">
          Get notified when your monitor goes down
        </p>
        <Button onClick={onAddAlert}>
          <Plus className="size-4" />
          Add Alert
        </Button>
      </CardContent>
    </Card>
  );
}

export function AlertList({
  monitorId,
  onAddAlert,
  onEditAlert,
  onDeleteAlert,
  onToggleAlert,
}: AlertListProps) {
  const { data: response, isLoading } = useAlerts(monitorId);
  const alerts = response?.data ?? [];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <AlertCardSkeleton />
        <AlertCardSkeleton />
      </div>
    );
  }

  if (alerts.length === 0) {
    return <EmptyState onAddAlert={onAddAlert} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Alerts</h3>
        <Button size="sm" onClick={onAddAlert}>
          <Plus className="size-4" />
          Add Alert
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert as Alert}
            onEdit={() => onEditAlert(alert as Alert)}
            onDelete={() => onDeleteAlert(alert as Alert)}
            onToggle={
              onToggleAlert
                ? (enabled) => onToggleAlert(alert as Alert, enabled)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
