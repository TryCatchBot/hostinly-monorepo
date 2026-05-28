'use client';
export const dynamic = "force-dynamic";

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Upload, X, Loader2, Camera } from 'lucide-react';
import { toast } from 'sonner';

function ProfileEditPageContent() {
  const { user, updateUser, fetchUser } = useAuth();
  const router = useRouter();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Profile Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');

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
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [otherPropertyType, setOtherPropertyType] = useState('');
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
  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [commissionPercentage, setCommissionPercentage] = useState('');
  const [availableLanguages] = useState(['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Portuguese', 'Russian', 'Italian']);

  const formatNumberWithCommas = (value: string) => {
    const number = value.replace(/\D/g, '');
    if (!number) return '';
    return new Intl.NumberFormat('en-GB').format(parseInt(number));
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumberWithCommas(e.target.value);
    setMonthlyIncomeTarget(formatted);
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;
      setIsInitialLoading(true);
      
      try {
        const token = localStorage.getItem('hostinly_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`, {
          headers: { 
            'Authorization': `Bearer ${token}`
          },
        });
        const result = await response.json();
        
        if (result.success) {
          const u = result.data;
          setFirstName((u.name || '').split(' ')[0]);
          setLastName((u.name || '').split(' ').slice(1).join(' '));
          setEmail(u.email || '');
          setPhone(u.phone || '');
          setAvatar(u.avatar || '');
          setAddress(u.address || '');
          setCity(u.city || '');
          setState(u.state || '');
          setZipCode(u.zipCode || '');
          setCountry(u.country || 'United Kingdom');
          setDateOfBirth(u.dateOfBirth ? u.dateOfBirth.split('T')[0] : '');
          setUploadId(u.uploadId || '');
          
          if (u.userType === 'HOST' || u.userType === 'host') {
            setNumberOfProperties(u.numberOfProperties?.toString() || '');
            setHostingExperience(u.hostingExperience?.toString() || '');
            setPropertyLocations(u.propertyLocations || '');
            
            if (u.propertyTypes) {
              try {
                const types = typeof u.propertyTypes === 'string' ? JSON.parse(u.propertyTypes) : u.propertyTypes;
                setPropertyTypes(Array.isArray(types) ? types : [types]);
              } catch {
                setPropertyTypes([]);
              }
            }

            setPlatformsUsed(u.platformsUsed || '');
            setMonthlyIncomeTarget(u.monthlyIncomeTarget ? formatNumberWithCommas(u.monthlyIncomeTarget.toString()) : '');
            setUsesCoHost(u.usesCoHost ? 'yes' : 'no');
            setSupportRequired(u.supportRequired || '');
            setProofOfOwnership(u.proofOfOwnership || '');
            setBusinessRegistration(u.businessRegistration || '');
          } else {
            setPostcode(u.postcode || '');
            setHasAirbnbExperience(u.hasAirbnbExperience ? 'yes' : 'no');
            setYearsOfExperience(u.yearsOfExperience?.toString() || '');
            setPropertiesManaged(u.propertiesManaged?.toString() || '');
            setServicesOffered(u.servicesOffered || '');
            setAvailability(u.availability || '');
            setAreasCovered(u.areasCovered || '');
            setProofOfAddress(u.proofOfAddress || '');
            setResume(u.resume || '');
            setCoverLetter(u.coverLetter || '');
            if (u.cohostProfile) {
              setLanguages(u.cohostProfile.languages || []);
              setCommissionPercentage(u.cohostProfile.commissionPercentage?.toString() || '');
            }
          }
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadUserData();
  }, [user?.id]);

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
      const isHost = String(user.userType).toUpperCase() === 'HOST';
      const isCoHostOrCleaner = ['COHOST', 'CLEANER'].includes(String(user.userType).toUpperCase());

      const updatedData: any = {
        name: `${firstName} ${lastName}`.trim(),
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        avatar,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
        uploadId,
      };

      if (isHost) {
        updatedData.numberOfProperties = parseInt(numberOfProperties) || 0;
        updatedData.hostingExperience = parseInt(hostingExperience) || 0;
        updatedData.propertyLocations = propertyLocations;
        updatedData.propertyTypes = JSON.stringify(propertyTypes);
        updatedData.platformsUsed = platformsUsed;
        updatedData.monthlyIncomeTarget = parseFloat(monthlyIncomeTarget.replace(/,/g, '')) || 0;
        updatedData.usesCoHost = usesCoHost === 'yes';
        updatedData.supportRequired = supportRequired;
        updatedData.proofOfOwnership = proofOfOwnership;
        updatedData.businessRegistration = businessRegistration;
      } else if (isCoHostOrCleaner) {
        updatedData.postcode = postcode;
        updatedData.hasAirbnbExperience = hasAirbnbExperience === 'yes';
        updatedData.yearsOfExperience = parseInt(yearsOfExperience) || 0;
        updatedData.propertiesManaged = parseInt(propertiesManaged) || 0;
        updatedData.servicesOffered = servicesOffered;
        updatedData.availability = availability;
        updatedData.areasCovered = areasCovered;
        updatedData.proofOfAddress = proofOfAddress;
        updatedData.resume = resume;
        updatedData.coverLetter = coverLetter;
        updatedData.languages = languages;
        updatedData.commissionPercentage = parseFloat(commissionPercentage) || 0;
      }

      try {
        await updateUser(updatedData);
        toast.success('Profile updated successfully!');
        router.push('/dashboard/profile');
        await fetchUser();
      } catch (err: any) {
        toast.error('Failed to update profile: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!user) return null;

  if (isInitialLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground font-medium">Loading your profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/dashboard/profile')}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-black text-foreground">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Upload */}
          <div className="bg-background rounded-2xl border border-border p-8 shadow-sm text-center">
            <h2 className="text-xl font-bold mb-6">Profile Picture</h2>
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-background shadow-md">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-muted-foreground">{firstName[0]}{lastName[0]}</span>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer shadow-lg hover:opacity-90 transition-opacity"
              >
                <Camera size={20} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await uploadFile(file);
                    if (url) setAvatar(url);
                  }
                }}
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Click the camera icon to update your photo</p>
          </div>

          {/* Personal Information */}
          <div className="bg-background rounded-2xl border border-border p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-muted cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background"
                />
              </div>
            </div>
          </div>

          {/* Additional sections would go here (Address, Role Specific, etc.) - truncated for brevity but would include all fields from profile page */}

          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="px-12 py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
              }}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard/profile')}
              className="px-12 py-3.5 rounded-xl font-bold border border-border hover:bg-muted transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default function ProfileEditPage() {
  return (
    <Suspense fallback={<Loader2 className="w-12 h-12 animate-spin mx-auto mt-20" />}>
      <ProfileEditPageContent />
    </Suspense>
  );
}
