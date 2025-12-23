// src/hooks/useProfile.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

export const useProfile = () => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await axiosInstance.get('/api/v1/auth/user/');
      return res.data;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosInstance.put('/api/v1/auth/user/', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  return { ...profileQuery, updateProfile };
};
