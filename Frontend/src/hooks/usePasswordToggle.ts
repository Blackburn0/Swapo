import { useState, useCallback } from 'react';

/**
 * usePasswordToggle
 * Handles showing and hiding password fields with optional auto-hide.
 *
 * @param autoHide - Whether to auto-hide the password after a short delay (default: true)
 * @param delay - Duration in milliseconds before auto-hiding (default: 2000)
 */
export const usePasswordToggle = (autoHide = true, delay = 800) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    setVisible((prev) => {
      const next = !prev;
      if (next && autoHide) {
        setTimeout(() => setVisible(false), delay);
      }
      return next;
    });
  }, [autoHide, delay]);

  const inputType = visible ? 'text' : 'password';

  return { visible, inputType, toggleVisibility };
};
