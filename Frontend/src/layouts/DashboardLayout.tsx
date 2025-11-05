import {
  ArrowLeftRight,
  LayoutDashboardIcon,
  MessageSquare,
  Search,
  User2,
} from 'lucide-react';
import { Outlet, NavLink } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-stone-50/50 text-center text-black sm:border-transparent sm:shadow-lg dark:bg-black dark:text-white">
      {/* Page Content */}
      <main className="flex-1">
        <Outlet /> {/* This renders the nested routes */}
      </main>

      {/* Footer Nav links */}
      <footer className="fixed bottom-0 left-1/2 w-full max-w-lg -translate-x-1/2 border-t border-gray-300 bg-white pt-2 dark:bg-black">
        <div className="px-4">
          <nav className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
            <NavLink
              to="/app/dashboard"
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-1 transition-colors ${
                  isActive
                    ? 'font-semibold text-red-600'
                    : 'text-gray-600 hover:text-red-500 dark:text-gray-200'
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
                    : 'text-gray-600 hover:text-red-500 dark:text-gray-200'
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
                    : 'text-gray-600 hover:text-red-500 dark:text-gray-200'
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
                    : 'text-gray-600 hover:text-red-500 dark:text-gray-200'
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
                    : 'text-gray-600 hover:text-red-500 dark:text-gray-200'
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

export default DashboardLayout;
