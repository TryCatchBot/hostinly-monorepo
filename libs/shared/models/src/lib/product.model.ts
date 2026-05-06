export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  searchTerm?: string;
}

// User Models
export type UserType = 'host' | 'cohost' | 'guest' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdAt: string;
  lastActive?: string;
}

// Property Models
export type PropertyStatus = 'available' | 'managing' | 'pending' | 'active' | 'inactive' | 'under_review' | 'rejected';
export type PropertyType = 'apartment' | 'house' | 'villa' | 'condo' | 'studio' | 'penthouse';

export interface Property {
  id: string;
  title: string;
  description: string;
  type?: PropertyType;
  location: string;
  detailedLocation?: {
    address: string;
    city: string;
    country: string;
  };
  price: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  status: PropertyStatus;
  ownerId?: string;
  ownerName?: string;
  amenities?: string[];
  createdAt: string;
  updatedAt: string;
}

// Co-host Models
export interface CoHost {
  id: string;
  userId?: string;
  name: string;
  title: string;
  email?: string;
  phone?: string;
  rating: number;
  reviews: number;
  specialties: string[];
  image: string;
  hourlyRate?: number;
  commissionRate?: number;
  activeProperties?: number;
  completedBookings?: number;
  joinedAt?: string;
  lastActive?: string;
  status?: 'active' | 'pending' | 'suspended' | 'banned';
}

// Job Models
export type JobStatus = 'open' | 'closed' | 'in_progress' | 'completed';

export interface JobPosting {
  id: string;
  title: string;
  description: string;
  propertyLocation: string;
  budget: number;
  duration: string;
  experience: string;
  status: JobStatus;
  applications: number;
  createdAt?: string;
  ownerId?: string;
}

// Booking Models
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no_show';

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  guestId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: BookingStatus;
  createdAt: string;
}
