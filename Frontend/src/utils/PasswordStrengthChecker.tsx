import React, { useMemo } from 'react';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

interface PasswordStrengthCheckerProps {
  password: string;
}

const PasswordStrengthChecker: React.FC<PasswordStrengthCheckerProps> = ({
  password,
}) => {
  const getStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1)
      return {
        score,
        label: 'Weak',
        color: 'bg-red-500',
        icon: <ShieldAlert className="text-red-500" size={16} />,
      };
    if (score === 2)
      return {
        score,
        label: 'Medium',
        color: 'bg-yellow-500',
        icon: <Shield className="text-yellow-500" size={16} />,
      };
    return {
      score,
      label: 'Strong',
      color: 'bg-green-500',
      icon: <ShieldCheck className="text-green-500" size={16} />,
    };
  }, [password]);

  // Only show when user starts typing
  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {getStrength.icon}
        <span>{getStrength.label}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStrength.color}`}
          style={{ width: `${(getStrength.score / 3) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default PasswordStrengthChecker;
