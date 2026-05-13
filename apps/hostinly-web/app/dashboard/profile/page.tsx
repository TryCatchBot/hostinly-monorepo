'use client';
export const dynamic = "force-dynamic";

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  // Personal Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Address Information
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United Kingdom');

  // Common Fields
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [uploadId, setUploadId] = useState('');

  // Host specific
  const [numberOfProperties, setNumberOfProperties] = useState('');
  const [hostingExperience, setHostingExperience] = useState('');
  const [propertyLocations, setPropertyLocations] = useState('');
  const [propertyTypes, setPropertyTypes] = useState('');
  const [platformsUsed, setPlatformsUsed] = useState('');
  const [monthlyIncomeTarget, setMonthlyIncomeTarget] = useState('');
  const [usesCoHost, setUsesCoHost] = useState('');
  const [supportRequired, setSupportRequired] = useState('');
  const [proofOfOwnership, setProofOfOwnership] = useState('');
  const [businessRegistration, setBusinessRegistration] = useState('');

  // Co-Host specific
  const [postcode, setPostcode] = useState('');
  const [hasAirbnbExperience, setHasAirbnbExperience] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [propertiesManaged, setPropertiesManaged] = useState('');
  const [servicesOffered, setServicesOffered] = useState('');
  const [availability, setAvailability] = useState('');
  const [areasCovered, setAreasCovered] = useState('');
  const [proofOfAddress, setProofOfAddress] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFirstName((user.name || '').split(' ')[0]);
      setLastName((user.name || '').split(' ').slice(1).join(' '));
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setState(user.state || '');
      setZipCode(user.zipCode || '');
      setCountry(user.country || 'United Kingdom');
      
      // Load other fields from user object
      const u = user as any;
      setDateOfBirth(u.dateOfBirth || '');
      setUploadId(u.uploadId || '');
      
      if (user.userType === 'host') {
        setNumberOfProperties(u.numberOfProperties || '');
        setHostingExperience(u.hostingExperience || '');
        setPropertyLocations(u.propertyLocations || '');
        setPropertyTypes(u.propertyTypes || '');
        setPlatformsUsed(u.platformsUsed || '');
        setMonthlyIncomeTarget(u.monthlyIncomeTarget || '');
        setUsesCoHost(u.usesCoHost ? 'yes' : 'no');
        setSupportRequired(u.supportRequired || '');
        setProofOfOwnership(u.proofOfOwnership || '');
        setBusinessRegistration(u.businessRegistration || '');
      } else {
        setPostcode(u.postcode || '');
        setHasAirbnbExperience(u.hasAirbnbExperience ? 'yes' : 'no');
        setYearsOfExperience(u.yearsOfExperience || '');
        setPropertiesManaged(u.propertiesManaged || '');
        setServicesOffered(u.servicesOffered || '');
        setAvailability(u.availability || '');
        setAreasCovered(u.areasCovered || '');
        setProofOfAddress(u.proofOfAddress || '');
      }
    }
  }, [user]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/upload`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result.data.url;
    } catch (error: any) {
      toast.error('Upload failed: ' + error.message);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (user) {
      const updatedData: any = {
        name: `${firstName} ${lastName}`,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
        uploadId,
      };

      if (user.userType === 'host') {
        updatedData.numberOfProperties = parseInt(numberOfProperties) || 0;
        updatedData.hostingExperience = parseInt(hostingExperience) || 0;
        updatedData.propertyLocations = propertyLocations;
        updatedData.propertyTypes = propertyTypes;
        updatedData.platformsUsed = platformsUsed;
        updatedData.monthlyIncomeTarget = monthlyIncomeTarget;
        updatedData.usesCoHost = usesCoHost === 'yes';
        updatedData.supportRequired = supportRequired;
        updatedData.proofOfOwnership = proofOfOwnership;
        updatedData.businessRegistration = businessRegistration;
      } else if (user.userType === 'cohost' || user.userType === 'cleaner') {
        updatedData.postcode = postcode;
        updatedData.hasAirbnbExperience = hasAirbnbExperience === 'yes';
        updatedData.yearsOfExperience = parseInt(yearsOfExperience) || 0;
        updatedData.propertiesManaged = parseInt(propertiesManaged) || 0;
        updatedData.servicesOffered = servicesOffered;
        updatedData.availability = availability;
        updatedData.areasCovered = areasCovered;
        updatedData.proofOfAddress = proofOfAddress;
      }

      try {
        await updateUser(updatedData);
        
        toast.success('Profile updated successfully!');
        setMessage('Profile updated successfully!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } catch (err: any) {
        toast.error('Failed to update profile: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto pb-20">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity mb-8"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-background rounded-lg border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-background rounded-lg border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Address Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {user.userType === 'cohost' && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Postcode</label>
                    <input
                      type="text"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">State / Region</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Role Specific Information */}
          <div className="bg-background rounded-lg border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {user.userType === 'host' ? 'Property Owner Details' : user.userType === 'cleaner' ? 'Cleaner Details' : 'Co-Host Details'}
            </h2>
            
            {user.userType === 'host' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Number of properties owned</label>
                    <input
                      type="number"
                      value={numberOfProperties}
                      onChange={(e) => setNumberOfProperties(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Years hosting experience</label>
                    <input
                      type="number"
                      value={hostingExperience}
                      onChange={(e) => setHostingExperience(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Property locations</label>
                  <input
                    type="text"
                    value={propertyLocations}
                    onChange={(e) => setPropertyLocations(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Cities / regions"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Type of properties</label>
                  <select
                    value={propertyTypes}
                    onChange={(e) => setPropertyTypes(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select type...</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="condo">Condo</option>
                    <option value="studio">Studio</option>
                    <option value="penthouse">Penthouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Current platforms used</label>
                  <input
                    type="text"
                    value={platformsUsed}
                    onChange={(e) => setPlatformsUsed(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Uses co-host</label>
                    <select
                      value={usesCoHost}
                      onChange={(e) => setUsesCoHost(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Monthly income target</label>
                    <input
                      type="text"
                      value={monthlyIncomeTarget}
                      onChange={(e) => setMonthlyIncomeTarget(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Has Airbnb experience</label>
                    <select
                      value={hasAirbnbExperience}
                      onChange={(e) => setHasAirbnbExperience(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Years of experience</label>
                    <input
                      type="number"
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Properties managed</label>
                    <input
                      type="number"
                      value={propertiesManaged}
                      onChange={(e) => setPropertiesManaged(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Availability</label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select availability...</option>
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="weekends">Weekends only</option>
                      <option value="evenings">Evenings only</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Areas covered</label>
                  <input
                    type="text"
                    value={areasCovered}
                    onChange={(e) => setAreasCovered(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Cities / regions"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Services offered</label>
                  <textarea
                    value={servicesOffered}
                    onChange={(e) => setServicesOffered(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Document Uploads */}
          <div className="bg-background rounded-lg border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Verification Documents</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Upload ID (Passport/License) *</label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await uploadFile(file);
                        if (url) setUploadId(url);
                      }}
                      className="hidden"
                      id="upload-id"
                    />
                    <label
                      htmlFor="upload-id"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <Upload size={20} className="text-muted-foreground" />
                      <span className="text-sm font-medium">Click to upload ID</span>
                    </label>
                  </div>
                  {uploadId && (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check size={20} />
                      <span className="text-sm font-medium">Uploaded</span>
                    </div>
                  )}
                </div>
              </div>

              {user.userType === 'host' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Proof of Property Ownership *</label>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = await uploadFile(file);
                            if (url) setProofOfOwnership(url);
                          }}
                          className="hidden"
                          id="proof-ownership"
                        />
                        <label
                          htmlFor="proof-ownership"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <Upload size={20} className="text-muted-foreground" />
                          <span className="text-sm font-medium">Upload proof of ownership</span>
                        </label>
                      </div>
                      {proofOfOwnership && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Check size={20} />
                          <span className="text-sm font-medium">Uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Business Registration (Optional)</label>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = await uploadFile(file);
                            if (url) setBusinessRegistration(url);
                          }}
                          className="hidden"
                          id="business-reg"
                        />
                        <label
                          htmlFor="business-reg"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <Upload size={20} className="text-muted-foreground" />
                          <span className="text-sm font-medium">Upload registration</span>
                        </label>
                      </div>
                      {businessRegistration && (
                        <div className="flex items-center gap-2 text-green-600">
                          <Check size={20} />
                          <span className="text-sm font-medium">Uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Proof of Address *</label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = await uploadFile(file);
                          if (url) setProofOfAddress(url);
                        }}
                        className="hidden"
                        id="proof-address"
                      />
                      <label
                        htmlFor="proof-address"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <Upload size={20} className="text-muted-foreground" />
                        <span className="text-sm font-medium">Upload proof of address</span>
                      </label>
                    </div>
                    {proofOfAddress && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check size={20} />
                        <span className="text-sm font-medium">Uploaded</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Type (ReadOnly) */}
          <div className="bg-background rounded-lg border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Account Type</h2>
            <div className="px-4 py-3 border border-border rounded-lg bg-muted text-foreground capitalize font-medium">
              {user?.userType === 'host' ? 'Property Owner' : user?.userType === 'cleaner' ? 'Cleaner' : 'Co-Host'}
            </div>
          </div>

          {message && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
              {message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 rounded-lg font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
              }}
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 rounded-lg font-medium border border-border text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
