
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff, ChevronLeft, LockKeyhole, Github, Loader2 } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useToast } from '@/hooks/useToast';
import { useCrud } from '@/hooks/useCrud';
import { usePasswordToggle } from '@/hooks/usePasswordToggle';
import { checkPasswordMatch } from '@/utils/CheckPasswordMatch';
import { validateEmail } from '@/utils/ValidateEmail';
import { useEnterKey } from '@/hooks/useEnterKey';
import { useAuth } from '@/context/AuthContext'; // ✅ added

interface NewUser {
  id?: number;
  email: string;
  password: string;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const Signup = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth(); // ✅ from context

  const { createItem, loading: signupLoading } = useCrud<NewUser>(
    `${API_BASE_URL}/auth/signup/`
  );

  const passwordToggle = usePasswordToggle();
  const confirmToggle = usePasswordToggle();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const isFormIncomplete = !email || !password || !passwordConfirm;

  const handleSocialSignup = (provider: 'google' | 'github') => {
    setSocialLoading(provider);
    const endpoint = `${API_BASE_URL}/auth/${provider}/`;
    showToast(`Redirecting to ${provider}...`, 'info');
    window.location.href = endpoint;
  };

  const handleSignup = async () => {
    if (!checkPasswordMatch(password, passwordConfirm, showToast)) return;
    if (!validateEmail(email)) {
      showToast('Please enter a valid email address', 'info');
      return;
    }

    try {
      const response = await createItem({ email, password });
      console.log('Signup success:', response);

      const token = response.access || response.token;
      const user = response.user || response || {};

      // if (token) {
      //   login(token, user); // ✅ Log user in directly after signup
      //   showToast('Signup successful! Welcome!', 'success');
      //   navigate('/onboarding');
      // } else {
      //   showToast('Signup successful! Please log in.', 'success');
      //   navigate('/login');
      // }
      if (response.access) {
        login(response.access, { email: response.email });
        localStorage.setItem('refreshToken', response.refresh);
        showToast('Signup successful! Welcome!', 'success');
        navigate('/app/onboarding'); // ✅ direct navigation to dashboard
      } else {
        showToast('Signup successful, please log in.', 'success');
        navigate('/login');
      }
      
    } catch (error) {
      showToast('Signup failed. Please try again.', 'error');
    }
  };

  useEnterKey(handleSignup);

  return (
    <div className="mx-auto min-h-screen max-w-lg bg-white px-4 py-8">
      <ChevronLeft
        size={28}
        className="cursor-pointer text-gray-700 hover:text-red-600"
        onClick={() => navigate(-1)}
      />

      <div className="mt-14 flex flex-col text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">Join Swapo</h1>
        <p className="mt-2 text-gray-500">Start your 30-day free trial now.</p>

        <div className="my-10 flex flex-col space-y-3">
          <Button
            onClick={() => handleSocialSignup('google')}
            variant="outline"
            disabled={socialLoading !== null}
            className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            {socialLoading === 'google' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Sign up with Google'
            )}
          </Button>

          <Button
            onClick={() => handleSocialSignup('github')}
            variant="outline"
            disabled={socialLoading !== null}
            className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          >
            {socialLoading === 'github' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Github className="mr-2 h-5 w-5" />
            )}
            Sign up with GitHub
          </Button>
        </div>

        <div className="my-2 flex items-center justify-center space-x-2">
          <div className="h-px flex-grow bg-gray-300" />
          <span className="text-sm text-gray-500">OR</span>
          <div className="h-px flex-grow bg-gray-300" />
        </div>

        <div className="my-6 flex flex-col space-y-6">
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
                <EyeOff size={18} onClick={passwordToggle.toggleVisibility} className="cursor-pointer text-gray-500" />
              ) : (
                <Eye size={18} onClick={passwordToggle.toggleVisibility} className="cursor-pointer text-gray-500" />
              )
            }
          />
          <Input
            icon={<LockKeyhole size={18} />}
            placeholderText="Confirm password"
            type={confirmToggle.inputType}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            rightIcon={
              confirmToggle.visible ? (
                <EyeOff size={18} onClick={confirmToggle.toggleVisibility} className="cursor-pointer text-gray-500" />
              ) : (
                <Eye size={18} onClick={confirmToggle.toggleVisibility} className="cursor-pointer text-gray-500" />
              )
            }
          />
        </div>

        <div className="text-center">
          <Button
            onClick={handleSignup}
            disabled={signupLoading || isFormIncomplete || socialLoading !== null}
          >
            {signupLoading ? 'Signing up...' : 'Create Account'}
          </Button>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              className="cursor-pointer text-red-600 hover:underline"
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
