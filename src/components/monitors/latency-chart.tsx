"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useMonitorChecks } from "@/hooks/api";
import { calculatePercentile } from "@/lib/utils/percentile";

function getBucketConfig(timeRange: "1d" | "7d" | "30d") {
  switch (timeRange) {
    case "1d":
      return { minutes: 30, ms: 24 * 60 * 60 * 1000, limit: 500 };
    case "7d":
      return { minutes: 180, ms: 7 * 24 * 60 * 60 * 1000, limit: 2500 };
    case "30d":
      return { minutes: 720, ms: 30 * 24 * 60 * 60 * 1000, limit: 5000 };
  }
}

function formatBucketKey(date: Date, timeRange: "1d" | "7d" | "30d", bucketMinutes: number): string {
  const bucketMs = bucketMinutes * 60 * 1000;
  const bucketTime = new Date(Math.floor(date.getTime() / bucketMs) * bucketMs);

  switch (timeRange) {
    case "1d":
      return bucketTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    case "7d":
      return bucketTime.toLocaleDateString("en-US", { weekday: "short", hour: "2-digit" });
    case "30d":
      return bucketTime.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

const chartConfig = {
  p50: {
    label: "P50",
    color: "var(--color-blue-500)",
  },
  p99: {
    label: "P99",
    color: "var(--color-amber-500)",
  },
} satisfies ChartConfig;

export default function LatencyChart({
  monitorId,
  timeRange = "1d",
}: {
  monitorId: string;
  timeRange?: "1d" | "7d" | "30d";
}) {
  const config = getBucketConfig(timeRange);

  const since = useMemo(
    () => new Date(Date.now() - config.ms).toISOString(),
    [config.ms],
  );

  const { data, isLoading } = useMonitorChecks(monitorId, {
    limit: config.limit,
    since,
  });

  const checks = data?.data ?? [];
  const validChecks = checks.filter((c) => c.responseTime !== null);

  const buckets = new Map<string, number[]>();
  for (const check of validChecks) {
    const date = new Date(check.checkedAt);
    const bucketKey = formatBucketKey(date, timeRange, config.minutes);
    const times = buckets.get(bucketKey) ?? [];
    times.push(check.responseTime as number);
    buckets.set(bucketKey, times);
  }

  const latencyData = Array.from(buckets.entries())
    .map(([time, times]) => ({
      time,
      p50: calculatePercentile(times, 50),
      p99: calculatePercentile(times, 99),
    }))
    .sort((a, b) => a.time.localeCompare(b.time));

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (latencyData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border bg-background">
        <p className="text-sm text-muted-foreground">
          No latency data available
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ChartContainer
        config={chartConfig}
        className="h-64 w-full rounded-xl border bg-background p-4 shadow-sm"
      >
        <AreaChart data={latencyData}>
          <defs>
            <linearGradient id="colorP99" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-p99)"
                stopOpacity={0.3}
              />
              <stop offset="95%" stopColor="var(--color-p99)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorP50" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-p50)"
                stopOpacity={0.3}
              />
              <stop offset="95%" stopColor="var(--color-p50)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            orientation="right"
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="p99"
            stroke="var(--color-p99)"
            fillOpacity={0.15}
            fill="url(#colorP99)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="p50"
            stroke="var(--color-p50)"
            fillOpacity={1}
            fill="url(#colorP50)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs font-medium">
        <span className="flex items-center gap-1 text-muted-foreground">
          <span className="size-2 rounded-sm bg-blue-500" /> P50 (Median)
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <span className="size-2 rounded-sm bg-amber-500" /> P99 (99th
          percentile)
        </span>
      </div>
    </div>
  );
}
