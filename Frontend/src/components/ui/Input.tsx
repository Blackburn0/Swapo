import React from 'react';
import clsx from 'clsx';

type InputProps = {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  textarea?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  placeholderText?: string;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  textarea = false,
  icon,
  rightIcon,
  placeholderText,
  className,
  ...props
}) => {
  const baseStyles =
    'border border-gray-300 rounded-md p-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400 transition duration-200 w-full';

  return (
    <div className={clsx('flex flex-col gap-1', fullWidth && 'w-full')}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      <div className="relative flex w-full items-center">
        {icon && <div className="absolute left-3 text-gray-500">{icon}</div>}

        {textarea ? (
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            placeholder={placeholderText}
            className={clsx(
              baseStyles,
              icon && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
          />
        ) : (
          <input
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            placeholder={placeholderText}
            className={clsx(
              baseStyles,
              icon && 'pl-10',
              rightIcon && 'pr-10',
              className,
            )}
          />
        )}

        {rightIcon && (
          <div className="absolute right-3 cursor-pointer text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>

      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default Input;

// usage example:
/*
1. Text Input

<Input type="text" label="Full Name" />


2. Full Width Input

<Input type="email" label="Email Address" fullWidth />


3. Textarea

<Input textarea label="Message" rows={4} fullWidth />


4. With Error Message

<Input
  type="password"
  label="Password"
  error="Password is required"
/>

*/
