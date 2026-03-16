import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/client";
import { queryKeys } from "@/lib/query-keys";

type IntegrationChannel = "email" | "webhook" | "slack" | "discord";

type CreateIntegrationData = {
  channel: IntegrationChannel;
  endpoint: string;
  isEnabled?: boolean;
};

type UpdateIntegrationData = Partial<CreateIntegrationData>;

export function useIntegrations() {
  return useQuery({
    queryKey: queryKeys.integrations.all,
    queryFn: async () => {
      const { data, error } = await api.integrations.get();
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateIntegrationData) => {
      const { data: res, error } = await api.integrations.post(data);
      if (error) throw error;
      return res;
    },
    onSuccess: () => {
      toast.success("Integration saved");
      queryClient.invalidateQueries({
        queryKey: queryKeys.integrations.all,
      });
    },
    onError: () => {
      toast.error("Failed to save integration");
    },
  });
}

export function useUpdateIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: { id: string; data: UpdateIntegrationData }) => {
      const { data: res, error } = await api.integrations({ id }).put(data);
      if (error) throw error;
      return res;
    },
    onSuccess: () => {
      toast.success("Integration updated");
      queryClient.invalidateQueries({
        queryKey: queryKeys.integrations.all,
      });
    },
    onError: () => {
      toast.error("Failed to update integration");
    },
  });
}

export function useDeleteIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await api.integrations({ id }).delete();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Integration removed");
      queryClient.invalidateQueries({
        queryKey: queryKeys.integrations.all,
      });
    },
    onError: () => {
      toast.error("Failed to remove integration");
    },
  });
}
