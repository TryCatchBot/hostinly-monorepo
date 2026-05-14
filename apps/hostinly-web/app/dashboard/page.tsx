'use client';

import { useState, useEffect } from 'react';
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
  mockAvailableListings,
  addProperty,
  addJob,
  type Property,
  type JobPosting,
  type CoHost,
} from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import { Home, Users, Briefcase, TrendingUp, Plus, AlertCircle, Activity, ArrowUpRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, fetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchUser();
      fetchDashboardData();
    }
  }, [user, isLoading, router]);

  const fetchDashboardData = async () => {
    setIsDataLoading(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      const [statsRes, activityRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/admin/recent-activity`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      const statsData = await statsRes.json();
      const activityData = await activityRes.json();
      
      if (statsData.success) setStats(statsData.data);
      if (activityData.success) setActivities(activityData.data);
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
  const hostProperties = mockProperties.filter((p) => p.status !== 'available');
  const availableProperties = mockAvailableListings;

  const handleAddProperty = (property: Property) => {
    addProperty(property);
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
      value: `$${(stats?.totalRevenue / 1000 || 0).toFixed(1)}k`,
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
      {/* Subtitle */}
      <div className="mb-6 sm:mb-8 flex justify-between items-center">
        <div>
          <p className="text-sm sm:text-base text-muted-foreground">
            {isHost
              ? 'Here is what is happening with your properties today.'
              : 'Explore properties and co-hosting opportunities'}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={isDataLoading}>
          {isDataLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

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
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {dashboardStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-background rounded-2xl shadow-soft border border-border p-5 sm:p-6 hover:shadow-medium transition-all hover:scale-[1.02]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-muted-foreground mb-1 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-black text-foreground">{stat.value}</p>
                </div>
                <div className={`${stat.color} bg-current/10 p-2.5 rounded-xl`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </div>
              <div className="flex items-center text-xs font-bold text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stat.trend} <span className="text-muted-foreground font-medium ml-1">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Charts/Activity Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Mock Chart Infographic */}
          <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Revenue Overview</h3>
              <select className="text-xs font-bold bg-muted border-none rounded-lg px-2 py-1 outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-48 flex items-end justify-between gap-2 px-2">
              {[40, 70, 45, 90, 65, 85, 55].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div 
                    className="w-full bg-primary/20 rounded-t-lg transition-all group-hover:bg-primary/40 relative"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ${(height * 10).toLocaleString()}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">Day {i+1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <Button 
                className="w-full justify-start py-6 rounded-xl border-2 hover:bg-muted/50 transition-all"
                variant="outline"
                onClick={() => setShowAddPropertyModal(true)}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                  <Plus size={18} />
                </div>
                <span className="font-bold">List New Property</span>
              </Button>
              <Button 
                className="w-full justify-start py-6 rounded-xl border-2 hover:bg-muted/50 transition-all"
                variant="outline"
                onClick={() => setShowPostJobModal(true)}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mr-3">
                  <Plus size={18} />
                </div>
                <span className="font-bold">Post New Job</span>
              </Button>
            </div>
          </div>

          {/* Property Status Distribution */}
          <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Property Status</h3>
            <div className="space-y-4">
              {stats?.propertyStats?.map((s: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wider">
                    <span>{s.status.toLowerCase()}</span>
                    <span>{s._count}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        s.status === 'AVAILABLE' ? 'bg-green-500' :
                        s.status === 'MANAGED' ? 'bg-blue-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${(s._count / stats.propertyCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-background rounded-xl shadow-sm border border-border mb-8 overflow-hidden">
        <div className="flex overflow-x-auto no-scrollbar border-b border-border bg-muted/30">
          {isHost ? (
            <>
              <button
                onClick={() => setActiveTab('overview')}
                className={`whitespace-nowrap px-6 py-4 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-primary text-primary bg-background'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Home className="inline mr-2 h-4 w-4" />
                My Properties
              </button>
              <button
                onClick={() => setActiveTab('cohost')}
                className={`whitespace-nowrap px-6 py-4 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === 'cohost'
                    ? 'border-primary text-primary bg-background'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                disabled={!isOnboarded}
              >
                <Users className="inline mr-2 h-4 w-4" />
                Find Co-Hosts
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`whitespace-nowrap px-6 py-4 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === 'jobs'
                    ? 'border-primary text-primary bg-background'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
                disabled={!isOnboarded}
              >
                <Briefcase className="inline mr-2 h-4 w-4" />
                Job Postings
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('browse')}
                className={`whitespace-nowrap px-6 py-4 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === 'browse'
                    ? 'border-primary text-primary bg-background'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Home className="inline mr-2 h-4 w-4" />
                Browse Properties
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`whitespace-nowrap px-6 py-4 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === 'jobs'
                    ? 'border-primary text-primary bg-background'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Briefcase className="inline mr-2 h-4 w-4" />
                Available Jobs
              </button>
            </>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6">
          {/* Host - My Properties Tab */}
          {isHost && activeTab === 'overview' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">My Properties</h2>
                <Button
                  variant="default"
                  className="w-full sm:w-auto py-2.5 px-6 rounded-xl text-sm font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {hostProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          )}

          {/* Host - Find Co-Hosts Tab */}
          {isHost && activeTab === 'cohost' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Featured Co-Hosts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockCoHosts.map((cohost) => (
                  <CoHostCard key={cohost.id} cohost={cohost} onContact={handleContact} />
                ))}
              </div>
            </div>
          )}

          {/* Job Postings Tab */}
          {activeTab === 'jobs' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {isHost ? 'Job Postings' : 'Available Jobs'}
                </h2>
                {isHost && (
                  <Button
                    variant="default"
                    className="w-full sm:w-auto py-2.5 px-6 rounded-xl text-sm font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
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
              <div className="grid grid-cols-1 gap-4">
                {mockJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </div>
          )}

          {/* CoHost - Browse Properties Tab */}
          {!isHost && activeTab === 'browse' && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Properties Looking for Co-Hosts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {availableProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Activity List */}
      <div className="bg-background rounded-2xl border border-border p-6 shadow-sm mb-8">
        <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.length > 0 ? activities.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border">
              <div className={`p-2.5 rounded-xl ${
                activity.type === 'USER_SIGNUP' ? 'bg-purple-100 text-purple-600' :
                activity.type === 'JOB_POSTED' ? 'bg-orange-100 text-orange-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                <Activity size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-snug">
                  {activity.type === 'USER_SIGNUP' && <span>New user <span className="font-bold">{activity.data.name}</span> joined as <span className="capitalize">{activity.data.userType.toLowerCase()}</span></span>}
                  {activity.type === 'JOB_POSTED' && <span>Job <span className="font-bold truncate inline-block max-w-[150px] align-bottom">{activity.data.title}</span> posted by {activity.data.author.name}</span>}
                  {activity.type === 'PROPERTY_ADDED' && <span>Property <span className="font-bold truncate inline-block max-w-[150px] align-bottom">{activity.data.title}</span> added in {activity.data.city}</span>}
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
    </DashboardLayout>
  );
}
