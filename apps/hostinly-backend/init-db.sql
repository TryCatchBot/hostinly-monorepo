-- Hostinly Supabase Schema Initialization (v2)

-- 1. Users Table (Platform & Admin)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('host', 'cohost', 'guest', 'admin', 'super_admin', 'supervisor')),
  avatar TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending', 'banned')),
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('verified', 'pending', 'rejected', 'unverified')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('apartment', 'house', 'villa', 'condo', 'studio', 'penthouse')),
  location TEXT NOT NULL, -- Short location string
  address TEXT,
  city TEXT,
  country TEXT,
  price DECIMAL NOT NULL,
  nightly_rate DECIMAL,
  currency TEXT DEFAULT 'USD',
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  max_guests INTEGER DEFAULT 2,
  image TEXT,
  images TEXT[],
  rating DECIMAL DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'managing', 'pending', 'active', 'inactive', 'under_review', 'rejected')),
  owner_id UUID REFERENCES users(id),
  owner_name TEXT,
  amenities TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Co-hosts Table
CREATE TABLE IF NOT EXISTS cohosts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  title TEXT,
  email TEXT,
  phone TEXT,
  rating DECIMAL DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  specialties TEXT[],
  image TEXT,
  hourly_rate DECIMAL,
  commission_rate DECIMAL,
  active_properties INTEGER DEFAULT 0,
  completed_bookings INTEGER DEFAULT 0,
  response_time INTEGER DEFAULT 0, -- in minutes
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'banned')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  property_location TEXT,
  budget DECIMAL,
  duration TEXT,
  experience TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'in_progress', 'completed')),
  applications INTEGER DEFAULT 0,
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY, -- Using custom ID like BK-101
  property_id BIGINT REFERENCES properties(id),
  property_title TEXT,
  guest_id UUID REFERENCES users(id),
  guest_name TEXT,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('confirmed', 'pending', 'cancelled', 'completed', 'no_show')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Pricing Table (Plans)
CREATE TABLE IF NOT EXISTS pricing_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
  features TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('succeeded', 'pending', 'failed', 'refunded')),
  payment_method TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Services Table
CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE cohosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Simple policies (Allow all for service role)
CREATE POLICY "Allow all for service role" ON users FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON properties FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON cohosts FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON jobs FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON bookings FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON contact_messages FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON pricing_plans FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON payments FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON services FOR ALL USING (true);

-- Seed Initial Data
INSERT INTO users (id, email, name, user_type, avatar, status, verification_status)
VALUES 
('admin-1', 'super@hostinly.com', 'Sarah Johnson', 'super_admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', 'active', 'verified')
ON CONFLICT (id) DO NOTHING;

INSERT INTO pricing_plans (id, name, price, interval, features)
VALUES 
('basic', 'Basic', 29.00, 'month', ARRAY['1 Property', 'Standard Support', 'Basic Analytics']),
('pro', 'Pro', 79.00, 'month', ARRAY['5 Properties', 'Priority Support', 'Advanced Analytics']),
('enterprise', 'Enterprise', 199.00, 'month', ARRAY['Unlimited Properties', '24/7 Support', 'Custom Reporting'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO services (name, description, price, category)
VALUES 
('Professional Cleaning', 'Full property turnover and cleaning service', 120.00, 'Cleaning'),
('Key Exchange', 'Secure digital or physical key exchange', 30.00, 'Operations'),
('Guest Screening', 'Background and ID verification for guests', 15.00, 'Safety')
ON CONFLICT DO NOTHING;
