'use client';
export const dynamic = "force-dynamic";

import DashboardLayout from '@/components/DashboardLayout';
import JobCard from '@/components/JobCard';
import PostJobModal from '@/components/PostJobModal';
import { mockJobs, addJob, type JobPosting } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';


export default function JobsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showPostJobModal, setShowPostJobModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const isHost = user.userType === 'host';

  const handlePostJob = (job: JobPosting) => {
    addJob(job);
    setShowPostJobModal(false);
  };

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {isHost ? 'Job Postings' : 'Available Jobs'}
            </h1>
            <p className="text-muted-foreground">
              {isHost
                ? 'Manage your job listings and find co-hosts'
                : 'Browse available co-hosting opportunities'}
            </p>
          </div>
          {isHost && (
            <Button
              style={{
                background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                color: '#ffffff',
              }}
              className="py-3 px-6"
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

        {mockJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No jobs found</p>
          </div>
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
