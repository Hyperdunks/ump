"use client";

import { Activity, AlertTriangle } from "lucide-react";
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
    },
    {
      label: "Recent Incidents",
      value: incidentsData?.data?.length?.toString() ?? "0",
      icon: AlertTriangle,
    },
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {summaryCards.map((card) => (
          <Card key={card.label} size="sm">
            <CardHeader className="flex-row items-center justify-between">
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
        ))}
      </div>

      {/* Sections */}
      {sections.map((section) => (
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
      ))}
    </div>
  );
}
