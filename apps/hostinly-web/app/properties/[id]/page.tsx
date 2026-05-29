'use client';

import { notFound, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Bed,
  Bath,
  Users,
  PoundSterling,
  ArrowLeft,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import { type Property } from "@/lib/properties";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyImageCarousel from "@/components/PropertyImageCarousel";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Send, CheckCircle } from "lucide-react";

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties/${id}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          const p = result.data;
          const cleanedImages = (p.images || []).map((img: string) => img.trim().replace(/^`|`$/g, ""));
          // Map backend structure to frontend Property structure
          // Note: Backend /properties/:id returns raw property with cohosts/owner
          const mappedProperty: Property = {
            id: p.id,
            title: p.title,
            location: `${p.address}, ${p.city}`,
            city: p.city,
            state: "USA", // Default
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            maxGuests: p.guests,
            expectedRevenue: `$${p.price}/night`,
            status: p.status,
            image: cleanedImages[0] || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
            images: cleanedImages,
            description: p.description,
            amenities: p.amenities || [],
            houseRules: [],
            ownerId: p.ownerId, // Added ownerId
            coHost: {
              name: p.owner?.name || "Property Owner",
              email: p.owner?.email || "",
              phone: p.owner?.phone || "",
              bio: `Contact the owner for co-hosting opportunities.`,
            }
          };
          setProperty(mappedProperty);

          // Check if user has already applied
          const appliedProperties = JSON.parse(localStorage.getItem('applied_properties') || '[]');
          if (appliedProperties.includes(id)) {
            setHasApplied(true);
          }
        } else {
          setError(result.message || "Property not found");
        }
      } catch (err) {
        setError("An error occurred while fetching property details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      router.push(`/login?redirect=/properties/${id}`);
      return;
    }
    if (!id || !property) return;
    
    setIsApplying(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hostId: property.ownerId || '',
          candidateId: user.id,
          notes: `Application to manage property: ${property.title}`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setHasApplied(true);
        const appliedProperties = JSON.parse(localStorage.getItem('applied_properties') || '[]');
        localStorage.setItem('applied_properties', JSON.stringify([...appliedProperties, id]));
        toast.success('Application sent successfully!');
      } else {
        toast.error(result.error || 'Failed to send application');
      }
    } catch (error) {
      console.error('Failed to apply:', error);
      toast.error('An error occurred while sending your application');
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FBFD]">
        <Navigation />
        <main className="flex flex-col items-center justify-center pt-40">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-[hsl(195,20%,45%)]">Loading property details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !property) return notFound();

  const allImages = property.images?.length
    ? property.images
    : [property.image];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="relative z-10 pt-20 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-foreground hover:opacity-80 mb-8 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Properties
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <div className="relative">
                <PropertyImageCarousel images={allImages} title={property.title} />
                <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-medium">
                  {property.status}
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-soft">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
                  {property.title}
                </h1>
                <div className="flex items-center text-muted-foreground gap-2 mb-6">
                  <MapPin className="h-5 w-5 shrink-0" />
                  <span className="text-lg">{property.location}</span>
                </div>
                <p className="text-foreground/90 leading-relaxed text-base sm:text-lg">
                  {property.description}
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-soft">
                <h2 className="text-xl font-semibold text-foreground mb-5">
                  Property Details
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors">
                    <Bed className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground">{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors">
                    <Bath className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground">{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors">
                    <Users className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground">Up to {property.maxGuests} guests</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors">
                    <PoundSterling className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground">{property.expectedRevenue.replace('$', '£')}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-soft">
                <h2 className="text-xl font-semibold text-foreground mb-5">
                  Amenities
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {property.amenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-2 text-foreground/80"
                    >
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-soft">
                <h2 className="text-xl font-semibold text-foreground mb-5">
                  House Rules
                </h2>
                <ul className="space-y-2 text-foreground/80">
                  {property.houseRules.map((rule) => (
                    <li key={rule} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              {property.checkInInstructions && (
                <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-soft">
                  <h2 className="text-xl font-semibold text-foreground mb-5">
                    Check-in Instructions
                  </h2>
                  <p className="text-foreground/80">
                    {property.checkInInstructions}
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="p-6 rounded-2xl border border-border bg-card shadow-soft">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Management Opportunity
                  </h3>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This property is currently looking for a co-host to manage operations, 
                      guest communication, and maintenance.
                    </p>
                    
                    <Button 
                      className="w-full py-6 text-lg font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02] bg-gradient-primary text-white border-0"
                      onClick={handleApply}
                      disabled={isApplying || hasApplied}
                    >
                      {isApplying ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Applying...
                        </div>
                      ) : hasApplied ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle size={20} />
                          Applied
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send size={20} />
                          Apply to Manage
                        </div>
                      )}
                    </Button>

                    {hasApplied && (
                      <p className="text-xs text-center text-emerald-600 font-medium">
                        Your application has been sent to the owner.
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-accent/50 border border-accent shadow-soft">
                  <p className="text-sm text-foreground">
                    <strong className="text-accent-foreground">Expected revenue:</strong> {property.expectedRevenue.replace('$', '£')}
                    <br />
                    Professional co-hosts typically earn 15-25% commission on bookings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
