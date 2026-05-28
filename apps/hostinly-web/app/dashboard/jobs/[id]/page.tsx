'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { type JobPosting } from '@/lib/provideData';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  MapPin,
  PoundSterling,
  Clock,
  Briefcase,
  Users,
  Edit2,
  Trash2,
  AlertTriangle,
  Loader2,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hostinly-backend.onrender.com/api';

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id;
  
  const [job, setJob] = useState<JobPosting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
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
              duration: j.duration || j.type,
              experience: 'Any experience welcome',
              status: j.status.toLowerCase(),
              applications: j.applications || 0,
              type: j.type,
              requirements: j.requirements,
              skills: j.skills || [],
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

  const handleApply = async () => {
    if (!id || !user) return;
    setIsApplying(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${API_URL}/jobs/${id}/apply`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ applicantId: user.id })
      });
      const result = await response.json();
      if (result.success) {
        setHasApplied(true);
        setJob(prev => prev ? { ...prev, applications: prev.applications + 1 } : null);
        toast.success('Application sent successfully!');
      } else {
        toast.error(result.error || 'Failed to apply for job');
      }
    } catch (error) {
      console.error('Failed to apply:', error);
      toast.error('An error occurred while applying');
    } finally {
      setIsApplying(false);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      const response = await fetch(`${API_URL}/jobs/${id}/save`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      const result = await response.json();
      if (result.success) {
        setHasSaved(true);
        toast.success('Job saved successfully!');
      } else {
        toast.error(result.error || 'Failed to save job');
      }
    } catch (error) {
      console.error('Failed to save job:', error);
      toast.error('An error occurred while saving the job');
    } finally {
      setIsSaving(false);
    }
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
            <div className="bg-background rounded-2xl border border-border p-8 mb-6 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4">
                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100">
                  {job.type}
                </span>
              </div>
              
              <h1 className="text-4xl font-bold text-foreground mb-4 pr-24">{job.title}</h1>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MapPin size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Location</p>
                    <p className="font-bold text-foreground">{job.propertyLocation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Duration</p>
                    <p className="font-bold text-foreground">{job.duration}</p>
                  </div>
                </div>
              </div>

              {/* Budget and Applications */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 p-6 rounded-2xl border border-green-100 shadow-sm group hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-xl text-green-600 group-hover:scale-110 transition-transform">
                      <PoundSterling size={20} />
                    </div>
                    <p className="text-[10px] text-green-700 font-black uppercase tracking-[0.2em]">Budget</p>
                  </div>
                  <p className="text-3xl font-black text-green-800 tracking-tight">
                    {typeof job.budget === 'number' ? `£${job.budget.toLocaleString('en-GB')}` : (job.budget as string).replace('$', '£')}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/30 p-6 rounded-2xl border border-blue-100 shadow-sm group hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
                      <Users size={20} />
                    </div>
                    <p className="text-[10px] text-blue-700 font-black uppercase tracking-[0.2em]">Applicants</p>
                  </div>
                  <p className="text-3xl font-black text-blue-800 tracking-tight">{job.applications}</p>
                </div>
              </div>
            </div>

            {/* Description & Requirements */}
            <div className="bg-background rounded-2xl border border-border p-8 mb-6 shadow-sm">
              <div className="mb-10">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                  <div className="w-2 h-8 bg-primary rounded-full" />
                  Job Description
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">{job.description}</p>
              </div>

              {job.requirements && (
                <div className="mb-10">
                  <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                    <div className="w-2 h-8 bg-secondary rounded-full" />
                    Requirements
                  </h3>
                  <div className="bg-muted/30 rounded-2xl p-6 border border-border whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {job.requirements}
                  </div>
                </div>
              )}

              {job.skills && job.skills.length > 0 && (
                <div>
                  <h3 className="text-2xl font-black mb-6 flex items-center gap-2">
                    <div className="w-2 h-8 bg-accent rounded-full" />
                    Desired Skills
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {job.skills.map((skill, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl shadow-sm group hover:border-primary transition-colors">
                        <Tag size={16} className="text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-foreground">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                      disabled={job.status !== 'open' || isApplying}
                    >
                      {isApplying ? <Loader2 className="animate-spin mr-2" /> : null}
                      Apply Now
                    </Button>
                  )}

                  <Button 
                    variant="outline" 
                    className="w-full py-4 font-bold rounded-xl border-2"
                    onClick={handleSave}
                    disabled={isSaving || hasSaved}
                  >
                    {isSaving ? <Loader2 className="animate-spin mr-2" /> : null}
                    {hasSaved ? '✓ Saved' : 'Save Job'}
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
