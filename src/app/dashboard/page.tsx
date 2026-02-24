"use client";

import Link from "next/link";
import { Activity, AlertTriangle, Files } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { useIncidents, useMonitors } from "@/hooks/api";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

const sections = [
  {
    title: "Incidents",
    subtitle: "Incidents over the last 7 days.",
    emptyText: "No incidents found",
    emptyDescription: "You have no incidents recorded in the last 7 days.",
    icon: AlertTriangle,
  },
] as const;

export default function DashboardPage() {
  const { data: monitorsData, isLoading: monitorsLoading } = useMonitors();
  const { data: incidentsData, isLoading: incidentsLoading } = useIncidents();

  const isLoading = monitorsLoading || incidentsLoading;

  const summaryCards = [
    {
      label: "Monitors",
      value: monitorsData?.pagination?.total?.toString() ?? "0",
      icon: Activity,
      href: "/dashboard/monitors",
    },
    {
      label: "Recent Incidents",
      value: incidentsData?.data?.length?.toString() ?? "0",
      icon: AlertTriangle,
      href: "/dashboard/incidents",
    },
    {
      label: "Status Pages",
      value: incidentsData?.data?.length?.toString() ?? "0",
      icon: Files,
      href: "/status",
    }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to your Sentinel dashboard.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <Link key={card.label} href={card.href} className="block transition-transform hover:scale-[1.02]">
            <Card size="sm" className="h-full cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <card.icon className="size-3.5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-12" />
                ) : (
                  <span className="text-lg font-semibold">{card.value}</span>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Sections */}
      {sections.map((section) => {
        if (section.title === "Incidents") {
          const hasIncidents = incidentsData?.data && incidentsData.data.length > 0;

          return (
            <div key={section.title} className="space-y-3">
              <div>
                <h2 className="text-sm font-semibold">{section.title}</h2>
                <p className="text-xs text-muted-foreground">{section.subtitle}</p>
              </div>

              {incidentsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                  ))}
                </div>
              ) : hasIncidents ? (
                <div className="space-y-3">
                  {incidentsData.data.slice(0, 5).map((incident: any) => (
                    <Link key={incident.id} href={`/dashboard/incidents/${incident.id}`} className="block">
                      <Card className="p-4 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{incident.monitorName}</span>
                              <Badge
                                variant={
                                  incident.state === "resolved"
                                    ? "default"
                                    : incident.state === "investigating"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {incident.state}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {incident.cause || "No cause specified"}
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground sm:text-right">
                            <div>
                              Detected {formatDistanceToNow(new Date(incident.detectedAt))} ago
                            </div>
                            {incident.resolvedAt && (
                              <div>
                                Resolved {formatDistanceToNow(new Date(incident.resolvedAt))} ago
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <section.icon />
                    </EmptyMedia>
                    <EmptyTitle>{section.emptyText}</EmptyTitle>
                    <EmptyDescription>{section.emptyDescription}</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </div>
          );
        }

        // Fallback for other sections (if any are added)
        return (
          <div key={section.title} className="space-y-3">
            <div>
              <h2 className="text-sm font-semibold">{section.title}</h2>
              <p className="text-xs text-muted-foreground">{section.subtitle}</p>
            </div>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <section.icon />
                </EmptyMedia>
                <EmptyTitle>{section.emptyText}</EmptyTitle>
                <EmptyDescription>{section.emptyDescription}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        );
      })}

      {/* Recent Monitors Grid */}
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold">Your Monitors</h2>
          <p className="text-xs text-muted-foreground">Recently added monitors to Sentinel.</p>
        </div>

        {monitorsLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : monitorsData?.data && monitorsData.data.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {monitorsData.data.slice(0, 5).map((monitor: any) => (
              <Link key={monitor.id} href={`/dashboard/monitors/${monitor.id}`} className="block transition-transform hover:scale-[1.02]">
                <Card className="h-full cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors p-4">
                  <div className="flex flex-col h-full justify-between gap-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1 overflow-hidden">
                        <h4 className="font-semibold text-sm truncate">{monitor.name}</h4>
                        <p className="text-xs text-muted-foreground truncate" title={monitor.url}>
                          {monitor.url}
                        </p>
                      </div>
                      <Badge variant={monitor.isActive ? "default" : "secondary"}>
                        {monitor.isActive ? "Active" : "Paused"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`size-2 rounded-full ${monitor.isActive ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                      <span className="text-xs text-muted-foreground">
                        {monitor.isActive ? 'Monitoring running' : 'Monitoring paused'}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-6">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Activity />
                </EmptyMedia>
                <EmptyTitle>No monitors found</EmptyTitle>
                <EmptyDescription>You haven't created any monitors yet.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </Card>
        )}
      </div>
    </div>
  );
}
