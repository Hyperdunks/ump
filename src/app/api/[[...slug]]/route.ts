import { Elysia, NotFoundError } from "elysia";
import { betterAuthPlugin, OpenAPI } from "./auth";
import { monitorRouter } from "../monitors/route";
import { incidentRouter } from "../incidents/route";
import { alertsRouter } from "../alerts/route";
import { adminRouter } from "../admin/route";
import { APIError } from "@/lib/api-error";
import { notFound } from "next/navigation";
import { openapi } from '@elysiajs/openapi'

const app = new Elysia({ prefix: "/api" })
	.use(betterAuthPlugin)
	.use(monitorRouter)
	.use(incidentRouter)
	.use(alertsRouter)
	.use(adminRouter)
	.use(
		openapi({
			documentation: {
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths()
			}
		})
	)
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
