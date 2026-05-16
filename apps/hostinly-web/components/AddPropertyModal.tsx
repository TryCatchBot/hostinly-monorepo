'use client';

import { useState } from 'react';
import { X, Upload, Trash2, Star, Loader2 } from 'lucide-react';
import type { Property } from '@/lib/provideData';
import { useAuth } from '@/context/AuthContext';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (property: Property) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export default function AddPropertyModal({ isOpen, onClose, onAdd }: AddPropertyModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
  });

  const propertyTypes = ['Apartment', 'House', 'Villa', 'Studio', 'Penthouse', 'Cottage', 'Other'];

  const validateStep = (s: 0 | 1 | 2) => {
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
  };

  const handleBack = () => {
    setError('');
    setStep((s) => {
      if (s === 0) return 0;
      if (s === 1) return 0;
      return 1;
    });
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'certificate') => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setIsUploading(true);
    setError('');
    const token = localStorage.getItem('hostinly_token');

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_URL}/uploads/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const result = await res.json();
        if (!result.success) throw new Error(result.error);
        return result.data.url;
      });

      const urls = await Promise.all(uploadPromises);

      if (type === 'photo') {
        setListForm((prev) => ({
          ...prev,
          upload_property_photos: [
            ...prev.upload_property_photos,
            ...urls.map((url, idx) => ({
              url,
              isFavorite: prev.upload_property_photos.length === 0 && idx === 0,
            })),
          ],
        }));
      } else {
        setListForm((prev) => ({
          ...prev,
          upload_safety_certificates: [
            ...prev.upload_safety_certificates,
            ...urls.map((url, idx) => ({
              name: files[idx].name,
              dataUrl: url,
            })),
          ],
        }));
      }
    } catch (err: any) {
      setError('Failed to upload images: ' + err.message);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step !== 2) {
      handleNext();
      return;
    }

    if (!validateStep(2)) {
      setError('Please upload at least one photo');
      return;
    }

    setIsSubmitting(true);
    try {
      const favorite = listForm.upload_property_photos.find((p) => p.isFavorite);
      const imageUrls = listForm.upload_property_photos.map((p) => p.url);
      const primaryImage = favorite?.url || imageUrls[0];

      const payload = {
        title: listForm.property_title,
        description: `Type: ${listForm.property_type}. Services: ${listForm.services_required}`,
        address: listForm.full_address,
        city: listForm.city,
        price: 0,
        ownerId: user?.id,
        images: imageUrls,
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

      onAdd({
        id: result.data.id,
        title: result.data.title,
        location: `${result.data.address}, ${result.data.city}`,
        price: result.data.price,
        bedrooms: result.data.bedrooms,
        bathrooms: result.data.bathrooms,
        image: primaryImage || '',
        images: imageUrls,
        rating: 4.5,
        reviews: 0,
        status: result.data.status.toLowerCase(),
        ownerId: result.data.ownerId,
      });
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
                Step {step + 1} of 3
              </div>
              <div className="text-sm font-medium text-foreground">
                {step === 0 ? 'Property Info' : step === 1 ? 'Details & Services' : 'Photos & Certificates'}
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
                    placeholder="e.g. Beautiful Sea View Villa"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property type *
                  </label>
                  <select
                    value={listForm.property_type}
                    onChange={(e) =>
                      setListForm((p) => ({ ...p, property_type: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select type...</option>
                    {propertyTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
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
                    placeholder="Street address"
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
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                <span className="font-bold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">PNG, JPG, JPEG or PDF (MAX. 5MB)</p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              multiple
                              accept="image/*,application/pdf"
                              disabled={isUploading}
                              onChange={(e) => handleFileUpload(e, 'photo')}
                            />
                          </label>
                        </div>
                        {isUploading && (
                          <div className="flex items-center gap-2 text-sm text-primary">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                          </div>
                        )}
                      </div>

                      {listForm.upload_property_photos.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-widest">
                            Photos (select favorite)
                          </p>
                          <div className="grid grid-cols-4 gap-3 max-h-80 overflow-y-auto pb-2">
                            {listForm.upload_property_photos.map((photo, index) => (
                              <div key={index} className="relative group">
                                <div className={`rounded-xl overflow-hidden border-2 transition-all ${
                                  photo.isFavorite ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'
                                }`}>
                                  {photo.url.endsWith('.pdf') ? (
                                    <div className="w-full h-24 flex items-center justify-center bg-muted text-muted-foreground flex-col gap-1">
                                      <Upload size={24} />
                                      <span className="text-[10px] font-bold">PDF Document</span>
                                    </div>
                                  ) : (
                                    <img
                                      src={photo.url}
                                      alt={`photo-${index}`}
                                      className="w-full h-24 object-cover"
                                    />
                                  )}
                                  <div className="absolute top-1 right-1 flex gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleRemovePhoto(index)}
                                      className="p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleSetFavoritePhoto(index)}
                                  className={`w-full mt-2 py-1 text-[10px] font-bold rounded-lg uppercase tracking-tighter transition-all ${
                                    photo.isFavorite
                                      ? 'bg-primary text-white'
                                      : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
                                  }`}
                                >
                                  {photo.isFavorite ? 'Primary' : 'Set Primary'}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Upload safety certificates
                    </label>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2 px-4 py-3 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                        <Upload size={18} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Select certificates...</span>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*,application/pdf"
                          disabled={isUploading}
                          onChange={(e) => handleFileUpload(e, 'certificate')}
                        />
                      </label>
                      <div className="space-y-2">
                        {listForm.upload_safety_certificates.map((cert, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg border border-border text-xs">
                            <span className="truncate flex-1 font-medium">{cert.name}</span>
                            <button
                              type="button"
                              onClick={() => setListForm(prev => ({
                                ...prev,
                                upload_safety_certificates: prev.upload_safety_certificates.filter((_, i) => i !== idx)
                              }))}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 p-6 border-t border-border flex-shrink-0 bg-background">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 px-4 py-2 rounded-lg font-bold border-2 border-border text-foreground hover:bg-muted transition-colors disabled:opacity-30"
              disabled={step === 0}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-[2] px-4 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 shadow-lg active:scale-95"
              style={{
                background:
                  'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
              }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                step === 2 ? 'List My Property' : 'Next Step'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
