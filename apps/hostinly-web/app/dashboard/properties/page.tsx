'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PropertyCard from '@/components/PropertyCard';
import AddPropertyModal from '@/components/AddPropertyModal';
import { type Property } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export default function PropertiesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;
      
      try {
        const token = localStorage.getItem('hostinly_token');
        const response = await fetch(`${API_URL}/properties`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          // Map backend properties to frontend Property type if necessary
          const mappedProperties = result.data.map((p: any) => ({
            id: p.id,
            title: p.title,
            location: `${p.address}, ${p.city}`,
            price: p.price,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            image: p.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop',
            images: p.images,
            rating: 4.5, // Default rating
            reviews: 0,
            status: p.status.toLowerCase(),
          }));
          setProperties(mappedProperties);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProperties();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const isHost = user.userType === 'host';
  const displayProperties = isHost
    ? properties.filter((p) => p.status !== 'available')
    : properties.filter((p) => p.status === 'available');

  const handleAddProperty = (property: Property) => {
    setProperties((prev) => [property, ...prev]);
    setShowAddPropertyModal(false);
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {isHost ? 'My Properties' : 'Available Properties'}
            </h1>
            <p className="text-muted-foreground">
              {isHost ? 'Manage your rental properties' : 'Find properties to co-host'}
            </p>
          </div>
          {isHost && (
            <Button
              style={{
                background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                color: '#ffffff',
              }}
              className="py-3 px-6"
              onClick={() => setShowAddPropertyModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {displayProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No properties found</p>
          </div>
        )}

        <AddPropertyModal
          isOpen={showAddPropertyModal}
          onClose={() => setShowAddPropertyModal(false)}
          onAdd={handleAddProperty}
        />
      </div>
    </DashboardLayout>
  );
}
