// src/hooks/useTrades.ts
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

export const useTrades = () => {
  return useQuery({
    queryKey: ["trades"],
    queryFn: async () => {
      const response = await axiosInstance.get("trades/");
      return response.data;
    },
  });
};

