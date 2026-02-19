import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { healthCheck, type Monitor, monitor } from "@/db/schema";
import { nanoid } from "@/lib/nanoid";
import { recordFailure, recordSuccess } from "./incident-service";

// Track last check time per monitor
const lastCheckTime = new Map<string, Date>();

/**
 * Main health check worker - runs periodically to check all due monitors
 */
export async function runHealthChecks(): Promise<void> {
  console.log("[HealthCheckWorker] Starting health check cycle...");

  try {
    // Fetch all active monitors
    const monitors = await db
      .select()
      .from(monitor)
      .where(eq(monitor.isActive, true));

    console.log(`[HealthCheckWorker] Found ${monitors.length} active monitors`);

    // Check which monitors are due for checking
    const dueMonitors = monitors.filter((mon) => isMonitorDue(mon));
    console.log(
      `[HealthCheckWorker] ${dueMonitors.length} monitors due for check`,
    );

    // Process monitors in parallel (with concurrency limit)
    const BATCH_SIZE = 10;
    for (let i = 0; i < dueMonitors.length; i += BATCH_SIZE) {
      const batch = dueMonitors.slice(i, i + BATCH_SIZE);
      await Promise.allSettled(batch.map((mon) => checkMonitor(mon)));
    }

    console.log("[HealthCheckWorker] Health check cycle complete");
  } catch (error) {
    console.error("[HealthCheckWorker] Error in health check cycle:", error);
  }
}

/**
 * Check if a monitor is due for its next check
 */
function isMonitorDue(mon: Monitor): boolean {
  const lastCheck = lastCheckTime.get(mon.id);
  if (!lastCheck) {
    return true; // Never checked before
  }

  const nextCheckTime = new Date(
    lastCheck.getTime() + mon.checkInterval * 1000,
  );
  return new Date() >= nextCheckTime;
}

/**
 * Perform a health check on a single monitor
 */
async function checkMonitor(mon: Monitor): Promise<void> {
  console.log(`[HealthCheckWorker] Checking monitor: ${mon.name} (${mon.url})`);

  const startTime = Date.now();
  let status: "up" | "down" | "degraded" = "down";
  let statusCode: number | undefined;
  let error: string | undefined;
  let responseTime: number | undefined;

  try {
    switch (mon.type) {
      case "http":
      case "https": {
        const result = await checkHttp(mon);
        status = result.status;
        statusCode = result.statusCode;
        error = result.error;
        responseTime = result.responseTime;
        break;
      }
      case "tcp": {
        // TCP check - simplified for now
        const tcpResult = await checkTcp(mon);
        status = tcpResult.status;
        error = tcpResult.error;
        responseTime = tcpResult.responseTime;
        break;
      }
      case "ping": {
        // Ping check - using HTTP HEAD as fallback since true ICMP requires privileges
        const pingResult = await checkPing(mon);
        status = pingResult.status;
        error = pingResult.error;
        responseTime = pingResult.responseTime;
        break;
      }
    }
  } catch (err) {
    status = "down";
    error = err instanceof Error ? err.message : "Unknown error";
    responseTime = Date.now() - startTime;
  }

  // Update last check time
  lastCheckTime.set(mon.id, new Date());

  // Store health check result
  await storeHealthCheck(mon.id, {
    status,
    statusCode,
    responseTime,
    error,
  });

  // Update incident tracking
  if (status === "up") {
    await recordSuccess(mon);
  } else {
    await recordFailure(mon, error);
  }

  console.log(
    `[HealthCheckWorker] ${mon.name}: ${status} (${responseTime}ms)${error ? ` - ${error}` : ""}`,
  );
}

interface CheckResult {
  status: "up" | "down" | "degraded";
  statusCode?: number;
  responseTime: number;
  error?: string;
}

/**
 * Perform HTTP/HTTPS health check
 */
async function checkHttp(mon: Monitor): Promise<CheckResult> {
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutMs = mon.timeout; // Already in milliseconds
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(mon.url, {
      method: mon.method,
      headers: mon.headers ?? undefined,
      body: mon.method === "POST" ? (mon.body ?? undefined) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    const statusCode = response.status;

    // Check if status code is in expected list
    const isExpectedStatus = mon.expectedStatusCodes.includes(
      statusCode.toString(),
    );

    // Check for degraded (slow response > 80% of timeout)
    const isDegraded = responseTime > timeoutMs * 0.8;

    if (!isExpectedStatus) {
      return {
        status: "down",
        statusCode,
        responseTime,
        error: `Unexpected status code: ${statusCode}`,
      };
    }

    return {
      status: isDegraded ? "degraded" : "up",
      statusCode,
      responseTime,
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;

    let error = "Unknown error";
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        error = `Timeout after ${mon.timeout}ms`;
      } else {
        error = err.message;
      }
    }

    return {
      status: "down",
      responseTime,
      error,
    };
  }
}

/**
 * Perform TCP check (simplified using fetch to HTTPS)
 */
async function checkTcp(mon: Monitor): Promise<CheckResult> {
  // For TCP, we just try to establish a connection
  // In a real implementation, you'd use a TCP socket library
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutMs = mon.timeout; // Already in milliseconds
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Try a HEAD request as a proxy for TCP connectivity
    const response = await fetch(mon.url, {
      method: "HEAD",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;

    return {
      status: response.ok ? "up" : "down",
      responseTime,
      statusCode: response.status,
    };
  } catch (err) {
    return {
      status: "down",
      responseTime: Date.now() - startTime,
      error: err instanceof Error ? err.message : "Connection failed",
    };
  }
}

/**
 * Perform ping check (using HTTP HEAD as ICMP requires privileges)
 */
async function checkPing(mon: Monitor): Promise<CheckResult> {
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutMs = mon.timeout; // Already in milliseconds
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(mon.url, {
      method: "HEAD",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;

    return {
      status: response.ok ? "up" : "down",
      responseTime,
    };
  } catch (err) {
    return {
      status: "down",
      responseTime: Date.now() - startTime,
      error: err instanceof Error ? err.message : "Ping failed",
    };
  }
}

/**
 * Store health check result in database
 */
async function storeHealthCheck(
  monitorId: string,
  result: Omit<CheckResult, "statusCode"> & { statusCode?: number },
): Promise<void> {
  await db.insert(healthCheck).values({
    id: nanoid(),
    monitorId,
    status: result.status,
    statusCode: result.statusCode,
    responseTime: result.responseTime,
    error: result.error,
    checkedAt: new Date(),
  });
}

/**
 * Initialize the last check times from database
 */
export async function initializeLastCheckTimes(): Promise<void> {
  console.log(
    "[HealthCheckWorker] Initializing last check times from database...",
  );

  const monitors = await db
    .select()
    .from(monitor)
    .where(eq(monitor.isActive, true));

  for (const mon of monitors) {
    const [lastCheck] = await db
      .select({ checkedAt: healthCheck.checkedAt })
      .from(healthCheck)
      .where(eq(healthCheck.monitorId, mon.id))
      .orderBy(desc(healthCheck.checkedAt))
      .limit(1);

    if (lastCheck) {
      lastCheckTime.set(mon.id, lastCheck.checkedAt);
    }
  }

  console.log(
    `[HealthCheckWorker] Loaded last check times for ${lastCheckTime.size} monitors`,
  );
}
