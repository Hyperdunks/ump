"use client";

import { Bar, BarChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

// TODO: Replace with TanStack Query hook
const uptimeData = Array.from({ length: 48 }, (_, i) => ({
  time: `${i}`,
  success: 1,
  error: 0,
  degraded: 0,
}));

const chartConfig = {
  success: {
    label: "Success",
    color: "var(--color-green-500)",
  },
  error: {
    label: "Error",
    color: "var(--color-red-500)",
  },
  degraded: {
    label: "Degraded",
    color: "var(--color-yellow-500)",
  },
} satisfies ChartConfig;

export default function UptimeChart() {
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
