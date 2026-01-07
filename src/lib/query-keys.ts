export const queryKeys = {
  monitors: {
    all: ["monitors"] as const,
    list: (params: { page?: number; limit?: number }) =>
      [...queryKeys.monitors.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.monitors.all, "detail", id] as const,
    checks: (id: string, params: { page?: number; limit?: number }) =>
      [...queryKeys.monitors.detail(id), "checks", params] as const,
    stats: (id: string) => [...queryKeys.monitors.detail(id), "stats"] as const,
    uptime: (id: string) =>
      [...queryKeys.monitors.detail(id), "uptime"] as const,
  },
  alerts: {
    all: ["alerts"] as const,
    list: (monitorId: string) =>
      [...queryKeys.alerts.all, "list", monitorId] as const,
    detail: (id: string) => [...queryKeys.alerts.all, "detail", id] as const,
  },
  incidents: {
    all: ["incidents"] as const,
    list: (params: { page?: number; limit?: number }) =>
      [...queryKeys.incidents.all, "list", params] as const,
    detail: (id: string) => [...queryKeys.incidents.all, "detail", id] as const,
  },
  user: {
    me: ["user", "me"] as const,
  },
  admin: {
    all: ["admin"] as const,
    monitors: (params: { page?: number; limit?: number }) =>
      [...queryKeys.admin.all, "monitors", params] as const,
    users: (params: { page?: number; limit?: number }) =>
      [...queryKeys.admin.all, "users", params] as const,
    stats: () => [...queryKeys.admin.all, "stats"] as const,
  },
};
