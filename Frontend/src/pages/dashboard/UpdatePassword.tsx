import { useState } from 'react';
import { Lock, Unlock, Asterisk, ChevronLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdate = () => {
    console.log({ currentPassword, newPassword, confirmPassword });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 dark:bg-black">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-xl items-center justify-between py-5">
        <button
          onClick={() => window.history.back()}
          className="cursor-pointer rounded-full p-2 transition hover:bg-gray-100 dark:hover:bg-black/50"
          aria-label="Go back"
        >
          <ChevronLeft size={22} className="text-gray-800 dark:text-white" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 md:text-xl dark:text-white">
          Password
        </h1>
        <div className="w-6" /> {/* Spacer for alignment */}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto mb-10 max-w-xl space-y-6">
          {/* Current Password */}
          <div>
            <label className="mb-1 block font-medium text-gray-800 dark:text-white">
              Current Password
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:bg-gray-500">
              <Lock className="text-gray-500" size={18} />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="mb-1 block font-medium text-gray-800 dark:text-white">
              New Password
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-500 py-3 pl-4 dark:bg-gray-500">
              <Unlock className="text-gray-500" size={18} />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="dark:bg-text-white mb-1 block font-medium text-gray-800 dark:text-white">
              Confirm New Password
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:bg-gray-500">
              <Asterisk className="text-gray-500 dark:text-white" size={18} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
        {/* Update Button */}
        <Button onClick={handleUpdate}>Update Password</Button>
      </main>
    </div>
  );
};

export default UpdatePassword;
