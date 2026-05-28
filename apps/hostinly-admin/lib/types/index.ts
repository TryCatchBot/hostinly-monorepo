// Admin Roles
export type AdminRole =
  | "super_admin"
  | "admin"
  | "supervisor"
  | "facilityManager";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

// Platform Users
export type UserType = "HOST" | "COHOST" | "CLEANER" | "SUPER_ADMIN" | "ADMIN" | "SUPERVISOR" | "FACILITY_MANAGER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  userType: UserType;
  status: UserStatus;
  verificationStatus: VerificationStatus;
  avatar?: string;
  createdAt: string;
  lastActive?: string;
  properties: number;
  bookings: number;
  revenue: number;
}

// Properties
export type PropertyStatus = "AVAILABLE" | "MANAGED" | "INACTIVE" | "PENDING";
export type PropertyType = "apartment" | "house" | "villa" | "condo" | "studio" | "penthouse";

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  airbnbLink?: string;
  ownerId: string;
  ownerName: string;
  address: string;
  city: string;
  country: string;
  pricing: {
    nightlyRate: number;
    currency: string;
  };
  price: number;
  currency: string;
  images: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  guests: number;
  rating: number | null;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// Co-Hosts
export type CoHostStatus = "active" | "pending" | "suspended" | "banned";

export interface CoHost {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  status: CoHostStatus;
  rating: number;
  responseTime: number; // in minutes
  completedBookings: number;
  activeProperties: number;
  commissionRate: number;
  joinedAt: string;
  lastActive?: string;
}

// Bookings
export type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed" | "no_show";

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  guestId: string;
  guestName: string;
  coHostId?: string;
  coHostName?: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  guests: number;
  totalAmount: number;
  platformFee: number;
  hostPayout: number;
  currency: string;
  createdAt: string;
  specialRequests?: string;
}

// Payments
export type TransactionType = "booking" | "payout" | "refund" | "commission" | "fee";
export type TransactionStatus = "completed" | "pending" | "failed" | "processing";

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  bookingId?: string;
  userId: string;
  userName: string;
  description: string;
  createdAt: string;
  processedAt?: string;
}

// Services
export type ServiceStatus = "available" | "unavailable" | "coming_soon";
export type ServiceRequestStatus = "pending" | "assigned" | "in_progress" | "completed" | "cancelled";

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  status: ServiceStatus;
  providerId?: string;
}

export type ServiceProviderStatus = "active" | "pending" | "suspended" | "inactive";

export interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  category: string;
  location: string;
  rating: number;
  totalReviews: number;
  completedJobs: number;
  services?: string[];
  hourlyRate?: number;
  status: ServiceProviderStatus;
  joinedAt: string;
}

export interface ServiceRequest {
  id: string;
  serviceId: string;
  serviceName: string;
  bookingId: string;
  propertyId: string;
  propertyTitle: string;
  propertyName?: string;
  requestedBy: string;
  assignedTo?: string;
  providerName?: string;
  category?: string;
  status: ServiceRequestStatus;
  scheduledAt: string;
  scheduledDate?: string;
  completedAt?: string;
  notes?: string;
  description?: string;
  estimatedCost?: number;
  createdAt: string;
}

// Reviews
export type ReviewStatus = "published" | "pending" | "flagged" | "removed";

export interface Review {
  id: string;
  bookingId: string;
  propertyId: string;
  propertyTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerType: "guest" | "host";
  rating: number;
  title?: string;
  content: string;
  status: ReviewStatus;
  flagReason?: string;
  response?: string;
  createdAt: string;
}

// Communications
export type NotificationType = "email" | "sms" | "push" | "in_app";
export type CommunicationStatus = "sent" | "scheduled" | "draft" | "failed";

export interface Communication {
  id: string;
  type: NotificationType;
  status: CommunicationStatus;
  subject: string;
  content: string;
  recipients: number;
  targetAudience: string;
  scheduledAt?: string;
  sentAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  description: string;
  type: NotificationType;
  subject: string;
  content: string;
  variables: string[];
  active: boolean;
  updatedAt: string;
  createdAt: string;
}

// Documents
export type DocumentType = "id_card" | "passport" | "business_license" | "tax_certificate" | "insurance" | "contract";
export type DocumentStatus = "verified" | "pending" | "rejected" | "expired";

export interface Document {
  id: string;
  userId: string;
  userName: string;
  type: DocumentType;
  status: DocumentStatus;
  fileName: string;
  fileUrl: string;
  expiryDate?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  uploadedAt: string;
}

// Support Tickets
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed";
export type TicketCategory = "booking" | "payment" | "property" | "account" | "technical" | "other";

export interface SupportMessage {
  id: string;
  content: string;
  sender: "user" | "admin";
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  description: string;
  assignedTo?: string;
  assignedToName?: string;
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

// Moderation
export type ModerationItemType = "user" | "property" | "review" | "message" | "media";
export type ModerationPriority = "low" | "medium" | "high";
export type ModerationStatus = "pending" | "resolved" | "dismissed";

export interface ModerationItem {
  id: string;
  type: ModerationItemType;
  priority: ModerationPriority;
  status: ModerationStatus;
  targetId: string;
  targetName: string;
  targetAvatar?: string;
  reason: string;
  reportedBy: string;
  reportedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolution?: string;
  reportCount?: number;
  details?: string;
  evidenceUrl?: string;
}

// Audit Logs
export type AuditAction = "create" | "update" | "delete" | "approve" | "reject" | "suspend" | "restore" | "login" | "logout";

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  description: string;
  ipAddress: string;
  createdAt: string;
}

