import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// ============================================================================
// ENUMS
// ============================================================================

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const monitorTypeEnum = pgEnum("monitor_type", [
  "http",
  "https",
  "tcp",
  "ping",
]);

export const httpMethodEnum = pgEnum("http_method", ["GET", "POST", "HEAD"]);

export const checkStatusEnum = pgEnum("check_status", [
  "up",
  "down",
  "degraded",
]);

export const incidentStateEnum = pgEnum("incident_state", [
  "detected",
  "investigating",
  "resolved",
]);

export const alertChannelEnum = pgEnum("alert_channel", [
  "email",
  "webhook",
  "slack",
  "discord",
]);

// ============================================================================
// AUTH TABLES (better-auth)
// ============================================================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ============================================================================
// MONITOR TABLE
// ============================================================================

export const monitor = pgTable(
  "monitor",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    type: monitorTypeEnum("type").default("https").notNull(),
    method: httpMethodEnum("method").default("GET").notNull(),
    checkInterval: integer("check_interval").default(60).notNull(), // seconds
    timeout: integer("timeout").default(30000).notNull(), // ms
    expectedStatusCodes: text("expected_status_codes")
      .array()
      .default(["200"])
      .notNull(),
    headers: jsonb("headers").$type<Record<string, string>>(),
    body: text("body"),
    isActive: boolean("is_active").default(true).notNull(),
    isPublic: boolean("is_public").default(false).notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("monitor_userId_idx").on(table.userId),
    index("monitor_isActive_idx").on(table.isActive),
  ],
);

// ============================================================================
// HEALTH CHECK TABLE
// ============================================================================

export const healthCheck = pgTable(
  "health_check",
  {
    id: text("id").primaryKey(),
    monitorId: text("monitor_id")
      .notNull()
      .references(() => monitor.id, { onDelete: "cascade" }),
    status: checkStatusEnum("status").notNull(),
    statusCode: integer("status_code"),
    responseTime: integer("response_time"), // ms
    error: text("error"),
    checkedAt: timestamp("checked_at").defaultNow().notNull(),
  },
  (table) => [
    index("healthCheck_monitorId_idx").on(table.monitorId),
    index("healthCheck_checkedAt_idx").on(table.checkedAt),
    index("healthCheck_monitorId_checkedAt_idx").on(
      table.monitorId,
      table.checkedAt,
    ),
  ],
);

// ============================================================================
// INCIDENT TABLE
// ============================================================================

export const incident = pgTable(
  "incident",
  {
    id: text("id").primaryKey(),
    monitorId: text("monitor_id")
      .notNull()
      .references(() => monitor.id, { onDelete: "cascade" }),
    state: incidentStateEnum("state").default("detected").notNull(),
    detectedAt: timestamp("detected_at").defaultNow().notNull(),
    acknowledgedAt: timestamp("acknowledged_at"),
    resolvedAt: timestamp("resolved_at"),
    cause: text("cause"),
    postmortem: text("postmortem"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("incident_monitorId_idx").on(table.monitorId),
    index("incident_state_idx").on(table.state),
  ],
);

// ============================================================================
// ALERT CONFIG TABLE
// ============================================================================

export const alertConfig = pgTable(
  "alert_config",
  {
    id: text("id").primaryKey(),
    monitorId: text("monitor_id")
      .notNull()
      .references(() => monitor.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    channel: alertChannelEnum("channel").notNull(),
    endpoint: text("endpoint").notNull(), // email or webhook URL
    failureThreshold: integer("failure_threshold").default(3).notNull(),
    isEnabled: boolean("is_enabled").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("alertConfig_monitorId_idx").on(table.monitorId)],
);

// ============================================================================
// NOTIFICATION TABLE
// ============================================================================

export const notification = pgTable(
  "notification",
  {
    id: text("id").primaryKey(),
    alertConfigId: text("alert_config_id")
      .notNull()
      .references(() => alertConfig.id, { onDelete: "cascade" }),
    incidentId: text("incident_id")
      .notNull()
      .references(() => incident.id, { onDelete: "cascade" }),
    channel: text("channel").notNull(), // copy for history
    success: boolean("success").notNull(),
    error: text("error"),
    sentAt: timestamp("sent_at").defaultNow().notNull(),
  },
  (table) => [
    index("notification_alertConfigId_idx").on(table.alertConfigId),
    index("notification_incidentId_idx").on(table.incidentId),
  ],
);

// ============================================================================
// RELATIONS
// ============================================================================

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  monitors: many(monitor),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const monitorRelations = relations(monitor, ({ one, many }) => ({
  user: one(user, {
    fields: [monitor.userId],
    references: [user.id],
  }),
  healthChecks: many(healthCheck),
  incidents: many(incident),
  alertConfigs: many(alertConfig),
}));

export const healthCheckRelations = relations(healthCheck, ({ one }) => ({
  monitor: one(monitor, {
    fields: [healthCheck.monitorId],
    references: [monitor.id],
  }),
}));

export const incidentRelations = relations(incident, ({ one, many }) => ({
  monitor: one(monitor, {
    fields: [incident.monitorId],
    references: [monitor.id],
  }),
  notifications: many(notification),
}));

export const alertConfigRelations = relations(alertConfig, ({ one, many }) => ({
  monitor: one(monitor, {
    fields: [alertConfig.monitorId],
    references: [monitor.id],
  }),
  notifications: many(notification),
}));

export const notificationRelations = relations(notification, ({ one }) => ({
  alertConfig: one(alertConfig, {
    fields: [notification.alertConfigId],
    references: [alertConfig.id],
  }),
  incident: one(incident, {
    fields: [notification.incidentId],
    references: [incident.id],
  }),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Monitor = typeof monitor.$inferSelect;
export type NewMonitor = typeof monitor.$inferInsert;

export type HealthCheck = typeof healthCheck.$inferSelect;
export type NewHealthCheck = typeof healthCheck.$inferInsert;

export type Incident = typeof incident.$inferSelect;
export type NewIncident = typeof incident.$inferInsert;

export type AlertConfig = typeof alertConfig.$inferSelect;
export type NewAlertConfig = typeof alertConfig.$inferInsert;

export type Notification = typeof notification.$inferSelect;
export type NewNotification = typeof notification.$inferInsert;
