import Button from '@/components/ui/Button';
import { ChevronLeft, MessageCircle, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '@/utils/axiosInstance';
import { useToast } from '@/hooks/useToast';
import { getStatusColor, getStatusDotColor } from '@/utils/statusColour';
import type { Proposal } from './ProposalDetails';

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
    proposal_id: number;
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
  const [_proposal, setProposal] = useState<Proposal | null>(null);
  const [processing, setProcessing] = useState(false);

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
        setProposal(res.data.proposal_details);
      } catch (err) {
        console.error('Failed to fetch trade:', err);
        showToast('Failed to fetch trade details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTrade();
  }, [tradeId]);

  const handleCompleted = async () => {
    if (!trade) return;

    setProcessing(true);
    try {
      const response = await axios.post(`/trades/${trade.trade_id}/completed/`);

      const updatedTrade = response.data.trade;

      if (!updatedTrade) {
        showToast('Failed to update trade status', 'error');
        return;
      }

      setTrade(updatedTrade);

      showToast('Trade marked as completed successfully.', 'success');
    } catch (err) {
      showToast('Failed to mark trade as completed', 'error');
      console.error('Error marking trade as completed:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p className="p-10 text-center">Loading trade...</p>;
  if (!trade) return <p className="p-10 text-center">Trade not found.</p>;

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
  const isTradeCompleted = trade.status.toLowerCase() === 'completed';
  //console.log('message', message);
  return (
    <div className="mx-auto h-full max-w-xl flex-col">
      {/* Header - Sticky, flat look */}
      <div className="sticky top-0 z-10 flex items-center justify-center border-b border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900">
        <ChevronLeft
          size={24}
          className="absolute left-4 cursor-pointer text-gray-700 dark:text-gray-300"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Trade Details
        </h1>
      </div>

      {/* Main Content - Flat background */}
      <div className="space-y-0 divide-y divide-gray-100 bg-white px-4 pb-5 dark:divide-gray-800 dark:bg-gray-900">
        {/* Trade Status - Highlighted, no card/shadow */}
        <div className="flex items-center justify-between py-4">
          <span className="text-base font-semibold text-gray-500 dark:text-gray-400">
            Current Status
          </span>
          <span
            className={`flex items-center gap-2 rounded-full px-3 py-0.5 text-sm font-bold tracking-wide ${getStatusColor(
              trade.status,
            )}`}
          >
            <div
              className={`h-2 w-2 rounded-full ${getStatusDotColor(
                trade.status,
              )}`}
            ></div>
            {trade.status}
          </span>
        </div>

        {/* Your Skill - Using dividers for separation */}
        <div className="py-4 text-left">
          <h3 className="mb-1 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
            You Are Offering
          </h3>
          <p className="text-md font-bold text-gray-900 capitalize dark:text-gray-100">
            {currentUserSkill?.skill_name || 'Unknown Skill'}
          </p>
          {currentUserSkill?.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {currentUserSkill.description}
            </p>
          )}
        </div>

        {/* Other User's Skill */}
        <div className="py-4 text-left">
          <h3 className="mb-1 text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
            You Are Receiving
          </h3>
          <p className="text-md font-bold text-gray-900 capitalize dark:text-gray-100">
            {otherUserSkill?.skill_name || 'Unknown Skill'}
          </p>
          {otherUserSkill?.description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {otherUserSkill.description}
            </p>
          )}
        </div>

        {/* About Trading Partner */}
        <div className="py-4">
          <h2 className="mb-3 text-left text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
            Trading Partner
          </h2>
          <div
            className="flex cursor-pointer items-center space-x-4"
            onClick={() =>
              navigate(`/app/dashboard/profile/${otherUser?.user_id}`)
            }
          >
            <img
              src={
                otherUser?.profile_picture_url ||
                'https://img.icons8.com/office/40/person-male.png'
              }
              alt={otherUserName}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="font-bold text-gray-900 capitalize dark:text-gray-100">
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

        {/* Message/Terms */}
        {message && (
          <div className="py-4 text-left">
            <h2 className="mb-2 text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
              Agreed Terms
            </h2>
            <p className="text-base whitespace-pre-wrap text-gray-800 dark:text-gray-300">
              {message}
            </p>
          </div>
        )}

        {/* Trade Info */}
        {trade.start_date && (
          <div className="flex justify-between py-4">
            <span className="text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
              Trade Start Date
            </span>
            <span className="text-base font-medium text-gray-900 dark:text-gray-100">
              {new Date(trade.start_date).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* CTA Buttons */}
      <div className="mx-auto mb-14 max-w-xl border-t border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/app/dashboard/messages')}
            className="flex flex-1 items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            Message Partner
          </Button>
          <Button
            onClick={handleCompleted}
            disabled={processing || isTradeCompleted}
            className={`flex flex-1 items-center justify-center gap-2 ${
              isTradeCompleted
                ? 'cursor-not-allowed bg-green-500 hover:bg-green-500/90'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isTradeCompleted ? (
              <>
                <CheckCircle size={18} />
                Completed
              </>
            ) : processing ? (
              'Processing...'
            ) : (
              'Mark as Completed'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TradeDetails;
