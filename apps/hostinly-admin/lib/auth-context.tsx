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
  operations_admin: {
    id: "admin-2",
    email: "ops@hostinly.com",
    name: "Michael Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    createdAt: "2024-02-15",
    lastLogin: new Date().toISOString(),
  },
  finance_admin: {
    id: "admin-3",
    email: "finance@hostinly.com",
    name: "Emily Roberts",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    createdAt: "2024-03-01",
    lastLogin: new Date().toISOString(),
  },
  support_admin: {
    id: "admin-4",
    email: "support@hostinly.com",
    name: "David Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    createdAt: "2024-03-10",
    lastLogin: new Date().toISOString(),
  },
  compliance_admin: {
    id: "admin-5",
    email: "compliance@hostinly.com",
    name: "Lisa Thompson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    createdAt: "2024-04-01",
    lastLogin: new Date().toISOString(),
  },
  content_moderator: {
    id: "admin-6",
    email: "content@hostinly.com",
    name: "James Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    createdAt: "2024-04-15",
    lastLogin: new Date().toISOString(),
  },
  marketing_admin: {
    id: "admin-7",
    email: "marketing@hostinly.com",
    name: "Amanda Garcia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda",
    createdAt: "2024-05-01",
    lastLogin: new Date().toISOString(),
  },
  technical_admin: {
    id: "admin-8",
    email: "tech@hostinly.com",
    name: "Ryan Patel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan",
    createdAt: "2024-05-15",
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
