import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/ui/Modal';
import { useModal } from '@/hooks/useModal';
import { useTheme } from '@/hooks/useTheme';

const account = [
  {
    title: 'Language',
    desc: 'English',
  },
  {
    title: 'Theme',
    desc: 'System',
  },
  {
    title: 'Display',
    desc: 'Default',
  },
];

const Preferences = () => {
  const navigate = useNavigate();
  const { isOpen, openModal, closeModal } = useModal();
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col bg-stone-50 py-2 pb-10 dark:bg-gray-900">
      {/* Header */}
      <div className="relative flex items-center justify-center border-b-2 border-gray-200 pt-2 pb-4 dark:border-gray-700">
        <ChevronLeft
          size={28}
          className="absolute left-2 cursor-pointer text-gray-900 dark:text-gray-100"
          onClick={() => navigate(-1)}
        />
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Preferences
          </h1>
        </div>
      </div>

      <div className="space-y-6 bg-stone-50/50 px-4 pt-4 dark:bg-gray-900">
        {/* General Settings */}
        <div className="space-y-2">
          <span className="block text-left text-sm font-bold text-gray-600 dark:text-gray-400">
            GENERAL
          </span>
          <div className="divide-y divide-gray-200 rounded-lg border-transparent bg-white shadow-sm dark:divide-gray-700 dark:bg-gray-800">
            {account.map((item, idx) => (
              <div
                key={idx}
                className="flex cursor-pointer items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={item.title === 'Theme' ? openModal : undefined}
              >
                <div className="text-left">
                  <h2 className="font-medium text-gray-900 dark:text-gray-100">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {item.title === 'Theme' ? theme : item.desc}
                  </p>
                </div>
                <ChevronRight
                  size={22}
                  className="text-gray-400 dark:text-gray-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Theme Modal */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
          Select Theme
        </h2>
        <div className="flex flex-col space-y-2">
          {(['light', 'dark', 'system'] as const).map((t) => (
            <button
              key={t}
              className={`w-full cursor-pointer rounded-md px-4 py-2 text-left ${
                theme === t
                  ? 'bg-red-100 font-bold text-red-600 dark:bg-red-200/30 dark:text-red-500'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
              onClick={() => {
                setTheme(t);
                closeModal();
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Preferences;
