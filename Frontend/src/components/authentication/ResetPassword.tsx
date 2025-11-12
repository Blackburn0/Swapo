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

// Define payload for reset
interface ResetPasswordPayload {
  new_password1: string;
  new_password2: string;
}

// Entity for CRUD hook (optional)
interface ResetPasswordEntity extends ResetPasswordPayload {
  id?: string | number;
  status?: string;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // ✅ get uid and token from the URL path
  const { uid, token } = useParams<{ uid: string; token: string }>();

  // ✅ Construct API endpoint dynamically
  const baseUrl = `${API_BASE_URL}/auth/password/reset/${uid}/${token}/`;

  // ✅ CRUD hook setup
  const { createItem, loading: resetLoading } =
    useCrud<ResetPasswordEntity>(baseUrl);

  // State management
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const passwordToggle = usePasswordToggle();
  const confirmToggle = usePasswordToggle();

  const isFormIncomplete = !newPassword || !newPasswordConfirm;

  const handleReset = async () => {
    // Validate uid/token
    if (!uid || !token) {
      showToast('Invalid or missing verification data (uid/token).', 'error');
      return;
    }

    // Check match
    if (!checkPasswordMatch(newPassword, newPasswordConfirm, showToast)) return;

    // Prepare payload for backend
    const resetData: ResetPasswordPayload = {
      uid,
      token,
      new_password: newPassword,
    };

    try {
      const response = await createItem(resetData);
      console.log('Password reset success:', response);

      showToast('Password reset successful! You can now log in.', 'success');
      navigate('/login');
    } catch (error) {
      const errorMessage =
        (error as Error).message ||
        'Password reset failed. Please try again.';
      showToast(errorMessage, 'error');
    }
  };

  // Trigger reset on Enter key
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
          {/* New Password */}
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

