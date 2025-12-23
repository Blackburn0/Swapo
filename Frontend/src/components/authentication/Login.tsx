import { useNavigate } from 'react-router-dom';
import { Mail, LockKeyhole, Eye, EyeOff, Loader2, Github } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { usePasswordToggle } from '@/hooks/usePasswordToggle';
import { validateEmail } from '@/utils/ValidateEmail';
import { useToast } from '@/hooks/useToast';
import { useState } from 'react';
import { useEnterKey } from '@/hooks/useEnterKey';
import { useCrud } from '@/hooks/useCrud';
import { useAuth } from '@/context/AuthContext';

// What you send to the API
interface LoginPayload {
  email: string;
  password: string;
}

// What the API returns
interface LoginResponse {
  id: number;
  email?: string;
  access?: string;
  token?: string;
  key?: string;
  refresh?: string;
  user?: any;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const Login = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();

  const { createItem, loading: loginLoading } = useCrud<LoginResponse>(
    `${API_BASE_URL}/auth/login/`,
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordToggle = usePasswordToggle();
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const handleSocialLogin = (provider: 'google' | 'github') => {
    setSocialLoading(provider);
    sessionStorage.setItem('oauth_provider', provider);
    const endpoint = `${API_BASE_URL}/auth/${provider}/`;
    showToast(`Redirecting to ${provider}...`, 'info');
    window.location.href = endpoint;
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      showToast('Please enter a valid email address', 'info');
      return;
    }

    try {
      const response = await createItem({ email, password } as LoginPayload);

      const token = response.access || response.token || response.key;
      const user = response.user || response || {};

      if (token) {
        login(token, user);
        showToast('Welcome back!', 'success');
        navigate('/app/dashboard');
      } else {
        showToast('Invalid login response (no token)', 'error');
      }
    } catch (err) {
      showToast('Login failed. Please check your credentials.', 'error');
    }
  };

  useEnterKey(handleLogin);

  const GoogleLogo = (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className="h-5 w-5"
    >
      <path
        fill="#4285F4"
        d="M44.5 20H24v8.5h11.8c-.8 4.7-4 7.5-8.5 7.5-6 0-10.8-4.8-10.8-10.8s4.8-10.8 10.8-10.8c3.2 0 5.6 1.3 7 2.7l6.6-6.6c-4.4-4-10.1-6.5-16.1-6.5-12 0-21.7 9.7-21.7 21.7s9.7 21.7 21.7 21.7c11.6 0 21.2-8.4 21.2-20.4 0-1.4-.2-2.7-.4-4z"
      />
      <path
        fill="#34A853"
        d="M37.5 44.2c-2.3.9-4.8 1.4-7.3 1.4-12 0-21.7-9.7-21.7-21.7 0-1.2.1-2.4.4-3.5h7.2v3.8h-4.6c-.3 1.1-.5 2.2-.5 3.4 0 9.8 8 17.8 17.8 17.8 4.9 0 9.2-2 12.3-5.2l-4.7-3.7z"
      />
      <path
        fill="#FBBC05"
        d="M8.2 27c-.2-1-.3-2.1-.3-3.2s.1-2.2.3-3.2v-3.8h-7.2c-.3 1.1-.4 2.4-.4 3.8s.1 2.7.4 3.8l7.2 3.2z"
      />
      <path
        fill="#EA4335"
        d="M21.7 8.1c3 0 5.6 1.1 7.7 2.9l6.2-6.2c-3.6-3.3-8.3-5.4-13.9-5.4-12 0-21.7 9.7-21.7 21.7 0 1.4.2 2.7.4 4l7.2-3.2c-.2-1.1-.4-2.2-.4-3.4 0-4.9 2-9.2 5.2-12.3z"
      />
    </svg>
  );

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-white px-4 py-8">
      <div className="mt-14 flex flex-col text-center">
        <h1 className="text-3xl font-bold md:text-3xl">Swapo</h1>
        <p className="mt-1 font-medium text-gray-600">Welcome back!</p>

        <div className="my-10 flex flex-col space-y-3">
          <Button
            onClick={() => handleSocialLogin('google')}
            variant="outline"
            disabled={socialLoading !== null}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {socialLoading === 'google' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span className="mr-2">{GoogleLogo}</span>
            )}
            Log in with Google
          </Button>

          <Button
            onClick={() => handleSocialLogin('github')}
            variant="outline"
            disabled={socialLoading !== null}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {socialLoading === 'github' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Github className="mr-2 h-5 w-5" />
            )}
            Log in with GitHub
          </Button>
        </div>

        <div className="my-2 flex items-center justify-center space-x-2">
          <div className="h-px flex-grow bg-gray-300" />
          <span className="text-sm text-gray-500">OR</span>
          <div className="h-px flex-grow bg-gray-300" />
        </div>

        <div className="mt-10 flex flex-col space-y-6">
          <Input
            icon={<Mail size={18} />}
            placeholderText="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={<LockKeyhole size={18} />}
            placeholderText="Password"
            type={passwordToggle.inputType}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightIcon={
              passwordToggle.visible ? (
                <EyeOff
                  size={18}
                  onClick={passwordToggle.toggleVisibility}
                  className="cursor-pointer text-gray-500"
                />
              ) : (
                <Eye
                  size={18}
                  onClick={passwordToggle.toggleVisibility}
                  className="cursor-pointer text-gray-500"
                />
              )
            }
          />
        </div>

        <div
          onClick={() => navigate('/forgot-password')}
          className="mb-8 cursor-pointer py-2 text-right text-sm font-semibold text-red-600 hover:underline"
        >
          Forgot Password?
        </div>

        <div className="text-center">
          <Button
            onClick={handleLogin}
            disabled={loginLoading || socialLoading !== null}
          >
            {loginLoading ? 'Logging you in...' : 'Log in'}
          </Button>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <span
              onClick={() => navigate('/signup')}
              className="cursor-pointer text-red-600 hover:underline"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
