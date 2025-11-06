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

const activeTradeData = [
  {
    img: 'https://img.icons8.com/office/40/person-male.png',
    name: 'Alex',
    desc: 'Photography for Web Design',
    url: '',
    senderProfileurl: '',
  },
  {
    img: 'https://img.icons8.com/office/40/person-female.png',
    name: 'Sarah',
    desc: 'Copywriting for SEO',
    url: '',
    senderProfileurl: '',
  },
];

const quickLinksData = [
  {
    icon: PlusCircle,
    title: 'New Listing',
    url: '/app/dashboard/listing',
  },
  {
    icon: ArrowLeftRight,
    title: 'Find a Trade',
    url: '/app/dashboard/trade',
  },
  {
    icon: Star,
    title: 'My Reviews',
    url: '/app/dashboard/reviews',
  },
  {
    icon: Settings,
    title: 'Settings',
    url: '/app/dashboard/settings',
  },
];

const DashboardHome = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-stone-50 pb-10 dark:bg-gray-900">
      {/* Profile Header */}
      <div className="flex items-center justify-between bg-red-500 px-4 pt-10 pb-26 text-white">
        <div className="flex items-center justify-center space-x-3">
          <div
            className="cursor-pointer rounded-full border bg-white p-1"
            onClick={() => navigate('/dashboard/profile')}
          >
            <img
              src="https://img.icons8.com/office/40/person-male.png"
              alt="User Profile Photo"
              className="h-8 w-8"
            />
          </div>
          <div>
            <h1 className="text-sm">Welcome back,</h1>
            <p className="text-2xl font-medium">John Doe</p>
          </div>
        </div>
        <div
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-transparent bg-white/20"
          onClick={() => navigate('/app/dashboard/notification')}
        >
          <Bell size={18} />
        </div>
      </div>

      {/* Active Trades */}
      <div className="mx-4 -mt-10 rounded-xl border-transparent bg-white p-4 text-black shadow-xl dark:bg-gray-800 dark:text-gray-100">
        <div className="flex justify-between space-y-4">
          <h2 className="text-lg font-bold">Active Trades</h2>
          <a className="cursor-pointer text-sm font-medium text-red-500 underline-offset-2 hover:underline">
            View All
          </a>
        </div>
        <div>
          {activeTradeData.map((trade, idx) => (
            <div className="flex items-center justify-between" key={idx}>
              <div className="mb-4 flex items-center space-x-3 text-left">
                <div
                  className="cursor-pointer rounded-full border-transparent bg-stone-200 p-1 dark:bg-gray-600"
                  onClick={() => navigate(trade.senderProfileurl)}
                >
                  <img
                    src={trade.img}
                    alt="User Profile Photo"
                    className="h-8 w-8"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Trade with {trade.name}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {trade.desc}
                  </p>
                </div>
              </div>
              {idx === 0 ? (
                <div
                  className="cursor-pointer text-red-600 dark:text-red-400"
                  onClick={() => navigate(trade.url)}
                >
                  <MessageSquareDot size={20} />
                </div>
              ) : (
                <div
                  className="cursor-pointer text-gray-700 dark:text-gray-300"
                  onClick={() => navigate(trade.url)}
                >
                  <MessageSquare size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
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
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
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
