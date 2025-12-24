import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import {
  alertConfig,
  type Incident,
  incident,
  type Monitor,
} from "@/db/schema";
import { nanoid } from "@/lib/nanoid";
import { type AlertPayload, sendAlerts } from "./notification-service";

// In-memory failure tracking (resets on server restart)
const failureCounter = new Map<string, number>();

/**
 * Get the minimum failure threshold for a monitor from its alert configs
 */
async function getFailureThreshold(monitorId: string): Promise<number> {
  const configs = await db
    .select({ failureThreshold: alertConfig.failureThreshold })
    .from(alertConfig)
    .where(
      and(
        eq(alertConfig.monitorId, monitorId),
        eq(alertConfig.isEnabled, true),
      ),
    );

  if (configs.length === 0) {
    return 3; // Default threshold
  }

  // Use the minimum threshold across all alert configs
  return Math.min(...configs.map((c) => c.failureThreshold));
}

/**
 * Get the active (unresolved) incident for a monitor
 */
async function getActiveIncident(monitorId: string): Promise<Incident | null> {
  const [active] = await db
    .select()
    .from(incident)
    .where(
      and(eq(incident.monitorId, monitorId), ne(incident.state, "resolved")),
    );

  return active ?? null;
}

/**
 * Record a health check failure and potentially create an incident
 */
export async function recordFailure(
  mon: Monitor,
  error?: string,
): Promise<void> {
  const currentCount = (failureCounter.get(mon.id) ?? 0) + 1;
  failureCounter.set(mon.id, currentCount);

  console.log(
    `[IncidentService] Monitor ${mon.name} failure count: ${currentCount}`,
  );

  // Check if we already have an active incident
  const activeIncident = await getActiveIncident(mon.id);
  if (activeIncident) {
    console.log(
      `[IncidentService] Active incident already exists for ${mon.name}`,
    );
    return;
  }

  // Check if we've hit the threshold
  const threshold = await getFailureThreshold(mon.id);
  if (currentCount >= threshold) {
    console.log(
      `[IncidentService] Threshold reached for ${mon.name}, creating incident`,
    );
    await createIncident(mon, error);
  }
}

/**
 * Record a successful health check and potentially resolve incidents
 */
export async function recordSuccess(mon: Monitor): Promise<void> {
  // Reset failure counter
  const previousCount = failureCounter.get(mon.id) ?? 0;
  failureCounter.set(mon.id, 0);

  if (previousCount > 0) {
    console.log(
      `[IncidentService] Monitor ${mon.name} recovered, resetting counter`,
    );
  }

  // Check for active incident to resolve
  const activeIncident = await getActiveIncident(mon.id);
  if (activeIncident) {
    console.log(`[IncidentService] Resolving incident for ${mon.name}`);
    await resolveIncident(activeIncident, mon);
  }
}

/**
 * Create a new incident and trigger alerts
 */
async function createIncident(mon: Monitor, error?: string): Promise<void> {
  const incidentId = nanoid();
  const now = new Date();

  await db.insert(incident).values({
    id: incidentId,
    monitorId: mon.id,
    state: "detected",
    detectedAt: now,
    cause: error ?? "Monitor health check failed",
    createdAt: now,
    updatedAt: now,
  });

  console.log(
    `[IncidentService] Created incident ${incidentId} for ${mon.name}`,
  );

  // Send alerts
  const payload: AlertPayload = {
    monitorId: mon.id,
    monitorName: mon.name,
    monitorUrl: mon.url,
    incidentId,
    status: "down",
    error,
    timestamp: now,
  };

  await sendAlerts(incidentId, payload);
}

/**
 * Resolve an incident and send recovery notification
 */
async function resolveIncident(inc: Incident, mon: Monitor): Promise<void> {
  const now = new Date();

  await db
    .update(incident)
    .set({
      state: "resolved",
      resolvedAt: now,
      updatedAt: now,
    })
    .where(eq(incident.id, inc.id));

  console.log(`[IncidentService] Resolved incident ${inc.id} for ${mon.name}`);

  // Send recovery notification
  const payload: AlertPayload = {
    monitorId: mon.id,
    monitorName: mon.name,
    monitorUrl: mon.url,
    incidentId: inc.id,
    status: "recovered",
    timestamp: now,
  };

  await sendAlerts(inc.id, payload);
}

/**
 * Get current failure count for a monitor (utility)
 */
export function getFailureCount(monitorId: string): number {
  return failureCounter.get(monitorId) ?? 0;
}

/**
 * Reset failure counter for a monitor (utility)
 */
export function resetFailureCount(monitorId: string): void {
  failureCounter.delete(monitorId);
}
