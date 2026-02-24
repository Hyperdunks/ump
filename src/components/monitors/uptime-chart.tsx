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

const chartConfig = {
  success: {
    label: "Success",
    color: "#22c55e",
  },
  error: {
    label: "Error",
    color: "#ef4444",
  },
  degraded: {
    label: "Degraded",
    color: "#eab308",
  },
} satisfies ChartConfig;

function bucketChecksByTime(
  checks: Array<{ status: string; checkedAt: string | Date }>,
  bucketMinutes = 30,
) {
  const buckets = new Map<
    string,
    { success: number; error: number; degraded: number }
  >();

  const now = new Date();
  const bucketMs = bucketMinutes * 60 * 1000;

  // Initialize buckets for last 24 hours (48 buckets of 30 min)
  for (let i = 47; i >= 0; i--) {
    const bucketTime = new Date(now.getTime() - i * bucketMs);
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

  // Convert to array and format time labels
  return Array.from(buckets.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, counts]) => ({
      time: new Date(time).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      ...counts,
    }));
}

export default function UptimeChart({ monitorId }: { monitorId: string }) {
  const { data, isLoading } = useMonitorChecks(monitorId, { limit: 500 });

  const checks = data?.data ?? [];
  const uptimeData = bucketChecksByTime(checks);

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
