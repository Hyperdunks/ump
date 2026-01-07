import { api } from "@/lib/client";
import { queryKeys } from "@/lib/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUserProfile() {
  return useQuery({
    queryKey: queryKeys.user.me,
    queryFn: async () => {
      const { data, error } = await api.user.me.get();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string }) => {
      const { data: res, error } = await api.user.me.put(data);
      if (error) throw error;
      return res;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.user.me });
    },
    onError: (error) => {
      toast.error("Failed to update profile");
      console.error(error);
    },
  });
}

export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const { data, error } = await api.user.image.post({
        file,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Image uploaded successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.user.me });
    },
    onError: (error) => {
      toast.error("Failed to upload image");
      console.error(error);
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await api.user.image.delete();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Image removed successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.user.me });
    },
    onError: (error) => {
      toast.error("Failed to remove image");
      console.error(error);
    },
  });
}
