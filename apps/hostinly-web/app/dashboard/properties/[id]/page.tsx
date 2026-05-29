'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';
import { type Property } from '@/lib/provideData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, MapPin, Bed, Bath, Edit2, Trash2, AlertTriangle, Send, CheckCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import PropertyImageCarousel from '@/components/PropertyImageCarousel';
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3333/api"

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id;
  
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        const token = localStorage.getItem('hostinly_token');
        const response = await fetch(`${BASE_URL}/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          const p = result.data;
          const trimmedImages = (p.images || []).map((img: string) => img.trim().replace(/^`|`$/g, ''));
          setProperty({
            id: p.id,
            title: p.title,
            location: `${p.address}, ${p.city}`,
            price: p.price,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            image: trimmedImages[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop',
            images: trimmedImages,
            rating: 4.5,
            reviews: 0,
            status: p.status.toLowerCase(),
            ownerId: p.ownerId,
            description: p.description,
            airbnbLink: p.airbnbLink,
          });

          // Check if user has already applied (this would usually be a backend check)
          // For now, we'll check local storage or a mock check
          const appliedProperties = JSON.parse(localStorage.getItem('applied_properties') || '[]');
          if (appliedProperties.includes(id)) {
            setHasApplied(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch property:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!property) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <Button
            onClick={() => router.push('/dashboard/properties')}
            className="py-2 px-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${BASE_URL}/properties/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        router.push('/dashboard/properties');
      } else {
        alert(result.error || 'Failed to delete property');
      }
    } catch (error) {
      console.error('Failed to delete property:', error);
      alert('An error occurred while deleting the property');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleApply = async () => {
    if (!user || !id) return;
    setIsApplying(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      // Create an interview request as an application
      const response = await fetch(`${BASE_URL}/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hostId: property.ownerId || '', // We need ownerId here
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

  const currentStatus = property.status;
  const isStaff = user?.userType === 'cohost' || user?.userType === 'cleaner';
  const isHost = user?.userType === 'host';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="flex gap-3">
            {isHost && (
              <>
                <Button
                  variant="outline"
                  className="py-2 px-4"
                  onClick={() => router.push(`/dashboard/properties/${id}/edit`)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="py-2 px-4"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Property Slideshow */}
        <div className="mb-6">
          <PropertyImageCarousel
            images={property.images || [property.image]}
            title={property.title}
          />
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-foreground mb-4">{property.title}</h1>

            {/* Location and Rating */}
            <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-muted-foreground" />
                <span className="text-muted-foreground">{property.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{property.rating}</span>
                <span className="text-muted-foreground">({property.reviews} reviews)</span>
              </div>
              {property.airbnbLink && (
                <a 
                  href={property.airbnbLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline font-bold text-sm"
                >
                  <ExternalLink size={16} />
                  View on Airbnb
                </a>
              )}
            </div>

            {/* Property Features */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Bedrooms</p>
                <div className="flex items-center gap-2">
                  <Bed size={24} className="text-primary" />
                  <p className="text-2xl font-bold">{property.bedrooms}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Bathrooms</p>
                <div className="flex items-center gap-2">
                  <Bath size={24} className="text-primary" />
                  <p className="text-2xl font-bold">{property.bathrooms}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About this property</h2>
              <p className="text-muted-foreground leading-relaxed">
                {property.description || `This beautiful property is located in the heart of ${property.location}. With ${property.bedrooms} spacious bedrooms and ${property.bathrooms} modern bathrooms, it is perfect for guests looking for comfort and convenience.`}
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nightly Rate</p>
                  <p className="text-3xl font-bold text-primary">£{property.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estimated Monthly</p>
                  <p className="text-3xl font-bold">£{(property.price * 30).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-background rounded-lg border border-border p-6 sticky top-8">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    currentStatus === 'managed' || currentStatus === 'managing'
                      ? 'bg-green-100 text-green-700'
                      : currentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                </div>
              </div>

              <div className="space-y-4">
                {isStaff && (
                  <Button
                    className="w-full py-4 text-lg font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02]"
                    style={{
                      background: hasApplied 
                        ? 'hsl(142, 76%, 36%)' 
                        : 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                      color: '#ffffff',
                    }}
                    onClick={handleApply}
                    disabled={isApplying || hasApplied}
                  >
                    {isApplying ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                )}

                {isHost && (
                  <Button
                    className="w-full py-3"
                    style={{
                      background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                      color: '#ffffff',
                    }}
                  >
                    Contact Manager
                  </Button>
                )}
                
                <Button variant="outline" className="w-full py-3 font-semibold">
                  View Analytics
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full border border-border shadow-xl">
            <div className="flex items-center gap-3 text-destructive mb-4">
              <AlertTriangle size={24} />
              <h2 className="text-xl font-bold">Danger Zone</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete <span className="font-semibold text-foreground">{property.title}</span>? This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 py-2"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 py-2"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Forever'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
