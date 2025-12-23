import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/utils/axiosInstance';

interface Notification {
  notification_id: number;
  user: number;
  message: number | null;
  proposal: number | null;
  trade: number | null;
  type: string;
  message_text: string;
  timestamp: string;
  is_read: boolean;
  link_url: string | null;
  sender_details: {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    profile_picture_url: string;
  } | null;
  message_details: {
    message_id: number;
    content: string;
    timestamp: string;
  } | null;
  proposal_details: {
    proposal_id: number;
    status: string;
  } | null;
  trade_details: {
    trade_id: number;
    status: string;
  } | null;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // Fetch all notifications
  const { data, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await axios.get('/notifications/');
      return response.data as Notification[];
    },
  });

  // Get unread count
  const { data: unreadCount } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await axios.get('/notifications/unread_count/');
      return response.data.unread_count as number;
    },
  });

  // Mark all as read mutation
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/notifications/mark_all_read/');
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  // Mark single notification as read
  const markAsRead = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await axios.patch(`/notifications/${notificationId}/`, {
        is_read: true,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  return {
    notifications: data || [],
    isLoading,
    error,
    unreadCount: unreadCount || 0,
    markAllAsRead,
    markAsRead,
  };
};
