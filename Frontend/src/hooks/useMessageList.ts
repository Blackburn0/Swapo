// src/hooks/useMessageList.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

export const useMessageList = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await axiosInstance.get('messages/conversations/');
      return res.data;
    },
  });
};
