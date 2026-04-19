"use client";

import { Bar, BarChart, XAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useMonitorChecks } from "@/hooks/api";
import { useMemo } from "react";

const chartConfig = {
  success: {
    label: "Success",
  },
  error: {
    label: "Error",
  },
  degraded: {
    label: "Degraded",
  },
} satisfies ChartConfig;

function getBucketMinutes(timeRange: "1d" | "7d" | "30d"): number {
  switch (timeRange) {
    case "1d":
      return 30;
    case "7d":
      return 180; // 3 hours
    case "30d":
      return 720; // 12 hours
  }
}

function formatBucketLabel(time: string, timeRange: "1d" | "7d" | "30d"): string {
  const d = new Date(time);
  switch (timeRange) {
    case "1d":
      return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    case "7d":
      return d.toLocaleDateString("en-US", { weekday: "short", hour: "2-digit" });
    case "30d":
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

function bucketChecksByTime(
  checks: Array<{ status: string; checkedAt: string | Date }>,
  timeRange: "1d" | "7d" | "30d",
) {
  const bucketMinutes = getBucketMinutes(timeRange);
  const buckets = new Map<
    string,
    { success: number; error: number; degraded: number }
  >();

  const now = new Date();
  const bucketMs = bucketMinutes * 60 * 1000;

  const timeRangeMs =
    timeRange === "1d"
      ? 24 * 60 * 60 * 1000
      : timeRange === "7d"
        ? 7 * 24 * 60 * 60 * 1000
        : 30 * 24 * 60 * 60 * 1000;

  // Align 'now' to the nearest bucket
  const alignedNow = new Date(Math.floor(now.getTime() / bucketMs) * bucketMs);
  const totalBuckets = Math.ceil(timeRangeMs / bucketMs);

  // Initialize buckets
  for (let i = totalBuckets - 1; i >= 0; i--) {
    const bucketTime = new Date(alignedNow.getTime() - i * bucketMs);
    const bucketKey = bucketTime.toISOString();
    buckets.set(bucketKey, { success: 0, error: 0, degraded: 0 });
  }

  // Populate buckets with check data
  for (const check of checks) {
    const checkTime = new Date(check.checkedAt);
    const bucketTime = new Date(
      Math.floor(checkTime.getTime() / bucketMs) * bucketMs,
    );
    const bucketKey = bucketTime.toISOString();

    if (buckets.has(bucketKey)) {
      const bucket = buckets.get(bucketKey)!;
      if (check.status === "up") bucket.success++;
      else if (check.status === "down") bucket.error++;
      else if (check.status === "degraded") bucket.degraded++;
    }
  }

  // Convert to array
  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, counts]) => ({
      time: formatBucketLabel(time, timeRange),
      ...counts,
    }));
}

export default function UptimeChart({
  monitorId,
  timeRange = "1d",
}: {
  monitorId: string;
  timeRange?: "1d" | "7d" | "30d";
}) {
  const timeRangeMs =
    timeRange === "1d"
      ? 24 * 60 * 60 * 1000
      : timeRange === "7d"
        ? 7 * 24 * 60 * 60 * 1000
        : 30 * 24 * 60 * 60 * 1000;

  const since = useMemo(
    () => new Date(Date.now() - timeRangeMs).toISOString(),
    [timeRangeMs],
  );

  const limit = timeRange === "1d" ? 500 : timeRange === "7d" ? 2500 : 5000;
  const { data, isLoading } = useMonitorChecks(monitorId, { limit, since });

  const checks = data?.data ?? [];
  const uptimeData = bucketChecksByTime(checks, timeRange);

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <ChartContainer config={chartConfig} className="h-48 w-full">
      <BarChart data={uptimeData} barGap={2}>
        <XAxis dataKey="time" hide />
        <ChartTooltip
          cursor={{ fill: "transparent" }}
          content={<ChartTooltipContent />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="success"
          fill="var(--color-success)"
          radius={[2, 2, 2, 2]}
          stackId="status"
        />
        <Bar
          dataKey="error"
          fill="var(--color-error)"
          radius={[2, 2, 2, 2]}
          stackId="status"
        />
        <Bar
          dataKey="degraded"
          fill="var(--color-degraded)"
          radius={[2, 2, 2, 2]}
          stackId="status"
        />
      </BarChart>
    </ChartContainer>
  );
}
