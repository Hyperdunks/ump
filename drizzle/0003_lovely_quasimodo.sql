CREATE TABLE "user_integration" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"channel" "alert_channel" NOT NULL,
	"endpoint" text NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_integration" ADD CONSTRAINT "user_integration_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "userIntegration_userId_idx" ON "user_integration" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "userIntegration_userId_channel_idx" ON "user_integration" USING btree ("user_id","channel");