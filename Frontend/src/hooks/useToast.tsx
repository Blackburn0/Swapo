import { createContext, useContext } from 'react';
import type { ToastContextType } from '../context/ToastContext';

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * Example usage
import { useToast } from '@/hooks/useToast';

const Example = () => {
  const { showToast } = useToast();

  return (
    <div className="flex flex-col gap-4 w-60">
      <button
        onClick={() => showToast('Saved successfully!', 'success')}
        className="bg-orange-500 text-white rounded-xl py-2 w-full"
      >
        Success Toast
      </button>

      <button
        onClick={() => showToast('Something went wrong!', 'error')}
        className="bg-orange-500 text-white rounded-xl py-2 w-full"
      >
        Error Toast
      </button>

      <button
        onClick={() => showToast('This is some information.', 'info')}
        className="bg-orange-500 text-white rounded-xl py-2 w-full"
      >
        Info Toast
      </button>
    </div>
  );
};

export default Example;
 *
 */
