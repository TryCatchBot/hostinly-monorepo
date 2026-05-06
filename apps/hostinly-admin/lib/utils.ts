import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // User/Property status
    active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    suspended: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    banned: "bg-red-500/10 text-red-500 border-red-500/20",
    inactive: "bg-muted text-muted-foreground border-border",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    under_review: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    
    // Verification status
    verified: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    unverified: "bg-muted text-muted-foreground border-border",
    
    // Booking status
    confirmed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    no_show: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    
    // Transaction status
    processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    failed: "bg-red-500/10 text-red-500 border-red-500/20",
    
    // Review status
    published: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    flagged: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    removed: "bg-red-500/10 text-red-500 border-red-500/20",
    
    // Ticket status
    open: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    in_progress: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    waiting: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    resolved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    closed: "bg-muted text-muted-foreground border-border",
    
    // Priority
    low: "bg-muted text-muted-foreground border-border",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    urgent: "bg-red-500/10 text-red-500 border-red-500/20",
    
    // Service status
    available: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    unavailable: "bg-muted text-muted-foreground border-border",
    coming_soon: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    assigned: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    
    // Document status
    expired: "bg-red-500/10 text-red-500 border-red-500/20",
    
    // Communication status
    sent: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    scheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    draft: "bg-muted text-muted-foreground border-border",
  };

  return statusColors[status] || "bg-muted text-muted-foreground border-border";
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-yellow-500/10 text-yellow-500",
    high: "bg-orange-500/10 text-orange-500",
    urgent: "bg-red-500/10 text-red-500",
  };
  return colors[priority] || colors.low;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatStatus(status: string): string {
  return status
    .split("_")
    .map((word) => capitalizeFirst(word))
    .join(" ");
}
