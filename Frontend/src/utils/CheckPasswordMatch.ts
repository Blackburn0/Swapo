export const checkPasswordMatch = (
  password: string,
  confirmPassword: string,
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void,
): boolean => {
  if (password !== confirmPassword) {
    showToast('Passwords do not match', 'info');
    return false;
  }
  return true;
};
