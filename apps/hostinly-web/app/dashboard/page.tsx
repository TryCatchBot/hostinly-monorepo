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
import { Home, Users, Briefcase, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';


export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [showPostJobModal, setShowPostJobModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

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

  // Stats for dashboard
  const stats = [
    {
      label: 'Active Properties',
      value: hostProperties.length,
      icon: Home,
      color: 'text-blue-600',
    },
    {
      label: 'Total Revenue',
      value: `$${(hostProperties.reduce((sum, p) => sum + p.price * 30, 0) / 1000).toFixed(1)}k`,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      label: 'Co-Hosts',
      value: 4,
      icon: Users,
      color: 'text-purple-600',
    },
    {
      label: 'Available Listings',
      value: availableProperties.length,
      icon: Briefcase,
      color: 'text-orange-600',
    },
  ];

  return (
    <DashboardLayout>
      {/* Subtitle */}
      <div className="mb-8">
        <p className="text-muted-foreground">
          {isHost
            ? 'Manage your properties and find the perfect co-hosts'
            : 'Explore properties and co-hosting opportunities'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-background rounded-lg shadow-medium border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <Icon className={`${stat.color} h-8 w-8 opacity-20`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs Navigation */}
      <div className="bg-background rounded-lg shadow-medium border border-border mb-8 overflow-hidden">
        <div className="flex flex-wrap border-b border-border">
          {isHost ? (
            <>
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 sm:flex-none px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === 'overview'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Home className="inline mr-2 h-4 w-4" />
                My Properties
              </button>
              <button
                onClick={() => setActiveTab('cohost')}
                className={`flex-1 sm:flex-none px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === 'cohost'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Users className="inline mr-2 h-4 w-4" />
                Find Co-Hosts
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`flex-1 sm:flex-none px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === 'jobs'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Briefcase className="inline mr-2 h-4 w-4" />
                Job Postings
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('browse')}
                className={`flex-1 sm:flex-none px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === 'browse'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Home className="inline mr-2 h-4 w-4" />
                Browse Properties
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`flex-1 sm:flex-none px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === 'jobs'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Briefcase className="inline mr-2 h-4 w-4" />
                Available Jobs
              </button>
            </>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Host - My Properties Tab */}
          {isHost && activeTab === 'overview' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">My Properties</h2>
                <Button
                  variant="default"
                  className="py-2 px-4 rounded-lg text-sm font-medium"
                  style={{
                    background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                    color: '#ffffff',
                  }}
                  onClick={() => setShowAddPropertyModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          )}

          {/* Host - Find Co-Hosts Tab */}
          {isHost && activeTab === 'cohost' && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Featured Co-Hosts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCoHosts.map((cohost) => (
                  <CoHostCard key={cohost.id} cohost={cohost} onContact={handleContact} />
                ))}
              </div>
            </div>
          )}

          {/* Job Postings Tab */}
          {activeTab === 'jobs' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {isHost ? 'Job Postings' : 'Available Jobs'}
                </h2>
                {isHost && (
                  <Button
                    variant="default"
                    className="py-2 px-4 rounded-lg text-sm font-medium"
                    style={{
                      background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                      color: '#ffffff',
                    }}
                    onClick={() => setShowPostJobModal(true)}
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
              <h2 className="text-2xl font-bold text-foreground mb-6">Properties Looking for Co-Hosts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
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
