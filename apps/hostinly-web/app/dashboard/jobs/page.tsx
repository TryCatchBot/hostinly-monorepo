'use client';

import DashboardLayout from '@/components/DashboardLayout';
import JobCard from '@/components/JobCard';
import PostJobModal from '@/components/PostJobModal';
import { type JobPosting } from '@/lib/provideData';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight, Loader2, LayoutGrid, List, Briefcase } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hostinly-backend.onrender.com/api';

export default function JobsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchJobs = async (page = 1) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`${API_URL}/jobs?page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      if (result.success) {
        const mappedJobs = result.data.jobs.map((j: any) => ({
          id: j.id,
          title: j.title,
          description: j.description,
          propertyLocation: j.location,
          budget: j.budget,
          duration: j.type,
          experience: 'Any experience welcome', // Default
          status: j.status.toLowerCase(),
          applications: j.applications || 0,
        }));
        setJobs(mappedJobs);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJobs(pagination.page);
    }
  }, [user, pagination.page]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const isHost = user.userType === 'host';

  const handlePostJob = (job: JobPosting) => {
    setJobs((prev) => [job, ...prev]);
    setShowPostJobModal(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {isHost ? 'Job Postings' : 'Available Jobs'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {isHost
                ? 'Manage your job listings and find co-hosts'
                : 'Browse available co-hosting opportunities'}
            </p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border mr-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-background text-primary shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-background text-primary shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                title="List View"
              >
                <List size={20} />
              </button>
            </div>

            {isHost && (
              <Button
                style={{
                  background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                  color: '#ffffff',
                }}
                className="flex-1 md:flex-none py-6 px-8 text-base font-bold shadow-lg hover:opacity-90 transition-all rounded-xl"
                onClick={() => setShowPostJobModal(true)}
              >
                <Plus className="h-5 w-5 mr-2" />
                Post Job
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Briefcase size={24} className="text-primary animate-pulse" />
              </div>
            </div>
            <p className="text-muted-foreground text-lg font-medium animate-pulse">Fetching opportunities...</p>
          </div>
        ) : (
          <>
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" 
                : "flex flex-col gap-4 mb-12"
            }>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} viewMode={viewMode} />
              ))}
            </div>

            {jobs.length === 0 && (
              <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground text-lg mb-4">No jobs found</p>
                {isHost && (
                  <Button variant="outline" onClick={() => setShowPostJobModal(true)}>
                    Post your first job
                  </Button>
                )}
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm font-medium text-muted-foreground">
                  Page <span className="text-foreground">{pagination.page}</span> of {pagination.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        <PostJobModal
          isOpen={showPostJobModal}
          onClose={() => setShowPostJobModal(false)}
          onPost={handlePostJob}
        />
      </div>
    </DashboardLayout>
  );
}
