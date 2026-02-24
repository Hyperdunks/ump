"use client";

import {
  ChevronDown,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { type Alert, AlertList } from "@/components/alerts/alert-list";
import { CreateAlertModal } from "@/components/alerts/create-alert-modal";
import { DeleteAlertDialog } from "@/components/alerts/delete-alert-dialog";
import { EditAlertModal } from "@/components/alerts/edit-alert-modal";
import { DeleteMonitorDialog } from "@/components/monitors/delete-monitor-dialog";
import { EditMonitorModal } from "@/components/monitors/edit-monitor-modal";
import LatencyChart from "@/components/monitors/latency-chart";
import UptimeChart from "@/components/monitors/uptime-chart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  useMonitor,
  useMonitorChecks,
  useMonitors,
  useMonitorUptime,
} from "@/hooks/api";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils/format";
import { calculatePercentiles } from "@/lib/utils/percentile";

const colorMap = {
  green: {
    bg: "bg-green-50/50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-400",
    ring: "ring-green-200 dark:ring-green-900",
  },
  yellow: {
    bg: "bg-yellow-50/50 dark:bg-yellow-950/30",
    text: "text-yellow-700 dark:text-yellow-400",
    ring: "ring-yellow-200 dark:ring-yellow-900",
  },
  red: {
    bg: "bg-red-50/50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    ring: "ring-red-200 dark:ring-red-900",
  },
} as const;

function formatPercent(value: number | undefined): string {
  if (value === undefined) return "—";
  return `${value.toFixed(2)}%`;
}

