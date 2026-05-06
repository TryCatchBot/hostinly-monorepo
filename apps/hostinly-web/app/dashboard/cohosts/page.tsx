'use client';

import DashboardLayout from '@/components/DashboardLayout';
import CoHostCard from '@/components/CoHostCard';
import Link from 'next/link';
import {
  getAllProperties,
  mockAvailableListings,
  mockCoHosts,
  type CoHost,
  type Property,
  updateProperty,
} from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type HireStatus = 'active' | 'probation' | 'ended';
type HireRecord = {
  cohostId: string;
  status: HireStatus;
  hiredAt: string;
  endedAt?: string;
};

export default function CoHostsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const isHost = user?.userType === 'host';
  const [hireRevision, setHireRevision] = useState(0);
  const [propertiesRevision, setPropertiesRevision] = useState(0);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleContact = (cohost: CoHost) => {
    router.push(`/dashboard/cohosts/${cohost.id}`);
  };

  const hireKey = user ? `hostinly_hires_${user.email.toLowerCase()}` : null;
  const hires = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = hireRevision;
    if (!hireKey || typeof window === 'undefined') return [] as HireRecord[];
    const raw = localStorage.getItem(hireKey);
    if (!raw) return [] as HireRecord[];
    try {
      const parsed = JSON.parse(raw) as unknown;
      return Array.isArray(parsed) ? (parsed as HireRecord[]) : [];
    } catch {
      return [] as HireRecord[];
    }
  }, [hireKey, hireRevision]);

  const hiredCoHosts = useMemo(() => {
    const map = new Map(mockCoHosts.map((c) => [c.id, c]));
    return hires
      .map((h) => ({ hire: h, cohost: map.get(h.cohostId) }))
      .filter((x): x is { hire: HireRecord; cohost: CoHost } => Boolean(x.cohost));
  }, [hires]);

  const writeHires = (next: HireRecord[]) => {
    if (!hireKey || typeof window === 'undefined') return;
    localStorage.setItem(hireKey, JSON.stringify(next));
    setHireRevision((r) => r + 1);
  };

  const endEngagement = (cohostId: string) => {
    const now = new Date().toISOString();
    const next = hires.map((h) =>
      h.cohostId === cohostId ? { ...h, status: 'ended' as const, endedAt: now } : h
    );
    writeHires(next);
  };

  const toggleProbation = (cohostId: string) => {
    const next = hires.map((h) =>
      h.cohostId === cohostId
        ? {
            ...h,
            status: h.status === 'probation' ? ('active' as const) : ('probation' as const),
          }
        : h
    );
    writeHires(next);
  };

  const hostProperties = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = propertiesRevision;
    if (!isHost) return [] as Property[];
    const all = getAllProperties();
    return all.filter((p) => !mockAvailableListings.some((a) => a.id === p.id));
  }, [isHost, propertiesRevision]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Featured Co-Hosts
          </h1>
          <p className="text-muted-foreground">
            Find and hire experienced co-hosts to manage your properties
          </p>
        </div>

        {isHost && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="bg-background rounded-lg border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Hired Co-Hosts</h2>
              <div className="space-y-3">
                {hiredCoHosts
                  .filter((x) => x.hire.status !== 'ended')
                  .map(({ hire, cohost }) => (
                    <div
                      key={cohost.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border rounded-lg p-4"
                    >
                      <div>
                        <div className="font-semibold text-foreground">{cohost.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Status:{' '}
                          <span className="font-medium text-foreground">{hire.status}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/dashboard/cohosts/${cohost.id}`}
                          className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleProbation(cohost.id)}
                          className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          {hire.status === 'probation' ? 'Remove probation' : 'Probation'}
                        </button>
                        <button
                          type="button"
                          onClick={() => endEngagement(cohost.id)}
                          className="px-3 py-2 rounded-lg border border-border text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          End
                        </button>
                      </div>
                    </div>
                  ))}
                {hiredCoHosts.filter((x) => x.hire.status !== 'ended').length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    You have not hired any co-hosts yet.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-background rounded-lg border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Property Status</h2>
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
                  <div className="text-sm text-muted-foreground">No properties found.</div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCoHosts.map((cohost) => (
            <CoHostCard key={cohost.id} cohost={cohost} onContact={handleContact} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
