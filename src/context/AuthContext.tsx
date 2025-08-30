import React, { createContext, useContext, useEffect, useState } from "react";

type User = { email: string };

type Ctx = {
  user: User | null;
  login: (u: User, remember?: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "km_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const login = (u: User, remember?: boolean) => {
    setUser(u);
    if (remember) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
