import { eq } from "drizzle-orm";
import { db } from "@/db";
import { alertConfig, notification } from "@/db/schema";
import { nanoid } from "@/lib/nanoid";
import {
  sendMonitorDownEmail,
  sendMonitorRecoveredEmail,
} from "@/lib/resend";

export interface AlertPayload {
  monitorId: string;
  monitorName: string;
  monitorUrl: string;
  incidentId: string;
  status: "down" | "recovered";
  error?: string;
  timestamp: Date;
}

/**
 * Send notifications for all enabled alert configs of a monitor
 */
export async function sendAlerts(
  incidentId: string,
  alertPayload: AlertPayload,
): Promise<void> {
  // Fetch all enabled alert configs for this monitor
  const configs = await db
    .select()
    .from(alertConfig)
    .where(eq(alertConfig.monitorId, alertPayload.monitorId));

  const enabledConfigs = configs.filter((c) => c.isEnabled);

  // Send notifications in parallel
  await Promise.allSettled(
    enabledConfigs.map((config) =>
      sendNotification(config, incidentId, alertPayload),
    ),
  );
}

/**
 * Send a single notification and record the result
 */
async function sendNotification(
  config: typeof alertConfig.$inferSelect,
  incidentId: string,
  payload: AlertPayload,
): Promise<void> {
  let success = false;
  let error: string | undefined;

  try {
    switch (config.channel) {
      case "webhook":
        await sendWebhook(config.endpoint, payload);
        break;
      case "slack":
        await sendSlack(config.endpoint, payload);
        break;
      case "discord":
        await sendDiscord(config.endpoint, payload);
        break;
      case "email":
        await sendEmail(config.endpoint, payload);
        break;
    }
    success = true;
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Notification] Failed to send ${config.channel}:`, error);
  }

  // Record notification attempt
  await db.insert(notification).values({
    id: nanoid(),
    alertConfigId: config.id,
    incidentId,
    channel: config.channel,
    success,
    error,
    sentAt: new Date(),
  });
}

/**
 * Send email notification via Resend
 */
async function sendEmail(to: string, payload: AlertPayload): Promise<void> {
  if (payload.status === "down") {
    await sendMonitorDownEmail({
      to,
      monitorName: payload.monitorName,
      monitorUrl: payload.monitorUrl,
      error: payload.error,
      timestamp: payload.timestamp,
    });
  } else {
    await sendMonitorRecoveredEmail({
      to,
      monitorName: payload.monitorName,
      monitorUrl: payload.monitorUrl,
      timestamp: payload.timestamp,
    });
  }
}

/**
 * Send generic webhook notification
 */
async function sendWebhook(url: string, payload: AlertPayload): Promise<void> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: payload.status === "down" ? "monitor.down" : "monitor.recovered",
      monitor: {
        id: payload.monitorId,
        name: payload.monitorName,
        url: payload.monitorUrl,
      },
      incident: {
        id: payload.incidentId,
      },
      error: payload.error,
      timestamp: payload.timestamp.toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Webhook failed: ${response.status} ${response.statusText}`,
    );
  }
}

/**
 * Send Slack notification via incoming webhook
 */
async function sendSlack(
  webhookUrl: string,
  payload: AlertPayload,
): Promise<void> {
  const isDown = payload.status === "down";
  const color = isDown ? "#e01e5a" : "#36a64f"; // Red or Green
  const emoji = isDown ? "🚨" : "✅";

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      attachments: [
        {
          color,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `${emoji} *${payload.monitorName}* is ${isDown ? "DOWN" : "UP"}`,
              },
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*URL:*\n${payload.monitorUrl}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Time:*\n${payload.timestamp.toISOString()}`,
                },
              ],
            },
            ...(payload.error
              ? [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: `*Error:* ${payload.error}`,
                  },
                },
              ]
              : []),
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Slack webhook failed: ${response.status}`);
  }
}

/**
 * Send Discord notification via webhook
 */
async function sendDiscord(
  webhookUrl: string,
  payload: AlertPayload,
): Promise<void> {
  const isDown = payload.status === "down";
  const color = isDown ? 0xe01e5a : 0x36a64f; // Red or Green (decimal)
  const emoji = isDown ? "🚨" : "✅";

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: `${emoji} ${payload.monitorName} is ${isDown ? "DOWN" : "UP"}`,
          color,
          fields: [
            {
              name: "URL",
              value: payload.monitorUrl,
              inline: true,
            },
            {
              name: "Time",
              value: payload.timestamp.toISOString(),
              inline: true,
            },
            ...(payload.error
              ? [
                {
                  name: "Error",
                  value: payload.error,
                  inline: false,
                },
              ]
              : []),
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Discord webhook failed: ${response.status}`);
  }
}
