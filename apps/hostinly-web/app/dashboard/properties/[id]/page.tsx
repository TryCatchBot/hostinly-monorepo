'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';
import { getPropertyById, updateProperty, type Property } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, MapPin, Bed, Bath, Edit2, Trash2 } from 'lucide-react';

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [revision, setRevision] = useState(0);
  const property = useMemo(
    () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = revision;
      return getPropertyById(params.id);
    },
    [params.id, revision]
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [statusOverride, setStatusOverride] = useState<Property['status'] | null>(
    null
  );

  if (!property) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <Button
            onClick={() => router.push('/dashboard')}
            className="py-2 px-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleDelete = () => {
    // In a real app, this would call an API
    console.log('Deleting property:', property.id);
    setShowDeleteConfirm(false);
    router.push('/dashboard');
  };

  const currentStatus = statusOverride ?? property.status;

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
            <Button
              variant="outline"
              className="py-2 px-4"
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
          </div>
        </div>

        {/* Property Image */}
        <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6 border border-border">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-foreground mb-4">{property.title}</h1>

            {/* Location and Rating */}
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-muted-foreground" />
                <span className="text-muted-foreground">{property.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                <span className="font-semibold">{property.rating}</span>
                <span className="text-muted-foreground">({property.reviews} reviews)</span>
              </div>
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
                This beautiful property is located in the heart of {property.location}. With {property.bedrooms} spacious bedrooms and {property.bathrooms} modern bathrooms, it is perfect for guests looking for comfort and convenience. The property features modern amenities and has consistently received excellent reviews from guests.
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nightly Rate</p>
                  <p className="text-3xl font-bold text-primary">${property.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Estimated Monthly</p>
                  <p className="text-3xl font-bold">${(property.price * 30).toLocaleString()}</p>
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
                    currentStatus === 'managing'
                      ? 'bg-green-100 text-green-700'
                      : currentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                </div>
                <div className="mt-3">
                  <select
                    value={currentStatus}
                    onChange={(e) => {
                      const nextStatus = e.target.value as Property['status'];
                      setStatusOverride(nextStatus);
                      updateProperty(property.id, { status: nextStatus });
                      setRevision((r) => r + 1);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="managing">Managing</option>
                    <option value="available">Available</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full py-3"
                  style={{
                    background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                    color: '#ffffff',
                  }}
                >
                  Contact Manager
                </Button>
                <Button variant="outline" className="w-full py-3">
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
          <div className="bg-background rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-2">Delete Property?</h2>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete {property.title}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 py-2"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 py-2"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
