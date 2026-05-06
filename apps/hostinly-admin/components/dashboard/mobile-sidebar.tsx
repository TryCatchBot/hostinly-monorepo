"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetClose } from "@/components/ui/sheet";
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
  { title: "Bookings", href: "/bookings", icon: Calendar, permissionKey: "bookings" },
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

export function MobileSidebar() {
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
      const isActive = pathname === item.href;
      const Icon = item.icon;

      return (
        <SheetClose key={item.href} asChild>
          <Link href={item.href}>
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
        </SheetClose>
      );
    });
  };

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">Hostinly</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {renderNavItems(mainNavItems)}
          
          <Separator className="my-3" />
          <span className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Content
          </span>
          {renderNavItems(secondaryNavItems)}
          
          <Separator className="my-3" />
          <span className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Administration
          </span>
          {renderNavItems(adminNavItems)}
        </nav>
      </ScrollArea>
    </div>
  );
}