export default function MonitorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const monitorId = params.id as string;

  const {
    data: monitorData,
    isLoading: isLoadingMonitor,
    error: monitorError,
  } = useMonitor(monitorId);
  const { data: uptimeData, isLoading: isLoadingUptime } =
    useMonitorUptime(monitorId);
  const { data: checksData } = useMonitorChecks(monitorId, { limit: 500 });
  const { data: monitorsData } = useMonitors({ limit: 50 });

  const isLoading = isLoadingMonitor || isLoadingUptime;
  const stats24h = uptimeData?.["24h"];

  const activeMonitors =
    monitorsData?.data?.filter((m) => m.isActive).slice(0, 50) ?? [];

  const responseTimes =
    checksData?.data
      ?.filter((c) => c.responseTime !== null)
      .map((c) => c.responseTime as number) ?? [];

  const percentiles =
    responseTimes.length >= 3 ? calculatePercentiles(responseTimes) : null;

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createAlertModalOpen, setCreateAlertModalOpen] = useState(false);
  const [editAlertModalOpen, setEditAlertModalOpen] = useState(false);
  const [deleteAlertDialogOpen, setDeleteAlertDialogOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const handleEditAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setEditAlertModalOpen(true);
  };

  const handleDeleteAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setDeleteAlertDialogOpen(true);
  };

  if (monitorError) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold">Monitor not found</h2>
        <p className="text-muted-foreground mt-2">
          This monitor may have been deleted or you don't have access to it.
        </p>
        <Link
          href="/dashboard/monitors"
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-2.5 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Back to Monitors
        </Link>
      </div>
    );
  }

  const statCards = [
    {
      label: "UPTIME",
      value: formatPercent(stats24h?.uptimePercent),
      subValue: stats24h
        ? `${(100 - stats24h.uptimePercent).toFixed(2)}%`
        : "—",
      color: "green" as const,
    },
    {
      label: "DEGRADED",
      value: stats24h?.degradedChecks?.toString() ?? "—",
      subValue:
        stats24h && stats24h.totalChecks > 0
          ? `${((stats24h.degradedChecks / stats24h.totalChecks) * 100).toFixed(1)}%`
          : "—",
      color: "yellow" as const,
    },
    {
      label: "FAILING",
      value: stats24h?.downChecks?.toString() ?? "—",
      subValue:
        stats24h && stats24h.totalChecks > 0
          ? `${((stats24h.downChecks / stats24h.totalChecks) * 100).toFixed(1)}%`
          : "—",
      color: "red" as const,
    },
  ];

  const latencyCards = [
    { label: "P50", value: percentiles ? `${percentiles.p50}ms` : "—" },
    { label: "P75", value: percentiles ? `${percentiles.p75}ms` : "—" },
    { label: "P90", value: percentiles ? `${percentiles.p90}ms` : "—" },
    { label: "P95", value: percentiles ? `${percentiles.p95}ms` : "—" },
    { label: "P99", value: percentiles ? `${percentiles.p99}ms` : "—" },
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/monitors" />}>
              Monitors
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:underline">
                {isLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : (
                  <>
                    {monitorData?.name}
                    <ChevronDown className="size-3" />
                  </>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="max-h-64 overflow-y-auto"
              >
                {activeMonitors.map((m) => (
                  <DropdownMenuItem
                    key={m.id}
                    onSelect={() => router.push(`/dashboard/monitors/${m.id}`)}
                    className={m.id === monitorId ? "bg-accent" : ""}
                  >
                    <span className="truncate">{m.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Overview</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {isLoading ? <Skeleton className="h-8 w-40" /> : monitorData?.name}
          </h1>
          {isLoading ? (
            <Skeleton className="mt-1 h-4 w-48" />
          ) : (
            <a
              href={monitorData?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:underline"
            >
              {monitorData?.url}
              <ExternalLink className="size-3" />
            </a>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ToggleGroup defaultValue={["1d"]} variant="outline">
            <ToggleGroupItem value="1d" className="text-xs">
              Last day
            </ToggleGroupItem>
            <ToggleGroupItem value="7d" className="text-xs">
              7 days
            </ToggleGroupItem>
            <ToggleGroupItem value="30d" className="text-xs">
              30 days
            </ToggleGroupItem>
          </ToggleGroup>
          <Button
            variant="outline"
            onClick={() => setEditModalOpen(true)}
            disabled={isLoading || !monitorData}
          >
            <Pencil className="mr-2 size-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={isLoading || !monitorData}
          >
            <Trash className="mr-2 size-4" />
            Delete
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Card key={i} size="sm">
              <CardHeader>
                <Skeleton className="h-3 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-20" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            {statCards.map((card) => (
              <Card
                key={card.label}
                size="sm"
                className={cn(
                  "ring-1",
                  colorMap[card.color].bg,
                  colorMap[card.color].ring,
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wider",
                      colorMap[card.color].text,
                    )}
                  >
                    {card.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <span
                      className={cn(
                        "text-xl font-bold",
                        colorMap[card.color].text,
                      )}
                    >
                      {card.value}
                    </span>
                    <span className="mb-0.5 rounded bg-background/50 px-1 text-xs opacity-70">
                      {card.subValue}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Requests card */}
            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  REQUESTS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-xl font-bold">
                  {stats24h?.totalChecks ?? "—"}
                </span>
              </CardContent>
            </Card>

            {/* Last Checked card */}
            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  LAST CHECKED
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-lg font-medium">
                  {formatRelativeTime(monitorData?.latestCheck?.checkedAt)}
                </span>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Latency Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {latencyCards.map((card) => (
          <Card key={card.label} size="sm">
            <CardHeader>
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-lg font-bold">{card.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Uptime Chart */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Uptime</h3>
          <p className="text-sm text-muted-foreground">
            Uptime of 24hours
          </p>
        </div>
        <UptimeChart monitorId={monitorId} />
      </div>

      {/* Latency Chart */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Latency</h3>
          <p className="text-sm text-muted-foreground">
            Response time across all the regions
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">The</span>
            <span className="rounded border bg-background px-2 py-0.5 text-xs font-medium shadow-sm">
              P50
            </span>
            <span className="text-sm text-muted-foreground">
              quantile within a
            </span>
            <span className="rounded border bg-background px-2 py-0.5 text-xs font-medium shadow-sm">
              30 minutes
            </span>
            <span className="text-sm text-muted-foreground">resolution</span>
          </div>
        </div>
        <LatencyChart monitorId={monitorId} />
      </div>

      {/* Alerts Section */}
      <div className="space-y-4">
        <AlertList
          monitorId={monitorId}
          onAddAlert={() => setCreateAlertModalOpen(true)}
          onEditAlert={handleEditAlert}
          onDeleteAlert={handleDeleteAlert}
        />
      </div>

      {monitorData && (
        <>
          <EditMonitorModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            monitor={monitorData}
          />
          <DeleteMonitorDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            monitor={{ id: monitorData.id, name: monitorData.name }}
          />
          <CreateAlertModal
            open={createAlertModalOpen}
            onOpenChange={setCreateAlertModalOpen}
            monitorId={monitorId}
          />
          <EditAlertModal
            open={editAlertModalOpen}
            onOpenChange={setEditAlertModalOpen}
            alert={selectedAlert}
          />
          <DeleteAlertDialog
            open={deleteAlertDialogOpen}
            onOpenChange={setDeleteAlertDialogOpen}
            alert={selectedAlert}
          />
        </>
      )}
    </div>
  );
}
