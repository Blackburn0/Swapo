import {
  ArrowLeftRight,
  Bell,
  MessageSquare,
  MessageSquareDot,
  PlusCircle,
  Settings,
  Star,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTrades } from '@/hooks/useTrades';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import axios from '@/utils/axiosInstance';
import { getStatusColor, getStatusDotColor } from '@/utils/statusColour';
import { useNotifications } from '@/hooks/useNotifications';
import { useMessageList } from '@/hooks/useMessageList';

const quickLinksData = [
  {
    icon: PlusCircle,
    title: 'New Listing',
    url: '/app/dashboard/create-listing',
  },
  {
    icon: ArrowLeftRight,
    title: 'Find a Trade',
    url: '/app/dashboard/trade',
  },
  {
    icon: Star,
    title: 'My Reviews',
    url: '/app/dashboard/profile',
  },
  {
    icon: Settings,
    title: 'Settings',
    url: '/app/dashboard/settings',
  },
];

const DashboardHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: trades, isLoading } = useTrades();
  const { data: chatList = [] } = useMessageList();
  const { unreadCount } = useNotifications();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/auth/me');

        setProfile(res.data.user);
      } catch (err) {
        console.error('Failed to load user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading || !profile) {
    return <p className="p-10 text-center">Please login</p>;
  }

  // Get the 2 most recent trades for the current user
  const recentTrades =
    trades
      ?.filter(
        (trade: any) =>
          trade.user1 === profile?.user_id || trade.user2 === profile?.user_id,
      )
      .slice(0, 2) || [];

  const capitalize = (str?: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  // Function to check if there are unread messages for a specific user
  const hasUnreadMessagesForUser = (userId: number) => {
    const conversation = chatList.find(
      (chat: any) => chat.other_user.user_id === userId,
    );
    return conversation?.unread_count > 0;
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-10 dark:bg-gray-900">
      {/* Profile Header */}
      <div className="flex items-center justify-between bg-red-500 px-4 pt-10 pb-26 text-white">
        <div className="flex items-center justify-center space-x-3">
          <div
            className="cursor-pointer rounded-full border-transparent bg-white"
            onClick={() => navigate('/app/dashboard/profile')}
          >
            <img
              src={
                profile?.profile_picture_url ||
                'https://img.icons8.com/office/40/person-female.png'
              }
              alt="User Profile Photo"
              className="h-10 w-10 rounded-full border-transparent"
            />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-sm">Welcome back,</h1>
            <p className="text-2xl font-medium capitalize">
              {isAuthenticated
                ? profile?.first_name && profile?.last_name
                  ? `${profile.first_name} ${profile.last_name}`
                  : profile?.username
                : 'User'}
            </p>
          </div>
        </div>
        <div
          className="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/20"
          onClick={() => navigate('/app/dashboard/notification')}
        >
          <Bell
            size={18}
            className={
              unreadCount > 0
                ? 'origin-top animate-[shake_0.6s_ease-in-out_infinite] text-white'
                : ''
            }
          />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
              {unreadCount > 10 ? '10+' : unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Active Trades */}
      <div className="mx-4 -mt-10 rounded-xl border-transparent bg-white p-4 text-black shadow-xl dark:bg-gray-800 dark:text-gray-100">
        <div className="flex justify-between space-y-4">
          <h2 className="text-lg font-bold">Recent Trades</h2>
          <a
            className="cursor-pointer text-sm font-medium text-red-500 underline-offset-2 hover:underline"
            onClick={() => navigate('/app/dashboard/trade')}
          >
            View All
          </a>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            Loading trades...
          </div>
        ) : recentTrades.length === 0 ? (
          <div className="py-8 text-center">
            <p className="mb-2 text-gray-500 dark:text-gray-400">
              No trades yet
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Start by creating a listing to connect with others!
            </p>
          </div>
        ) : (
          <div>
            {recentTrades.map((trade: any, idx: number) => {
              // Determine the other user in the trade
              const otherUser = trade.user1_details || trade.user2_details;
              const otherUserId = otherUser?.user_id;
              const hasUnread = hasUnreadMessagesForUser(otherUserId);

              const profilePic =
                otherUser?.profile_picture_url ||
                'https://img.icons8.com/office/40/person-male.png';

              const displayName = otherUser?.first_name
                ? `${otherUser?.first_name} ${otherUser?.last_name}`
                : capitalize(otherUser?.username);

              return (
                <div
                  className="flex items-center justify-between"
                  key={trade.trade_id || idx}
                >
                  <div className="mb-4 flex items-center space-x-3 text-left">
                    <div
                      className="cursor-pointer rounded-full border-transparent bg-stone-200 dark:bg-gray-600"
                      onClick={() =>
                        navigate(`/app/dashboard/profile/${otherUserId}`)
                      }
                    >
                      <img
                        src={profilePic}
                        alt="User Profile"
                        className="h-10 w-10 rounded-full border-transparent"
                      />
                    </div>
                    <div
                      onClick={() =>
                        navigate(`/app/dashboard/trade/${trade.trade_id}`)
                      }
                      className="cursor-pointer"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Trade with {displayName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {trade.skill1_details?.skill_name || 'Skill'} ↔{' '}
                        {trade.skill2_details?.skill_name || 'Skill'}
                      </p>
                      <span
                        className={`mt-1 inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusColor(
                          trade.status,
                        )}`}
                      >
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${getStatusDotColor(trade.status)}`}
                        ></div>
                        {trade.status}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`relative cursor-pointer dark:text-gray-300 ${hasUnread ? 'text-red-800/90' : 'text-gray-700'}`}
                    onClick={() =>
                      navigate('/app/dashboard/messages', {
                        state: { userId: otherUserId, username: displayName },
                      })
                    }
                  >
                    <MessageSquare size={20} />
                    {hasUnread && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full border-2 border-red-800/90 bg-white"></span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="mx-4 my-10">
        <h3 className="mb-5 text-left text-lg font-bold text-gray-900 dark:text-gray-100">
          Quick Links
        </h3>
        <div className="grid grid-cols-2 gap-6">
          {quickLinksData.map((link, idx) => (
            <div
              key={idx}
              className="flex cursor-pointer flex-col items-center rounded-xl border-transparent bg-white p-10 shadow-md hover:bg-gray-50/70 dark:bg-gray-800 dark:hover:bg-gray-700/90"
              onClick={() => navigate(link.url)}
            >
              <div className="mb-2 rounded-full border-transparent bg-red-200/30 p-4 text-red-700 dark:bg-red-100/20 dark:text-red-500">
                <link.icon size={18} />
              </div>
              <div className="text-base font-semibold text-gray-700 dark:text-gray-300">
                {link.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
