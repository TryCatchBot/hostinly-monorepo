'use client';
export const dynamic = "force-dynamic";

import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  // Personal Information
  const [firstName, setFirstName] = useState((user?.name || '').split(' ')[0]);
  const [lastName, setLastName] = useState((user?.name || '').split(' ').slice(1).join(' '));
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Address Information
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [state, setState] = useState(user?.state || '');
  const [zipCode, setZipCode] = useState(user?.zipCode || '');
  const [country, setCountry] = useState(user?.country || 'United States');

  // Government ID & Verification
  const [governmentIdType, setGovernmentIdType] = useState(user?.governmentIdType || 'driver-license');
  const [governmentIdNumber, setGovernmentIdNumber] = useState(user?.governmentIdNumber || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [ssn, setSSN] = useState(user?.ssn || '');

  // Banking Information
  const [bankName, setBankName] = useState(user?.bankName || '');
  const [accountNumber, setAccountNumber] = useState(user?.accountNumber || '');
  const [routingNumber, setRoutingNumber] = useState(user?.routingNumber || '');

  // Business Information (if applicable)
  const [businessName, setBusinessName] = useState(user?.businessName || '');
  const [businessLicense, setBusinessLicense] = useState(user?.businessLicense || '');
  const [taxId, setTaxId] = useState(user?.taxId || '');

  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      const updatedUser = {
        ...user,
        name: `${firstName} ${lastName}`,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        governmentIdType,
        governmentIdNumber,
        dateOfBirth,
        ssn,
        bankName,
        accountNumber,
        routingNumber,
        businessName,
        businessLicense,
        taxId,
      };

      localStorage.setItem('hostinly_user', JSON.stringify(updatedUser));

      const users = JSON.parse(localStorage.getItem('hostinly_users') || '[]') as Array<
        { id: string } & Record<string, unknown>
      >;
      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));
      localStorage.setItem('hostinly_users', JSON.stringify(updatedUsers));

      setMessage('Profile updated successfully!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
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
                  placeholder="(555) 123-4567"
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
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="CA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">ZIP Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
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

          {/* Government ID & Verification */}
          <div className="bg-background rounded-lg border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Government ID & Verification</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Government ID Type</label>
                  <select
                    value={governmentIdType}
                    onChange={(e) => setGovernmentIdType(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="driver-license">Driver&apos;s License</option>
                    <option value="passport">Passport</option>
                    <option value="state-id">State ID</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Government ID Number</label>
                  <input
                    type="text"
                    value={governmentIdNumber}
                    onChange={(e) => setGovernmentIdNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="ID number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Social Security Number (Last 4)</label>
                  <input
                    type="password"
                    value={ssn}
                    onChange={(e) => setSSN(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Banking Information */}
          <div className="bg-background rounded-lg border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Banking Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Chase Bank"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Account Number</label>
                  <input
                    type="password"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Routing Number</label>
                  <input
                    type="password"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-background rounded-lg border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Business Information (Optional)</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Business License Number</label>
                  <input
                    type="text"
                    value={businessLicense}
                    onChange={(e) => setBusinessLicense(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="License number"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tax ID / EIN</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="XX-XXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Account Type */}
          <div className="bg-background rounded-lg border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Account Type</h2>
            <div className="px-4 py-3 border border-border rounded-lg bg-muted text-foreground capitalize font-medium">
              {user?.userType === 'host' ? 'Property Owner' : 'Co-Host'}
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
              className="px-8 py-3 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
              }}
            >
              Update Profile
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