// Promo Codes
export type PromoCodeStatus = "active" | "inactive" | "expired";
export type DiscountType = "percentage" | "fixed";

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  currency?: string;
  minBookingAmount?: number;
  maxUses?: number;
  usedCount: number;
  status: PromoCodeStatus;
  validFrom: string;
  validUntil: string;
  createdAt: string;
}

// Marketing
export type CampaignStatus = "active" | "paused" | "completed" | "draft";
export type CampaignType = "email" | "push" | "social" | "referral";

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: CampaignType;
  status: CampaignStatus;
  impressions: number;
  clicks: number;
  conversions: number;
  budget: number;
  spend: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Promotion {
  id: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  status: PromoCodeStatus;
  minPurchase?: number;
  usedCount: number;
  maxUses?: number;
  startDate: string;
  endDate: string;
  totalSavings: number;
  createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  activeCoHosts: number;
  pendingApprovals: number;
  openTickets: number;
  occupancyRate: number;
  userGrowth: number;
  revenueGrowth: number;
  bookingGrowth: number;
  propertyGrowth: number;
}

// Chart Data
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  bookings: number;
}

// Role Permissions
export interface RolePermissions {
  users: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  properties: { view: boolean; create: boolean; edit: boolean; delete: boolean; approve: boolean };
  coHosts: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  bookings: { view: boolean; edit: boolean; cancel: boolean };
  payments: { view: boolean; process: boolean; refund: boolean };
  services: { view: boolean; create: boolean; edit: boolean; delete: boolean };
  reviews: { view: boolean; moderate: boolean; delete: boolean };
  communications: { view: boolean; create: boolean; send: boolean };
  documents: { view: boolean; verify: boolean; reject: boolean };
  settings: { view: boolean; edit: boolean };
  moderation: { view: boolean; action: boolean };
  marketing: { view: boolean; create: boolean; edit: boolean };
  support: { view: boolean; assign: boolean; resolve: boolean };
}

export type PermissionSection = keyof RolePermissions;

export const ROLE_PERMISSIONS: Record<AdminRole, RolePermissions> = {
  super_admin: {
    users: { view: true, create: true, edit: true, delete: true },
    properties: { view: true, create: true, edit: true, delete: true, approve: true },
    coHosts: { view: true, create: true, edit: true, delete: true },
    bookings: { view: true, edit: true, cancel: true },
    payments: { view: true, process: true, refund: true },
    services: { view: true, create: true, edit: true, delete: true },
    reviews: { view: true, moderate: true, delete: true },
    communications: { view: true, create: true, send: true },
    documents: { view: true, verify: true, reject: true },
    settings: { view: true, edit: true },
    moderation: { view: true, action: true },
    marketing: { view: true, create: true, edit: true },
    support: { view: true, assign: true, resolve: true },
  },
  admin: {
    users: { view: true, create: true, edit: true, delete: true },
    properties: { view: true, create: true, edit: true, delete: true, approve: true },
    coHosts: { view: true, create: true, edit: true, delete: true },
    bookings: { view: true, edit: true, cancel: true },
    payments: { view: true, process: true, refund: true },
    services: { view: true, create: true, edit: true, delete: true },
    reviews: { view: true, moderate: true, delete: true },
    communications: { view: true, create: true, send: true },
    documents: { view: true, verify: true, reject: true },
    settings: { view: true, edit: true },
    moderation: { view: true, action: true },
    marketing: { view: true, create: true, edit: true },
    support: { view: true, assign: true, resolve: true },
  },
  supervisor: {
    users: { view: true, create: false, edit: true, delete: false },
    properties: { view: true, create: false, edit: true, delete: false, approve: true },
    coHosts: { view: true, create: true, edit: true, delete: false },
    bookings: { view: true, edit: true, cancel: true },
    payments: { view: true, process: false, refund: false },
    services: { view: true, create: true, edit: true, delete: false },
    reviews: { view: true, moderate: false, delete: false },
    communications: { view: true, create: false, send: false },
    documents: { view: true, verify: false, reject: false },
    settings: { view: false, edit: false },
    moderation: { view: true, action: false },
    marketing: { view: false, create: false, edit: false },
    support: { view: true, assign: false, resolve: false },
  },
  facilityManager: {
    users: { view: true, create: false, edit: false, delete: false },
    properties: { view: true, create: false, edit: true, delete: false, approve: false },
    coHosts: { view: false, create: false, edit: false, delete: false },
    bookings: { view: false, edit: false, cancel: false },
    payments: { view: false, process: false, refund: false },
    services: { view: true, create: true, edit: true, delete: true },
    reviews: { view: false, moderate: false, delete: false },
    communications: { view: false, create: false, send: false },
    documents: { view: false, verify: false, reject: false },
    settings: { view: false, edit: false },
    moderation: { view: true, action: false },
    marketing: { view: false, create: false, edit: false },
    support: { view: true, assign: false, resolve: false },
  },
};

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  supervisor: "Supervisor",
  facilityManager: "Facility Manager",
};
