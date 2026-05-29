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
import { ArrowLeft, Star, MessageSquare, Mail, Phone, Badge, Calendar, Globe, Percent, Loader2, MapPin, Briefcase, Clock, X, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CoHost } from '@/lib/provideData';

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
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

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
            userId: c.user.id,
            name: c.user.name,
            title: c.user.servicesOffered?.split(',')?.[0] || 'Property Expert',
            rating: c.rating,
            reviews: c.totalReviews,
            image: c.user.avatar || '',
            specialties: c.specialties.length > 0 ? c.specialties : (c.user.servicesOffered ? c.user.servicesOffered.split(',').map((s: string) => s.trim()) : []),
            hourlyRate: c.hourlyRate,
            commissionPercentage: c.commissionPercentage,
            languages: c.languages,
            bio: c.bio || `Professional co-host specializing in ${c.user.servicesOffered || 'property management'}.`,
            location: c.user.city || c.user.country || 'Location not specified',
            email: c.user.email,
            phone: c.user.phone,
            areasCovered: c.user.areasCovered,
            experience: c.user.yearsOfExperience || c.experience,
            availability: c.user.availability || c.availabilityStatus
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
    if (!user || !cohost?.userId || !bookingDate || !bookingTime) return;
    setIsBooking(true);
    try {
      const combinedDateTime = new Date(`${bookingDate}T${bookingTime}`);
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          hostId: user.id,
          candidateId: cohost.userId,
          date: combinedDateTime.toISOString(),
          notes: `Interview request for ${cohost?.name}`
        })
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Interview request sent!');
        setShowBookingModal(false);
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
    if (!user || !cohost?.userId) return;
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
          staffId: cohost.userId,
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
    if (!user || !cohost?.userId) return;
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
          revieweeId: cohost.userId
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-6"></div>
          <p className="text-xl font-medium text-muted-foreground animate-pulse">
            Loading co-host details...
          </p>
        </div>
      </DashboardLayout>
    );
  }

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
                <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-primary/10 flex items-center justify-center border border-border">
                  {cohost.image ? (
                    <Image
                      src={cohost.image}
                      alt={cohost.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-black text-primary">
                      {cohost.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  )}
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
                {cohost.bio}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {cohost.location && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin size={20} className="text-primary" />
                    <span>{cohost.location}</span>
                  </div>
                )}
                {cohost.experience !== undefined && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Briefcase size={20} className="text-primary" />
                    <span>{cohost.experience} years experience</span>
                  </div>
                )}
                {cohost.availability && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock size={20} className="text-primary" />
                    <span>{cohost.availability}</span>
                  </div>
                )}
                {cohost.areasCovered && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Globe size={20} className="text-primary" />
                    <span>Covers {cohost.areasCovered}</span>
                  </div>
                )}
              </div>
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
                  onClick={() => setShowBookingModal(true)}
                  disabled={isBooking}
                >
                  <Calendar size={18} />
                  Book Interview
                </Button>

                <Button
                  className="w-full py-3 flex items-center justify-center gap-2"
                  variant="outline"
                >
                  <MessageSquare size={18} />
                  Send Message
                </Button>

              <a 
                href={`mailto:${cohost.email}`}
                className="w-full py-3 flex items-center justify-center gap-2 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground rounded-md font-medium transition-colors"
              >
                <Mail size={18} />
                Email
              </a>

              <a 
                href={`tel:${cohost.phone}`}
                className="w-full py-3 flex items-center justify-center gap-2 border border-input bg-transparent hover:bg-accent hover:text-accent-foreground rounded-md font-medium transition-colors"
              >
                <Phone size={18} />
                Call
              </a>

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

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl shadow-xl max-w-md w-full border border-border overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Schedule Interview</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-muted-foreground uppercase mb-2">Select Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-muted-foreground uppercase mb-2">Select Time</label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="p-6 bg-muted/30 border-t border-border flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={!bookingDate || !bookingTime || isBooking}
                onClick={bookInterview}
                style={{
                  background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                  color: '#ffffff',
                }}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
