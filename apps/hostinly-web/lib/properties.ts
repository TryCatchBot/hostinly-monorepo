export interface CoHost {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar?: string;
}

export interface Property {
  id: string | number;
  title: string;
  location: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  expectedRevenue: string;
  status: string;
  image: string;
  images?: string[];
  description: string;
  amenities: string[];
  houseRules: string[];
  checkInInstructions?: string;
  ownerId?: string;
  coHost: CoHost;
}

export const properties: Property[] = [
  {
    id: 1,
    title: "Modern Downtown Apartment",
    location: "Miami, FL",
    city: "Miami",
    state: "FL",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    expectedRevenue: "£3,500/mo",
    status: "Looking for Co-Host",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=600&fit=crop",
    ],
    description: "Stylish 2-bedroom apartment in the heart of Miami's downtown. Walking distance to restaurants, shops, and nightlife. Modern finishes, high ceilings, and a private balcony with city views. Perfect for professionals or small families visiting the area.",
    amenities: ["WiFi", "Air Conditioning", "Kitchen", "Washer/Dryer", "Parking", "Pool", "Gym"],
    houseRules: ["No smoking", "No pets", "Quiet hours 10pm-8am", "Check-in after 3pm"],
    checkInInstructions: "Self check-in with smart lock. Code will be sent 24 hours before arrival.",
    coHost: {
      name: "Sarah Mitchell",
      email: "sarah.m@hostingly.co",
      phone: "+1 (305) 555-0123",
      bio: "Experienced co-host with 50+ properties. Specializing in downtown Miami short-term rentals.",
    },
  },
  {
    id: 2,
    title: "Beachfront Villa",
    location: "San Diego, CA",
    city: "San Diego",
    state: "CA",
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 10,
    expectedRevenue: "£8,000/mo",
    status: "Looking for Co-Host",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    ],
    description: "Stunning 4-bedroom beachfront villa with panoramic ocean views. Private beach access, infinity pool, and outdoor dining area. Ideal for families and groups looking for a luxurious coastal getaway.",
    amenities: ["WiFi", "Air Conditioning", "Full Kitchen", "Pool", "Beach Access", "BBQ Grill", "Ocean View", "Parking"],
    houseRules: ["No parties", "No smoking", "Pets allowed with fee", "Check-in 4pm"],
    checkInInstructions: "Key box at main gate. Code provided upon booking confirmation.",
    coHost: {
      name: "James Chen",
      email: "james.c@hostingly.co",
      phone: "+1 (619) 555-0456",
      bio: "Luxury property specialist. 10+ years in San Diego vacation rentals.",
    },
  },
  {
    id: 3,
    title: "Cozy Mountain Cabin",
    location: "Denver, CO",
    city: "Denver",
    state: "CO",
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    expectedRevenue: "£4,200/mo",
    status: "Looking for Co-Host",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    ],
    description: "Charming mountain cabin nestled in the Rockies. Wood-burning fireplace, rustic decor, and stunning mountain views. Perfect for ski trips or summer hiking adventures. 20 minutes from major ski resorts.",
    amenities: ["WiFi", "Fireplace", "Full Kitchen", "Hot Tub", "Mountain View", "Parking", "Washer/Dryer"],
    houseRules: ["No smoking", "Pets welcome", "4WD recommended in winter", "Check-in 3pm"],
    checkInInstructions: "Meet and greet at the cabin. Host will coordinate arrival time.",
    coHost: {
      name: "Emily Rodriguez",
      email: "emily.r@hostingly.co",
      phone: "+1 (303) 555-0789",
      bio: "Mountain property expert. Local to the Denver area for 15 years.",
    },
  },
  {
    id: 4,
    title: "Lakeside Retreat",
    location: "Austin, TX",
    city: "Austin",
    state: "TX",
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 8,
    expectedRevenue: "£4,800/mo",
    status: "Looking for Co-Host",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    ],
    description: "Beautiful lakeside home with private dock. Perfect for fishing, kayaking, and sunset views. Open floor plan with large windows overlooking the lake. Great for family reunions or group getaways.",
    amenities: ["WiFi", "AC", "Kitchen", "Lake Access", "Dock", "Kayaks", "Fire Pit", "BBQ"],
    houseRules: ["No smoking", "Pets allowed", "Quiet after 10pm", "Check-in 3pm"],
    checkInInstructions: "Keyless entry. Code sent 48 hours before check-in.",
    coHost: {
      name: "Michael Torres",
      email: "michael.t@hostingly.co",
      phone: "+1 (512) 555-0321",
      bio: "Austin area co-host. Specializing in waterfront properties.",
    },
  },
  {
    id: 5,
    title: "Urban Loft in SoHo",
    location: "New York, NY",
    city: "New York",
    state: "NY",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    expectedRevenue: "£5,200/mo",
    status: "Looking for Co-Host",
    image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    ],
    description: "Industrial chic loft in the heart of SoHo. Exposed brick, 14ft ceilings, and designer furnishings. Steps from the best shopping, dining, and art galleries in Manhattan.",
    amenities: ["WiFi", "AC", "Kitchenette", "Doorman", "Elevator", "Laundry in building"],
    houseRules: ["No smoking", "No pets", "No parties", "Check-in 4pm"],
    checkInInstructions: "Doorman will provide keys. ID required at check-in.",
    coHost: {
      name: "David Kim",
      email: "david.k@hostingly.co",
      phone: "+1 (212) 555-0654",
      bio: "NYC luxury short-term rental specialist. 8 years experience.",
    },
  },
  {
    id: 6,
    title: "Desert Oasis",
    location: "Scottsdale, AZ",
    city: "Scottsdale",
    state: "AZ",
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    expectedRevenue: "£6,500/mo",
    status: "Looking for Co-Host",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
    ],
    description: "Luxurious desert estate with private pool and mountain views. Modern Southwestern design with indoor-outdoor living. Perfect for golf trips or relaxing getaways.",
    amenities: ["WiFi", "AC", "Pool", "Spa", "Full Kitchen", "Golf Nearby", "Mountain View"],
    houseRules: ["No smoking", "No pets", "Pool hours 8am-10pm", "Check-in 4pm"],
    checkInInstructions: "Smart lock entry. Code provided 24 hours before arrival.",
    coHost: {
      name: "Jennifer Walsh",
      email: "jennifer.w@hostingly.co",
      phone: "+1 (480) 555-0987",
      bio: "Scottsdale vacation rental expert. PGA area specialist.",
    },
  },
  {
    id: 7,
    title: "Historic Brownstone",
    location: "Boston, MA",
    city: "Boston",
    state: "MA",
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    expectedRevenue: "£5,800/mo",
    status: "Looking for Co-Host",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    ],
    description: "Elegant 19th-century brownstone in Beacon Hill. Original hardwood floors, period details, and modern amenities. Walking distance to Boston Common and Freedom Trail.",
    amenities: ["WiFi", "AC", "Full Kitchen", "Washer/Dryer", "Street Parking"],
    houseRules: ["No smoking", "No pets", "Quiet neighborhood", "Check-in 3pm"],
    checkInInstructions: "Key pick-up at nearby cafe. Details sent after booking.",
    coHost: {
      name: "Robert Thompson",
      email: "robert.t@hostingly.co",
      phone: "+1 (617) 555-0147",
      bio: "Boston historic property manager. Beacon Hill specialist.",
    },
  },
  {
    id: 8,
    title: "Wine Country Cottage",
    location: "Napa, CA",
    city: "Napa",
    state: "CA",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    expectedRevenue: "£4,500/mo",
    status: "Looking for Co-Host",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
    ],
    description: "Charming cottage in the heart of wine country. Vineyard views, private patio, and easy access to world-class wineries. Romantic getaway or wine-tasting weekend.",
    amenities: ["WiFi", "AC", "Kitchen", "Vineyard View", "Patio", "Parking"],
    houseRules: ["No smoking", "No pets", "Wine tasting tours available", "Check-in 4pm"],
    checkInInstructions: "Self check-in with lockbox. Code sent upon confirmation.",
    coHost: {
      name: "Amanda Foster",
      email: "amanda.f@hostingly.co",
      phone: "+1 (707) 555-0234",
      bio: "Napa Valley hospitality expert. Wine country concierge.",
    },
  },
  {
    id: 9,
    title: "Lakefront Condo",
    location: "Chicago, IL",
    city: "Chicago",
    state: "IL",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    expectedRevenue: "£3,800/mo",
    status: "Looking for Co-Host",
    image: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop",
    ],
    description: "Stunning lakefront condo with panoramic views of Lake Michigan. Modern amenities, rooftop access, and steps from Navy Pier and Magnificent Mile.",
    amenities: ["WiFi", "AC", "Kitchen", "Lake View", "Gym", "Doorman", "Parking"],
    houseRules: ["No smoking", "No pets", "No parties", "Check-in 4pm"],
    checkInInstructions: "Building concierge. Bring ID for key handoff.",
    coHost: {
      name: "Lisa Anderson",
      email: "lisa.a@hostingly.co",
      phone: "+1 (312) 555-0567",
      bio: "Chicago downtown specialist. 12 years in hospitality.",
    },
  },
  {
    id: 10,
    title: "Garden Studio",
    location: "Portland, OR",
    city: "Portland",
    state: "OR",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    expectedRevenue: "$2,800/mo",
    status: "Looking for Co-Host",
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    ],
    description: "Cozy garden studio in hip Portland neighborhood. Private entrance, lush garden patio, and walkable to cafes and shops. Perfect for solo travelers or couples.",
    amenities: ["WiFi", "Kitchenette", "Garden", "Parking", "Bike storage"],
    houseRules: ["No smoking", "Pets considered", "Eco-friendly", "Check-in 3pm"],
    checkInInstructions: "Key in lockbox at gate. Code in booking confirmation.",
    coHost: {
      name: "Chris Nguyen",
      email: "chris.n@hostingly.co",
      phone: "+1 (503) 555-0890",
      bio: "Portland local. Sustainable travel advocate.",
    },
  },
];

export function getPropertyById(id: number): Property | undefined {
  return properties.find((p) => p.id === id);
}
