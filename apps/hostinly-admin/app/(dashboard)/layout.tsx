"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PermissionSection } from "@/lib/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, permissions, isLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const requiredSection: PermissionSection | null = (() => {
    const routeMap: Array<[string, PermissionSection]> = [
      ["/users", "users"],
      ["/properties", "properties"],
      ["/co-hosts", "coHosts"],
      ["/bookings", "bookings"],
      ["/payments", "payments"],
      ["/services", "services"],
      ["/reviews", "reviews"],
      ["/communications", "communications"],
      ["/documents", "documents"],
      ["/moderation", "moderation"],
      ["/marketing", "marketing"],
      ["/support", "support"],
      ["/settings", "settings"],
    ];

    const matched = routeMap.find(([prefix]) => pathname === prefix || pathname?.startsWith(`${prefix}/`));
    return matched ? matched[1] : null;
  })();

  const canViewRoute = requiredSection ? permissions?.[requiredSection]?.view === true : true;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Redirecting to login…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "flex flex-col transition-all duration-300",
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        )}
      >
        <Header />
        <main className="flex-1 p-4 md:p-6">
          {canViewRoute ? (
            children
          ) : (
            <Card className="max-w-xl">
              <CardHeader>
                <CardTitle>Access denied</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your admin role does not have permission to view this section.
                </p>
                <Button onClick={() => router.push("/")}>Go to dashboard</Button>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
