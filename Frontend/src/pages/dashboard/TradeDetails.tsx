import Button from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '@/utils/axiosInstance';
import { useToast } from '@/hooks/useToast';
import { getStatusColor, getStatusDotColor } from '@/utils/statusColour';

interface TradeDetail {
  trade_id: number;
  status: string;
  user1: number;
  user2: number;
  user1_details?: {
    user_id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    profile_picture_url?: string;
  };
  user2_details?: {
    user_id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    role?: string;
    profile_picture_url?: string;
  };
  skill1_details?: {
    skill_id: number;
    skill_name: string;
    category?: string;
    description?: string;
  };
  skill2_details?: {
    skill_id: number;
    skill_name: string;
    category?: string;
    description?: string;
  };
  proposal_details?: {
    message?: string;
  };
  terms_agreed?: string;
  start_date?: string;
}

const TradeDetails = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { tradeId } = useParams<{ tradeId: string }>();
  const [trade, setTrade] = useState<TradeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch current user
    axios
      .get('/auth/me/')
      .then((res) => {
        setCurrentUserId(Number(res.data.user.user_id));
      })
      .catch((err) => console.error('Failed to fetch user:', err));

    const fetchTrade = async () => {
      if (!tradeId) return;
      try {
        const res = await axios.get(`/trades/${tradeId}/`);
        console.log('Trade data:', res.data);
        setTrade(res.data);
      } catch (err: any) {
        console.error('Failed to fetch trade:', err);
        showToast('Failed to fetch trade details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTrade();
  }, [tradeId]);

  if (loading) return <p className="p-10 text-center">Loading trade...</p>;
  if (!trade) return <p className="p-10 text-center">Trade not found.</p>;

  // Determine which user is "the other person"
  const otherUser =
    currentUserId === trade.user1 ? trade.user2_details : trade.user1_details;
  const currentUserSkill =
    currentUserId === trade.user1 ? trade.skill1_details : trade.skill2_details;
  const otherUserSkill =
    currentUserId === trade.user1 ? trade.skill2_details : trade.skill1_details;

  const otherUserName =
    otherUser?.first_name && otherUser?.last_name
      ? `${otherUser.first_name} ${otherUser.last_name}`
      : otherUser?.username || 'Unknown User';

  const message = trade.proposal_details?.message || trade.terms_agreed;

  return (
    <div className="mx-auto my-2 flex min-h-screen max-w-xl flex-col pb-20">
      {/* Header */}
      <div className="relative flex items-center justify-center border-b-2 border-gray-200 pt-2 pb-4 dark:border-gray-700">
        <ChevronLeft
          size={28}
          className="absolute left-2 cursor-pointer text-gray-900 dark:text-gray-100"
          onClick={() => navigate(-1)}
        />
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Trade Details
          </h1>
        </div>
      </div>

      <div className="space-y-4 bg-stone-50/50 px-4 pt-4 pb-10 dark:bg-gray-900">
        {/* Trade Status */}
        <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-600 dark:text-gray-300">
              Trade Status
            </span>
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

        {/* Your Skill */}
        <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
          <div className="flex-1 text-left">
            <h2 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              You're Offering
            </h2>
            <p className="text-lg font-bold text-gray-900 capitalize dark:text-gray-100">
              {currentUserSkill?.skill_name || 'Unknown Skill'}
            </p>
            {currentUserSkill?.description && (
              <p className="mt-1 text-sm text-gray-600 capitalize dark:text-gray-300">
                {currentUserSkill.description}
              </p>
            )}
          </div>
        </div>

        {/* Other User's Skill */}
        <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
          <div className="flex-1 text-left">
            <h2 className="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              You're Receiving
            </h2>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {otherUserSkill?.skill_name || 'Unknown Skill'}
            </p>
            {otherUserSkill?.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {otherUserSkill.description}
              </p>
            )}
          </div>
        </div>

        {/* Message/Terms */}
        {message && (
          <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
            <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
              Trade Agreement
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {message}
            </p>
          </div>
        )}

        {/* About Trading Partner */}
        <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
          <h2 className="mb-3 text-lg font-bold text-gray-900 dark:text-gray-100">
            Trading Partner
          </h2>
          <div className="flex items-center space-x-4">
            <img
              src={
                otherUser?.profile_picture_url ||
                'https://img.icons8.com/office/40/person-male.png'
              }
              alt={otherUserName}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="font-bold text-gray-900 dark:text-gray-100">
                {otherUserName}
              </p>
              {otherUser?.role && (
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {otherUser.role}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Trade Info */}
        {trade.start_date && (
          <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                Started
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {new Date(trade.start_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex space-x-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/app/dashboard/messages')}
            className="flex-1"
          >
            Message
          </Button>
          <Button
            onClick={() => navigate('/app/dashboard/trade')}
            className="flex-1 bg-red-600 text-white hover:bg-red-700"
          >
            Back to Trades
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TradeDetails;
