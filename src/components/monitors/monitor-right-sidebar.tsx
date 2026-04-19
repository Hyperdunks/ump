"use client";

import { ChevronRight, Globe, List } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useAlerts, useMonitor } from "@/hooks/api";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MonitorRightSidebarProps {
  monitorId: string;
  open: boolean;
}

// ---------------------------------------------------------------------------
// Key-value row
// ---------------------------------------------------------------------------

function SidebarRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-2">
      <span className="min-w-[90px] max-w-[90px] truncate text-sm text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-sm font-medium",
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section header (collapsible trigger)
// ---------------------------------------------------------------------------

function SectionHeader({ title, isOpen }: { title: string; isOpen: boolean }) {
  return (
    <CollapsibleTrigger className="flex h-9 w-full shrink-0 cursor-pointer items-center px-2">
      <span className="text-sm font-medium">{title}</span>
      <ChevronRight
        className={cn(
          "ml-auto size-4 shrink-0 transition-transform duration-200",
          isOpen && "rotate-90",
        )}
      />
    </CollapsibleTrigger>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCheckInterval(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  return `${Math.round(seconds / 3600)}h`;
}

function formatTimeout(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${Math.round(ms / 1000)} sec`;
}

function getStatusLabel(
  latestCheck: { status: string } | null | undefined,
  activeIncident: { state: string } | null | undefined,
): { label: string; color: string } {
  if (activeIncident && activeIncident.state !== "resolved") {
    return {
      label:
        activeIncident.state === "investigating" ? "Investigating" : "Incident",
      color: "text-red-500",
    };
  }
  if (!latestCheck) return { label: "Unknown", color: "text-muted-foreground" };
  switch (latestCheck.status) {
    case "up":
      return { label: "Normal", color: "text-green-500" };
    case "degraded":
      return { label: "Degraded", color: "text-yellow-500" };
    case "down":
      return { label: "Down", color: "text-red-500" };
    default:
      return { label: latestCheck.status, color: "text-muted-foreground" };
  }
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function MonitorRightSidebar({
  monitorId,
  open,
}: MonitorRightSidebarProps) {
  const { data: monitor } = useMonitor(monitorId);
  const { data: alertsData } = useAlerts(monitorId);

  const [overviewOpen, setOverviewOpen] = useState(true);
  const [configOpen, setConfigOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(true);

  const alerts = alertsData?.data ?? [];
  const status = getStatusLabel(monitor?.latestCheck, monitor?.activeIncident);

  return (
    <aside
      className={cn(
        "hidden shrink-0 border-l bg-sidebar transition-[width,opacity] duration-200 ease-in-out md:flex md:flex-col",
        open ? "w-72 opacity-100" : "w-0 overflow-hidden opacity-0",
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-2 py-2">
        <h2 className="text-base font-medium">Monitor</h2>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Overview */}
        <Collapsible open={overviewOpen} onOpenChange={setOverviewOpen}>
          <SectionHeader title="Overview" isOpen={overviewOpen} />
          <CollapsibleContent>
            <div>
              <SidebarRow label="External Name" value={monitor?.name ?? "—"} />
              <SidebarRow
                label="Status"
                value={status.label}
                valueClassName={status.color}
              />
              <SidebarRow
                label="Type"
                value={
                  <span className="flex items-center gap-1">
                    <span className="uppercase">{monitor?.type ?? "—"}</span>
                    <Globe className="size-2.5 shrink-0 text-muted-foreground" />
                  </span>
                }
              />
              <SidebarRow label="Endpoint" value={monitor?.url ?? "—"} />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Configuration */}
        <Collapsible open={configOpen} onOpenChange={setConfigOpen}>
          <SectionHeader title="Configuration" isOpen={configOpen} />
          <CollapsibleContent>
            <div>
              <SidebarRow
                label="Periodicity"
                value={
                  monitor?.checkInterval
                    ? formatCheckInterval(monitor.checkInterval)
                    : "—"
                }
              />
              <SidebarRow
                label="Timeout"
                value={monitor?.timeout ? formatTimeout(monitor.timeout) : "—"}
              />
              <SidebarRow
                label="Public"
                value={monitor ? String(monitor.isPublic) : "—"}
              />
              <SidebarRow
                label="Active"
                value={monitor ? String(monitor.isActive) : "—"}
              />
              <SidebarRow label="Method" value={monitor?.method ?? "—"} />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Notifications – only show if there are alerts */}
        {alerts.length > 0 && (
          <Collapsible
            open={notificationsOpen}
            onOpenChange={setNotificationsOpen}
          >
            <SectionHeader title="Notifications" isOpen={notificationsOpen} />
            <CollapsibleContent>
              <div className="space-y-1 px-2 py-1">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm"
                  >
                    <span className="truncate">{alert.name}</span>
                    <span className="ml-2 shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs capitalize text-muted-foreground">
                      {alert.channel}
                    </span>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </aside>
  );
}
