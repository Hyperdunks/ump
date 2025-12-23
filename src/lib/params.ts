import { t } from "elysia";

export const paginationQuery = t.Object({
  page: t.Optional(t.Numeric({ default: 1 })),
  limit: t.Optional(t.Numeric({ default: 20 })),
});

export const idParam = t.Object({
  id: t.String(),
});

export const monitorIdParam = t.Object({
  monitorId: t.String(),
});

export const updateRoleBody = t.Object({
  role: t.Union([t.Literal("user"), t.Literal("admin")]),
});
