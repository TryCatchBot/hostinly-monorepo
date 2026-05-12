'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Check } from 'lucide-react';
import { toast } from 'sonner';

type PropertyOwnerRegistrationForm = {
  full_name: string;
  date_of_birth: string;
  phone_number: string;
  email_address: string;
  residential_address: string;
  number_of_properties_owned: string;
  property_locations: string;
  type_of_properties: string;
  years_hosting_experience: string;
  current_platforms_used: string;
  monthly_income_target: string;
  uses_co_host: string;
  support_required: string;
  upload_id: string;
  proof_of_property_ownership: string;
  business_registration: string;
  confirm_information_accuracy: boolean;
  agree_to_terms: boolean;
};

type CoHostApplicationForm = {
  full_name: string;
  phone_number: string;
  email_address: string;
  city: string;
  postcode: string;
  has_airbnb_experience: string;
  years_of_experience: string;
  number_of_properties_managed: string;
  platforms_used: string;
  average_review_rating: string;
  services_offered: string;
  availability: string;
  areas_covered: string;
  upload_id: string;
  proof_of_address: string;
  references: string;
  insurance: string;
  approval_reason: string;
  agree_to_background_checks: boolean;
  agree_to_terms: boolean;
};

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, isLoading } = useAuth();
  const roleParam = searchParams?.get('role');
  const initialRole: 'host' | 'cohost' =
    roleParam === 'cohost' ? 'cohost' : 'host';
  const [step, setStep] = useState<0 | 1 | 2 | 3>(roleParam ? 1 : 0);
  const [account, setAccount] = useState({
    full_name: '',
    phone_number: '',
    email_address: '',
    password: '',
    confirmPassword: '',
    userType: initialRole as 'host' | 'cohost',
  });
  const isRoleFixed = !!roleParam;

  const [propertyOwnerRegistrationForm, setPropertyOwnerRegistrationForm] =
    useState<PropertyOwnerRegistrationForm>({
      full_name: '',
      date_of_birth: '',
      phone_number: '',
      email_address: '',
      residential_address: '',
      number_of_properties_owned: '',
      property_locations: '',
      type_of_properties: '',
      years_hosting_experience: '',
      current_platforms_used: '',
      monthly_income_target: '',
      uses_co_host: '',
      support_required: '',
      upload_id: '',
      proof_of_property_ownership: '',
      business_registration: '',
      confirm_information_accuracy: false,
      agree_to_terms: false,
    });
  const [coHostApplicationForm, setCoHostApplicationForm] =
    useState<CoHostApplicationForm>({
      full_name: '',
      phone_number: '',
      email_address: '',
      city: '',
      postcode: '',
      has_airbnb_experience: '',
      years_of_experience: '',
      number_of_properties_managed: '',
      platforms_used: '',
      average_review_rating: '',
      services_offered: '',
      availability: '',
      areas_covered: '',
      upload_id: '',
      proof_of_address: '',
      references: '',
      insurance: '',
      approval_reason: '',
      agree_to_background_checks: false,
      agree_to_terms: false,
    });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const readSingleFileAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('File read failed'));
      reader.onload = () => resolve(String(reader.result || ''));
      reader.readAsDataURL(file);
    });

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

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, '');
    if (!number) return '';
    return new Intl.NumberFormat('en-GB').format(parseInt(number));
  };

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
      return;
    }

    if (step === 1) {
      if (
        !account.full_name ||
        !account.phone_number ||
        !account.email_address ||
        !account.password ||
        !account.confirmPassword
      ) {
        toast.error('Please fill in all fields');
        return;
      }

      if (!validatePassword(account.password)) {
        toast.error('Password must be at least 8 characters');
        return;
      }

      if (account.password !== account.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      if (account.userType === 'host') {
        setPropertyOwnerRegistrationForm((p) => ({
          ...p,
          full_name: account.full_name,
          phone_number: account.phone_number,
          email_address: account.email_address,
        }));
      } else {
        setCoHostApplicationForm((p) => ({
          ...p,
          full_name: account.full_name,
          phone_number: account.phone_number,
          email_address: account.email_address,
        }));
      }

      setStep(2);
      return;
    }

    if (step === 2) {
      if (account.userType === 'host') {
        const f = propertyOwnerRegistrationForm;
        if (
          !f.full_name ||
          !f.date_of_birth ||
          !f.phone_number ||
          !f.email_address ||
          !f.residential_address ||
          !f.number_of_properties_owned ||
          !f.property_locations ||
          !f.type_of_properties ||
          !f.years_hosting_experience ||
          !f.monthly_income_target ||
          !f.uses_co_host ||
          !f.support_required ||
          !f.upload_id ||
          !f.proof_of_property_ownership ||
          !f.confirm_information_accuracy
        ) {
          toast.error('Please complete all required fields');
          return;
        }

        if (!f.agree_to_terms) {
          toast.error('You must agree to the Terms of Service and Privacy Policy');
          return;
        }
      } else {
        const f = coHostApplicationForm;
        if (
          !f.full_name ||
          !f.phone_number ||
          !f.email_address ||
          !f.city ||
          !f.postcode ||
          !f.has_airbnb_experience ||
          !f.years_of_experience ||
          !f.number_of_properties_managed ||
          !f.platforms_used ||
          !f.average_review_rating ||
          !f.services_offered ||
          !f.availability ||
          !f.areas_covered ||
          !f.upload_id ||
          !f.proof_of_address ||
          !f.approval_reason ||
          !f.agree_to_background_checks
        ) {
          toast.error('Please complete all required fields');
          return;
        }

        if (!f.agree_to_terms) {
          toast.error('You must agree to the Terms of Service and Privacy Policy');
          return;
        }
      }

      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    if (step === 1 && roleParam) {
      router.push('/login');
      return;
    }
    setStep((s) => {
      if (s === 0) return 0;
      if (s === 1) return 0;
      if (s === 2) return 1;
      return 2;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step !== 3) {
      handleNext();
      return;
    }

    try {
      const additionalData = account.userType === 'host' 
        ? {
            dateOfBirth: propertyOwnerRegistrationForm.date_of_birth,
            numberOfProperties: parseInt(propertyOwnerRegistrationForm.number_of_properties_owned),
            hostingExperience: parseInt(propertyOwnerRegistrationForm.years_hosting_experience),
            propertyLocations: propertyOwnerRegistrationForm.property_locations,
            propertyTypes: propertyOwnerRegistrationForm.type_of_properties,
            platformsUsed: propertyOwnerRegistrationForm.current_platforms_used,
            monthlyIncomeTarget: propertyOwnerRegistrationForm.monthly_income_target,
            usesCoHost: propertyOwnerRegistrationForm.uses_co_host === 'yes',
            supportRequired: propertyOwnerRegistrationForm.support_required,
            address: propertyOwnerRegistrationForm.residential_address,
            phone: account.phone_number,
            uploadId: propertyOwnerRegistrationForm.upload_id,
            proofOfOwnership: propertyOwnerRegistrationForm.proof_of_property_ownership,
            businessRegistration: propertyOwnerRegistrationForm.business_registration,
          }
        : {
            city: coHostApplicationForm.city,
            postcode: coHostApplicationForm.postcode,
            hasAirbnbExperience: coHostApplicationForm.has_airbnb_experience === 'yes',
            yearsOfExperience: parseInt(coHostApplicationForm.years_of_experience),
            propertiesManaged: parseInt(coHostApplicationForm.number_of_properties_managed),
            servicesOffered: coHostApplicationForm.services_offered,
            availability: coHostApplicationForm.availability,
            areasCovered: coHostApplicationForm.areas_covered,
            phone: account.phone_number,
            uploadId: coHostApplicationForm.upload_id,
            proofOfAddress: coHostApplicationForm.proof_of_address,
          };

      await signup(
        account.email_address,
        account.password,
        account.full_name,
        account.userType,
        additionalData
      );

      toast.success('Account created successfully!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sign up failed');
    }
  };

  const passwordValid = account.password && validatePassword(account.password);
  const passwordsMatch =
    account.password &&
    account.confirmPassword &&
    account.password === account.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/hostinly-logo.png"
              alt="Hostinly"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold text-primary">Hostinly</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-background rounded-lg shadow-medium p-8 border border-border">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {step === 0
              ? 'Choose your role'
              : step === 1
              ? 'Create your account'
              : step === 2
              ? account.userType === 'host'
                ? 'Property Owner Registration Form'
                : 'Co-Host Application Form'
              : 'Review & submit'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {step === 0
              ? 'Tell us what you want to do on Hostinly.'
              : step === 1
              ? 'Create your login details.'
              : step === 2
              ? 'A few details to personalize your experience.'
              : 'Confirm your details before creating your account.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 0 && (
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setAccount((p) => ({ ...p, userType: 'host' }))
                  }
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    account.userType === 'host'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="font-semibold text-foreground mb-1">
                    Property Owner
                  </div>
                  <div className="text-sm text-muted-foreground">
                    List a property and find trusted co-hosts.
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAccount((p) => ({ ...p, userType: 'cohost' }))
                  }
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    account.userType === 'cohost'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/40'
                  }`}
                >
                  <div className="font-semibold text-foreground mb-1">
                    Co-Host
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Apply to manage properties and earn.
                  </div>
                </button>
              </div>
            )}

            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={account.full_name}
                    onChange={(e) =>
                      setAccount((p) => ({ ...p, full_name: e.target.value }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={account.phone_number}
                    onChange={(e) =>
                      setAccount((p) => ({
                        ...p,
                        phone_number: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="+44 7..."
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={account.email_address}
                    onChange={(e) =>
                      setAccount((p) => ({
                        ...p,
                        email_address: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="you@example.com"
                    disabled={isLoading}
                  />
                </div>

                {!isRoleFixed && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Account Type
                    </label>
                    <select
                      value={account.userType}
                      onChange={(e) =>
                        setAccount((p) => ({
                          ...p,
                          userType: e.target.value as 'host' | 'cohost',
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      disabled={isLoading}
                    >
                      <option value="host">Property Owner (Host)</option>
                      <option value="cohost">Co-Host / Property Manager</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={account.password}
                      onChange={(e) =>
                        setAccount((p) => ({
                          ...p,
                          password: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      passwordValid ? 'text-green-600' : 'text-muted-foreground'
                    }`}
                  >
                    {passwordValid && <Check size={14} />}
                    At least 8 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={account.confirmPassword}
                      onChange={(e) =>
                        setAccount((p) => ({
                          ...p,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  <p
                    className={`text-xs mt-1 flex items-center gap-1 ${
                      passwordsMatch ? 'text-green-600' : 'text-muted-foreground'
                    }`}
                  >
                    {passwordsMatch && <Check size={14} />}
                    Passwords match
                  </p>
                </div>
              </>
            )}

            {step === 2 && account.userType === 'host' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Date of birth *
                  </label>
                  <input
                    type="date"
                    value={propertyOwnerRegistrationForm.date_of_birth}
                    onChange={(e) =>
                      setPropertyOwnerRegistrationForm((p) => ({
                        ...p,
                        date_of_birth: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Residential address *
                  </label>
                  <input
                    type="text"
                    value={propertyOwnerRegistrationForm.residential_address}
                    onChange={(e) =>
                      setPropertyOwnerRegistrationForm((p) => ({
                        ...p,
                        residential_address: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="Address"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Number of properties owned *
                    </label>
                    <input
                      type="number"
                      value={
                        propertyOwnerRegistrationForm.number_of_properties_owned
                      }
                      onChange={(e) =>
                        setPropertyOwnerRegistrationForm((p) => ({
                          ...p,
                          number_of_properties_owned: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Years hosting experience *
                    </label>
                    <input
                      type="number"
                      value={propertyOwnerRegistrationForm.years_hosting_experience}
                      onChange={(e) =>
                        setPropertyOwnerRegistrationForm((p) => ({
                          ...p,
                          years_hosting_experience: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Property locations *
                  </label>
                  <input
                    type="text"
                    value={propertyOwnerRegistrationForm.property_locations}
                    onChange={(e) =>
                      setPropertyOwnerRegistrationForm((p) => ({
                        ...p,
                        property_locations: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="Cities / regions"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Type of properties *
                  </label>
                  <select
                    value={propertyOwnerRegistrationForm.type_of_properties}
                    onChange={(e) =>
                      setPropertyOwnerRegistrationForm((p) => ({
                        ...p,
                        type_of_properties: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    disabled={isLoading}
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
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Current platforms used
                  </label>
                  <input
                    type="text"
                    value={propertyOwnerRegistrationForm.current_platforms_used}
                    onChange={(e) =>
                      setPropertyOwnerRegistrationForm((p) => ({
                        ...p,
                        current_platforms_used: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="cohostmarket"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Monthly income target *
                  </label>
                  <input
                    type="text"
                    value={propertyOwnerRegistrationForm.monthly_income_target}
                    onChange={(e) =>
                      setPropertyOwnerRegistrationForm((p) => ({
                        ...p,
                        monthly_income_target: formatCurrency(e.target.value),
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="2,000,000"
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Uses co-host *
                    </label>
                    <select
                      value={propertyOwnerRegistrationForm.uses_co_host}
                      onChange={(e) =>
                        setPropertyOwnerRegistrationForm((p) => ({
                          ...p,
                          uses_co_host: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      disabled={isLoading}
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Support required *
                    </label>
                    <input
                      type="text"
                      value={propertyOwnerRegistrationForm.support_required}
                      onChange={(e) =>
                        setPropertyOwnerRegistrationForm((p) => ({
                          ...p,
                          support_required: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="Cleaning, guest messaging..."
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Upload ID *
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = await uploadFile(file);
                      if (url) {
                        setPropertyOwnerRegistrationForm((p) => ({
                          ...p,
                          upload_id: url,
                        }));
                      }
                      e.target.value = '';
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground"
                    disabled={isLoading}
                  />
                  {propertyOwnerRegistrationForm.upload_id && (
                    <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Proof of property ownership *
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = await uploadFile(file);
                      if (url) {
                        setPropertyOwnerRegistrationForm((p) => ({
                          ...p,
                          proof_of_property_ownership: url,
                        }));
                      }
                      e.target.value = '';
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground"
                    disabled={isLoading}
                  />
                  {propertyOwnerRegistrationForm.proof_of_property_ownership && (
                    <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Business registration
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const url = await uploadFile(file);
                      if (url) {
                        setPropertyOwnerRegistrationForm((p) => ({
                          ...p,
                          business_registration: url,
                        }));
                      }
                      e.target.value = '';
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground"
                    disabled={isLoading}
                  />
                  {propertyOwnerRegistrationForm.business_registration && (
                    <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>
                  )}
                </div>

                <label className="flex items-start gap-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={
                      propertyOwnerRegistrationForm.confirm_information_accuracy
                    }
                    onChange={(e) =>
                      setPropertyOwnerRegistrationForm((p) => ({
                        ...p,
                        confirm_information_accuracy: e.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4"
                    disabled={isLoading}
                  />
                  <span>Confirm information accuracy *</span>
                </label>

                <label className="flex items-start gap-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={propertyOwnerRegistrationForm.agree_to_terms}
                    onChange={(e) =>
                      setPropertyOwnerRegistrationForm((p) => ({
                        ...p,
                        agree_to_terms: e.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4"
                    disabled={isLoading}
                  />
                  <span>
                    By clicking &quot;Create Account&quot;, you agree to our{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    . *
                  </span>
                </label>
              </div>
            )}

            {step === 2 && account.userType === 'cohost' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={coHostApplicationForm.city}
                      onChange={(e) =>
                        setCoHostApplicationForm((p) => ({
                          ...p,
                          city: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Postcode *
                    </label>
                    <input
                      type="text"
                      value={coHostApplicationForm.postcode}
                      onChange={(e) =>
                        setCoHostApplicationForm((p) => ({
                          ...p,
                          postcode: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Has Airbnb experience *
                    </label>
                    <select
                      value={coHostApplicationForm.has_airbnb_experience}
                      onChange={(e) =>
                        setCoHostApplicationForm((p) => ({
                          ...p,
                          has_airbnb_experience: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      disabled={isLoading}
                    >
                      <option value="">Select...</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Years of experience *
                    </label>
                    <input
                      type="number"
                      value={coHostApplicationForm.years_of_experience}
                      onChange={(e) =>
                        setCoHostApplicationForm((p) => ({
                          ...p,
                          years_of_experience: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Number of properties managed *
                    </label>
                    <input
                      type="number"
                      value={coHostApplicationForm.number_of_properties_managed}
                      onChange={(e) =>
                        setCoHostApplicationForm((p) => ({
                          ...p,
                          number_of_properties_managed: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Average review rating *
                    </label>
                    <input
                      type="text"
                      value={coHostApplicationForm.average_review_rating}
                      onChange={(e) =>
                        setCoHostApplicationForm((p) => ({
                          ...p,
                          average_review_rating: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="4.9"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Platforms used *
                  </label>
                  <input
                    type="text"
                    value={coHostApplicationForm.platforms_used}
                    onChange={(e) =>
                      setCoHostApplicationForm((p) => ({
                        ...p,
                        platforms_used: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="Airbnb, Booking.com..."
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Services offered *
                  </label>
                  <input
                    type="text"
                    value={coHostApplicationForm.services_offered}
                    onChange={(e) =>
                      setCoHostApplicationForm((p) => ({
                        ...p,
                        services_offered: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="Cleaning, check-ins..."
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Availability *
                    </label>
                    <input
                      type="text"
                      value={coHostApplicationForm.availability}
                      onChange={(e) =>
                        setCoHostApplicationForm((p) => ({
                          ...p,
                          availability: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="Weekdays, weekends..."
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Areas covered *
                    </label>
                    <input
                      type="text"
                      value={coHostApplicationForm.areas_covered}
                      onChange={(e) =>
                        setCoHostApplicationForm((p) => ({
                          ...p,
                          areas_covered: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      placeholder="Zones / neighborhoods"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Upload ID *
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const dataUrl = await readSingleFileAsDataUrl(file);
                      setCoHostApplicationForm((p) => ({
                        ...p,
                        upload_id: dataUrl,
                      }));
                      e.target.value = '';
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Proof of address *
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const dataUrl = await readSingleFileAsDataUrl(file);
                      setCoHostApplicationForm((p) => ({
                        ...p,
                        proof_of_address: dataUrl,
                      }));
                      e.target.value = '';
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    References
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const dataUrl = await readSingleFileAsDataUrl(file);
                      setCoHostApplicationForm((p) => ({
                        ...p,
                        references: dataUrl,
                      }));
                      e.target.value = '';
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Insurance
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const dataUrl = await readSingleFileAsDataUrl(file);
                      setCoHostApplicationForm((p) => ({
                        ...p,
                        insurance: dataUrl,
                      }));
                      e.target.value = '';
                    }}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Why should we approve your application? *
                  </label>
                  <textarea
                    value={coHostApplicationForm.approval_reason}
                    onChange={(e) =>
                      setCoHostApplicationForm((p) => ({
                        ...p,
                        approval_reason: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                    placeholder="Tell us about your background..."
                    disabled={isLoading}
                  />
                </div>

                <label className="flex items-start gap-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={coHostApplicationForm.agree_to_background_checks}
                    onChange={(e) =>
                      setCoHostApplicationForm((p) => ({
                        ...p,
                        agree_to_background_checks: e.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4"
                    disabled={isLoading}
                  />
                  <span>I agree to background checks *</span>
                </label>

                <label className="flex items-start gap-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={coHostApplicationForm.agree_to_terms}
                    onChange={(e) =>
                      setCoHostApplicationForm((p) => ({
                        ...p,
                        agree_to_terms: e.target.checked,
                      }))
                    }
                    className="mt-1 h-4 w-4"
                    disabled={isLoading}
                  />
                  <span>
                    By clicking &quot;Create Account&quot;, you agree to our{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    . *
                  </span>
                </label>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-muted/40 p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold text-foreground">
                    Account Information
                  </h3>
                  <div className="grid grid-cols-2 text-sm">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="text-foreground font-medium">
                      {account.full_name}
                    </span>
                    <span className="text-muted-foreground">Email:</span>
                    <span className="text-foreground font-medium">
                      {account.email_address}
                    </span>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="text-foreground font-medium capitalize">
                      {account.userType}
                    </span>
                  </div>
                </div>

                <div className="bg-muted/40 p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold text-foreground">
                    Terms & Privacy
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="text-green-600" size={16} />
                    <span>Agreed to Terms of Service and Privacy Policy</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 text-base font-semibold"
              >
                {isLoading
                  ? 'Processing...'
                  : step === 3
                  ? 'Create Account'
                  : 'Continue'}
              </Button>

              {step > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isLoading}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition"
                >
                  Back
                </button>
              )}

              {step === 0 && (
                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="text-primary hover:underline font-medium"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
