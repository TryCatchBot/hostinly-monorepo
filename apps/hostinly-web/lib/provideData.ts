// Mock data for properties, co-hosts, and listings
export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  status: 'available' | 'managing' | 'pending' | 'managed' | 'inactive';
  description?: string;
  airbnbLink?: string;
  ownerId?: string;
}

export interface CoHost {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  specialties: string[];
  image: string;
  hourlyRate?: number;
  commissionPercentage?: number;
  languages?: string[];
}

export interface JobPosting {
  id: string;
  title: string;
  description: string;
  propertyLocation: string;
  budget: number | string;
  duration: string;
  experience: string;
  status: 'open' | 'closed' | 'in_progress' | 'completed' | 'cancelled';
  applications: number;
  type: string;
  requirements?: string;
  skills?: string[];
}

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Modern Apartment',
    location: 'San Francisco, CA',
    price: 450,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop',
    rating: 4.9,
    reviews: 128,
    status: 'managing',
  },
  {
    id: '2',
    title: 'Cozy Brooklyn Loft',
    location: 'Brooklyn, NY',
    price: 380,
    bedrooms: 1,
    bathrooms: 1,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop',
    rating: 4.7,
    reviews: 94,
    status: 'available',
  },
  {
    id: '3',
    title: 'Austin Tech House',
    location: 'Austin, TX',
    price: 320,
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=300&fit=crop',
    rating: 4.6,
    reviews: 67,
    status: 'available',
  },
  {
    id: '4',
    title: 'Miami Beachfront Villa',
    location: 'Miami, FL',
    price: 520,
    bedrooms: 4,
    bathrooms: 3,
    image: 'https://images.unsplash.com/photo-1512917774080-9b41b20b7487?w=500&h=300&fit=crop',
    rating: 4.8,
    reviews: 156,
    status: 'pending',
  },
];

export const mockCoHosts: CoHost[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Professional Property Manager',
    rating: 4.95,
    reviews: 342,
    specialties: ['Check-ins', 'Cleaning', 'Guest Communication'],
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    hourlyRate: 35,
  },
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Airbnb Superhost',
    rating: 4.92,
    reviews: 287,
    specialties: ['Maintenance', 'Repairs', 'Property Inspections'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    hourlyRate: 40,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    title: 'Guest Experience Specialist',
    rating: 4.88,
    reviews: 219,
    specialties: ['Guest Communication', 'Resolution', 'Marketing'],
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    hourlyRate: 30,
  },
  {
    id: '4',
    name: 'David Williams',
    title: 'Senior Property Coordinator',
    rating: 4.91,
    reviews: 405,
    specialties: ['Full Property Management', 'Multi-property Handling', 'Revenue Optimization'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
    hourlyRate: 50,
  },
];

export const mockJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Full-time Co-Host for Twin Apartments',
    description: 'Looking for experienced co-host to manage two modern apartments in downtown area.',
    propertyLocation: 'San Francisco, CA',
    budget: 4000,
    duration: 'Full-time',
    experience: '2+ years',
    status: 'open',
    applications: 12,
    type: 'Full-time',
  },
  {
    id: '2',
    title: 'Weekend Co-Host Support',
    description: 'Need help with weekend check-ins and guest coordination for our beach property.',
    propertyLocation: 'Miami, FL',
    budget: 1500,
    duration: 'Part-time (weekends)',
    experience: '1+ years',
    status: 'open',
    applications: 8,
    type: 'Part-time',
  },
  {
    id: '3',
    title: 'Maintenance & Cleaning Specialist',
    description: 'Seeking detail-oriented professional for property maintenance and turnover cleaning.',
    propertyLocation: 'Austin, TX',
    budget: 2500,
    duration: 'Part-time',
    experience: 'Any experience welcome',
    status: 'open',
    applications: 15,
    type: 'Part-time',
  },
];

export const mockAvailableListings: Property[] = [
  {
    id: '5',
    title: 'Seattle Downtown Studio',
    location: 'Seattle, WA',
    price: 280,
    bedrooms: 1,
    bathrooms: 1,
    image: 'https://images.unsplash.com/photo-1502086223922-7f770b50f3f7?w=500&h=300&fit=crop',
    rating: 4.5,
    reviews: 45,
    status: 'available',
  },
  {
    id: '6',
    title: 'Denver Mountain Cabin',
    location: 'Denver, CO',
    price: 350,
    bedrooms: 2,
    bathrooms: 1.5,
    image: 'https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=500&h=300&fit=crop',
    rating: 4.7,
    reviews: 78,
    status: 'available',
  },
  {
    id: '7',
    title: 'Portland Urban Retreat',
    location: 'Portland, OR',
    price: 310,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.unsplash.com/photo-1505873242700-f289a29e7e0f?w=500&h=300&fit=crop',
    rating: 4.6,
    reviews: 92,
    status: 'available',
  },
];

// CRUD Operations for Properties
export function getAllProperties(): Property[] {
  const base = [...mockProperties, ...mockAvailableListings];
  if (typeof window === 'undefined') return base;

  const storedRaw = localStorage.getItem('hostinly_properties');
  if (!storedRaw) return base;

  try {
    const parsed = JSON.parse(storedRaw) as unknown;
    if (!Array.isArray(parsed)) return base;
    const stored = parsed as Property[];

    const map = new Map<string, Property>();
    base.forEach((p) => map.set(p.id, p));
    stored.forEach((p) => map.set(p.id, p));
    return Array.from(map.values());
  } catch {
    return base;
  }
}

export function getPropertyById(id: string): Property | undefined {
  return getAllProperties().find((p) => p.id === id);
}

export function getCoHostById(id: string): CoHost | undefined {
  return mockCoHosts.find(c => c.id === id);
}

export function getJobById(id: string): JobPosting | undefined {
  return mockJobs.find(j => j.id === id);
}

export function addProperty(property: Property): void {
  mockProperties.push(property);
  // Also persist to localStorage
  const stored = localStorage.getItem('hostinly_properties');
  const properties = stored ? JSON.parse(stored) : [];
  properties.push(property);
  localStorage.setItem('hostinly_properties', JSON.stringify(properties));
}

export function addJob(job: JobPosting): void {
  mockJobs.push(job);
  // Also persist to localStorage
  const stored = localStorage.getItem('hostinly_jobs');
  const jobs = stored ? JSON.parse(stored) : [];
  jobs.push(job);
  localStorage.setItem('hostinly_jobs', JSON.stringify(jobs));
}

export function updateProperty(id: string, updates: Partial<Property>): void {
  const property =
    mockProperties.find((p) => p.id === id) ||
    mockAvailableListings.find((p) => p.id === id);
  if (property) Object.assign(property, updates);

  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem('hostinly_properties');
  if (!stored) return;
  try {
    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed)) return;
    const storedProperties = parsed as Property[];
    const next = storedProperties.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    localStorage.setItem('hostinly_properties', JSON.stringify(next));
  } catch {
    return;
  }
}

export function deleteProperty(id: string): void {
  const index = mockProperties.findIndex(p => p.id === id);
  if (index > -1) {
    mockProperties.splice(index, 1);
  }
}

export function deleteJob(id: string): void {
  const index = mockJobs.findIndex(j => j.id === id);
  if (index > -1) {
    mockJobs.splice(index, 1);
  }
}
