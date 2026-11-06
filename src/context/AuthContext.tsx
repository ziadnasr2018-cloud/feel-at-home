import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { SEED_USERS } from '../services/storage';

interface AuthContextType {
  user: User | null;
  role: Role;
  login: (email: string) => boolean;
  loginAsDemo: (targetRole: Role) => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => User;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  switchRole: () => void;
}

const AUTH_USER_KEY = 'feel_at_home_active_user_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to a logged-in demo user (e.g. Sarah as Seeker) so judges and visitors immediately have an active session!
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    // Default to Sarah (Accommodation Seeker)
    return SEED_USERS[3];
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  const login = (email: string): boolean => {
    const found = SEED_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      return true;
    }
    // Allow any custom email as a valid login for demonstration
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      fullName: email.split('@')[0],
      phoneNumber: '+20 10 0000 0000',
      role: 'SEEKER',
      isLookingForRoommate: true,
      verificationStatus: 'NOT_VERIFIED',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return true;
  };

  const loginAsDemo = (targetRole: Role) => {
    if (targetRole === 'PROVIDER') {
      setUser(SEED_USERS[0]); // Ahmed Mostafa (Cairo Host)
    } else {
      setUser(SEED_USERS[3]); // Sarah Adel (Accommodation Seeker)
    }
  };

  const register = (userData: Omit<User, 'id' | 'createdAt'>): User => {
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
  };

  const switchRole = () => {
    if (!user) return;
    const nextRole: Role = user.role === 'SEEKER' ? 'PROVIDER' : 'SEEKER';
    setUser({ ...user, role: nextRole });
  };

  const role = user?.role || 'SEEKER';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        login,
        loginAsDemo,
        register,
        logout,
        updateProfile,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
