import { Resend } from "resend";

import { MonitorDown } from "@/emails/monitor-down";
import { MonitorRecovered } from "@/emails/monitor-recovered";
import { ResetPassword } from "@/emails/reset-password";
import { VerifyEmail } from "@/emails/verify-email";

export const resend = new Resend(process.env.RESEND_API_KEY);

const appUrl = (
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

// Configure your verified sender email here
// Use "onboarding@resend.dev" for testing (works without domain verification)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

// ============================================================================
// MONITOR ALERT EMAILS
// ============================================================================

export interface SendAlertEmailOptions {
  to: string;
  incidentId: string;
  monitorId: string;
  monitorName: string;
  monitorUrl: string;
  timestamp: Date;
  error?: string;
  downtimeDuration?: string;
}

function formatUtcTimestamp(date: Date): string {
  return `${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(date)} UTC`;
}

/**
 * Send monitor down alert email
 */
export async function sendMonitorDownEmail(
  options: SendAlertEmailOptions,
): Promise<void> {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: options.to,
    subject: `🚨 Monitor Down: ${options.monitorName}`,
    react: MonitorDown({
      monitorName: options.monitorName,
      monitorUrl: options.monitorUrl,
      incidentId: options.incidentId,
      reason: options.error,
      timestamp: formatUtcTimestamp(options.timestamp),
      viewIncidentUrl: `${appUrl}/dashboard/incidents/${options.incidentId}`,
    }),
  });

  if (error) {
    console.error("[Resend] Failed to send monitor down email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  console.log(`[Resend] Monitor down email sent: ${data?.id}`);
}

/**
 * Send monitor recovered alert email
 */
export async function sendMonitorRecoveredEmail(
  options: SendAlertEmailOptions,
): Promise<void> {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: options.to,
    subject: `✅ Monitor Recovered: ${options.monitorName}`,
    react: MonitorRecovered({
      monitorName: options.monitorName,
      monitorUrl: options.monitorUrl,
      monitorId: options.monitorId,
      incidentId: options.incidentId,
      timestamp: formatUtcTimestamp(options.timestamp),
      downtimeDuration: options.downtimeDuration,
      viewMonitorUrl: `${appUrl}/dashboard/monitors/${options.monitorId}`,
    }),
  });

  if (error) {
    console.error("[Resend] Failed to send recovery email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  console.log(`[Resend] Monitor recovered email sent: ${data?.id}`);
}

// ============================================================================
// AUTH EMAILS (Better Auth integration)
// ============================================================================

/**
 * Send email verification email
 */
export async function sendVerificationEmail(
  to: string,
  verificationUrl: string,
  username?: string,
): Promise<void> {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Verify your email address",
    react: VerifyEmail({ verificationUrl, username }),
  });

  if (error) {
    console.error("[Resend] Failed to send verification email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  console.log(`[Resend] Verification email sent: ${data?.id}`);
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  username?: string,
): Promise<void> {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Reset your password",
    react: ResetPassword({ resetUrl, username }),
  });

  if (error) {
    console.error("[Resend] Failed to send password reset email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  console.log(`[Resend] Password reset email sent: ${data?.id}`);
}
