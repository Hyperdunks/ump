"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// TODO: Replace with TanStack Query hook
const latencyData = Array.from({ length: 48 }, (_, i) => ({
  time: `${i}`,
  p50: Math.round(30 + Math.random() * 20),
  p99: Math.round(80 + Math.random() * 100),
}));

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

export default function LatencyChart() {
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
          <XAxis dataKey="time" hide />
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
            fillOpacity={1}
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
          <span className="size-2 rounded-sm bg-red-400" /> DNS
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <span className="size-2 rounded-sm bg-green-500" /> Connect
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <span className="size-2 rounded-sm bg-blue-500" /> TLS
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <span className="size-2 rounded-sm bg-yellow-500" /> TTFB
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <span className="size-2 rounded-sm bg-orange-400" /> Transfer
        </span>
      </div>
    </div>
  );
}
