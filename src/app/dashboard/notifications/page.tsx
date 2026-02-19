"use client";

import {
  AlertTriangle,
  Archive,
  Bell,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIncidents } from "@/hooks/api";
import { cn } from "@/lib/utils";

type NotificationType = "error" | "warning" | "success" | "info";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  archived: boolean;
}

function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

function mapStateToType(
  state: "detected" | "investigating" | "resolved",
): NotificationType {
  switch (state) {
    case "detected":
      return "error";
    case "investigating":
      return "warning";
    case "resolved":
      return "success";
  }
}

function mapStateToTitle(
  state: "detected" | "investigating" | "resolved",
  monitorName: string,
): string {
  switch (state) {
    case "detected":
      return `Incident Detected: ${monitorName}`;
    case "investigating":
      return `Investigating: ${monitorName}`;
    case "resolved":
      return `Resolved: ${monitorName}`;
  }
}

const typeIcons: Record<NotificationType, React.ReactNode> = {
  error: <XCircle className="size-5 text-red-500" />,
  warning: <AlertTriangle className="size-5 text-yellow-500" />,
  success: <CheckCircle2 className="size-5 text-green-500" />,
  info: <Bell className="size-5 text-blue-500" />,
};

function NotificationList({
  items,
  onMarkRead,
  onArchive,
}: {
  items: Notification[];
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <Empty className="min-h-64">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Bell />
          </EmptyMedia>
          <EmptyTitle>No notifications</EmptyTitle>
          <EmptyDescription>
            You&apos;re all caught up. New alerts will appear here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="divide-y">
      {items.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "group flex items-start gap-4 p-4 transition-colors hover:bg-muted/50",
            !notification.read && "bg-muted/30",
          )}
          onClick={() => onMarkRead(notification.id)}
        >
          <div className="mt-0.5 shrink-0">{typeIcons[notification.type]}</div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center justify-between">
              <h3
                className={cn(
                  "text-sm font-medium",
                  !notification.read && "font-semibold",
                )}
              >
                {notification.title}
                {!notification.read && (
                  <span className="ml-2 inline-block size-2 rounded-full bg-blue-500" />
                )}
              </h3>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {notification.timestamp}
              </span>
            </div>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {notification.message}
            </p>
          </div>
          {!notification.archived && (
            <div className="opacity-0 transition-opacity group-hover:opacity-100">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onArchive(notification.id);
                        }}
                      />
                    }
                  >
                    <Archive className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>Archive</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function NotificationsPage() {
  const { data: incidentsData, isLoading } = useIncidents();
  const [localState, setLocalState] = useState<
    Record<string, { read: boolean; archived: boolean }>
  >({});

  const notifications = useMemo<Notification[]>(() => {
    if (!incidentsData?.data) return [];

    return incidentsData.data.map((incident) => {
      const local = localState[incident.id] || {
        read: incident.state === "resolved",
        archived: incident.state === "resolved",
      };

      return {
        id: incident.id,
        title: mapStateToTitle(incident.state, incident.monitorName),
        message: incident.cause || "Monitor incident",
        type: mapStateToType(incident.state),
        timestamp: formatRelativeTime(incident.detectedAt),
        read: local.read,
        archived: local.archived,
      };
    });
  }, [incidentsData, localState]);

  function markAsRead(id: string) {
    setLocalState((prev) => ({
      ...prev,
      [id]: { ...prev[id], read: true },
    }));
  }

  function archiveNotification(id: string) {
    setLocalState((prev) => ({
      ...prev,
      [id]: { ...prev[id], archived: true },
    }));
  }

  const active = notifications.filter((n) => !n.archived);
  const unread = notifications.filter((n) => !n.read && !n.archived);
  const archived = notifications.filter((n) => n.archived);

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-2 h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-48" />
        </div>
        <Card className="min-h-64 p-0 overflow-hidden">
          <div className="divide-y">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4">
                <Skeleton className="size-5 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="all" className="w-full flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              Stay updated with system alerts and activities.
            </p>
          </div>
          <TabsList className="h-9 p-1 bg-muted/50">
            <TabsTrigger value="all" className="h-7 text-xs px-3">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="h-7 text-xs px-3">
              Unread
            </TabsTrigger>
            <TabsTrigger value="archived" className="h-7 text-xs px-3">
              Archived
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-6">
          <Card className="min-h-64 p-0 overflow-hidden">
            <TabsContent value="all" className="m-0">
              <NotificationList
                items={active}
                onMarkRead={markAsRead}
                onArchive={archiveNotification}
              />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <NotificationList
                items={unread}
                onMarkRead={markAsRead}
                onArchive={archiveNotification}
              />
            </TabsContent>
            <TabsContent value="archived" className="m-0">
              <NotificationList
                items={archived}
                onMarkRead={markAsRead}
                onArchive={archiveNotification}
              />
            </TabsContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
}
