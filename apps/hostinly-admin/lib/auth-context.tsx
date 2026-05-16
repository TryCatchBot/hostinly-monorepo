"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type AdminUser, type AdminRole, ROLE_PERMISSIONS, type RolePermissions } from "./types";

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string, role: AdminRole) => Promise<boolean>;
  logout: () => void;
  permissions: RolePermissions | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_ADMIN_USERS: Record<AdminRole, Omit<AdminUser, "role">> = {
  super_admin: {
    id: "admin-1",
    email: "super@hostinly.com",
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    createdAt: "2024-01-01",
    lastLogin: new Date().toISOString(),
  },
  admin: {
    id: "admin-2",
    email: "admin@hostinly.com",
    name: "Michael Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    createdAt: "2024-02-15",
    lastLogin: new Date().toISOString(),
  },
  supervisor: {
    id: "admin-3",
    email: "supervisor@hostinly.com",
    name: "Emily Roberts",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    createdAt: "2024-03-01",
    lastLogin: new Date().toISOString(),
  },
  facilityManager: {
    id: "admin-4",
    email: "fm@hostinly.com",
    name: "David Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    createdAt: "2024-03-10",
    lastLogin: new Date().toISOString(),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("hostinly_admin_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AdminUser;
        queueMicrotask(() => setUser(parsedUser));
      } catch {
        localStorage.removeItem("hostinly_admin_user");
      }
    }
    queueMicrotask(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string, role: AdminRole): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock authentication - in production, this would be a real API call
    if (password.length >= 4) {
      const mockUser = MOCK_ADMIN_USERS[role];
      const adminUser: AdminUser = {
        ...mockUser,
        role,
        email: email || mockUser.email,
        lastLogin: new Date().toISOString(),
      };
      setUser(adminUser);
      localStorage.setItem("hostinly_admin_user", JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hostinly_admin_user");
  };

  const permissions = user ? ROLE_PERMISSIONS[user.role] : null;

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, permissions }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
