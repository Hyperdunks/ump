"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTestMonitor } from "@/hooks/api";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TestResult {
  result: "success" | "failed";
  timestamp: string;
  url: string;
  method: string;
  statusCode: number;
  latency: number;
  headers: Record<string, string>;
  timing: {
    dns: number;
    connect: number;
    tls: number;
    ttfb: number;
    transfer: number;
  };
  body: string;
  assertions: { name: string; passed: boolean }[];
  error?: string;
}

interface TestMonitorDrawerProps {
  monitorId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ---------------------------------------------------------------------------
// Key-value row
// ---------------------------------------------------------------------------

function ResultRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start border-b border-border">
      <span className="min-w-[140px] shrink-0 border-r border-border px-4 py-2.5 text-sm text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "min-w-0 flex-1 break-all px-4 py-2.5 text-sm font-medium",
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Timing bar
// ---------------------------------------------------------------------------

const timingColors: Record<string, string> = {
  DNS: "bg-blue-500",
  CONNECT: "bg-emerald-500",
  TLS: "bg-amber-500",
  TTFB: "bg-purple-500",
  TRANSFER: "bg-pink-500",
};

function TimingRow({
  label,
  ms,
  totalMs,
}: {
  label: string;
  ms: number;
  totalMs: number;
}) {
  const percent = totalMs > 0 ? ((ms / totalMs) * 100).toFixed(2) : "0.00";
  return (
    <div className="flex items-center gap-3 border-b border-border px-4 py-2">
      <span className="min-w-[80px] text-sm text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-1 items-center gap-2">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full",
              timingColors[label] ?? "bg-blue-500",
            )}
            style={{ width: `${Math.min(100, Number(percent))}%` }}
          />
        </div>
        <span className="min-w-[50px] text-right text-xs text-muted-foreground">
          {percent}%
        </span>
        <span className="min-w-[50px] text-right text-sm font-medium">
          {ms} ms
        </span>
        <span
          className={cn(
            "size-3 shrink-0 rounded-sm",
            timingColors[label] ?? "bg-blue-500",
          )}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function TestMonitorDrawer({
  monitorId,
  open,
  onOpenChange,
}: TestMonitorDrawerProps) {
  const testMutation = useTestMonitor();
  const [bodyExpanded, setBodyExpanded] = useState(false);

  // Auto-fire test when drawer opens
  useEffect(() => {
    if (open && !testMutation.isPending && !testMutation.data) {
      testMutation.mutate(monitorId);
    }
    // Reset when closed
    if (!open) {
      testMutation.reset();
      setBodyExpanded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const data = testMutation.data as TestResult | undefined;
  const totalTiming = data
    ? data.timing.dns +
      data.timing.connect +
      data.timing.tls +
      data.timing.ttfb +
      data.timing.transfer
    : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Test Result</SheetTitle>
        </SheetHeader>

        {/* Loading state */}
        {testMutation.isPending && (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Sending request...</p>
          </div>
        )}

        {/* Error state */}
        {testMutation.isError && (
          <div className="flex flex-col items-center justify-center gap-3 py-24">
            <XCircle className="size-8 text-red-500" />
            <p className="text-sm text-red-500">Failed to execute test</p>
            <button
              type="button"
              onClick={() => testMutation.mutate(monitorId)}
              className="text-sm text-primary underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Results */}
        {data && (
          <div className="flex flex-col">
            {/* Request Section */}
            <h3 className="border-b border-border px-3 pb-2 pt-3 text-sm font-semibold">
              Request
            </h3>
            <ResultRow
              label="Result"
              value={
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2.5 rounded-full",
                      data.result === "success" ? "bg-green-500" : "bg-red-500",
                    )}
                  />
                  <span
                    className={
                      data.result === "success"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {data.result === "success" ? "Success" : "Failed"}
                  </span>
                </span>
              }
            />
            <ResultRow
              label="Timestamp"
              value={new Date(data.timestamp).toLocaleString()}
            />
            <ResultRow label="URL" value={data.url} />
            <ResultRow
              label="Status"
              value={data.statusCode}
              valueClassName={
                data.statusCode >= 200 && data.statusCode < 300
                  ? "text-green-500"
                  : "text-red-500"
              }
            />
            <ResultRow label="Latency" value={`${data.latency}ms`} />
            {data.error && (
              <ResultRow
                label="Error"
                value={data.error}
                valueClassName="text-red-500"
              />
            )}

            {/* Headers Section */}
            <h3 className="mt-4 border-b border-border px-3 pb-2 pt-3 text-sm font-semibold">
              Headers
            </h3>
            <div className="max-h-[360px] overflow-y-auto">
              {Object.entries(data.headers).map(([key, value]) => (
                <ResultRow key={key} label={key} value={value} />
              ))}
              {Object.keys(data.headers).length === 0 && (
                <p className="px-4 py-3 text-sm text-muted-foreground">
                  No headers received
                </p>
              )}
            </div>

            {/* Timing Section */}
            <h3 className="mt-4 border-b border-border px-3 pb-2 pt-3 text-sm font-semibold">
              Timing
            </h3>
            <TimingRow label="DNS" ms={data.timing.dns} totalMs={totalTiming} />
            <TimingRow
              label="CONNECT"
              ms={data.timing.connect}
              totalMs={totalTiming}
            />
            <TimingRow label="TLS" ms={data.timing.tls} totalMs={totalTiming} />
            <TimingRow
              label="TTFB"
              ms={data.timing.ttfb}
              totalMs={totalTiming}
            />
            <TimingRow
              label="TRANSFER"
              ms={data.timing.transfer}
              totalMs={totalTiming}
            />

            {/* Body Section */}
            {data.body && (
              <>
                <h3 className="mt-4 border-b border-border px-3 pb-2 pt-3 text-sm font-semibold">
                  Body
                </h3>
                <div className="relative mx-4 rounded-lg bg-muted/50">
                  <div
                    className={cn(
                      "overflow-auto",
                      !bodyExpanded && "max-h-[200px]",
                    )}
                  >
                    <pre className="whitespace-pre-wrap break-all p-3 text-xs leading-relaxed">
                      {data.body}
                    </pre>
                  </div>
                  {data.body.length > 200 && (
                    <div className="sticky bottom-0 flex justify-center bg-linear-to-t from-muted/80 to-transparent py-2">
                      <button
                        type="button"
                        onClick={() => setBodyExpanded(!bodyExpanded)}
                        className="rounded-md bg-background px-3 py-1 text-xs font-medium shadow-sm transition-colors hover:bg-accent"
                      >
                        {bodyExpanded ? "Collapse" : "Expand"}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Assertions Section */}
            {data.assertions.length > 0 && (
              <>
                <h3 className="mt-4 border-b border-border px-3 pb-2 pt-3 text-sm font-semibold">
                  Assertions
                </h3>
                <div className="space-y-1 px-4 pb-4">
                  {data.assertions.map((assertion) => (
                    <div
                      key={assertion.name}
                      className="flex items-center gap-2 text-sm"
                    >
                      {assertion.passed ? (
                        <CheckCircle className="size-4 shrink-0 text-green-500" />
                      ) : (
                        <XCircle className="size-4 shrink-0 text-red-500" />
                      )}
                      <span>{assertion.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
