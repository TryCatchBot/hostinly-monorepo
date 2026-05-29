import Link from 'next/link';
import Image from 'next/image';
import { Star, Check } from 'lucide-react';
import { type CoHost } from '@/lib/provideData';
import { Button } from '@/components/ui/button';

interface CoHostCardProps {
  cohost: CoHost;
  onContact?: (cohost: CoHost) => void;
}

export default function CoHostCard({ cohost, onContact }: CoHostCardProps) {
  const initials = cohost.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const hasImage = cohost.image && 
    cohost.image !== '' && 
    !cohost.image.includes('images.unsplash.com/photo-1472099645785-5658abf4ff4e');

  return (
    <Link
      href={`/co-host/${cohost.id}`}
      className="bg-background rounded-lg shadow-medium border border-border overflow-hidden hover:shadow-strong transition-shadow block group h-full flex flex-col"
    >
      {/* Header with Image or Initials */}
      <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
        {hasImage ? (
          <Image
            src={cohost.image}
            alt={cohost.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
            <span className="text-4xl font-bold tracking-wider">{initials}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-foreground mb-1">
          {cohost.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{cohost.title}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3 text-sm">
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">{cohost.rating}</span>
          </div>
          <span className="text-muted-foreground">({cohost.reviews} reviews)</span>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Specialties</p>
          <div className="flex flex-wrap gap-1">
            {cohost.specialties.slice(0, 2).map((specialty, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded"
              >
                <Check size={12} />
                {specialty}
              </span>
            ))}
            {cohost.specialties.length > 2 && (
              <span className="text-xs text-muted-foreground px-2 py-1">
                +{cohost.specialties.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Rate and Button */}
        {cohost.hourlyRate && (
          <p className="text-sm font-bold text-foreground mb-3">
            £{cohost.hourlyRate}/hour
          </p>
        )}
        <Button
          variant="default"
          className="w-full py-2 rounded-lg text-sm font-medium"
          style={{
            background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
            color: '#ffffff',
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onContact?.(cohost);
          }}
        >
          Contact
        </Button>
      </div>
    </Link>
  );
}
