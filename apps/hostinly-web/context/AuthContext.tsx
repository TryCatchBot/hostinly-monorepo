'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
  signup: (email: string, password: string, name: string, userType: 'host' | 'cohost', additionalData?: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('hostinly_user');
    const storedToken = localStorage.getItem('hostinly_token');
    
    // Use a microtask to move the state updates out of the synchronous effect body
    // to avoid "cascading render" warnings and satisfy strict lint rules.
    queueMicrotask(() => {
      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem('hostinly_user');
          localStorage.removeItem('hostinly_token');
        }
      }
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Invalid email or password');
      }

      const { user: loggedInUser, token } = result.data;

      // Normalize userType to lowercase for frontend consistency
      const normalizedUser = {
        ...loggedInUser,
        userType: loggedInUser.userType.toLowerCase() as 'host' | 'cohost',
      };

      setUser(normalizedUser);
      localStorage.setItem('hostinly_user', JSON.stringify(normalizedUser));
      localStorage.setItem('hostinly_token', token);
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, userType: 'host' | 'cohost', additionalData: any = {}) => {
    setIsLoading(true);
    try {
      const payload = {
        email,
        password,
        name,
        userType: userType.toUpperCase(),
        ...additionalData,
      };

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Email already exists');
      }

      const { user: newUser, token } = result.data;

      // Normalize userType to lowercase for frontend consistency
      const normalizedUser = {
        ...newUser,
        userType: newUser.userType.toLowerCase() as 'host' | 'cohost',
      };

      setUser(normalizedUser);
      localStorage.setItem('hostinly_user', JSON.stringify(normalizedUser));
      localStorage.setItem('hostinly_token', token);
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hostinly_user');
    localStorage.removeItem('hostinly_token');
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
