"use client";

import Link from "next/link";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import UptimeChart from "@/components/monitors/uptime-chart";
import LatencyChart from "@/components/monitors/latency-chart";

// TODO: Replace with TanStack Query hook
const monitor = {
    name: "Harsh Website",
    url: "https://www.harzh.xyz/",
};

const statCards = [
    {
        label: "UPTIME",
        value: "100.00%",
        subValue: "0%",
        color: "green" as const,
    },
    {
        label: "DEGRADED",
        value: "0",
        subValue: "0%",
        color: "yellow" as const,
    },
    {
        label: "FAILING",
        value: "0",
        subValue: "0%",
        color: "red" as const,
    },
];

const latencyCards = [
    { label: "P50", value: "46 ms", change: "2.1%" },
    { label: "P75", value: "61 ms", change: "4.7%" },
    { label: "P90", value: "72 ms", change: "12.2%" },
    { label: "P95", value: "94 ms", change: "11.3%" },
    { label: "P99", value: "287 ms", change: "12.8%" },
];

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

export default function MonitorDetailPage() {
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
                        <BreadcrumbLink render={<Link href="#" />}>
                            {monitor.name}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Overview</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">{monitor.name}</h1>
                    <a
                        href={monitor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:underline"
                    >
                        {monitor.url}
                        <ExternalLink className="size-3" />
                    </a>
                </div>
                <div className="flex items-center gap-2">
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
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
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
                        <span className="text-xl font-bold">192</span>
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
                        <span className="text-lg font-medium">12 minutes ago</span>
                    </CardContent>
                </Card>
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
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold">{card.value}</span>
                                <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                >
                                    -{card.change}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Uptime Chart */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold">Uptime</h3>
                    <p className="text-sm text-muted-foreground">
                        Uptime across all the selected regions
                    </p>
                </div>
                <UptimeChart />
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
                <LatencyChart />
            </div>
        </div>
    );
}
