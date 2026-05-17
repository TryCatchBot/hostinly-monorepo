"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/properties", label: "Properties" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#how-it-works", label: "How it Works" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard') ?? false;
  const isHome = pathname === '/';
  const router = useRouter();

  const handleDashboardClick = (e?: MouseEvent) => {
    e?.preventDefault();
    if (user) {
      router.push("/dashboard");
      return;
    }
    setRoleModalOpen(true);
  };

  const goToSignup = (role: "host" | "cohost") => {
    setRoleModalOpen(false);
    setMobileOpen(false);
    router.push(`/auth/signup?role=${role}`);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        backgroundColor: "hsl(180, 100.00%, 99.80%)",
        borderColor: "hsl(180, 100.00%, 99.80%)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link href="/" className="flex items-center space-x-2 shrink-0">
            <Image
              src="/images/hostinly-logo.png"
              alt="Hostinly"
              width={40}
              height={40}
              className="h-8 w-auto sm:h-10"
            />
            <span
              className="text-lg font-bold sm:text-xl"
              style={{ color: "hsl(195, 60%, 25%)" }}
            >
              Hostinly
            </span>
          </Link>

          {/* Desktop nav */}
          {!isDashboard && (
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:opacity-80 text-sm font-medium"
                style={{ color: "hsl(195, 20%, 45%)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          )}

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {!isHome && (
                  <span className="text-sm font-medium text-muted-foreground">
                    {user.name}
                  </span>
                )}
                <Link
                  href="/dashboard"
                  className="rounded-md px-4 py-2 text-sm font-medium transition-colors text-black hover:bg-[hsl(45,100%,90%)] hover:text-[hsl(45,100%,35%)]"
                >
                  Dashboard
                </Link>
                <Button
                  variant="default"
                  className="btn-breathe rounded-lg border-0 min-w-0 px-5 py-2.5 text-sm font-medium"
                  style={{
                    background: "linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))",
                    color: "#ffffff",
                  }}
                >
                  List Property
                </Button>
                <button
                  onClick={logout}
                  className="rounded-md px-4 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Log out"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-4 py-2 text-sm font-medium transition-colors text-black hover:bg-[hsl(45,100%,90%)] hover:text-[hsl(45,100%,35%)]"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn-breathe rounded-lg border-0 min-w-0 px-5 py-2.5 text-sm font-medium inline-flex items-center justify-center transition-colors"
                  style={{
                    background: "linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))",
                    color: "#ffffff",
                  }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-white/60"
            style={{ color: "hsl(195, 60%, 25%)" }}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-200 ease-out ${
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 pb-5 flex flex-col gap-4 border-t border-[hsl(180,20%,90%)]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-2 text-sm font-medium transition-colors"
                style={{ color: "hsl(195, 20%, 45%)" }}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                {!isHome && (
                  <div className="py-2 text-sm font-medium text-muted-foreground border-t border-border pt-4">
                    Signed in as {user.name}
                  </div>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md px-2 -mx-2 transition-colors"
                >
                  Dashboard
                </Link>
                <Button
                  variant="default"
                  className="btn-breathe w-full justify-center rounded-lg border-0 text-sm font-medium py-3"
                  style={{
                    background: "linear-gradient(135deg, hsl(180, 50%, 35%), hsl(195, 60%, 40%))",
                    color: "#ffffff",
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  List Property
                </Button>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                    window.location.href = '/login';
                  }}
                  className="py-2 px-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md -mx-2 transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="py-2 text-sm font-medium text-black hover:bg-[hsl(45,100%,90%)] hover:text-[hsl(45,100%,35%)] rounded-md px-2 -mx-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/dashboard"
                  onClick={(e) => handleDashboardClick(e)}
                  className="btn-breathe w-full justify-center rounded-lg border-0 text-sm font-medium py-3 inline-flex items-center transition-colors"
                  style={{
                    background: "linear-gradient(135deg, hsl(180, 50%, 35%), hsl(195, 60%, 40%))",
                    color: "#ffffff",
                  }}
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {roleModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setRoleModalOpen(false)}
            aria-label="Close"
          />
          <div className="relative w-full max-w-lg bg-background rounded-xl border border-border shadow-strong p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Continue as</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose your role to see the right form.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRoleModalOpen(false)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => goToSignup("host")}
                className="text-left rounded-xl border border-border p-4 hover:border-primary hover:bg-muted/40 transition-colors"
              >
                <div className="font-semibold text-foreground mb-1">Property Owner</div>
                <div className="text-sm text-muted-foreground">
                  List your property and find co-hosts.
                </div>
              </button>
              <button
                type="button"
                onClick={() => goToSignup("cohost")}
                className="text-left rounded-xl border border-border p-4 hover:border-primary hover:bg-muted/40 transition-colors"
              >
                <div className="font-semibold text-foreground mb-1">Co-Host</div>
                <div className="text-sm text-muted-foreground">
                  Apply to manage properties and earn.
                </div>
              </button>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setRoleModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))",
                  color: "#ffffff",
                }}
                onClick={() => goToSignup("host")}
              >
                List Property
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
