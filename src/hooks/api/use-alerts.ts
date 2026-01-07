import { api } from "@/lib/client";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type CreateAlertData = {
  name: string;
  channel: "email" | "webhook" | "slack" | "discord";
  endpoint: string;
  failureThreshold?: number;
  isEnabled?: boolean;
};

type UpdateAlertData = Partial<CreateAlertData>;

export function useAlerts(monitorId: string) {
  return useQuery({
    queryKey: queryKeys.alerts.list(monitorId),
    queryFn: async () => {
      const { data, error } = await api.alerts.monitor({ monitorId }).get();
      if (error) throw error;
      return data;
    },
    enabled: !!monitorId,
  });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      monitorId,
      data,
    }: { monitorId: string; data: CreateAlertData }) => {
      const { data: res, error } = await api.alerts
        .monitor({ monitorId })
        .post(data);
      if (error) throw error;
      return res;
    },
    onSuccess: (data, variables) => {
      toast.success("Alert created successfully");
      queryClient.invalidateQueries({
        queryKey: queryKeys.alerts.list(variables.monitorId),
      });
    },
    onError: (error) => {
      toast.error("Failed to create alert");
      console.error(error);
    },
  });
}

export function useUpdateAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateAlertData }) => {
      const { data: res, error } = await api.alerts({ id }).put(data);
      if (error) throw error;
      return res;
    },
    onSuccess: (data, variables) => {
      toast.success("Alert updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },
    onError: (error) => {
      toast.error("Failed to update alert");
      console.error(error);
    },
  });
}

export function useDeleteAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await api.alerts({ id }).delete();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Alert deleted successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
    },
    onError: (error) => {
      toast.error("Failed to delete alert");
      console.error(error);
    },
  });
}
