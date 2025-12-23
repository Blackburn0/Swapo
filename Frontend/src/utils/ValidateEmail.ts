// src/utils/validateEmail.ts
export const validateEmail = (email: string): boolean => {
  // Simple but effective regex for basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};
