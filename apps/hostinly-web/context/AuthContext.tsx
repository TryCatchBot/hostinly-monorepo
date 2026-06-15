'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  userType: 'host' | 'cohost' | 'cleaner'; // host = property owner, cohost = co-host provider, cleaner = cleaning provider
  isOnboardingCompleted?: boolean;
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
  uploadId?: string;
  proofOfOwnership?: string;
  businessRegistration?: string;
  proofOfAddress?: string;
  createdAt?: string;
  resume?: string;
  coverLetter?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, userType: 'host' | 'cohost' | 'cleaner', additionalData?: any) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://hostinly-backend-prod.onrender.com/api";

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
          const parsedUser = JSON.parse(storedUser);
          parsedUser.userType = parsedUser.userType.toLowerCase() as 'host' | 'cohost' | 'cleaner';
          setUser(parsedUser);
        } catch {
          localStorage.removeItem('hostinly_user');
          localStorage.removeItem('hostinly_token');
        }
      }
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
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
        userType: loggedInUser.userType.toLowerCase() as 'host' | 'cohost' | 'cleaner',
      };

      setUser(normalizedUser);
      localStorage.setItem('hostinly_user', JSON.stringify(normalizedUser));
      localStorage.setItem('hostinly_token', token);
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, userType: 'host' | 'cohost' | 'cleaner', additionalData: any = {}) => {
    setIsLoading(true);
    try {
      console.log("AuthContext - BASE_URL:", BASE_URL);
      console.log("AuthContext - process.env.NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

      const payload = {
        email,
        password,
        name,
        userType: userType.toUpperCase(),
        ...additionalData,
      };

      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Email already exists');
      }

      // After signup success, we don't set user state here anymore since we want redirect to login
      // But we can return result for the component to handle redirect
      return result.data;
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (data: Partial<User>) => {
    if (!user) throw new Error('Not authenticated');
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${BASE_URL}/users/${user.id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile');
      }

      const updatedUser = {
        ...result.data,
        userType: result.data.userType.toLowerCase() as 'host' | 'cohost' | 'cleaner',
      };

      setUser(updatedUser);
      localStorage.setItem('hostinly_user', JSON.stringify(updatedUser));
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchUser = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${BASE_URL}/users/${user.id}`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      });

      const result = await response.json();

      if (result.success) {
        const updatedUser = {
          ...result.data,
          userType: result.data.userType.toLowerCase() as 'host' | 'cohost' | 'cleaner',
        };
        
        // Only update if data changed to avoid unnecessary re-renders
        const currentUserStr = JSON.stringify(user);
        const updatedUserStr = JSON.stringify(updatedUser);
        if (currentUserStr !== updatedUserStr) {
          setUser(updatedUser);
          localStorage.setItem('hostinly_user', updatedUserStr);
        }
      } else if (response.status === 401) {
        // Token expired or invalid
        logout();
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('hostinly_user');
    localStorage.removeItem('hostinly_token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, updateUser, fetchUser, logout }}>
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
