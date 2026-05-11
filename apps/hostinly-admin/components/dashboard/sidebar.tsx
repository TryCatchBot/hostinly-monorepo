"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import {
  Building2,
  LayoutDashboard,
  Users,
  Home,
  UserCheck,
  Calendar,
  CreditCard,
  Wrench,
  Star,
  MessageSquare,
  FileText,
  Settings,
  Shield,
  Megaphone,
  HeadphonesIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  permissionKey: string;
}

const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard, permissionKey: "users" },
  { title: "Users", href: "/users", icon: Users, permissionKey: "users" },
  { title: "Properties", href: "/properties", icon: Home, permissionKey: "properties" },
  { title: "Co-hosts", href: "/co-hosts", icon: UserCheck, permissionKey: "coHosts" },
  // { title: "Bookings", href: "/bookings", icon: Calendar, permissionKey: "bookings" },
  { title: "Payments", href: "/payments", icon: CreditCard, permissionKey: "payments" },
  { title: "Services", href: "/services", icon: Wrench, permissionKey: "services" },
];

const secondaryNavItems: NavItem[] = [
  { title: "Reviews", href: "/reviews", icon: Star, permissionKey: "reviews" },
  { title: "Communications", href: "/communications", icon: MessageSquare, permissionKey: "communications" },
  { title: "Documents", href: "/documents", icon: FileText, permissionKey: "documents" },
];

const adminNavItems: NavItem[] = [
  { title: "Moderation", href: "/moderation", icon: Shield, permissionKey: "moderation" },
  { title: "Marketing", href: "/marketing", icon: Megaphone, permissionKey: "marketing" },
  { title: "Support", href: "/support", icon: HeadphonesIcon, permissionKey: "support" },
  { title: "Settings", href: "/settings", icon: Settings, permissionKey: "settings" },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();
  const { permissions } = useAuth();

  const canViewItem = (permissionKey: string) => {
    if (!permissions) return false;
    const perm = permissions[permissionKey as keyof typeof permissions];
    if (typeof perm === "object" && "view" in perm) {
      return perm.view;
    }
    return false;
  };

  const renderNavItems = (items: NavItem[]) => {
    return items.filter((item) => canViewItem(item.permissionKey)).map((item) => {
      const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
      const Icon = item.icon;

      if (collapsed) {
        return (
          <Tooltip key={item.href} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="icon"
                  className={cn(
                    "w-10 h-10",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{item.title}</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
              {item.title}
            </TooltipContent>
          </Tooltip>
        );
      }

      return (
        <Link key={item.href} href={item.href}>
          <Button
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {item.title}
          </Button>
        </Link>
      );
    });
  };

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className={cn("flex h-16 items-center border-b px-4", collapsed && "justify-center")}>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              {!collapsed && (
                <span className="text-lg font-semibold text-sidebar-foreground">Hostinly</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="flex flex-col gap-1">
              {renderNavItems(mainNavItems)}
              
              {/*
              {!collapsed && (
                <div className="mt-4 mb-2">
                  <span className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Content
                  </span>
                </div>
              )}
              {collapsed && <Separator className="my-3" />}
              {renderNavItems(secondaryNavItems)}
              
              {!collapsed && (
                <div className="mt-4 mb-2">
                  <span className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Administration
                  </span>
                </div>
              )}
              {collapsed && <Separator className="my-3" />}
              {renderNavItems(adminNavItems)}
              */}
            </nav>
          </ScrollArea>

          {/* Collapse Toggle */}
          <div className="border-t p-3">
            <Button
              variant="ghost"
              size={collapsed ? "icon" : "default"}
              onClick={() => onCollapsedChange(!collapsed)}
              className={cn("w-full", !collapsed && "justify-start gap-3")}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5" />
                  Collapse
                </>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
