"use client";

import { ExternalLink, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { EditIncidentModal } from "@/components/incidents/edit-incident-modal";
import { IncidentStateButtons } from "@/components/incidents/incident-state-buttons";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useIncident } from "@/hooks/api";
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

function formatFullDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getStateColor(
  state: "detected" | "investigating" | "resolved",
): "red" | "yellow" | "green" {
  switch (state) {
    case "detected":
      return "red";
    case "investigating":
      return "yellow";
    case "resolved":
      return "green";
  }
}

function getStateBadgeVariant(
  state: "detected" | "investigating" | "resolved",
): "destructive" | "outline" | "secondary" {
  switch (state) {
    case "detected":
      return "destructive";
    case "investigating":
      return "outline";
    case "resolved":
      return "secondary";
  }
}

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

export default function IncidentDetailPage() {
  const params = useParams();
  const incidentId = params.id as string;

  const { data: incident, isLoading, error } = useIncident(incidentId);
  const [editModalOpen, setEditModalOpen] = useState(false);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-semibold">Incident not found</h2>
        <p className="text-muted-foreground mt-2">
          This incident may have been deleted or you don&apos;t have access to
          it.
        </p>
        <Link
          href="/dashboard/notifications"
          className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-2.5 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Back to Notifications
        </Link>
      </div>
    );
  }

  const stateColor = incident ? getStateColor(incident.state) : "red";
  const stateBadgeVariant = incident
    ? getStateBadgeVariant(incident.state)
    : "destructive";

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/notifications" />}>
              Incidents
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {isLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <BreadcrumbPage>
                {incident?.monitorName} - {incident?.state}
              </BreadcrumbPage>
            )}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">
            {isLoading ? (
              <Skeleton className="h-8 w-48" />
            ) : (
              incident?.monitorName
            )}
          </h1>
          {isLoading ? (
            <Skeleton className="h-6 w-20" />
          ) : incident ? (
            <Badge variant={stateBadgeVariant} className="capitalize">
              {incident.state}
            </Badge>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {incident && (
            <>
              <IncidentStateButtons
                incidentId={incident.id}
                currentState={incident.state}
              />
              <Button
                variant="outline"
                onClick={() => setEditModalOpen(true)}
                disabled={isLoading}
              >
                <Pencil className="mr-2 size-4" />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <Card key={i} size="sm">
              <CardHeader>
                <Skeleton className="h-3 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-1 h-3 w-40" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card
              size="sm"
              className={cn(
                "ring-1",
                colorMap[stateColor].bg,
                colorMap[stateColor].ring,
              )}
            >
              <CardHeader>
                <CardTitle
                  className={cn(
                    "text-xs font-semibold uppercase tracking-wider",
                    colorMap[stateColor].text,
                  )}
                >
                  Detected At
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-medium">
                  {formatRelativeTime(incident?.detectedAt)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatFullDate(incident?.detectedAt)}
                </div>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Acknowledged At
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-medium">
                  {formatRelativeTime(incident?.acknowledgedAt)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatFullDate(incident?.acknowledgedAt)}
                </div>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Resolved At
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-medium">
                  {formatRelativeTime(incident?.resolvedAt)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatFullDate(incident?.resolvedAt)}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-5 w-48" />
          ) : incident ? (
            <Link
              href={`/dashboard/monitors/${incident.monitorId}`}
              className="flex items-center gap-1 text-primary hover:underline"
            >
              {incident.monitorName}
              <ExternalLink className="size-3" />
            </Link>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Cause
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : incident?.cause ? (
            <p className="text-sm whitespace-pre-wrap">{incident.cause}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No cause documented yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Postmortem
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : incident?.postmortem ? (
            <p className="text-sm whitespace-pre-wrap">{incident.postmortem}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No postmortem documented yet.
            </p>
          )}
        </CardContent>
      </Card>

      {incident && (
        <EditIncidentModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          incident={incident}
        />
      )}
    </div>
  );
}
