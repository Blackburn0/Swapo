import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { AlertCircle } from 'lucide-react';
import axios from '@/utils/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { useNavigate } from 'react-router-dom';

const DeleteAccount = () => {
  const [password, setPassword] = useState('');
  const [checked, setChecked] = useState(false);
  const { token, user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Determine if user is OAuth-based (no password)
  const isOAuthUser = Boolean(user?.googleId || user?.githubId);

  const handleDelete = async () => {
    if (!checked) {
      showToast('Please confirm account deletion.', 'error');
      return;
    }

    if (!isOAuthUser && !password.trim()) {
      showToast('Please enter your password to confirm.', 'error');
      return;
    }

    try {
      const res = await axios.delete('/auth/delete-account/', {
        headers: { Authorization: `Bearer ${token}` },
        data: isOAuthUser ? {} : { password },
        validateStatus: (status) => status < 500, // prevents global 401 redirect
      });

      if (res.status === 401 || res.status === 403) {
        showToast('Invalid or wrong password.', 'error');
        return;
      }

      if (res.status === 204 || res.status === 200) {
        showToast('Your account has been permanently deleted.', 'success');
        logout();
        navigate('/'); // redirect home
      } else {
        showToast('Failed to delete account. Try again.', 'error');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      showToast('Something went wrong. Try again later.', 'error');
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white px-6 py-8 text-center">
      {/* Header */}
      <header className="mb-8 flex items-center">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-base font-medium text-gray-800"
        >
          ←
        </button>
        <h1 className="flex-1 text-lg font-semibold text-gray-900">
          Delete Account
        </h1>
      </header>

      {/* Main Content */}
      <section className="mx-auto flex max-w-xl flex-1 flex-col items-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-red-50 p-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Are you sure?
            </h2>
            <p className="mt-2 max-w-sm text-gray-600">
              Deleting your account is a permanent action and cannot be undone.
              All your data, including your profile, skills, and messages, will
              be permanently removed.
            </p>
          </div>
        </div>

        {/* Password Input → only show for email/password users */}
        {!isOAuthUser && (
          <div className="text-gray w-full">
            <Input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password to confirm"
              className="w-full"
            />
          </div>
        )}

        {/* Checkbox */}
        <div className="flex w-full items-start space-x-3 text-left">
          <input
            type="checkbox"
            id="confirmDelete"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 h-4 w-4 accent-red-500"
          />
          <label
            htmlFor="confirmDelete"
            className="text-sm leading-snug text-gray-700"
          >
            I understand this action is irreversible and I want to permanently
            delete my account.
          </label>
        </div>
      </section>

      {/* Delete Button */}
      <footer className="mx-auto mt-auto w-full max-w-xl">
        <Button
          onClick={handleDelete}
          className={`w-full py-3 text-lg font-semibold ${
            checked && (isOAuthUser || password.trim())
              ? 'bg-[#F87171]'
              : 'cursor-not-allowed bg-red-300'
          }`}
        >
          Delete My Account
        </Button>
      </footer>
    </main>
  );
};

export default DeleteAccount;
