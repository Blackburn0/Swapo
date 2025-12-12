import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTrades } from '@/hooks/useTrades';
import { getStatusColor, getStatusDotColor } from '@/utils/statusColour';

const nav = ['All', 'Pending', 'Active', 'Completed'];

const Trade = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const { data: trades = [], isLoading, error } = useTrades();

  if (isLoading) return <p className="mt-10 text-center">Loading...</p>;
  if (error)
    return (
      <p className="mt-10 text-center text-red-500">Failed to load trades</p>
    );

  const filteredTrades =
    activeTab === 'All'
      ? trades
      : trades.filter((trade: any) => {
          const status = trade.status.toLowerCase();
          if (activeTab === 'Pending')
            return status === 'pending' || status === 'active';
          if (activeTab === 'Active')
            return status === 'active' || status === 'in_progress';
          if (activeTab === 'Completed') return status === 'completed';
          return false;
        });

  return (
    <div className="mx-auto min-h-screen max-w-xl bg-stone-50 py-5 dark:bg-gray-900">
      {/* Header */}
      <div className="relative mb-8 flex items-center justify-center border-b border-gray-200 pb-4 dark:border-gray-700">
        <ChevronLeft
          size={28}
          className="absolute left-0 cursor-pointer text-gray-900 dark:text-gray-100"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Trades
        </h1>
      </div>

      {/* Navigation Tabs */}
      <nav className="border-b border-gray-200 px-4 dark:border-gray-700">
        <ul className="flex justify-start space-x-10 text-sm font-medium">
          {nav.map((link) => (
            <li
              key={link}
              className={`relative cursor-pointer pb-6 font-bold transition-colors ${
                activeTab === link
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setActiveTab(link)}
            >
              {link}
              {activeTab === link && (
                <span className="absolute right-0 bottom-0 left-0 mx-auto mt-2 h-[3px] w-full rounded-full bg-red-500 dark:bg-red-400"></span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Trade List */}
      <div className="space-y-4 bg-stone-50/50 px-4 pt-6 pb-10 dark:bg-gray-900">
        {filteredTrades.length === 0 ? (
          <p className="text-center text-gray-500">No trades found</p>
        ) : (
          filteredTrades.map((trade: any, idx: number) => {
            const otherUser = trade.user1_details || trade.user2_details;
            const tradeeName =
              otherUser?.username ||
              (otherUser?.first_name && otherUser?.last_name)
                ? `${otherUser.first_name} ${otherUser.last_name}`
                : 'Unknown User';
            const profilePic =
              otherUser?.profile_picture_url ||
              'https://img.icons8.com/office/40/person-male.png';

            return (
              <div
                key={trade.trade_id || trade.id || idx}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                onClick={() =>
                  navigate(`/app/dashboard/trade/${trade.trade_id}`)
                }
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={profilePic}
                    alt={tradeeName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-200">
                      Trade with {tradeeName}
                    </p>
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
                <ChevronRight
                  size={20}
                  className="text-gray-400 dark:text-gray-200"
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Trade;
