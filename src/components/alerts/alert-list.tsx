"use client";

import type { LucideIcon } from "lucide-react";
import {
  Mail,
  MessageSquare,
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
  { icon: LucideIcon; label: string }
> = {
  email: { icon: Mail, label: "Email" },
  webhook: { icon: Webhook, label: "Webhook" },
  slack: { icon: MessageSquare, label: "Slack" },
  discord: { icon: MessageSquare, label: "Discord" },
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
