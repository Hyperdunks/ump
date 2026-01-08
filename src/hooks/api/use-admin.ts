import { api } from "@/lib/client";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type UpdateRoleData = {
    role: "user" | "admin";
};

export function useAdminMonitors(
    params: { page?: number; limit?: number } = {},
) {
    return useQuery({
        queryKey: queryKeys.admin.monitors(params),
        queryFn: async () => {
            const { data, error } = await api.admin.monitors.get({
                query: {
                    page: params.page ?? 1,
                    limit: params.limit ?? 50,
                },
            });
            if (error) throw error;
            return data;
        },
    });
}

export function useAdminUsers(params: { page?: number; limit?: number } = {}) {
    return useQuery({
        queryKey: queryKeys.admin.users(params),
        queryFn: async () => {
            const { data, error } = await api.admin.users.get({
                query: {
                    page: params.page ?? 1,
                    limit: params.limit ?? 50,
                },
            });
            if (error) throw error;
            return data;
        },
    });
}

export function useAdminStats() {
    return useQuery({
        queryKey: queryKeys.admin.stats(),
        queryFn: async () => {
            const { data, error } = await api.admin.stats.get();
            if (error) throw error;
            return data;
        },
    });
}

export function useUpdateUserRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: UpdateRoleData }) => {
            const { data: res, error } = await api.admin.users({ id }).role.put(data);
            if (error) throw error;
            return res;
        },
        onSuccess: () => {
            toast.success("User role updated successfully");
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
        },
        onError: (error) => {
            toast.error("Failed to update user role");
            console.error(error);
        },
    });
}
