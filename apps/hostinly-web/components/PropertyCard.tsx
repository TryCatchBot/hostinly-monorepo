import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Bed, Bath, Send, CheckCircle, Loader2 } from 'lucide-react';
import { type Property } from '@/lib/provideData';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export default function PropertyCard({ property }: PropertyCardProps) {
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const appliedProperties = JSON.parse(localStorage.getItem('applied_properties') || '[]');
    if (appliedProperties.includes(property.id)) {
      setHasApplied(true);
    }
  }, [property.id]);

  const handleApply = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    
    if (!user || !property.id) return;
    setIsApplying(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${API_URL}/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hostId: property.ownerId || '',
          candidateId: user.id,
          notes: `Application to manage property: ${property.title} via Quick Apply`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setHasApplied(true);
        const appliedProperties = JSON.parse(localStorage.getItem('applied_properties') || '[]');
        localStorage.setItem('applied_properties', JSON.stringify([...appliedProperties, property.id]));
        toast.success('Application sent!');
      } else {
        toast.error(result.error || 'Failed to send application');
      }
    } catch (error) {
      console.error('Failed to apply:', error);
      toast.error('An error occurred');
    } finally {
      setIsApplying(false);
    }
  };

  const href = `/dashboard/properties/${property.id}`;
  const isStaff = user?.userType === 'cohost' || user?.userType === 'cleaner';
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'managing':
        return 'bg-green-100 text-green-800';
      case 'available':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'managing':
        return 'Managing';
      case 'available':
        return 'Available';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <Link
      href={href}
      className="bg-background rounded-lg shadow-medium border border-border overflow-hidden hover:shadow-strong transition-shadow cursor-pointer group block"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
          {getStatusLabel(property.status)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-foreground text-base line-clamp-2 mb-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin size={16} />
          <span>{property.location}</span>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
          <div className="flex items-center gap-1 text-black font-bold">
            <Bed size={16} className="text-black" />
            <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1 text-black font-bold">
            <Bath size={16} className="text-primary" />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="text-right font-black text-secondary">
            £{property.price}/mo
          </div>
        </div>

        {/* Rating and Apply Button */}
        <div className="flex items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">{property.rating}</span>
            </div>
            <span className="text-muted-foreground">({property.reviews} reviews)</span>
          </div>

          {isStaff && (
            <button
              onClick={handleApply}
              disabled={isApplying || hasApplied}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                hasApplied 
                ? 'bg-green-100 text-green-700 cursor-default' 
                : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
              }`}
            >
              {isApplying ? (
                <Loader2 size={14} className="animate-spin" />
              ) : hasApplied ? (
                <CheckCircle size={14} />
              ) : (
                <Send size={14} />
              )}
              {isApplying ? 'Applying...' : hasApplied ? 'Applied' : 'Apply'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