          {/* Confirm Password */}
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




// import { useState, useMemo } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { LockKeyhole, Eye, EyeOff, ChevronLeft } from 'lucide-react';
// import Input from '../ui/Input';
// import Button from '../ui/Button';
// import { usePasswordToggle } from '@/hooks/usePasswordToggle';
// import PasswordStrengthChecker from '@/utils/PasswordStrengthChecker';
// import { useToast } from '@/hooks/useToast';
// import { checkPasswordMatch } from '@/utils/CheckPasswordMatch';
// import { useEnterKey } from '@/hooks/useEnterKey';
// import { useCrud } from '@/hooks/useCrud';

// // Define the structure of the data payload sent to the API
// interface ResetPasswordPayload {
//   new_password: string;
//   new_password_confirm: string;
//   // These are expected in the request body, even if also in the URL path
//   uid: string;
//   token: string;
// }

// // Define the complete entity type (T) for useCrud.
// interface ResetPasswordEntity extends ResetPasswordPayload {
//   id: string | number;
//   status?: string; // Include status if the API returns it
// }

// const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// const ResetPassword = () => {
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [searchParams] = useSearchParams();

//   // Extract uid and token from the URL (e.g., ?uid=...&token=...)
//   const verificationDetails = useMemo(
//     () => ({
//       uid: searchParams.get('uid'),
//       token: searchParams.get('token'),
//     }),
//     [searchParams],
//   );

//   // Dynamically construct the base URL using the uid and token
//   const baseUrl = useMemo(() => {
//     const uid = verificationDetails.uid || 'invalid_uid';
//     const token = verificationDetails.token || 'invalid_token';

//     // Using the user-specified dynamic URL structure
//     return `${API_BASE_URL}/auth/password/reset/${uid}/${token}/`;
//   }, [verificationDetails, API_BASE_URL]);

//   // Initialize the Crud hook with the dynamically constructed URL
//   const { createItem, loading: resetLoading } =
//     useCrud<ResetPasswordEntity>(baseUrl);

//   const passwordToggle = usePasswordToggle();
//   const confirmToggle = usePasswordToggle();

//   const [newPassword, setNewPassword] = useState('');
//   const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

//   // Validation Check: Button should be disabled if fields are empty
//   const isFormIncomplete = !newPassword || !newPasswordConfirm;

//   const handleReset = async () => {
//     // 1. Client-side Validation ---

//     if (!verificationDetails.uid || !verificationDetails.token) {
//       showToast(
//         'The password reset link is invalid or missing verification data (uid/token).',
//         'error',
//       );
//       return;
//     }

//     if (!checkPasswordMatch(newPassword, newPasswordConfirm, showToast)) return;

//     // 2. Prepare Data and Call the Hook ---
//     const resetData: ResetPasswordPayload = {
//       new_password: newPassword,
//       new_password_confirm: newPasswordConfirm,
//       uid: verificationDetails.uid,
//       token: verificationDetails.token,
//     };

//     // proceed with API call
//     try {
//       // The hook handles the POST request to the dynamic URL
//       const response = await createItem(resetData);

//       // Success Handling ---
//       console.log('Password reset success response:', response);
//       showToast('Password reset successful! You can now log in.', 'success');

//       // Redirect to login page after successful reset
//       navigate('/login');
//     } catch (error) {
//       // Error Handling ---
//       const errorMessage =
//         (error as Error).message ||
//         'Password reset failed. Please check the link or try again.';
//       showToast(errorMessage, 'error');
//     }
//   };

//   //  Trigger resetPassword on Enter key
//   useEnterKey(handleReset);

//   return (
//     <div className="mx-auto min-h-screen max-w-lg bg-white px-4 py-8">
//       <div title="back">
//         <ChevronLeft
//           size={28}
//           className="cursor-pointer"
//           onClick={() => navigate(-1)}
//         />
//       </div>

//       <div className="mt-14 flex flex-col text-center">
//         <div>
//           <h1 className="text-2xl font-bold md:text-3xl">
//             Reset your password
//           </h1>
//           <p className="mt-2 text-gray-600">
//             Make sure to use a strong password you can remember.
//           </p>
//         </div>

//         <div className="my-10 flex flex-col space-y-6">
//           {/* Password */}
//           <Input
//             icon={<LockKeyhole size={18} />}
//             placeholderText="Enter new password"
//             type={passwordToggle.inputType}
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             rightIcon={
//               passwordToggle.visible ? (
//                 <EyeOff
//                   size={18}
//                   className="cursor-pointer text-gray-500"
//                   onClick={passwordToggle.toggleVisibility}
//                 />
//               ) : (
//                 <Eye
//                   size={18}
//                   className="cursor-pointer text-gray-500"
//                   onClick={passwordToggle.toggleVisibility}
//                 />
//               )
//             }
//           />
//           <PasswordStrengthChecker password={newPassword} />

//           {/* Confirm Password */}
//           <Input
//             icon={<LockKeyhole size={18} />}
//             placeholderText="Confirm new password"
//             type={confirmToggle.inputType}
//             value={newPasswordConfirm}
//             onChange={(e) => setNewPasswordConfirm(e.target.value)}
//             rightIcon={
//               confirmToggle.visible ? (
//                 <EyeOff
//                   size={18}
//                   className="cursor-pointer text-gray-500"
//                   onClick={confirmToggle.toggleVisibility}
//                 />
//               ) : (
//                 <Eye
//                   size={18}
//                   className="cursor-pointer text-gray-500"
//                   onClick={confirmToggle.toggleVisibility}
//                 />
//               )
//             }
//           />
//         </div>

//         <div className="text-center">
//           <Button
//             className="mb-4"
//             onClick={handleReset}
//             // Disable button if loading OR if form fields are empty
//             disabled={resetLoading || isFormIncomplete}
//           >
//             {resetLoading ? 'Resetting...' : 'Reset Password'}
//           </Button>
//           <p className="text-sm font-medium text-gray-600">
//             Already have an account?{' '}
//             <span
//               onClick={() => navigate('/login')}
//               className="cursor-pointer text-red-600 hover:underline hover:underline-offset-2"
//             >
//               Log in
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;
