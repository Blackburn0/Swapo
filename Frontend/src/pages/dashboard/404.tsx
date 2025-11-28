import {
  AlertTriangle,
  ArrowLeftRight,
  ChevronLeft,
  LayoutDashboardIcon,
  MessageSquare,
  Search,
  User2,
} from 'lucide-react';

import { NavLink, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-start bg-stone-50 py-2 dark:bg-gray-900">
      {/* Header */}
      <div className="relative flex items-center justify-center border-b-2 border-gray-200 pt-2 pb-4 dark:border-gray-700">
        <ChevronLeft
          size={28}
          className="absolute left-2 cursor-pointer text-gray-900 dark:text-gray-100"
          onClick={() => navigate(-1)}
        />
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Error
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-stone-50/50 px-6 pt-38 text-center text-gray-800 dark:bg-gray-900 dark:text-gray-100">
        <AlertTriangle size={28} />
        <h2 className="mt-12 mb-2 text-3xl font-bold">Oops! Page Not Found</h2>
        <p className="px-11 text-sm font-medium">
          The page you're looking for doesn't seem to exist. Please check the
          URL or return to the homepage.
        </p>
      </div>

      {/* Footer Nav links */}
      <footer className="fixed bottom-0 left-0 w-full border-t border-gray-300 bg-white pt-2 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-xl px-4">
          <nav className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-1 transition-colors ${
                  isActive
                    ? 'font-semibold text-red-600'
                    : 'text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-500'
                }`
              }
            >
              <LayoutDashboardIcon size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/app/dashboard/trade"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-1 transition-colors ${
                  isActive
                    ? 'font-semibold text-red-600'
                    : 'text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-500'
                }`
              }
            >
              <ArrowLeftRight size={18} />
              <span>Trades</span>
            </NavLink>

            <NavLink
              to="/app/dashboard/listing"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-1 transition-colors ${
                  isActive
                    ? 'font-semibold text-red-600'
                    : 'text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-500'
                }`
              }
            >
              <Search size={18} />
              <span>Browse</span>
            </NavLink>

            <NavLink
              to="/app/dashboard/messages"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-1 transition-colors ${
                  isActive
                    ? 'font-semibold text-red-600'
                    : 'text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-500'
                }`
              }
            >
              <MessageSquare size={18} />
              <span>Messages</span>
            </NavLink>

            <NavLink
              to="/app/dashboard/profile"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-1 transition-colors ${
                  isActive
                    ? 'font-semibold text-red-600'
                    : 'text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-500'
                }`
              }
            >
              <User2 size={18} />
              <span>Profile</span>
            </NavLink>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
