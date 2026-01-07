import { api } from "@/lib/client";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types derived from the API definition would be ideal, but for now we infer from usage
type CreateMonitorData = {
  name: string;
  url: string;
  type?: "http" | "https" | "tcp" | "ping";
  method?: "GET" | "POST" | "HEAD";
  checkInterval?: number;
  timeout?: number;
  expectedStatusCodes?: string[];
  headers?: Record<string, string>;
  body?: string;
  isActive?: boolean;
  isPublic?: boolean;
};

type UpdateMonitorData = Partial<CreateMonitorData>;

export function useMonitors(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.monitors.list(params),
    queryFn: async () => {
      const { data, error } = await api.monitors.get({
        query: {
          page: params.page ?? 1,
          limit: params.limit ?? 20,
        },
      });

      if (error) throw error;
      return data;
    },
  });
}

export function useMonitor(id: string) {
  return useQuery({
    queryKey: queryKeys.monitors.detail(id),
    queryFn: async () => {
      const { data, error } = await api.monitors({ id }).get();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useMonitorChecks(
  id: string,
  params: { page?: number; limit?: number } = {},
) {
  return useQuery({
    queryKey: queryKeys.monitors.checks(id, params),
    queryFn: async () => {
      const { data, error } = await api.monitors({ id }).checks.get({
        query: {
          page: params.page ?? 1,
          limit: params.limit ?? 50,
        },
      });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useMonitorStats(id: string) {
  return useQuery({
    queryKey: queryKeys.monitors.stats(id),
    queryFn: async () => {
      const { data, error } = await api.monitors({ id }).stats.get();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useMonitorUptime(id: string) {
  return useQuery({
    queryKey: queryKeys.monitors.uptime(id),
    queryFn: async () => {
      const { data, error } = await api.monitors({ id }).uptime.get();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateMonitor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMonitorData) => {
      const { data: res, error } = await api.monitors.post(data);
      if (error) throw error;
      return res;
    },
    onSuccess: () => {
      toast.success("Monitor created successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.monitors.all });
    },
    onError: (error) => {
      toast.error("Failed to create monitor");
      console.error(error);
    },
  });
}

export function useUpdateMonitor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMonitorData;
    }) => {
      const { data: res, error } = await api.monitors({ id }).put(data);
      if (error) throw error;
      return res;
    },
    onSuccess: (data, variables) => {
      toast.success("Monitor updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.monitors.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.monitors.detail(variables.id),
      });
    },
    onError: (error) => {
      toast.error("Failed to update monitor");
      console.error(error);
    },
  });
}

export function useDeleteMonitor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await api.monitors({ id }).delete();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Monitor deleted successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.monitors.all });
    },
    onError: (error) => {
      toast.error("Failed to delete monitor");
      console.error(error);
    },
  });
}
