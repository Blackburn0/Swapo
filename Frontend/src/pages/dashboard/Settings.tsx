import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

import { useToast } from '@/hooks/useToast';
import {
  ChevronLeft,
  CircleQuestionMark,
  CreditCard,
  LockKeyhole,
  Shield,
  User2,
  Mail,
  ChevronRight,
  Bell,
  Ban,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const account = [
  {
    icon: User2,
    title: 'Profile',
    desc: 'Update your profile information',
    url: '/profile/edit',
  },
  {
    icon: LockKeyhole,
    title: 'Password',
    desc: 'Change your password',
    url: '/app/dashboard/settings/update-password',
  },
  {
    icon: CreditCard,
    title: 'Payment Methods',
    desc: 'Manage your payment methods',
    url: '/app/dashboard/settings/payment',
  },
];

const privacy = [
  {
    icon: Shield,
    title: 'Privacy Settings',
    desc: 'Manage your privacy settings',
    url: '/app/dashboard/settings/privacy',
  },
  {
    icon: Ban,
    title: 'Blocked Users',
    desc: 'Block or unblock users',
    url: '/app/dashboard/settings/blocked',
  },
];

const support = [
  {
    icon: CircleQuestionMark,
    title: 'Help Center',
    desc: 'Get help with the app',
    url: '/app/dashboard/settings/help',
  },
  {
    icon: Mail,
    title: 'Contact',
    desc: 'Contact us for support',
    url: '/dashboard/settings/contact',
  },
];

const FRONTEND_LOGOUT_URL = '/';

const Settings = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { loading, logout } = useAuth();

  const handleLogout = async () => {
    try {
      //await api.post('/auth/logout/');
      logout();
      showToast('Successfully logged out. See you later!', 'success');
      navigate(FRONTEND_LOGOUT_URL);
    } catch (error) {
      console.error('Logout error:');
      showToast('Logout failed.', 'error');
    }
  };

  const renderCard = (items: typeof account) => (
    <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow-sm dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-900">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => navigate(item.url)}
        >
          <div className="flex items-center gap-3 text-left">
            <div className="rounded-full border-transparent bg-red-100/50 p-2 dark:bg-red-500/20">
              <item.icon size={20} className="text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="font-medium text-gray-900 dark:text-gray-100">
                {item.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.desc}
              </p>
            </div>
          </div>
          <ChevronRight
            size={22}
            className="text-gray-400 dark:text-gray-500"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col bg-stone-50/50 py-2 pb-20 dark:bg-gray-900">
      {/* Header */}
      <div className="relative flex items-center justify-center border-b-2 border-gray-200 pt-2 pb-4 dark:border-gray-700">
        <ChevronLeft
          size={28}
          className="absolute left-2 cursor-pointer text-gray-900 dark:text-gray-100"
          onClick={() => navigate(-1)}
        />
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Settings
          </h1>
        </div>
      </div>

      <div className="space-y-6 px-4 pt-4">
        {/* Account */}
        <div className="space-y-2">
          <span className="block text-left text-sm font-bold text-gray-600 dark:text-gray-400">
            ACCOUNT
          </span>
          {renderCard(account)}
        </div>

        {/* Notifications */}
        <div className="space-y-2">
          <span className="block text-left text-sm font-bold text-gray-600 dark:text-gray-400">
            NOTIFICATIONS
          </span>
          {renderCard([
            {
              icon: Bell,
              title: 'Preferences',
              desc: 'Customize your notifications',
              url: '/app/dashboard/settings/preferences',
            },
          ])}
        </div>

        {/* Privacy */}
        <div className="space-y-2">
          <span className="block text-left text-sm font-bold text-gray-600 dark:text-gray-400">
            PRIVACY
          </span>
          {renderCard(privacy)}
        </div>

        {/* Support */}
        <div className="space-y-2">
          <span className="block text-left text-sm font-bold text-gray-600 dark:text-gray-400">
            SUPPORT
          </span>
          {renderCard(support)}
        </div>

        {/* logout */}
        <div className="space-y-2">
          <Button disabled={loading} onClick={handleLogout}>
            {loading ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
