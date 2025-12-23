CREATE TYPE "public"."alert_channel" AS ENUM('email', 'webhook', 'slack', 'discord');--> statement-breakpoint
CREATE TYPE "public"."check_status" AS ENUM('up', 'down', 'degraded');--> statement-breakpoint
CREATE TYPE "public"."http_method" AS ENUM('GET', 'POST', 'HEAD');--> statement-breakpoint
CREATE TYPE "public"."incident_state" AS ENUM('detected', 'investigating', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."monitor_type" AS ENUM('http', 'https', 'tcp', 'ping');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "alert_config" (
	"id" text PRIMARY KEY NOT NULL,
	"monitor_id" text NOT NULL,
	"name" text NOT NULL,
	"channel" "alert_channel" NOT NULL,
	"endpoint" text NOT NULL,
	"failure_threshold" integer DEFAULT 3 NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "health_check" (
	"id" text PRIMARY KEY NOT NULL,
	"monitor_id" text NOT NULL,
	"status" "check_status" NOT NULL,
	"status_code" integer,
	"response_time" integer,
	"error" text,
	"checked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incident" (
	"id" text PRIMARY KEY NOT NULL,
	"monitor_id" text NOT NULL,
	"state" "incident_state" DEFAULT 'detected' NOT NULL,
	"detected_at" timestamp DEFAULT now() NOT NULL,
	"acknowledged_at" timestamp,
	"resolved_at" timestamp,
	"cause" text,
	"postmortem" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monitor" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"type" "monitor_type" DEFAULT 'https' NOT NULL,
	"method" "http_method" DEFAULT 'GET' NOT NULL,
	"check_interval" integer DEFAULT 60 NOT NULL,
	"timeout" integer DEFAULT 30000 NOT NULL,
	"expected_status_codes" text[] DEFAULT '{"200"}' NOT NULL,
	"headers" jsonb,
	"body" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" text PRIMARY KEY NOT NULL,
	"alert_config_id" text NOT NULL,
	"incident_id" text NOT NULL,
	"channel" text NOT NULL,
	"success" boolean NOT NULL,
	"error" text,
	"sent_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role" DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "alert_config" ADD CONSTRAINT "alert_config_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "health_check" ADD CONSTRAINT "health_check_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "incident" ADD CONSTRAINT "incident_monitor_id_monitor_id_fk" FOREIGN KEY ("monitor_id") REFERENCES "public"."monitor"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monitor" ADD CONSTRAINT "monitor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_alert_config_id_alert_config_id_fk" FOREIGN KEY ("alert_config_id") REFERENCES "public"."alert_config"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_incident_id_incident_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."incident"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "alertConfig_monitorId_idx" ON "alert_config" USING btree ("monitor_id");--> statement-breakpoint
CREATE INDEX "healthCheck_monitorId_idx" ON "health_check" USING btree ("monitor_id");--> statement-breakpoint
CREATE INDEX "healthCheck_checkedAt_idx" ON "health_check" USING btree ("checked_at");--> statement-breakpoint
CREATE INDEX "healthCheck_monitorId_checkedAt_idx" ON "health_check" USING btree ("monitor_id","checked_at");--> statement-breakpoint
CREATE INDEX "incident_monitorId_idx" ON "incident" USING btree ("monitor_id");--> statement-breakpoint
CREATE INDEX "incident_state_idx" ON "incident" USING btree ("state");--> statement-breakpoint
CREATE INDEX "monitor_userId_idx" ON "monitor" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "monitor_isActive_idx" ON "monitor" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "notification_alertConfigId_idx" ON "notification" USING btree ("alert_config_id");--> statement-breakpoint
CREATE INDEX "notification_incidentId_idx" ON "notification" USING btree ("incident_id");