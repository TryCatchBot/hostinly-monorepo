'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { type JobPosting } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Users,
  Edit2,
  Trash2,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id;
  
  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        const token = localStorage.getItem('hostinly_token');
        const response = await fetch(`${API_URL}/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          const j = result.data;
          setJob({
            id: j.id,
            title: j.title,
            description: j.description,
            propertyLocation: j.location,
            budget: j.budget,
            duration: j.type,
            experience: 'Any experience welcome',
            status: j.status.toLowerCase(),
            applications: 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch job:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Job not found</h1>
          <Button onClick={() => router.push('/dashboard/jobs')} className="py-2 px-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleApply = () => {
    setHasApplied(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${API_URL}/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();
      if (result.success) {
        router.push('/dashboard/jobs');
      } else {
        alert(result.error || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('An error occurred while deleting the job');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const isHost = user?.userType === 'host';

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
          <div className="flex gap-3">
            {isHost && (
              <>
                <Button 
                  variant="outline" 
                  className="py-2 px-4"
                  onClick={() => router.push(`/dashboard/jobs/${id}/edit`)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="py-2 px-4"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-background rounded-lg border border-border p-8 mb-6 shadow-sm">
              <h1 className="text-4xl font-bold text-foreground mb-4">{job.title}</h1>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold text-foreground">{job.propertyLocation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold text-foreground">{job.duration}</p>
                  </div>
                </div>
              </div>

              {/* Budget and Applications */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={20} className="text-green-600" />
                    <p className="text-sm text-green-700 font-medium">Budget</p>
                  </div>
                  <p className="text-3xl font-bold text-green-700">{job.budget}</p>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={20} className="text-blue-600" />
                    <p className="text-sm text-blue-700 font-medium">Applications</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-700">{job.applications}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-background rounded-lg border border-border p-8 mb-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">About this job</h2>
              <p className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-wrap">{job.description}</p>

              {/* Requirements */}
              <h3 className="text-lg font-bold mb-3">Requirements</h3>
              <div className="bg-muted/30 rounded-xl p-6 flex items-start gap-4 border border-border">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center border border-border shadow-sm">
                  <Briefcase size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground mb-1">Experience Level</p>
                  <p className="text-muted-foreground">{job.experience}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-background rounded-xl border border-border p-6 sticky top-8 space-y-6 shadow-sm">
              <div>
                <p className="text-sm text-muted-foreground mb-3 font-medium">Job Status</p>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${
                    job.status === 'open'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${job.status === 'open' ? 'bg-green-600' : 'bg-red-600'} animate-pulse`} />
                  {job.status === 'open' ? 'Open for applications' : 'Closed'}
                </div>
              </div>

              {!isHost && (
                <div className="space-y-4">
                  {hasApplied ? (
                    <Button disabled className="w-full py-4 text-lg font-bold rounded-xl shadow-md">
                      ✓ Application Sent
                    </Button>
                  ) : (
                    <Button
                      className="w-full py-4 text-lg font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all"
                      style={{
                        background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                        color: '#ffffff',
                      }}
                      onClick={handleApply}
                      disabled={job.status !== 'open'}
                    >
                      Apply Now
                    </Button>
                  )}

                  <Button variant="outline" className="w-full py-4 font-bold rounded-xl border-2">
                    Save Job
                  </Button>
                </div>
              )}

              {/* Share */}
              <div className="pt-6 border-t border-border">
                <p className="text-sm font-bold text-foreground mb-4">Spread the word</p>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 py-2 font-semibold">
                    Email
                  </Button>
                  <Button variant="outline" className="flex-1 py-2 font-semibold">
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl p-8 max-w-sm w-full border border-border shadow-2xl">
            <div className="flex items-center gap-3 text-destructive mb-4">
              <AlertTriangle size={28} />
              <h2 className="text-2xl font-bold">Warning</h2>
            </div>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Are you sure you want to delete <span className="font-bold text-foreground">"{job.title}"</span>? This action is permanent and all applications will be lost.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                variant="destructive"
                className="w-full py-3 font-bold text-lg"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Listing'}
              </Button>
              <Button
                variant="ghost"
                className="w-full py-3 font-semibold"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Go back
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
