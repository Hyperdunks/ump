import { api } from "@/lib/client";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UpdateIncidentData = {
  state?: "detected" | "investigating" | "resolved";
  cause?: string;
  postmortem?: string;
};

export function useIncidents(params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.incidents.list(params),
    queryFn: async () => {
      const { data, error } = await api.incidents.index.get({
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

export function useIncident(id: string) {
  return useQuery({
    queryKey: queryKeys.incidents.detail(id),
    queryFn: async () => {
      const { data, error } = await api.incidents({ id }).get();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: { id: string; data: UpdateIncidentData }) => {
      const { data: res, error } = await api.incidents({ id }).put(data);
      if (error) throw error;
      return res;
    },
    onSuccess: (data, variables) => {
      toast.success("Incident updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.incidents.detail(variables.id),
      });
    },
    onError: (error) => {
      toast.error("Failed to update incident");
      console.error(error);
    },
  });
}
