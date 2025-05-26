// src/hooks/useAuth.tsx
'use client'
import { get } from '@/utils/apiClient';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';


// Adjust this interface to match your backend's user model
interface User {
  id: string;
  email: string;
  name: string;
  // Add other user fields as needed
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refreshUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = () => {
    setLoading(true);
    get<User>('/auth/me')
      .then((data:User) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
