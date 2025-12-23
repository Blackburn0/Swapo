import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import { useToast } from '@/hooks/useToast';

interface BlockedUser {
  blockId: number;
  block_user_id: number;
  blocked_username: string;
  blocked_first_name: string;
  blocked_last_name: string;
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
      console.log('res', res.data);
      const users = res.data.map((item: any) => ({
        blockId: item.block_id,
        block_user_id: item.blocked_user_id,
        username: item.blocked_username,
        blocked_first_name: item.blocked_first_name,
        blocked_last_name: item.blocked_last_name,
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

  // console.log('user', blockedUsers);

  if (loading)
    return <p className="mt-10 text-center">Loading blocked users...</p>;
  if (blockedUsers.length === 0)
    return (
      <div className="mt-10 flex flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800">
          <svg
            className="h-10 w-10 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m2 2a9 9 0 11-14 0 9 9 0 0114 0z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
          You have not blocked any users yet.
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Block users to stop them from messaging you or seeing your posts.
        </p>
      </div>
    );

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
            key={user.block_user_id}
            className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-xs transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            {/* Icon + Text Row */}
            <div className="flex items-center space-x-4 text-left">
              <div className="rounded-sm border-transparent bg-red-100/50 p-2.5 text-gray-700 dark:bg-red-100/20 dark:text-red-500">
                <img
                  src={user.img}
                  alt={user.blocked_username}
                  className="h-10 w-10 rounded-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {user?.blocked_first_name && user?.blocked_last_name
                    ? `${user.blocked_first_name} ${user.blocked_last_name}`
                    : user?.blocked_username}
                </h2>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                  {user.blocked_at}
                </p>
              </div>
            </div>

            <Button
              className="w-auto! py-2"
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
