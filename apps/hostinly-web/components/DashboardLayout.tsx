'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';
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
  Menu,
  X,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', alwaysEnabled: true },
    { icon: Home, label: 'Properties', href: '/dashboard/properties' },
    { icon: Users, label: 'Co-Hosts', href: '/dashboard/cohosts' },
    { icon: MessageSquare, label: 'Interviews', href: '/dashboard/interviews' },
    { icon: Briefcase, label: 'Jobs', href: '/dashboard/jobs' },
    { icon: CreditCard, label: 'Billing', href: '/dashboard/billing' },
  ];

  const isActive = (href: string) => pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));

  const SidebarContent = () => (
    <>
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
      <nav className="p-4 space-y-2 flex-1">
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
                } else {
                  setIsSidebarOpen(false);
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
      <div className="p-4 border-t border-border/20 mt-auto">
        <button
          onClick={() => {
            logout();
            setIsSidebarOpen(false);
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium w-full text-muted-foreground hover:text-white hover:bg-muted"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 z-50 transform lg:hidden transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: 'hsl(220, 13%, 15%)' }}
      >
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-white lg:hidden"
        >
          <X size={24} />
        </button>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div
        className="hidden lg:flex w-64 border-r border-border overflow-y-auto flex-col shrink-0"
        style={{ backgroundColor: 'hsl(220, 13%, 15%)' }}
      >
        <SidebarContent />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 sm:px-8 shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
              {pathname === '/dashboard' ? `Welcome, ${user?.name.split(' ')[0]}!` : 
               pathname?.includes('profile') ? 'Profile Settings' :
               pathname?.includes('properties') ? 'Properties' :
               pathname?.includes('jobs') ? 'Jobs' :
               pathname?.includes('interviews') ? 'Interviews' :
               pathname?.includes('billing') ? 'Billing' :
               pathname?.includes('cohosts') ? 'Co-Hosts' : 'Dashboard'}
            </h1>
          </div>

          {user && (
            <Link href="/dashboard/profile" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{user.userType}</p>
              </div>
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-sm"
                style={{ background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))' }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            </Link>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
