"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { type AdminUser, type AdminRole, ROLE_PERMISSIONS, type RolePermissions } from "./types";
import { BASE_URL } from "./utils";

interface AuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  permissions: RolePermissions | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("hostinly_admin_user");
    const token = localStorage.getItem("hostinly_admin_token");
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser) as AdminUser;
        setUser(parsedUser);
      } catch {
        localStorage.removeItem("hostinly_admin_user");
        localStorage.removeItem("hostinly_admin_token");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log("Admin AuthContext - BASE_URL:", BASE_URL);
      console.log("Admin AuthContext - process.env.NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success && (result.data.user.userType === "ADMIN" || result.data.user.userType === "SUPER_ADMIN")) {
        const adminUser: AdminUser = {
          id: result.data.user.id,
          email: result.data.user.email,
          name: result.data.user.name,
          role: result.data.user.userType === "SUPER_ADMIN" ? "super_admin" : "admin",
          avatar: result.data.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.data.user.name}`,
          createdAt: result.data.user.createdAt,
          lastLogin: new Date().toISOString(),
        };

        setUser(adminUser);
        localStorage.setItem("hostinly_admin_user", JSON.stringify(adminUser));
        localStorage.setItem("hostinly_admin_token", result.data.token);
        return { success: true };
      } else {
        // Check if it's invalid credentials OR just not an admin user
        const errorMsg = result.error || "Invalid credentials. Only admin users can log in.";
        return { success: false, error: errorMsg };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An error occurred. Please try again." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hostinly_admin_user");
    localStorage.removeItem("hostinly_admin_token");
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
