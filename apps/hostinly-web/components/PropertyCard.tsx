import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Bed, Bath } from 'lucide-react';
import { Property } from '@/lib/mockData';

interface PropertyCardProps {
  property: Property;
  onSelect?: (property: Property) => void;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const href = `/dashboard/properties/${property.id}`;
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
          <div className="flex items-center gap-1 text-foreground">
            <Bed size={16} />
            <span>{property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1 text-foreground">
            <Bath size={16} />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="text-right font-bold text-secondary">
            ${property.price}/mo
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{property.rating}</span>
          </div>
          <span className="text-muted-foreground">({property.reviews} reviews)</span>
        </div>
      </div>
    </Link>
  );
}
