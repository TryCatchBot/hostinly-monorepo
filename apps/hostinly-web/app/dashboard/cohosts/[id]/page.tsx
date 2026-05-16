'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import DashboardLayout from '@/components/DashboardLayout';
import {
  getAllProperties,
  getCoHostById,
  mockAvailableListings,
  updateProperty,
  type Property,
} from '@/lib/provideData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, MessageSquare, Mail, Phone, Badge, Calendar, Globe, Percent, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

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
  const [isHiring, setIsHiring] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [cohost, setCohost] = useState<CoHost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCohost = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const token = localStorage.getItem('hostinly_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cohosts/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        if (result.success) {
          const c = result.data;
          setCohost({
            id: c.id,
            name: c.user.name,
            title: c.specialties[0] || 'Property Expert',
            rating: c.rating,
            reviews: c.totalReviews,
            image: c.user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
            specialties: c.specialties,
            hourlyRate: c.hourlyRate,
            commissionPercentage: c.commissionPercentage,
            languages: c.languages
          });
        }
      } catch (err) {
        console.error('Failed to fetch cohost:', err);
        setCohost(getCoHostById(id) || null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCohost();
  }, [id]);

  const [hireRevision, setHireRevision] = useState(0);
  const [propertiesRevision, setPropertiesRevision] = useState(0);

  const bookInterview = async () => {
    if (!user || !id) return;
    setIsBooking(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hostId: user.id,
          candidateId: id,
          date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          notes: `Interview request for ${cohost?.name}`
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Interview request sent!');
        router.push('/dashboard/interviews');
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      toast.error('Failed to book interview: ' + err.message);
    } finally {
      setIsBooking(false);
    }
  };

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

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const hireCohost = async () => {
    if (!user || !id) return;
    setIsHiring(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/engagements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hostId: user.id,
          staffId: id,
          status: 'ACTIVE',
          startDate: new Date().toISOString()
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Co-host hired successfully!');
        setHireRevision(r => r + 1);
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      toast.error('Failed to hire: ' + err.message);
    } finally {
      setIsHiring(false);
    }
  };

  const submitReview = async () => {
    if (!user || !id) return;
    setIsSubmittingReview(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/engagements/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
          reviewerId: user.id,
          revieweeId: id
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Review submitted successfully!');
        setReviewComment('');
        setReviewRating(5);
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      toast.error('Failed to submit review: ' + err.message);
    } finally {
      setIsSubmittingReview(false);
    }
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

                  {/* Rate */}
                  {cohost.commissionPercentage ? (
                    <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                      <Percent size={24} />
                      {cohost.commissionPercentage}% commission
                    </div>
                  ) : cohost.hourlyRate ? (
                    <div className="text-2xl font-bold text-primary">
                      £{cohost.hourlyRate}/hour
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Languages */}
            {cohost.languages && cohost.languages.length > 0 && (
              <div className="bg-background rounded-lg border border-border p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Globe size={24} className="text-primary" />
                  Languages
                </h2>
                <div className="flex flex-wrap gap-3">
                  {cohost.languages.map((lang, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 rounded-xl bg-muted font-semibold text-foreground border border-border"
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            {/* Review Section */}
            {isHost && (
              <div className="bg-background rounded-lg border border-border p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Leave a Review</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground uppercase mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className={`p-2 transition-all ${reviewRating >= star ? 'text-yellow-500' : 'text-muted/40'}`}
                        >
                          <Star size={24} fill={reviewRating >= star ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-muted-foreground uppercase mb-2">Comment</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience working with this co-host..."
                      className="w-full p-4 rounded-xl bg-muted/30 border border-border focus:ring-2 focus:ring-primary outline-none min-h-[120px] transition-all"
                    />
                  </div>
                  <Button
                    onClick={submitReview}
                    disabled={isSubmittingReview || !reviewComment.trim()}
                    className="w-full sm:w-auto px-8 py-2.5 font-bold"
                  >
                    {isSubmittingReview ? <Loader2 className="animate-spin mr-2" /> : null}
                    Submit Review
                  </Button>
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
                  onClick={bookInterview}
                  disabled={isBooking}
                >
                  <Calendar size={18} />
                  {isBooking ? 'Booking...' : 'Book Interview'}
                </Button>

                <Button
                  className="w-full py-3 flex items-center justify-center gap-2"
                  variant="outline"
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
