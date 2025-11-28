import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import { useToast } from '@/hooks/useToast';

interface BlockedUser {
  blockId: number;
  id: number;
  username: string;
  img: string;
  blocked_at: string;
}

const BlockedUsers = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlockedUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/userblocks/');
      const users = res.data.map((item: any) => ({
        blockId: item.block_id,
        id: item.blocked.id,
        username: item.blocked.username,
        img:
          item.blocked.profile_image ||
          'https://img.icons8.com/office/40/person-male.png',
        blocked_at: new Date(item.block_date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      }));
      setBlockedUsers(users);
    } catch (err) {
      console.error(err);
      showToast('Failed to fetch blocked users.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (blockId: number) => {
    try {
      await axiosInstance.delete(`/userblocks/${blockId}/`);
      showToast('User unblocked successfully.', 'success');
      setBlockedUsers((prev) =>
        prev.filter((user) => user.blockId !== blockId),
      );
    } catch (err) {
      console.error(err);
      showToast('Failed to unblock user.', 'error');
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  if (loading)
    return <p className="mt-10 text-center">Loading blocked users...</p>;
  if (blockedUsers.length === 0)
    return <p className="mt-10 text-center">No blocked users</p>;

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col bg-stone-50 py-2 pb-20 dark:bg-gray-900">
      {/* Header */}
      <div className="relative flex items-center justify-center border-b-2 border-gray-200 pt-2 pb-4 dark:border-gray-700">
        <ChevronLeft
          size={28}
          className="absolute left-2 cursor-pointer text-gray-900 dark:text-gray-100"
          onClick={() => navigate(-1)}
        />
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Blocked Users
          </h1>
        </div>
      </div>

      <div className="space-y-4 bg-stone-50/50 px-4 pt-4 dark:bg-gray-900">
        <h2 className="text-base font-medium text-gray-500 dark:text-gray-300">
          You won't see their posts or messages, and they won't see yours.
        </h2>

        {/* Blocked Users */}
        {blockedUsers.map((user) => (
          <div
            key={user.id}
            className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-xs transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            {/* Icon + Text Row */}
            <div className="flex items-center space-x-4 text-left">
              <div className="rounded-sm border-transparent bg-red-100/50 p-2.5 text-gray-700 dark:bg-red-100/20 dark:text-red-500">
                <img
                  src={user.img}
                  alt={user.username}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {user.username}
                </h2>
                <p className="text-base font-semibold text-gray-500 dark:text-gray-300">
                  {user.blocked_at}
                </p>
              </div>
            </div>

            <Button
              className="w-auto! bg-gray-100! py-2! text-black hover:bg-gray-300! dark:bg-gray-700! dark:text-gray-200 dark:hover:bg-gray-600!"
              onClick={() => handleUnblock(user.blockId)}
            >
              Unblock
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockedUsers;
