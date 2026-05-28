'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PropertyCard from '@/components/PropertyCard';
import CoHostCard from '@/components/CoHostCard';
import JobCard from '@/components/JobCard';
import AddPropertyModal from '@/components/AddPropertyModal';
import PostJobModal from '@/components/PostJobModal';
import {
  mockProperties,
  mockCoHosts,
  mockJobs,
  addProperty,
  addJob,
  type Property,
  type JobPosting,
  type CoHost,
} from '@/lib/provideData';
import { useAuth } from '@/context/AuthContext';
import { Home, Users, Briefcase, TrendingUp, Plus, AlertCircle, Activity, ArrowUpRight, Loader2, PoundSterling, Calendar, CheckCircle2, Clock, MapPin, MessageSquare } from 'lucide-react';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hostinly-backend.onrender.com/api';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, fetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const lastFetchedUserId = useRef<string | null>(null);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [cohostExperts, setCohostExperts] = useState<CoHost[]>([]);
  const [recentJobs, setRecentJobs] = useState<JobPosting[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [engagements, setEngagements] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (user && lastFetchedUserId.current !== user.id) {
      lastFetchedUserId.current = user.id;
      fetchUser();
      fetchDashboardData();
    }
  }, [user, isLoading, router, fetchUser]);

  const fetchDashboardData = async () => {
    setIsDataLoading(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [statsRes, activityRes, cohostsRes, jobsRes, propertiesRes, interviewsRes, engagementsRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers }),
        fetch(`${API_URL}/admin/recent-activity`, { headers }),
        fetch(`${API_URL}/cohosts`, { headers }),
        fetch(`${API_URL}/jobs?limit=10`, { headers }),
        fetch(`${API_URL}/properties`, { headers }),
        fetch(`${API_URL}/interviews`, { headers }),
        fetch(`${API_URL}/engagements`, { headers })
      ]);
      
      const statsData = await statsRes.json();
      const activityData = await activityRes.json();
      const cohostsData = await cohostsRes.json();
      const jobsData = await jobsRes.json();
      const propertiesData = await propertiesRes.json();
      const interviewsData = await interviewsRes.json();
      const engagementsData = await engagementsRes.json();
      
      if (statsData.success) setStats(statsData.data);
      if (activityData.success) setActivities(activityData.data);
      if (engagementsData.success) setEngagements(engagementsData.data);
      if (interviewsData.success) {
        const sortedInterviews = (interviewsData.data || [])
          .filter((i: any) => i.status === 'SCHEDULED' || i.status === 'PENDING')
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setInterviews(sortedInterviews.slice(0, 3));
      }
      
      if (cohostsData.success) {
        setCohostExperts(cohostsData.data.map((c: any) => ({
          id: c.id,
          name: c.name || c.user?.name,
          title: c.specialties?.[0] || c.user?.servicesOffered?.split(',')?.[0] || 'Property Expert',
          rating: c.rating,
          reviews: c.totalReviews || 0,
          image: (c.user?.avatar || c.avatar || '').replace(/`/g, ''),
          specialties: c.specialties || (c.user?.servicesOffered ? c.user.servicesOffered.split(',') : []),
          hourlyRate: c.hourlyRate || c.commissionRate,
          commissionPercentage: c.commissionPercentage
        })));
      }

      if (jobsData.success) {
        const allJobs = jobsData.data.jobs.map((j: any) => ({
          id: j.id,
          title: j.title,
          description: j.description,
          propertyLocation: j.location,
          budget: j.budget,
          duration: j.duration || j.type,
          experience: 'Any experience welcome',
          status: j.status.toLowerCase(),
          applications: 0,
          type: j.type,
          createdAt: j.createdAt
        }));
        setRecentJobs(allJobs.slice(0, 5));
        
        // Mock applied jobs for cohosts (in real app, this would be a separate endpoint)
        if (user && (user.userType === 'cohost' || user.userType === 'cleaner')) {
          setAppliedJobs(allJobs.slice(0, 5).map((j: any, i: number) => ({
            ...j,
            applicationStatus: i === 0 ? 'Interview Scheduled' : i === 1 ? 'Under Review' : 'Applied'
          })));
        }
      }
      if (propertiesData.success) {
        const fetchedProperties = propertiesData.data.map((p: any) => {
          const trimmedImages = (p.images || []).map((img: string) => img.trim().replace(/^`|`$/g, ''));
          return {
            id: p.id,
            title: p.title,
            location: `${p.address}, ${p.city}`,
            price: p.price,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            image: trimmedImages[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop',
            images: trimmedImages,
            rating: 4.5,
            reviews: 0,
            status: p.status.toLowerCase(),
            ownerId: p.ownerId,
            airbnbLink: p.airbnbLink,
          };
        });
        setProperties(fetchedProperties);

        // Set default tab based on user type and property availability
        if (fetchedProperties.length === 0) {
          if (user?.userType === 'host') {
            setActiveTab('cohost');
          } else {
            setActiveTab('jobs');
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsDataLoading(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const isHost = user.userType === 'host';
  const hostProperties = properties.filter((p) => p.ownerId === user.id);
  const availableProperties = properties.filter((p) => p.status === 'available');

  const handleAddProperty = (property: Property) => {
    setProperties((prev) => [property, ...prev]);
    setShowAddPropertyModal(false);
  };

  const handlePostJob = (job: JobPosting) => {
    addJob(job);
    setShowPostJobModal(false);
  };

  const handleContact = (cohost: CoHost) => {
    router.push(`/dashboard/cohosts/${cohost.id}`);
  };

  const dashboardStats = [
    {
      label: 'Total Properties',
      value: stats?.propertyCount || 0,
      icon: Home,
      color: 'text-blue-600',
      trend: '+12%',
    },
    {
      label: 'Revenue',
      value: `£${(stats?.totalRevenue / 1000 || 0).toFixed(1)}k`,
      icon: TrendingUp,
      color: 'text-green-600',
      trend: '+8%',
    },
    {
      label: 'Active Jobs',
      value: stats?.activeJobCount || 0,
      icon: Briefcase,
      color: 'text-orange-600',
      trend: '+5',
    },
  ];

  const isOnboarded = !!user?.isOnboardingCompleted;

  return (
    <DashboardLayout>
      {isDataLoading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-6"></div>
          <p className="text-xl font-medium text-muted-foreground animate-pulse">
            Preparing your dashboard...
          </p>
        </div>
      ) : (
        <>
          {/* Subtitle */}
          {properties.length > 0 && (
        <div className="mb-6 sm:mb-8 flex justify-between items-center">
          <div>
            <p className="text-sm sm:text-base text-muted-foreground">
              {isHost
                ? 'Manage your rental properties'
                : 'Find properties to co-host'}
            </p>
          </div>
        </div>
      )}

      {!isOnboarded && (
        <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-yellow-50 border border-yellow-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3 text-yellow-800">
            <AlertCircle size={24} className="flex-shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-sm font-semibold leading-relaxed">
              Please complete your profile to enable all dashboard features like adding properties and jobs.
            </p>
          </div>
          <Button 
            variant="default" 
            size="sm" 
            className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-6 py-2 shadow-sm shrink-0"
            onClick={() => router.push('/dashboard/profile?edit=true')}
          >
            Complete Profile
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-8">
        {dashboardStats
          .filter(stat => isHost || !['Total Properties', 'Revenue', 'Active Jobs'].includes(stat.label))
          .map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-background rounded-2xl shadow-soft border border-border p-4 sm:p-5 lg:p-6 hover:shadow-medium transition-all hover:translate-y-[-2px] group">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-muted-foreground mb-1 uppercase tracking-widest opacity-70 truncate">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-black text-foreground truncate">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} bg-current/10 p-2 sm:p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                </div>
                <div className="flex items-center text-[10px] sm:text-xs font-bold text-green-600">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stat.trend} <span className="text-muted-foreground font-medium ml-1">vs last month</span>
                </div>
              </div>
            );
          })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
        {/* Revenue Overview Section */}
        <div className="lg:col-span-2">
          <div className="bg-background rounded-2xl border border-border shadow-sm p-4 sm:p-6 lg:p-8 h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h3 className="font-black text-lg sm:text-xl text-foreground">Revenue Overview</h3>
              <select className="text-[10px] sm:text-xs font-black bg-muted border-none rounded-lg px-3 py-2 outline-none cursor-pointer hover:bg-muted/80 transition-colors uppercase tracking-widest">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
              <div className="h-48 sm:h-64 flex items-end justify-between gap-1.5 sm:gap-3 px-1 min-w-[280px]">
                {[40, 70, 45, 90, 65, 85, 55].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <div 
                      className="w-full bg-primary/20 rounded-t-md sm:rounded-t-xl transition-all group-hover:bg-primary/50 relative"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] sm:text-[10px] font-black py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-y-[-4px] whitespace-nowrap z-10 shadow-lg">
                        £{(height * 10).toLocaleString('en-GB')}
                      </div>
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-tighter opacity-60">Day {i+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6 lg:space-y-8">
          {/* Property Status Distribution (Host Only) */}
          {isHost && (
            <div className="bg-background rounded-2xl border border-border p-5 lg:p-6 shadow-sm">
              <h3 className="font-black text-lg mb-6 text-foreground uppercase tracking-tight">Property Status</h3>
              <div className="space-y-5">
                {stats?.propertyStats?.map((s: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest text-muted-foreground">
                      <span>{s.status.toLowerCase()}</span>
                      <span className="text-foreground">{s._count}</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          s.status === 'AVAILABLE' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' :
                          s.status === 'MANAGED' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-gray-400'
                        }`}
                        style={{ width: `${(s._count / (stats.propertyCount || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-background rounded-2xl shadow-sm border border-border mb-8 overflow-hidden">
        <div className="flex overflow-x-auto no-scrollbar border-b border-border bg-muted/20">
          {isHost ? (
            <>
              {properties.length > 0 && (
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`whitespace-nowrap px-6 py-5 font-black text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${
                    activeTab === 'overview'
                      ? 'border-primary text-primary bg-background shadow-[inset_0_-2px_0_rgba(var(--primary),1)]'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                  disabled={!isOnboarded}
                >
                  <Home className="inline mr-2 h-3.5 w-3.5" />
                  Properties
                </button>
              )}
              <button
                onClick={() => setActiveTab('cohost')}
                className={`whitespace-nowrap px-6 py-5 font-black text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${
                  activeTab === 'cohost'
                    ? 'border-primary text-primary bg-background shadow-[inset_0_-2px_0_rgba(var(--primary),1)]'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                disabled={!isOnboarded}
              >
                <Users className="inline mr-2 h-3.5 w-3.5" />
                Find Co-Hosts
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`whitespace-nowrap px-6 py-5 font-black text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${
                  activeTab === 'jobs'
                    ? 'border-primary text-primary bg-background shadow-[inset_0_-2px_0_rgba(var(--primary),1)]'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                disabled={!isOnboarded}
              >
                <Briefcase className="inline mr-2 h-3.5 w-3.5" />
                Jobs
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                className={`whitespace-nowrap px-6 py-5 font-black text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${
                  activeTab === 'staff'
                    ? 'border-primary text-primary bg-background shadow-[inset_0_-2px_0_rgba(var(--primary),1)]'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                disabled={!isOnboarded}
              >
                <Users className="inline mr-2 h-3.5 w-3.5" />
                My Staff
              </button>
            </>
          ) : (
            <>
              {properties.length > 0 && (
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`whitespace-nowrap px-6 py-5 font-black text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${
                    activeTab === 'browse'
                      ? 'border-primary text-primary bg-background shadow-[inset_0_-2px_0_rgba(var(--primary),1)]'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Home className="inline mr-2 h-3.5 w-3.5" />
                  Browse Properties
                </button>
              )}
              <button
                onClick={() => setActiveTab('jobs')}
                className={`whitespace-nowrap px-6 py-5 font-black text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${
                  activeTab === 'jobs'
                    ? 'border-primary text-primary bg-background shadow-[inset_0_-2px_0_rgba(var(--primary),1)]'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Briefcase className="inline mr-2 h-3.5 w-3.5" />
                Available Jobs
              </button>
            </>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Host - My Properties Tab */}
          {isHost && activeTab === 'overview' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight">My Properties</h2>
                <Button
                  variant="default"
                  className="w-full sm:w-auto py-6 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
                  style={isOnboarded ? {
                    background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                    color: '#ffffff',
                  } : {}}
                  onClick={() => setShowAddPropertyModal(true)}
                  disabled={!isOnboarded}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {hostProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          )}

          {/* Host - Find Co-Hosts Tab */}
          {isHost && activeTab === 'cohost' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground mb-8 uppercase tracking-tight">Find Co-Hosts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {cohostExperts.map((cohost) => (
                  <CoHostCard key={cohost.id} cohost={cohost} onContact={handleContact} />
                ))}
                {cohostExperts.length === 0 && (
                  <div className="col-span-full text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                    <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-black text-sm uppercase tracking-widest">No co-hosts found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Host - My Staff Tab */}
          {isHost && activeTab === 'staff' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight">My Staff</h2>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto py-6 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-muted transition-all" 
                  onClick={() => setActiveTab('cohost')}
                >
                  Hire More
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {engagements.map((engagement) => (
                  <div key={engagement.id} className="bg-background rounded-2xl border border-border p-6 shadow-sm hover:shadow-strong transition-all group">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-muted ring-4 ring-muted transition-all group-hover:ring-primary/10">
                        {engagement.staff.user.avatar ? (
                          <NextImage src={engagement.staff.user.avatar.replace(/`/g, '')} alt={engagement.staff.user.name} width={64} height={64} className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary text-white font-black text-2xl">
                            {engagement.staff.user.name[0]}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-foreground">{engagement.staff.user.name}</h3>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-70">{engagement.staff.specialties[0] || 'Property Expert'}</p>
                      </div>
                    </div>
                    <div className="space-y-4 mb-6 text-sm">
                      <div className="flex justify-between items-center pb-3 border-b border-border/50">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${engagement.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{engagement.status}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Hired Date</span>
                        <span className="font-bold text-foreground">{new Date(engagement.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1 py-5 rounded-xl text-[10px] font-black uppercase tracking-widest" onClick={() => router.push(`/dashboard/cohosts/${engagement.staff.id}`)}>View Profile</Button>
                      <Button variant="ghost" className="w-12 h-12 p-0 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"><MessageSquare size={20} /></Button>
                    </div>
                  </div>
                ))}
                {engagements.length === 0 && (
                  <div className="col-span-full text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                    <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-black text-sm uppercase tracking-widest mb-4">You haven&apos;t hired any staff yet.</p>
                    <Button variant="link" className="font-black text-[10px] uppercase tracking-widest text-primary" onClick={() => setActiveTab('cohost')}>Find experts now</Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Job Postings Tab */}
          {activeTab === 'jobs' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight">
                  {isHost ? 'Job Postings' : 'Available Jobs'}
                </h2>
                {isHost && (
                  <Button
                    variant="default"
                    className="w-full sm:w-auto py-6 px-8 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
                    style={isOnboarded ? {
                      background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                      color: '#ffffff',
                    } : {}}
                    onClick={() => setShowPostJobModal(true)}
                    disabled={!isOnboarded}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Post Job
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {recentJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
                {recentJobs.length === 0 && (
                  <div className="col-span-full text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
                    <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-black text-sm uppercase tracking-widest">No job postings found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CoHost - Browse Properties Tab */}
          {!isHost && activeTab === 'browse' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground mb-8 uppercase tracking-tight">Available Properties</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {availableProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cohost/Cleaner Specific Sections */}
      {!isHost && (
        <div className="space-y-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Interviews */}
            <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Calendar className="text-primary h-5 w-5" />
                Upcoming Interviews (Top 3)
              </h2>
              <div className="space-y-4">
                {interviews.length > 0 ? interviews.map((interview, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/30 transition-all cursor-pointer group"
                    onClick={() => router.push(`/dashboard/interviews/${interview.id}`)}
                  >
                    <div>
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">{interview.host?.name || 'Host'}</p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-1">
                        <Calendar size={12} />
                        {new Date(interview.date).toLocaleDateString()}
                        <span className="mx-1">•</span>
                        <Clock size={12} />
                        {new Date(interview.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-full">
                      {interview.status}
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground italic text-center py-8">No upcoming interviews.</p>
                )}
              </div>
            </div>

            {/* Recent Application Status */}
            <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="text-primary h-5 w-5" />
                Application Status (Top 3)
              </h2>
              <div className="space-y-4">
                {appliedJobs.slice(0, 3).map((job, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.propertyLocation}</p>
                    </div>
                    <div className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${
                      job.applicationStatus === 'Interview Scheduled' ? 'bg-green-100 text-green-700' :
                      job.applicationStatus === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {job.applicationStatus}
                    </div>
                  </div>
                ))}
                {appliedJobs.length === 0 && (
                  <p className="text-sm text-muted-foreground italic text-center py-8">No recent applications.</p>
                )}
              </div>
            </div>
          </div>

          {/* Jobs Applied For */}
          <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-primary h-5 w-5" />
              Jobs Applied For (Top 5)
            </h2>
            <div className="space-y-4">
              {appliedJobs.slice(0, 5).map((job) => (
                <div 
                  key={`applied-${job.id}`} 
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => router.push(`/dashboard/jobs/${job.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{job.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin size={12} />
                        {job.propertyLocation}
                        <span className="mx-1">•</span>
                        <PoundSterling size={12} />
                        {typeof job.budget === 'number' ? job.budget.toLocaleString('en-GB') : job.budget}
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${
                    job.applicationStatus === 'Interview Scheduled' ? 'bg-green-100 text-green-700' :
                    job.applicationStatus === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {job.applicationStatus}
                  </div>
                </div>
              ))}
              {appliedJobs.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-8">You haven&apos;t applied for any jobs yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Activity List */}
      <div className="bg-background rounded-2xl border border-border p-6 shadow-sm mb-8">
        <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.filter(a => {
            if (a.type === 'USER_SIGNUP') return false; // Don't show signup
            if (a.type === 'JOB_POSTED') return a.data.author?.id === user.id;
            if (a.type === 'PROPERTY_ADDED') return a.data.ownerId === user.id;
            if (a.type === 'JOB_APPLICATION') return a.data.applicantId === user.id || a.data.job?.authorId === user.id;
            if (a.type === 'INTERVIEW_SCHEDULED') return a.data.candidateId === user.id || a.data.hostId === user.id;
            return false;
          }).length > 0 ? activities.filter(a => {
            if (a.type === 'USER_SIGNUP') return false;
            if (a.type === 'JOB_POSTED') return a.data.author?.id === user.id;
            if (a.type === 'PROPERTY_ADDED') return a.data.ownerId === user.id;
            if (a.type === 'JOB_APPLICATION') return a.data.applicantId === user.id || a.data.job?.authorId === user.id;
            if (a.type === 'INTERVIEW_SCHEDULED') return a.data.candidateId === user.id || a.data.hostId === user.id;
            return false;
          }).map((activity, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border">
              <div className={`p-2.5 rounded-xl ${
                activity.type === 'JOB_POSTED' ? 'bg-orange-100 text-orange-600' :
                activity.type === 'JOB_APPLICATION' ? 'bg-green-100 text-green-600' :
                activity.type === 'INTERVIEW_SCHEDULED' ? 'bg-purple-100 text-purple-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <Activity size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-snug">
                  {activity.type === 'JOB_POSTED' && <span>New job created: <span className="font-bold truncate inline-block max-w-[150px] align-bottom">{activity.data.title}</span></span>}
                  {activity.type === 'PROPERTY_ADDED' && <span>New property added: <span className="font-bold truncate inline-block max-w-[150px] align-bottom">{activity.data.title}</span></span>}
                  {activity.type === 'JOB_APPLICATION' && <span>{activity.data.applicantId === user.id ? 'You applied for a job:' : 'New job application received for:'} <span className="font-bold truncate inline-block max-w-[150px] align-bottom">{activity.data.job.title}</span></span>}
                  {activity.type === 'INTERVIEW_SCHEDULED' && <span>Interview scheduled for: <span className="font-bold truncate inline-block max-w-[150px] align-bottom">{activity.data.job?.title || 'a property'}</span></span>}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground mt-1.5 uppercase tracking-wider">{new Date(activity.date).toLocaleDateString()} • {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No recent activity to show</p>
            </div>
          )}
        </div>
      </div>

      <AddPropertyModal
        isOpen={showAddPropertyModal}
        onClose={() => setShowAddPropertyModal(false)}
        onAdd={handleAddProperty}
      />

      <PostJobModal
        isOpen={showPostJobModal}
        onClose={() => setShowPostJobModal(false)}
        onPost={handlePostJob}
      />
    </>
  )}
</DashboardLayout>
);
}
