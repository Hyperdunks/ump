import { openapi } from "@elysiajs/openapi";
import { Elysia, NotFoundError } from "elysia";
import { notFound } from "next/navigation";
import { APIError } from "@/lib/api-error";
import { initializeLastCheckTimes } from "@/lib/workers";
import { adminRouter } from "@/routes/admin/route";
import { alertsRouter } from "@/routes/alerts/route";
import { incidentRouter } from "@/routes/incidents/route";
import { monitorRouter } from "@/routes/monitors/route";
import { betterAuthPlugin, OpenAPI } from "./auth";

// Initialize last check times on startup
initializeLastCheckTimes().catch(console.error);

const app = new Elysia({ prefix: "/api" })
  // Note: Health check cron is handled by Vercel's native cron (/api/cron)
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    }),
  )
  .use(betterAuthPlugin)
  .use(monitorRouter)
  .use(incidentRouter)
  .use(alertsRouter)
  .use(adminRouter)
  .get("/health", () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .onError(({ error, set }) => {
    if (error instanceof APIError) {
      set.status = error.status;
      return {
        success: false,
        message: error.message,
        code: error.code,
      };
    } else if (error instanceof NotFoundError) {
      notFound();
    } else if (isNextJsInternalError(error)) {
      throw error;
    }

    console.error("Internal Server Error:", error);

    set.status = 500;
    return {
      success: false,
      message: "Internal Server Error",
    };
  });

export type App = typeof app;

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const DELETE = app.handle;
export const PATCH = app.handle;

function isNextJsInternalError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("digest" in error)) {
    return false;
  }
  const digest = (error as { digest?: string }).digest;
  return typeof digest === "string" && digest.startsWith("NEXT_");
}
