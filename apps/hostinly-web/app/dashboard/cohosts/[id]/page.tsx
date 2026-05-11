'use client';
export const dynamic = "force-dynamic";

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';
import {
  getAllProperties,
  getCoHostById,
  mockAvailableListings,
  updateProperty,
  type Property,
} from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, MessageSquare, Mail, Phone, Badge } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useMemo, useState } from 'react';

type HireStatus = 'active' | 'probation' | 'ended';
type HireRecord = {
  cohostId: string;
  status: HireStatus;
  hiredAt: string;
  endedAt?: string;
};

export default function CoHostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const id = params?.id;
  const isHost = user?.userType === 'host';
  const [hireRevision, setHireRevision] = useState(0);
  const [propertiesRevision, setPropertiesRevision] = useState(0);
  const cohost = id ? getCoHostById(id) : null;

  const hireKey = user ? `hostinly_hires_${user.email.toLowerCase()}` : null;
  const hires = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = hireRevision;
    if (typeof window === 'undefined') return [] as HireRecord[];
    if (!hireKey) return [] as HireRecord[];
    const raw = localStorage.getItem(hireKey);
    if (!raw) return [] as HireRecord[];
    try {
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? (parsed as HireRecord[]) : [];
    } catch {
      return [] as HireRecord[];
    }
  }, [hireKey, hireRevision]);

  const currentHire = useMemo(() => {
    return id ? hires.find((h) => h.cohostId === id) || null : null;
  }, [hires, id]);

  const hostProperties = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = propertiesRevision;
    if (!isHost) return [] as Property[];
    const all = getAllProperties();
    return all.filter((p) => !mockAvailableListings.some((a) => a.id === p.id));
  }, [isHost, propertiesRevision]);

  const writeHires = (next: HireRecord[]) => {
    if (typeof window === 'undefined') return;
    if (!hireKey) return;
    localStorage.setItem(hireKey, JSON.stringify(next));
    setHireRevision((r) => r + 1);
  };

  const hireCohost = () => {
    if (!hireKey || !id) return;
    const now = new Date().toISOString();
    const existing = hires.find((h) => h.cohostId === id);
    const nextRecord: HireRecord = {
      cohostId: id,
      status: 'active',
      hiredAt: existing?.hiredAt || now,
    };
    const next = [...hires.filter((h) => h.cohostId !== id), nextRecord];
    writeHires(next);
  };

  const endEngagement = () => {
    if (!id) return;
    const now = new Date().toISOString();
    const next = hires.map((h) =>
      h.cohostId === id
        ? { ...h, status: 'ended' as const, endedAt: now }
        : h
    );
    writeHires(next);
  };

  const setProbation = (enabled: boolean) => {
    if (!id) return;
    const next = hires.map((h) =>
      h.cohostId === id
        ? { ...h, status: enabled ? ('probation' as const) : ('active' as const) }
        : h
    );
    writeHires(next);
  };

  if (!cohost) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Co-Host not found</h1>
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Profile Card */}
            <div className="bg-background rounded-lg border border-border p-8 mb-6">
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={cohost.image}
                    alt={cohost.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-foreground mb-2">{cohost.name}</h1>
                  <p className="text-xl text-muted-foreground mb-4">{cohost.title}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Star size={20} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-lg">{cohost.rating}</span>
                      <span className="text-muted-foreground">({cohost.reviews} reviews)</span>
                    </div>
                  </div>

                  {/* Hourly Rate */}
                  {cohost.hourlyRate && (
                    <div className="text-2xl font-bold text-primary">
                      ${cohost.hourlyRate}/hour
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-background rounded-lg border border-border p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Specialties</h2>
              <div className="flex flex-wrap gap-3">
                {cohost.specialties.map((specialty, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{
                      backgroundColor: 'hsl(180, 41.50%, 90%)',
                      color: 'hsl(195, 60%, 25%)',
                    }}
                  >
                    <Badge size={16} />
                    {specialty}
                  </div>
                ))}
              </div>
            </div>

            {/* About */}
            <div className="bg-background rounded-lg border border-border p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {cohost.name} is a highly experienced property manager with a passion for providing exceptional service. With {cohost.reviews} reviews and a {cohost.rating} rating, they have proven their expertise in {cohost.specialties[0].toLowerCase()}.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Known for professionalism, quick response times, and thorough property care, {cohost.name} is an excellent choice for hosts looking to expand their portfolio.
              </p>
            </div>

            {isHost && (
              <div className="bg-background rounded-lg border border-border p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">Property Status</h2>
                <div className="space-y-3">
                  {hostProperties.map((p) => (
                    <div
                      key={p.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border rounded-lg p-4"
                    >
                      <div>
                        <div className="font-semibold text-foreground">{p.title}</div>
                        <div className="text-sm text-muted-foreground">{p.location}</div>
                      </div>
                      <select
                        value={p.status}
                        onChange={(e) => {
                          updateProperty(p.id, {
                            status: e.target.value as Property['status'],
                          });
                          setPropertiesRevision((r) => r + 1);
                        }}
                        className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-w-44"
                      >
                        <option value="pending">Pending</option>
                        <option value="managing">Managing</option>
                        <option value="available">Available</option>
                      </select>
                    </div>
                  ))}
                  {hostProperties.length === 0 && (
                    <div className="text-sm text-muted-foreground">
                      No properties found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-background rounded-lg border border-border p-6 sticky top-8 space-y-4">
              {isHost && (
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Engagement</div>
                      <div className="font-semibold text-foreground">
                        {currentHire?.status === 'active'
                          ? 'Active'
                          : currentHire?.status === 'probation'
                          ? 'Probation'
                          : currentHire?.status === 'ended'
                          ? 'Ended'
                          : 'Not hired'}
                      </div>
                    </div>
                    {currentHire?.hiredAt ? (
                      <div className="text-right text-xs text-muted-foreground">
                        Hired {new Date(currentHire.hiredAt).toLocaleDateString()}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 space-y-2">
                    {!currentHire || currentHire.status === 'ended' ? (
                      <Button
                        className="w-full"
                        style={{
                          background:
                            'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                          color: '#ffffff',
                        }}
                        onClick={hireCohost}
                      >
                        Hire Co-Host
                      </Button>
                    ) : (
                      <>
                        <Button
                          className="w-full"
                          variant="outline"
                          onClick={() =>
                            setProbation(currentHire.status !== 'probation')
                          }
                        >
                          {currentHire.status === 'probation'
                            ? 'Remove Probation'
                            : 'Put on Probation'}
                        </Button>
                        <Button
                          className="w-full"
                          variant="destructive"
                          onClick={endEngagement}
                        >
                          End Engagement
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}

              <Button
                className="w-full py-3 flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                  color: '#ffffff',
                }}
              >
                <MessageSquare size={18} />
                Send Message
              </Button>

              <Button variant="outline" className="w-full py-3 flex items-center justify-center gap-2">
                <Mail size={18} />
                Email
              </Button>

              <Button variant="outline" className="w-full py-3 flex items-center justify-center gap-2">
                <Phone size={18} />
                Call
              </Button>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Response Time</p>
                    <p className="font-bold">Usually responds within 2 hours</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Availability</p>
                    <p className="font-bold">Available Now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
