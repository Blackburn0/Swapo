import { ChevronLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '@/utils/axiosInstance';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/ui/Button';
import { getStatusColor, getStatusDotColor } from '@/utils/statusColour';

export type Proposal = {
  proposal_id: number;
  message: string;
  proposal_date: string;
  status: string;
  last_status_update: string;
  listing: number;
  proposer: number;
  recipient: number;
  skill_offered_by_proposer: number;
  skill_desired_by_proposer: number;
  proposer_details?: any;
  recipient_details?: any;
  skill_offered_details?: any;
  skill_desired_details?: any;
};

const ProposalDetails = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Fetch current user
    axios
      .get('/auth/me/')
      .then((res) => {
        setCurrentUserId(Number(res.data.user.user_id));
      })
      .catch((err) => console.error('Failed to fetch user:', err));

    // Fetch proposal
    axios
      .get(`/trades/proposals/${proposalId}/`)
      .then((res) => {
        console.log('proposal', res.data);
        setProposal(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [proposalId]);

  const handleAccept = async () => {
    if (!proposal) return;

    setProcessing(true);
    try {
      const response = await axios.post(
        `/trades/proposals/${proposal.proposal_id}/accept/`,
      );
      showToast('Proposal accepted! Trade created successfully.', 'success');

      // Navigate to the trade details page
      if (response.data.trade?.trade_id) {
        navigate(`/app/dashboard/trade/${response.data.trade.trade_id}`);
      } else {
        // Refresh proposal data
        setProposal(response.data.proposal);
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.detail || 'Failed to accept proposal',
        'error',
      );
      console.error('Error accepting proposal:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!proposal) return;

    setProcessing(true);
    try {
      const response = await axios.post(
        `/trades/proposals/${proposal.proposal_id}/reject/`,
      );
      showToast('Proposal rejected', 'success');
      setProposal(response.data.proposal);
    } catch (err: any) {
      showToast(
        err?.response?.data?.detail || 'Failed to reject proposal',
        'error',
      );
      console.error('Error rejecting proposal:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <p className="p-5 text-center text-gray-500 dark:text-gray-300">
        Loading...
      </p>
    );

  if (!proposal)
    return (
      <p className="p-5 text-center text-gray-500 dark:text-gray-300">
        Proposal not found.
      </p>
    );

  const isRecipient = currentUserId === proposal.recipient;
  const canAcceptOrReject = isRecipient && proposal.status === 'pending';
  // console.log('proposal', proposal);
  // console.log('recipient', isRecipient);
  return (
    <div className="mx-auto mb-12 max-w-xl p-5">
      {/* Header with back button */}
      <div className="relative mb-5 flex items-center justify-center">
        <ChevronLeft
          size={28}
          className="absolute left-0 cursor-pointer text-gray-900 dark:text-gray-100"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
          Proposal Details
        </h1>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-md dark:bg-gray-800">
        {/* ONE REUSABLE ROW */}
        <div className="flex justify-between border-b border-gray-200 py-3 dark:border-gray-700">
          <span className="font-semibold text-gray-600 dark:text-gray-300">
            Proposal ID
          </span>
          <span className="font-bold text-gray-900 dark:text-gray-100">
            #{proposal.proposal_id}
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-200 py-3 dark:border-gray-700">
          <span className="font-semibold text-gray-600 dark:text-gray-300">
            Status
          </span>

          <span
            className={`flex items-center gap-2 rounded-full px-3 py-0.5 text-sm font-bold tracking-wide ${getStatusColor(
              proposal.status,
            )}`}
          >
            <div
              className={`h-2 w-2 rounded-full ${getStatusDotColor(
                proposal.status,
              )}`}
            ></div>
            {proposal.status}
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-200 py-3 dark:border-gray-700">
          <span className="font-semibold text-gray-600 dark:text-gray-300">
            Message
          </span>
          <span className="max-w-[55%] text-right text-gray-800 dark:text-gray-200">
            {proposal.message || '—'}
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-200 py-3 dark:border-gray-700">
          <span className="font-semibold text-gray-600 dark:text-gray-300">
            Proposer
          </span>
          <span className="font-medium text-gray-900 capitalize dark:text-gray-100">
            {proposal.proposer_details?.username || `User ${proposal.proposer}`}
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-200 py-3 dark:border-gray-700">
          <span className="font-semibold text-gray-600 dark:text-gray-300">
            Recipient
          </span>
          <span className="font-medium text-gray-900 capitalize dark:text-gray-100">
            {proposal.recipient_details?.username ||
              `User ${proposal.recipient}`}
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-200 py-3 dark:border-gray-700">
          <span className="font-semibold text-gray-600 dark:text-gray-300">
            Skill Offered
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {proposal.skill_offered_details?.skill_name ||
              proposal.skill_offered_by_proposer}
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-200 py-3 dark:border-gray-700">
          <span className="font-semibold text-gray-600 dark:text-gray-300">
            Skill Desired
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {proposal.skill_desired_details?.skill_name ||
              proposal.skill_desired_by_proposer}
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-200 py-3 dark:border-gray-700">
          <span className="font-semibold text-gray-600 dark:text-gray-300">
            Proposal Date
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {new Date(proposal.proposal_date).toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between py-3">
          <span className="font-semibold text-gray-600 dark:text-gray-300">
            Last Updated
          </span>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {new Date(proposal.last_status_update).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {canAcceptOrReject && (
        <div className="mt-5 flex gap-3">
          <Button
            onClick={handleReject}
            variant="outline"
            disabled={processing}
            className="flex-1"
          >
            {processing ? 'Processing...' : 'Reject'}
          </Button>
          <Button
            onClick={handleAccept}
            disabled={processing}
            className="flex-1 bg-green-600 text-white hover:bg-green-700"
          >
            {processing ? 'Processing...' : 'Accept'}
          </Button>
        </div>
      )}

      {proposal.status === 'accepted' && (
        <div className="mt-5 rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            This proposal has been accepted and a trade has been created!
          </p>
          <Button
            onClick={() => navigate('/app/dashboard/trade')}
            className="mt-3 bg-green-600 text-white hover:bg-green-700"
          >
            View Trades
          </Button>
        </div>
      )}

      {proposal.status === 'rejected' && (
        <div className="mt-5 rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            This proposal has been rejected.
          </p>
        </div>
      )}
    </div>
  );
};
export default ProposalDetails;
