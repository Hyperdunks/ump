"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Archive,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
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

// TODO: Replace with TanStack Query hook
const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Monitor Failed: Harsh Website",
    message: "Harsh Website is down. Response code: 500.",
    type: "error",
    timestamp: "2 minutes ago",
    read: false,
    archived: false,
  },
  {
    id: "2",
    title: "High Latency Detected",
    message: "Payment Gateway latency is > 200ms (Current: 450ms).",
    type: "warning",
    timestamp: "1 hour ago",
    read: false,
    archived: false,
  },
  {
    id: "3",
    title: "Scheduled Maintenance",
    message: "Database maintenance scheduled for Feb 15, 02:00 AM UTC.",
    type: "info",
    timestamp: "1 day ago",
    read: true,
    archived: false,
  },
  {
    id: "4",
    title: "Monitor Recovered: Harsh Website",
    message: "Harsh Website is back online.",
    type: "success",
    timestamp: "2 days ago",
    read: true,
    archived: true,
  },
];

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
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  function archiveNotification(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, archived: true } : n)),
    );
  }

  const active = notifications.filter((n) => !n.archived);
  const unread = notifications.filter((n) => !n.read && !n.archived);
  const archived = notifications.filter((n) => n.archived);

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
            <TabsTrigger value="all" className="h-7 text-xs px-3">All</TabsTrigger>
            <TabsTrigger value="unread" className="h-7 text-xs px-3">Unread</TabsTrigger>
            <TabsTrigger value="archived" className="h-7 text-xs px-3">Archived</TabsTrigger>
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
