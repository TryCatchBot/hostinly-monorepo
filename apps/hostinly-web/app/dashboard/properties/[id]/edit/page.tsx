'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hostinly-backend.onrender.com/api';

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    guests: '',
    airbnbLink: '',
    status: '',
  });

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        const token = localStorage.getItem('hostinly_token');
        const response = await fetch(`${API_URL}/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          const p = result.data;
          setFormData({
            title: p.title || '',
            description: p.description || '',
            address: p.address || '',
            city: p.city || '',
            price: p.price?.toString() || '0',
            bedrooms: p.bedrooms?.toString() || '1',
            bathrooms: p.bathrooms?.toString() || '1',
            guests: p.guests?.toString() || '2',
            airbnbLink: p.airbnbLink || '',
            status: p.status || 'AVAILABLE',
          });
        }
      } catch (err) {
        console.error('Failed to fetch property:', err);
        setError('Failed to load property details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${API_URL}/properties/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseFloat(formData.bathrooms),
          guests: parseInt(formData.guests),
        }),
      });

      const result = await response.json();
      if (result.success) {
        router.push(`/dashboard/properties/${id}`);
      } else {
        throw new Error(result.error || 'Failed to update property');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-3xl font-bold">Edit Property</h1>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-background p-8 rounded-xl border border-border shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none min-h-[120px]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Airbnb Listing Link</label>
              <input
                type="url"
                value={formData.airbnbLink}
                onChange={(e) => setFormData({ ...formData, airbnbLink: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                placeholder="https://airbnb.com/rooms/..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price per Night ($)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="MANAGED">Managed</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bedrooms</label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bathrooms</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Max Guests</label>
                <input
                  type="number"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full py-6 text-lg font-bold"
              style={{
                background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                color: '#ffffff',
              }}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
