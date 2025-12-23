import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LockKeyhole, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { usePasswordToggle } from '@/hooks/usePasswordToggle';
import PasswordStrengthChecker from '@/utils/PasswordStrengthChecker';
import { useToast } from '@/hooks/useToast';
import { checkPasswordMatch } from '@/utils/CheckPasswordMatch';
import { useEnterKey } from '@/hooks/useEnterKey';
import { useCrud } from '@/hooks/useCrud';

// What the API returns
interface ResetPasswordResponse {
  id: string | number;
  status?: string;
  message?: string;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { uid, token } = useParams<{ uid: string; token: string }>();

  const baseUrl = `${API_BASE_URL}/auth/password/reset/${uid}/${token}/`;

  const { createItem, loading: resetLoading } =
    useCrud<ResetPasswordResponse>(baseUrl);

  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const passwordToggle = usePasswordToggle();
  const confirmToggle = usePasswordToggle();

  const isFormIncomplete = !newPassword || !newPasswordConfirm;

  const handleReset = async () => {
    if (!uid || !token) {
      showToast('Invalid or missing verification data (uid/token).', 'error');
      return;
    }

    if (!checkPasswordMatch(newPassword, newPasswordConfirm, showToast)) return;

    const resetData = {
      uid,
      token,
      new_password: newPassword,
    };

    try {
      const response = await createItem(resetData as any);
      console.log('Password reset success:', response);

      showToast('Password reset successful! You can now log in.', 'success');
      navigate('/login');
    } catch (error) {
      const errorMessage =
        (error as Error).message || 'Password reset failed. Please try again.';
      showToast(errorMessage, 'error');
    }
  };

  useEnterKey(handleReset);

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-white px-4 py-8">
      <div title="back">
        <ChevronLeft
          size={28}
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </div>

      <div className="mt-14 flex flex-col text-center">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">
            Reset your password
          </h1>
          <p className="mt-2 text-gray-600">
            Make sure to use a strong password you can remember.
          </p>
        </div>

        <div className="my-10 flex flex-col space-y-6">
          <Input
            icon={<LockKeyhole size={18} />}
            placeholderText="Enter new password"
            type={passwordToggle.inputType}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            rightIcon={
              passwordToggle.visible ? (
                <EyeOff
                  size={18}
                  className="cursor-pointer text-gray-500"
                  onClick={passwordToggle.toggleVisibility}
                />
              ) : (
                <Eye
                  size={18}
                  className="cursor-pointer text-gray-500"
                  onClick={passwordToggle.toggleVisibility}
                />
              )
            }
          />
          <PasswordStrengthChecker password={newPassword} />

          <Input
            icon={<LockKeyhole size={18} />}
            placeholderText="Confirm new password"
            type={confirmToggle.inputType}
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            rightIcon={
              confirmToggle.visible ? (
                <EyeOff
                  size={18}
                  className="cursor-pointer text-gray-500"
                  onClick={confirmToggle.toggleVisibility}
                />
              ) : (
                <Eye
                  size={18}
                  className="cursor-pointer text-gray-500"
                  onClick={confirmToggle.toggleVisibility}
                />
              )
            }
          />
        </div>

        <div className="text-center">
          <Button
            className="mb-4"
            onClick={handleReset}
            disabled={resetLoading || isFormIncomplete}
          >
            {resetLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
          <p className="text-sm font-medium text-gray-600">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="cursor-pointer text-red-600 hover:underline hover:underline-offset-2"
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
