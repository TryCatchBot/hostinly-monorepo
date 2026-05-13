'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Briefcase,
  LogOut,
  LayoutDashboard,
  CreditCard,
  MessageSquare,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', alwaysEnabled: true },
    { icon: Home, label: 'Properties', href: '/dashboard/properties' },
    { icon: Users, label: 'Co-Hosts', href: '/dashboard/cohosts' },
    { icon: MessageSquare, label: 'Interviews', href: '/dashboard/interviews' },
    { icon: Briefcase, label: 'Jobs', href: '/dashboard/jobs' },
    { icon: CreditCard, label: 'Billing', href: '/dashboard/billing' },
  ];

  const isActive = (href: string) => pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className="w-64 border-r border-border overflow-y-auto"
        style={{ backgroundColor: 'hsl(220, 13%, 15%)' }}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-border/20">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))' }}
            >
              H
            </div>
            <span className="font-bold text-white text-lg">Hostinly</span>
          </Link>
        </div>



        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isDisabled = !user?.isOnboardingCompleted && !item.alwaysEnabled;

            return (
              <Link
                key={item.href}
                href={isDisabled ? '#' : item.href}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                    // Optional: show a toast or message
                  }
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed text-muted-foreground'
                    : isActive(item.href)
                    ? 'text-white'
                    : 'text-muted-foreground hover:text-white hover:bg-muted'
                }`}
                style={
                  isActive(item.href) && !isDisabled
                    ? {
                        background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                        color: '#ffffff',
                      }
                    : {}
                }
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/20 w-64">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium w-full text-muted-foreground hover:text-white hover:bg-muted"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top bar with avatar */}
        <div className="border-b border-border p-6 flex items-center justify-between bg-background">
          <h2 className="text-xl font-semibold text-foreground">Welcome back, {user?.name}!</h2>
          {user && (
            <Link href="/dashboard/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.userType}</p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))' }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            </Link>
          )}
        </div>
        <div className="p-8 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
