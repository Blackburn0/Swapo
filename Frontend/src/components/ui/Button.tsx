import React from 'react';
import clsx from 'clsx';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  onClick,
  className,
  type = 'button',
  disabled = false,
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg w-full py-3 cursor-pointer px-4 transition duration-300 ease-in-out shadow-md focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-red-600 hover:bg-red-700 text-white',
    secondary: 'bg-gray-300 hover:bg-gray-400 text-black',
    outline: 'border-1 border-red-500 text-red-500 hover:bg-red-50 ',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        baseStyles,
        variants[variant],
        fullWidth && 'w-full',
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;

/*
Examples of reusability:
<Button>Default red</Button>

<Button variant="secondary">Gray Button</Button>

<Button variant="outline">Outlined red</Button>

<Button fullWidth disabled>Disabled Full Width</Button>
*/
