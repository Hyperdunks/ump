"use client";

import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useIncidents } from "@/hooks/api";
import { cn } from "@/lib/utils";

function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

const stateColors = {
  detected: "bg-red-500/10 text-red-500 border-red-500/20",
  investigating: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  resolved: "bg-green-500/10 text-green-500 border-green-500/20",
} as const;

const stateIcons = {
  detected: <XCircle className="size-5 text-red-500" />,
  investigating: <AlertTriangle className="size-5 text-yellow-500" />,
  resolved: <CheckCircle2 className="size-5 text-green-500" />,
} as const;

export default function IncidentsPage() {
  const { data, isLoading } = useIncidents();
  const incidents = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="mb-6">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <Card className="min-h-64 overflow-hidden p-0">
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

  if (incidents.length === 0) {
    return (
      <div className="w-full space-y-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Incidents</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all incidents across your monitors.
          </p>
        </div>
        <Empty className="min-h-64">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertTriangle />
            </EmptyMedia>
            <EmptyTitle>No incidents</EmptyTitle>
            <EmptyDescription>
              All your monitors are healthy. Incidents will appear here when
              monitors fail.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Incidents</h1>
        <p className="text-sm text-muted-foreground">
          View and manage all incidents across your monitors.
        </p>
      </div>

      <Card className="min-h-64 overflow-hidden p-0">
        <div className="divide-y">
          {incidents.map((incident) => (
            <Link
              key={incident.id}
              href={`/dashboard/incidents/${incident.id}`}
              className="group flex items-start gap-4 p-4 transition-colors hover:bg-muted/50"
            >
              <div className="mt-0.5 shrink-0">
                {stateIcons[incident.state]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium">
                      {incident.monitorName}
                    </h3>
                    <Badge
                      variant="outline"
                      className={cn("capitalize", stateColors[incident.state])}
                    >
                      {incident.state}
                    </Badge>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {formatRelativeTime(incident.detectedAt)}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {incident.cause || "No cause documented"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
