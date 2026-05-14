'use client';

import { useState } from 'react';
import { X, Upload, Trash2, Star } from 'lucide-react';
import type { Property } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (property: Property) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export default function AddPropertyModal({ isOpen, onClose, onAdd }: AddPropertyModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [listForm, setListForm] = useState({
    property_title: '',
    property_type: '',
    full_address: '',
    city: '',
    postcode: '',
    number_of_bedrooms: '',
    number_of_bathrooms: '',
    maximum_guest_capacity: '',
    is_listed_on_airbnb: '',
    airbnb_listing_link: '',
    expected_monthly_bookings: '',
    preferred_commission_structure: '',
    services_required: '',
    upload_property_photos: [] as { url: string; isFavorite: boolean }[],
    upload_safety_certificates: [] as { name: string; dataUrl: string }[],
    full_name: '',
    phone_number: '',
    email_address: '',
    preferred_contact_method: '',
    agree_to_terms: false,
  });

  const readSingleFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('File read failed'));
      reader.onload = () => resolve(String(reader.result || ''));
      reader.readAsDataURL(file);
    });

  const validateStep = (s: 0 | 1 | 2 | 3 | 4) => {
    if (s === 0) {
      return Boolean(
        listForm.property_title &&
          listForm.property_type &&
          listForm.full_address &&
          listForm.city &&
          listForm.postcode
      );
    }
    if (s === 1) {
      if (
        !listForm.number_of_bedrooms ||
        !listForm.number_of_bathrooms ||
        !listForm.maximum_guest_capacity ||
        !listForm.is_listed_on_airbnb ||
        !listForm.expected_monthly_bookings ||
        !listForm.preferred_commission_structure ||
        !listForm.services_required
      ) {
        return false;
      }
      if (listForm.is_listed_on_airbnb === 'yes' && !listForm.airbnb_listing_link) {
        return false;
      }
      return true;
    }
    if (s === 2) {
      return listForm.upload_property_photos.length > 0;
    }
    if (s === 3) {
      return Boolean(
        listForm.full_name &&
          listForm.phone_number &&
          listForm.email_address &&
          listForm.preferred_contact_method &&
          listForm.agree_to_terms
      );
    }
    return true;
  };

  const resetForm = () => {
    setStep(0);
    setError('');
    setImageInput('');
    setListForm({
      property_title: '',
      property_type: '',
      full_address: '',
      city: '',
      postcode: '',
      number_of_bedrooms: '',
      number_of_bathrooms: '',
      maximum_guest_capacity: '',
      is_listed_on_airbnb: '',
      airbnb_listing_link: '',
      expected_monthly_bookings: '',
      preferred_commission_structure: '',
      services_required: '',
      upload_property_photos: [],
      upload_safety_certificates: [],
      full_name: '',
      phone_number: '',
      email_address: '',
      preferred_contact_method: '',
      agree_to_terms: false,
    });
  };

  const handleNext = () => {
    setError('');
    if (!validateStep(step)) {
      setError('Please fill in all required fields');
      return;
    }
    if (step === 0) setStep(1);
    else if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep(4);
  };

  const handleBack = () => {
    setError('');
    setStep((s) => {
      if (s === 0) return 0;
      if (s === 1) return 0;
      if (s === 2) return 1;
      if (s === 3) return 2;
      return 3;
    });
  };

  const handleAddPhotoUrl = () => {
    if (!imageInput.trim()) return;
    setListForm((prev) => ({
      ...prev,
      upload_property_photos: [
        ...prev.upload_property_photos,
        { url: imageInput.trim(), isFavorite: prev.upload_property_photos.length === 0 },
      ],
    }));
    setImageInput('');
  };

  const handleRemovePhoto = (index: number) => {
    setListForm((prev) => {
      const newPhotos = prev.upload_property_photos.filter((_, i) => i !== index);
      if (prev.upload_property_photos[index]?.isFavorite && newPhotos.length > 0) {
        newPhotos[0] = { ...newPhotos[0], isFavorite: true };
      }
      return { ...prev, upload_property_photos: newPhotos };
    });
  };

  const handleSetFavoritePhoto = (index: number) => {
    setListForm((prev) => ({
      ...prev,
      upload_property_photos: prev.upload_property_photos.map((p, i) => ({
        ...p,
        isFavorite: i === index,
      })),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step !== 4) {
      handleNext();
      return;
    }

    if (![0, 1, 2, 3].every((s) => validateStep(s as 0 | 1 | 2 | 3))) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const favorite = listForm.upload_property_photos.find((p) => p.isFavorite);
      const imageUrls = listForm.upload_property_photos.map((p) => p.url);
      const primaryImage =
        favorite?.url ||
        imageUrls[0] ||
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop';

      const payload = {
        title: listForm.property_title,
        description: `Type: ${listForm.property_type}. Services: ${listForm.services_required}`,
        address: listForm.full_address,
        city: listForm.city,
        price: 0,
        ownerId: user?.id,
        images: imageUrls.length > 0 ? imageUrls : [primaryImage],
        amenities: listForm.services_required.split(',').map((s) => s.trim()),
        bedrooms: parseInt(listForm.number_of_bedrooms),
        bathrooms: parseFloat(listForm.number_of_bathrooms),
        guests: parseInt(listForm.maximum_guest_capacity),
      };

      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${API_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create property');
      }

      onAdd(result.data);
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the property');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full border border-border max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <h2 className="text-xl font-bold text-foreground">List Your Property</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Step {step + 1} of 5
              </div>
              <div className="text-sm font-medium text-foreground">
                {step === 0
                  ? 'Property'
                  : step === 1
                  ? 'Details'
                  : step === 2
                  ? 'Uploads'
                  : step === 3
                  ? 'Contact'
                  : 'Review'}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm">
                {error}
              </div>
            )}

            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property title *
                  </label>
                  <input
                    type="text"
                    value={listForm.property_title}
                    onChange={(e) =>
                      setListForm((p) => ({ ...p, property_title: e.target.value }))
                    }
                    placeholder="Property title"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property type *
                  </label>
                  <input
                    type="text"
                    value={listForm.property_type}
                    onChange={(e) =>
                      setListForm((p) => ({ ...p, property_type: e.target.value }))
                    }
                    placeholder="Apartment, house, villa..."
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full address *
                  </label>
                  <input
                    type="text"
                    value={listForm.full_address}
                    onChange={(e) =>
                      setListForm((p) => ({ ...p, full_address: e.target.value }))
                    }
                    placeholder="Address"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={listForm.city}
                      onChange={(e) =>
                        setListForm((p) => ({ ...p, city: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Postcode *
                    </label>
                    <input
                      type="text"
                      value={listForm.postcode}
                      onChange={(e) =>
                        setListForm((p) => ({ ...p, postcode: e.target.value }))
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Bedrooms *
                    </label>
                    <input
                      type="number"
                      value={listForm.number_of_bedrooms}
                      onChange={(e) =>
                        setListForm((p) => ({
                          ...p,
                          number_of_bedrooms: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Bathrooms *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={listForm.number_of_bathrooms}
                      onChange={(e) =>
                        setListForm((p) => ({
                          ...p,
                          number_of_bathrooms: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Max guests *
                    </label>
                    <input
                      type="number"
                      value={listForm.maximum_guest_capacity}
                      onChange={(e) =>
                        setListForm((p) => ({
                          ...p,
                          maximum_guest_capacity: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Listed on Airbnb *
                    </label>
                    <select
                      value={listForm.is_listed_on_airbnb}
                      onChange={(e) =>
                        setListForm((p) => ({
                          ...p,
                          is_listed_on_airbnb: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Airbnb listing link
                    </label>
                    <input
                      type="url"
                      value={listForm.airbnb_listing_link}
                      onChange={(e) =>
                        setListForm((p) => ({
                          ...p,
                          airbnb_listing_link: e.target.value,
                        }))
                      }
                      placeholder="https://airbnb.com/..."
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      disabled={listForm.is_listed_on_airbnb !== 'yes'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Expected monthly bookings *
                    </label>
                    <input
                      type="number"
                      value={listForm.expected_monthly_bookings}
                      onChange={(e) =>
                        setListForm((p) => ({
                          ...p,
                          expected_monthly_bookings: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preferred commission structure *
                    </label>
                    <input
                      type="text"
                      value={listForm.preferred_commission_structure}
                      onChange={(e) =>
                        setListForm((p) => ({
                          ...p,
                          preferred_commission_structure: e.target.value,
                        }))
                      }
                      placeholder="e.g. 15% per booking"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Services required *
                  </label>
                  <textarea
                    value={listForm.services_required}
                    onChange={(e) =>
                      setListForm((p) => ({
                        ...p,
                        services_required: e.target.value,
                      }))
                    }
                    rows={3}
                    placeholder="Cleaning, check-ins, guest communication..."
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Upload property photos *
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={imageInput}
                          onChange={(e) => setImageInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddPhotoUrl();
                            }
                          }}
                          placeholder="https://example.com/image.jpg"
                          className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={handleAddPhotoUrl}
                          className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-white transition-opacity hover:opacity-90"
                          style={{
                            background:
                              'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                          }}
                        >
                          <Upload size={16} />
                        </button>
                      </div>

                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={async (e) => {
                          const files = e.target.files ? Array.from(e.target.files) : [];
                          if (files.length === 0) return;
                          const dataUrls = await Promise.all(
                            files.map((f) => readSingleFileAsDataUrl(f))
                          );
                          setListForm((prev) => ({
                            ...prev,
                            upload_property_photos: [
                              ...prev.upload_property_photos,
                              ...dataUrls.map((url, idx) => ({
                                url,
                                isFavorite:
                                  prev.upload_property_photos.length === 0 && idx === 0,
                              })),
                            ],
                          }));
                          e.target.value = '';
                        }}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                      />

                      {listForm.upload_property_photos.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-3">
                            Photos (select favorite)
                          </p>
                          <div className="grid grid-cols-4 gap-3 max-h-80 overflow-y-auto pb-2">
                            {listForm.upload_property_photos.map((photo, index) => (
                              <div key={index} className="relative group">
                                <div className="bg-muted rounded-lg overflow-hidden border border-border hover:border-primary transition-colors">
                                  <img
                                    src={photo.url}
                                    alt={`photo-${index}`}
                                    className="w-full h-24 object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        'https://via.placeholder.com/96?text=Invalid';
                                    }}
                                  />
                                  {photo.isFavorite && (
                                    <div className="absolute top-1 right-1 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                                      ★
                                    </div>
                                  )}
                                </div>
                                <div className="mt-2 space-y-2">
                                  <button
                                    type="button"
                                    onClick={() => handleSetFavoritePhoto(index)}
                                    className={`w-full p-1 text-sm rounded transition-colors ${
                                      photo.isFavorite
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-muted text-muted-foreground hover:bg-yellow-100 hover:text-yellow-600'
                                    }`}
                                  >
                                    <Star size={14} className="inline mr-1" />
                                    Favorite
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(index)}
                                    className="w-full p-1 text-sm rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                  >
                                    <Trash2 size={14} className="inline mr-1" />
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground mt-3">
                            {listForm.upload_property_photos.length} photo(s) added
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Upload safety certificates
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*,application/pdf"
                      onChange={async (e) => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        if (files.length === 0) return;
                        const items = await Promise.all(
                          files.map(async (f) => ({
                            name: f.name,
                            dataUrl: await readSingleFileAsDataUrl(f),
                          }))
                        );
                        setListForm((prev) => ({
                          ...prev,
                          upload_safety_certificates: [
                            ...prev.upload_safety_certificates,
                            ...items,
                          ],
                        }));
                        e.target.value = '';
                      }}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {listForm.upload_safety_certificates.length} file(s) added
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full name *
                  </label>
                  <input
                    type="text"
                    value={listForm.full_name}
                    onChange={(e) =>
                      setListForm((p) => ({ ...p, full_name: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone number *
                  </label>
                  <input
                    type="tel"
                    value={listForm.phone_number}
                    onChange={(e) =>
                      setListForm((p) => ({ ...p, phone_number: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email address *
                  </label>
                  <input
                    type="email"
                    value={listForm.email_address}
                    onChange={(e) =>
                      setListForm((p) => ({ ...p, email_address: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Preferred contact method *
                  </label>
                  <select
                    value={listForm.preferred_contact_method}
                    onChange={(e) =>
                      setListForm((p) => ({
                        ...p,
                        preferred_contact_method: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select...</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
                <label className="flex items-start gap-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={listForm.agree_to_terms}
                    onChange={(e) =>
                      setListForm((p) => ({
                        ...p,
                        agree_to_terms: e.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4"
                  />
                  <span>Agree to terms *</span>
                </label>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-foreground">Property</div>
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => setStep(0)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                    <div>{listForm.property_title}</div>
                    <div>{listForm.property_type}</div>
                    <div>{listForm.full_address}</div>
                    <div>
                      {listForm.city} {listForm.postcode}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-foreground">Details</div>
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => setStep(1)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                    <div>Bedrooms: {listForm.number_of_bedrooms}</div>
                    <div>Bathrooms: {listForm.number_of_bathrooms}</div>
                    <div>Max guests: {listForm.maximum_guest_capacity}</div>
                    <div>Airbnb listed: {listForm.is_listed_on_airbnb}</div>
                    <div>Bookings/mo: {listForm.expected_monthly_bookings}</div>
                    <div>Commission: {listForm.preferred_commission_structure}</div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    Services: {listForm.services_required}
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-foreground">Uploads</div>
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => setStep(2)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                    <div>Photos: {listForm.upload_property_photos.length}</div>
                    <div>Safety certificates: {listForm.upload_safety_certificates.length}</div>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-foreground">Contact</div>
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => setStep(3)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                    <div>{listForm.full_name}</div>
                    <div>{listForm.phone_number}</div>
                    <div>{listForm.email_address}</div>
                    <div>Preferred contact: {listForm.preferred_contact_method}</div>
                    <div>Agreed to terms: {listForm.agree_to_terms ? 'yes' : 'no'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 p-6 border-t border-border flex-shrink-0 bg-background">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 px-4 py-2 rounded-lg font-medium border border-border text-foreground hover:bg-muted transition-colors"
              disabled={step === 0}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                background:
                  'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
              }}
            >
              {step === 4 ? (isSubmitting ? 'Listing...' : 'List My Property') : 'Next Step'}
            </button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="hidden sm:inline-flex flex-1 px-4 py-2 rounded-lg font-medium border border-border text-foreground hover:bg-muted transition-colors items-center justify-center"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
