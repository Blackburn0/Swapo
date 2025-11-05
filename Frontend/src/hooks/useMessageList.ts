// src/hooks/useMessageList.ts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/utils/axiosInstance';

export const useMessageList = () => {
  return useQuery({
    queryKey: ['messageList'],
    queryFn: async () => {
      const res = await axiosInstance.get('messages/');
      return res.data;
    },
  });
};
