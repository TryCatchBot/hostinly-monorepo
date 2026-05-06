-- Create users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  country TEXT DEFAULT 'USA',
  property_type TEXT NOT NULL, -- apartment, house, condo, etc.
  bedrooms INTEGER,
  bathrooms NUMERIC,
  max_guests INTEGER,
  price_per_night NUMERIC(10, 2),
  amenities TEXT[], -- array of amenity strings
  images TEXT[], -- array of image URLs
  status TEXT DEFAULT 'draft', -- draft, active, inactive
  is_cohost_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create cohost_applications table
CREATE TABLE IF NOT EXISTS public.cohost_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending', -- pending, approved, rejected
  message TEXT,
  experience_years INTEGER,
  previous_properties TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(property_id, applicant_id)
);

-- Create cohost_partnerships table
CREATE TABLE IF NOT EXISTS public.cohost_partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  cohost_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active', -- active, inactive
  commission_percentage NUMERIC(5, 2) DEFAULT 20,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(property_id, cohost_id)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  guest_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price NUMERIC(10, 2),
  status TEXT DEFAULT 'confirmed', -- confirmed, cancelled, completed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohost_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohost_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for properties table
CREATE POLICY "Users can view all properties" ON public.properties
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can create properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own properties" ON public.properties
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own properties" ON public.properties
  FOR DELETE USING (auth.uid() = owner_id);

-- RLS Policies for cohost_applications table
CREATE POLICY "Users can view applications for their properties" ON public.cohost_applications
  FOR SELECT USING (
    auth.uid() IN (
      SELECT owner_id FROM public.properties WHERE id = property_id
    ) OR auth.uid() = applicant_id
  );

CREATE POLICY "Users can apply to properties" ON public.cohost_applications
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);

-- RLS Policies for cohost_partnerships table
CREATE POLICY "Users can view partnerships for their properties or as cohost" ON public.cohost_partnerships
  FOR SELECT USING (
    auth.uid() IN (
      SELECT owner_id FROM public.properties WHERE id = property_id
    ) OR auth.uid() = cohost_id
  );

-- RLS Policies for bookings table
CREATE POLICY "Users can view bookings for their properties or as guest" ON public.bookings
  FOR SELECT USING (
    auth.uid() IN (
      SELECT owner_id FROM public.properties WHERE id = property_id
    ) OR auth.uid() = guest_id
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_cohost_applications_property_id ON public.cohost_applications(property_id);
CREATE INDEX IF NOT EXISTS idx_cohost_partnerships_property_id ON public.cohost_partnerships(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON public.bookings(guest_id);
