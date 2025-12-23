import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = () => {
      try {
        const params = new URLSearchParams(location.search);
        
        // Get all parameters
        const access = params.get('access');
        const refresh = params.get('refresh');
        const userId = params.get('user_id');
        const email = params.get('email');
        const username = params.get('username');
        const isNew = params.get('is_new') === '1';
        const redirectTo = params.get('redirect');
        const errorParam = params.get('error');

        console.log('OAuth Callback Params:', {
          access: access ? 'present' : 'missing',
          refresh: refresh ? 'present' : 'missing',
          userId,
          email,
          username,
          isNew,
          redirectTo,
          errorParam,
        });

        // Handle error
        if (errorParam) {
          setError(`Authentication failed: ${errorParam}`);
          setTimeout(() => navigate('/login', { replace: true }), 2000);
          return;
        }

        // Validate token
        if (!access) {
          setError('No access token received');
          setTimeout(() => navigate('/login', { replace: true }), 2000);
          return;
        }

        // Build user object
        const user = {
          user_id: userId || '',
          email: email || '',
          username: username || '',
          is_profile_complete: !isNew,
        };

        // Save auth data
        login(access, user);
        
        if (refresh) {
          localStorage.setItem('refreshToken', refresh);
        }

        showToast('Successfully logged in!', 'success');

        // Navigate based on profile completion
        if (redirectTo === 'onboarding' || isNew) {
          navigate('/app/onboarding', { replace: true });
        } else {
          navigate('/app/dashboard', { replace: true });
        }
        
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('An error occurred during authentication');
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      }
    };

    handleCallback();
  }, []); // Run once on mount

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
        {error ? (
          <>
            <div className="mb-4 text-red-600">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-900">{error}</p>
            <p className="mt-2 text-sm text-gray-600">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            <p className="text-lg text-gray-700">Completing authentication...</p>
            <p className="mt-2 text-sm text-gray-500">Please wait</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;