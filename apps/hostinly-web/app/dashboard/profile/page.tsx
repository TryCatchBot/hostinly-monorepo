'use client';
export const dynamic = "force-dynamic";

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, Upload, Edit2, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function ProfilePageContent() {
  const { user, updateUser, fetchUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (searchParams?.get('edit') === 'true') {
      setIsEditMode(true);
    }
  }, [searchParams]);

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
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
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

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

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
            
            if (typeof u.propertyTypes === 'string') {
              try {
                const parsed = JSON.parse(u.propertyTypes);
                setPropertyTypes(Array.isArray(parsed) ? parsed : [parsed]);
              } catch {
                setPropertyTypes(u.propertyTypes.split(',').map((s: string) => s.trim()).filter(Boolean));
              }
            } else if (Array.isArray(u.propertyTypes)) {
              setPropertyTypes(u.propertyTypes);
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
    if (!isEditMode) return;

    setIsLoading(true);

    if (user) {
      const isHost = String(user.userType).toUpperCase() === 'HOST';
      const isCoHostOrCleaner = ['COHOST', 'CLEANER'].includes(String(user.userType).toUpperCase());

      let onboardingCompleted = false;

      if (isHost) {
        onboardingCompleted = !!(
          proofOfOwnership &&
          uploadId &&
          monthlyIncomeTarget &&
          numberOfProperties &&
          hostingExperience &&
          dateOfBirth &&
          country &&
          address &&
          city &&
          state &&
          phone &&
          email &&
          (firstName && lastName) &&
          propertyTypes.length > 0 &&
          propertyLocations
        );
      } else if (isCoHostOrCleaner) {
        onboardingCompleted = !!(
          hasAirbnbExperience &&
          yearsOfExperience &&
          propertiesManaged &&
          servicesOffered &&
          availability &&
          areasCovered &&
          proofOfAddress &&
          uploadId &&
          dateOfBirth &&
          country &&
          address &&
          city &&
          state &&
          phone &&
          email &&
          (firstName && lastName)
        );
      }

      const updatedData: any = {
        name: `${firstName} ${lastName}`.trim(),
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth).toISOString() : null,
        uploadId,
        isOnboardingCompleted: onboardingCompleted,
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
        setIsEditMode(false);
        await fetchUser(); // Refresh global user state
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

  const isHost = String(user.userType).toUpperCase() === 'HOST';

  // Read-only View UI Components
  const DetailItem = ({ label, value }: { label: string; value: string | React.ReactNode }) => (
    <div className="py-4 border-b border-border last:border-0">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      <p className="text-base font-semibold text-foreground">{value || <span className="text-muted-foreground/40 font-normal italic">Not provided</span>}</p>
    </div>
  );

  const SectionCard = ({ title, children, icon: Icon }: { title: string; children: React.ReactNode; icon?: any }) => (
    <div className="bg-background rounded-2xl border border-border overflow-hidden shadow-soft mb-8">
      <div className="bg-muted/30 px-6 py-4 border-b border-border flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-primary" />}
        <h2 className="text-lg font-black text-foreground">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  if (!isEditMode) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black text-foreground">My Profile</h1>
            <button
              onClick={() => setIsEditMode(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg"
            >
              <Edit2 size={18} /> Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-background rounded-2xl border border-border p-8 shadow-soft text-center mb-8">
                <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black">
                  {firstName[0]}{lastName[0]}
                </div>
                <h2 className="text-xl font-black text-foreground mb-1">{firstName} {lastName}</h2>
                <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">{user.userType}</p>
                <div className="inline-flex items-center px-3 py-1 bg-muted rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                  Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <SectionCard title="Contact Info">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Upload size={14} className="text-primary rotate-180" /> {/* Simplified Icon */}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Email</p>
                      <p className="text-sm font-semibold truncate">{email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Upload size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Phone</p>
                      <p className="text-sm font-semibold">{phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>

            <div className="md:col-span-2">
              <SectionCard title="Basic Details">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  <DetailItem label="Full Name" value={`${firstName} ${lastName}`} />
                  <DetailItem label="Date of Birth" value={dateOfBirth || 'Not specified'} />
                  <DetailItem label="Country" value={country} />
                  <DetailItem label="Address" value={address ? `${address}, ${city}, ${state} ${zipCode}` : 'Not specified'} />
                </div>
              </SectionCard>

              {isHost ? (
                <SectionCard title="Property Portfolio">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                    <DetailItem label="Properties Owned" value={numberOfProperties} />
                    <DetailItem label="Hosting Experience" value={`${hostingExperience} Years`} />
                    <DetailItem label="Locations" value={propertyLocations} />
                    <DetailItem label="Income Target" value={`£${monthlyIncomeTarget}`} />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Property Types</p>
                    <div className="flex flex-wrap gap-2">
                      {propertyTypes.length > 0 ? propertyTypes.map(type => (
                        <span key={type} className="px-3 py-1 bg-primary/5 text-primary border border-primary/10 rounded-lg text-xs font-bold capitalize">
                          {type}
                        </span>
                      )) : <span className="text-muted-foreground/40 italic text-sm">None selected</span>}
                    </div>
                  </div>
                </SectionCard>
              ) : (
                <SectionCard title="Professional Profile">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                    <DetailItem label="Airbnb Experience" value={hasAirbnbExperience === 'yes' ? 'Yes' : 'No'} />
                    <DetailItem label="Years Experience" value={`${yearsOfExperience} Years`} />
                    <DetailItem label="Properties Managed" value={propertiesManaged} />
                    <DetailItem label="Availability" value={availability} />
                  </div>
                  <div className="mt-6">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Services Offered</p>
                    <p className="text-sm font-medium text-foreground bg-muted/30 p-4 rounded-xl leading-relaxed">{servicesOffered || 'No services listed'}</p>
                  </div>
                  <div className="mt-6">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Areas Covered</p>
                    <p className="text-sm font-medium text-foreground">{areasCovered || 'No areas specified'}</p>
                  </div>
                </SectionCard>
              )}

              <SectionCard title="Documents">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Identity Document</p>
                      <p className="text-sm font-semibold">{uploadId ? 'Verified ID' : 'Missing'}</p>
                    </div>
                    {uploadId && <a href={uploadId} target="_blank" className="text-primary text-xs font-bold hover:underline">View</a>}
                  </div>
                  {!isHost && (
                    <div className="p-4 border border-border rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Proof of Address</p>
                        <p className="text-sm font-semibold">{proofOfAddress ? 'Document Uploaded' : 'Missing'}</p>
                      </div>
                      {proofOfAddress && <a href={proofOfAddress} target="_blank" className="text-primary text-xs font-bold hover:underline">View</a>}
                    </div>
                  )}
                  {isHost ? (
                    <div className="p-4 border border-border rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Proof of Ownership</p>
                        <p className="text-sm font-semibold">{proofOfOwnership ? 'Document Uploaded' : 'Missing'}</p>
                      </div>
                      {proofOfOwnership && <a href={proofOfOwnership} target="_blank" className="text-primary text-xs font-bold hover:underline">View</a>}
                    </div>
                  ) : (
                    <>
                      <div className="p-4 border border-border rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Resume</p>
                          <p className="text-sm font-semibold">{resume ? 'Resume Uploaded' : 'Not Provided'}</p>
                        </div>
                        {resume && <a href={resume} target="_blank" className="text-primary text-xs font-bold hover:underline">View</a>}
                      </div>
                      <div className="p-4 border border-border rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Cover Letter</p>
                          <p className="text-sm font-semibold">{coverLetter ? 'Cover Letter Uploaded' : 'Not Provided'}</p>
                        </div>
                        {coverLetter && <a href={coverLetter} target="_blank" className="text-primary text-xs font-bold hover:underline">View</a>}
                      </div>
                    </>
                  )}
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
          
          <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
              isEditMode 
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
            }`}
          >
            {isEditMode ? (
              <><X size={18} /> Cancel</>
            ) : (
              <><Edit2 size={18} /> Edit Profile</>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Personal Information */}
          <div className="bg-background rounded-2xl border border-border p-5 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditMode}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last Name *</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditMode}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled={isEditMode || true}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-muted/50 text-muted-foreground cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditMode}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  disabled={!isEditMode}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-background rounded-2xl border border-border p-5 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Address Information</h2>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!isEditMode}
                  className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                  />
                </div>
                {(user.userType === 'cohost' || user.userType === 'cleaner') && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Postcode</label>
                    <input
                      type="text"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      disabled={!isEditMode}
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">State / Region</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Role Specific Information */}
          <div className="bg-background rounded-2xl border border-border p-5 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 text-capitalize">
              {user.userType === 'host' ? 'Property Owner Details' : `${user.userType} Details`}
            </h2>
            
            {user.userType === 'host' ? (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Number of properties owned *</label>
                    <input
                      type="number"
                      value={numberOfProperties}
                      onChange={(e) => setNumberOfProperties(e.target.value)}
                      disabled={!isEditMode}
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Years hosting experience *</label>
                    <input
                      type="number"
                      value={hostingExperience}
                      onChange={(e) => setHostingExperience(e.target.value)}
                      disabled={!isEditMode}
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Property locations *</label>
                  <input
                    type="text"
                    value={propertyLocations}
                    onChange={(e) => setPropertyLocations(e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                    placeholder="Cities / regions"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Type of properties * (Select all that apply)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {[
                      'Apartment', 'House', 'Villa', 'Studio', 'Penthouse', 'Cottage', 'Other'
                    ].map((type) => (
                      <button
                        key={type}
                        type="button"
                        disabled={!isEditMode}
                        onClick={() => {
                          setPropertyTypes(prev => 
                            prev.includes(type) 
                              ? prev.filter(t => t !== type)
                              : [...prev, type]
                          );
                        }}
                        className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-all ${
                          propertyTypes.includes(type)
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                        } disabled:opacity-60`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Current platforms used</label>
                  <input
                    type="text"
                    value={platformsUsed}
                    onChange={(e) => setPlatformsUsed(e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Uses co-host</label>
                    <select
                      value={usesCoHost}
                      onChange={(e) => setUsesCoHost(e.target.value)}
                      disabled={!isEditMode}
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Monthly income target (£) *</label>
                    <input
                      type="text"
                      value={monthlyIncomeTarget}
                      onChange={handleIncomeChange}
                      disabled={!isEditMode}
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30 font-mono"
                      placeholder="e.g. 5,000"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Has Airbnb experience *</label>
                    <select
                      value={hasAirbnbExperience}
                      onChange={(e) => setHasAirbnbExperience(e.target.value)}
                      disabled={!isEditMode}
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Years of experience *</label>
                    <input
                      type="number"
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(e.target.value)}
                      disabled={!isEditMode}
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Properties managed *</label>
                    <input
                      type="number"
                      value={propertiesManaged}
                      onChange={(e) => setPropertiesManaged(e.target.value)}
                      disabled={!isEditMode}
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Availability *</label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      disabled={!isEditMode}
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                      required
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
                  <label className="block text-sm font-medium text-foreground mb-2">Areas covered *</label>
                  <input
                    type="text"
                    value={areasCovered}
                    onChange={(e) => setAreasCovered(e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                    placeholder="Cities / regions"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Languages Spoken</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        disabled={!isEditMode}
                        onClick={() => {
                          setLanguages(prev => 
                            prev.includes(lang) 
                              ? prev.filter(l => l !== lang)
                              : [...prev, lang]
                          );
                        }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          languages.includes(lang)
                            ? 'bg-primary text-white border-primary'
                            : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                        } disabled:opacity-60`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Monthly Commission Percentage (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={commissionPercentage}
                      onChange={(e) => setCommissionPercentage(e.target.value)}
                      disabled={!isEditMode}
                      className="w-full pl-4 pr-10 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30"
                      placeholder="e.g. 15"
                      min="0"
                      max="100"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-muted-foreground font-bold">%</span>
                    </div>
                  </div>
                  <p className="mt-1.5 text-[10px] text-muted-foreground italic font-medium">This is the percentage of monthly revenue you charge for your services.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Services offered *</label>
                  <textarea
                    value={servicesOffered}
                    onChange={(e) => setServicesOffered(e.target.value)}
                    disabled={!isEditMode}
                    className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:bg-muted/30 min-h-[100px]"
                    rows={3}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Document Uploads */}
          <div className="bg-background rounded-2xl border border-border p-5 sm:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Verification Documents</h2>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Upload ID (Passport/License) *</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
                      disabled={!isEditMode}
                    />
                    <label
                      htmlFor="upload-id"
                      className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-xl transition-all ${
                        isEditMode ? 'cursor-pointer hover:bg-muted/50' : 'opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <Upload size={20} className="text-muted-foreground" />
                      <span className="text-sm font-medium">Click to upload ID</span>
                    </label>
                  </div>
                  {uploadId && (
                    <div className="flex items-center gap-2 text-green-600 self-start sm:self-center">
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
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
                          disabled={!isEditMode}
                        />
                        <label
                          htmlFor="proof-ownership"
                          className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-xl transition-all ${
                            isEditMode ? 'cursor-pointer hover:bg-muted/50' : 'opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <Upload size={20} className="text-muted-foreground" />
                          <span className="text-sm font-medium">Upload proof</span>
                        </label>
                      </div>
                      {proofOfOwnership && (
                        <div className="flex items-center gap-2 text-green-600 self-start sm:self-center">
                          <Check size={20} />
                          <span className="text-sm font-medium">Uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Business Registration (Optional)</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
                          disabled={!isEditMode}
                        />
                        <label
                          htmlFor="business-reg"
                          className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-xl transition-all ${
                            isEditMode ? 'cursor-pointer hover:bg-muted/50' : 'opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <Upload size={20} className="text-muted-foreground" />
                          <span className="text-sm font-medium">Upload registration</span>
                        </label>
                      </div>
                      {businessRegistration && (
                        <div className="flex items-center gap-2 text-green-600 self-start sm:self-center">
                          <Check size={20} />
                          <span className="text-sm font-medium">Uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Proof of Address *</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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
                          disabled={!isEditMode}
                        />
                        <label
                          htmlFor="proof-address"
                          className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-xl transition-all ${
                            isEditMode ? 'cursor-pointer hover:bg-muted/50' : 'opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <Upload size={20} className="text-muted-foreground" />
                          <span className="text-sm font-medium">Upload proof</span>
                        </label>
                      </div>
                      {proofOfAddress && (
                        <div className="flex items-center gap-2 text-green-600 self-start sm:self-center">
                          <Check size={20} />
                          <span className="text-sm font-medium">Uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Resume (Optional)</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="relative flex-1">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = await uploadFile(file);
                            if (url) setResume(url);
                          }}
                          className="hidden"
                          id="resume-upload"
                          disabled={!isEditMode}
                        />
                        <label
                          htmlFor="resume-upload"
                          className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-xl transition-all ${
                            isEditMode ? 'cursor-pointer hover:bg-muted/50' : 'opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <Upload size={20} className="text-muted-foreground" />
                          <span className="text-sm font-medium">Upload Resume</span>
                        </label>
                      </div>
                      {resume && (
                        <div className="flex items-center gap-2 text-green-600 self-start sm:self-center">
                          <Check size={20} />
                          <span className="text-sm font-medium">Uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Cover Letter (Optional)</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="relative flex-1">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const url = await uploadFile(file);
                            if (url) setCoverLetter(url);
                          }}
                          className="hidden"
                          id="cover-letter-upload"
                          disabled={!isEditMode}
                        />
                        <label
                          htmlFor="cover-letter-upload"
                          className={`flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-border rounded-xl transition-all ${
                            isEditMode ? 'cursor-pointer hover:bg-muted/50' : 'opacity-60 cursor-not-allowed'
                          }`}
                        >
                          <Upload size={20} className="text-muted-foreground" />
                          <span className="text-sm font-medium">Upload Cover Letter</span>
                        </label>
                      </div>
                      {coverLetter && (
                        <div className="flex items-center gap-2 text-green-600 self-start sm:self-center">
                          <Check size={20} />
                          <span className="text-sm font-medium">Uploaded</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isEditMode && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-12 py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                }}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Updating...
                  </div>
                ) : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="w-full sm:w-auto px-12 py-3.5 rounded-xl font-bold border border-border text-foreground hover:bg-muted transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    }>
      <ProfilePageContent />
    </Suspense>
  );
}
