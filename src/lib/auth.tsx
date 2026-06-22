"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sakuraby-token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 > Date.now()) {
          setUser({ id: payload.id, name: payload.name, email: payload.email, isAdmin: payload.isAdmin || false });
        } else {
          localStorage.removeItem("sakuraby-token");
        }
      } catch {
        localStorage.removeItem("sakuraby-token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("sakuraby-token", data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || "Credenciais inválidas" };
    } catch {
      return { success: false, error: "Erro ao conectar ao servidor" };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("sakuraby-token", data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || "Erro ao criar conta" };
    } catch {
      return { success: false, error: "Erro ao conectar ao servidor" };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("sakuraby-token");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      login: async () => ({ success: false, error: "Not initialized" }),
      register: async () => ({ success: false, error: "Not initialized" }),
      logout: () => {},
      isLoading: false,
    };
  }
  return context;
}
