'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeDemoAccounts } from '@/lib/initializeAuth';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'host' | 'cohost'; // host = property owner, cohost = co-host provider
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  governmentIdType?: string;
  governmentIdNumber?: string;
  dateOfBirth?: string;
  ssn?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  businessName?: string;
  businessLicense?: string;
  taxId?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, userType: 'host' | 'cohost') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    // Initialize demo accounts first
    initializeDemoAccounts();

    const storedUser = localStorage.getItem('hostinly_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('hostinly_user');
      }
    }
    setIsLoading(false);
  }, []);

  type StoredUser = User & { password: string };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('hostinly_users') || '[]') as StoredUser[];
      const foundUser = users.find((u) => u.email === email && u.password === password);

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      const loggedInUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        userType: foundUser.userType,
      };

      setUser(loggedInUser);
      localStorage.setItem('hostinly_user', JSON.stringify(loggedInUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, userType: 'host' | 'cohost') => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('hostinly_users') || '[]') as StoredUser[];
      if (users.some((u) => u.email === email)) {
        throw new Error('Email already exists');
      }

      // Create new user
      const newUser: StoredUser = {
        id: Math.random().toString(36).substring(7),
        email,
        password, // In production, this would be hashed on the backend
        name,
        userType,
      };

      users.push(newUser);
      localStorage.setItem('hostinly_users', JSON.stringify(users));

      // Log the user in
      const loggedInUser: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        userType: newUser.userType,
      };

      setUser(loggedInUser);
      localStorage.setItem('hostinly_user', JSON.stringify(loggedInUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hostinly_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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
