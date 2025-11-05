// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  [key: string]: any;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const defaultState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
};

const AuthContext = createContext<AuthContextType>({
  ...defaultState,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultState);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userJson = localStorage.getItem("user");
    if (token) {
      setAuthState({
        isAuthenticated: true,
        token,
        user: userJson ? JSON.parse(userJson) : null,
      });
    }
    setLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem("authToken", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
    setAuthState({
      isAuthenticated: true,
      token,
      user,
    });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setAuthState(defaultState);
    navigate("/login");
  };

  const value: AuthContextType = {
    isAuthenticated: authState.isAuthenticated,
    token: authState.token,
    user: authState.user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
