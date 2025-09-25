// src/context/AuthProvider.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthState {
  token: string | null;
  full_name: string | null;
  role_id: number | null;
}

const AuthContext = createContext<
  | {
      auth: AuthState;
      setAuth: (auth: AuthState) => void;
    }
  | undefined
>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    token: localStorage.getItem('token') || null,
    full_name: null,
    role_id: null,
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
