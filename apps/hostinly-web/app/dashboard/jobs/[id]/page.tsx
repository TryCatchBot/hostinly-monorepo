'use client';
export const dynamic = "force-dynamic";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { getJobById } from '@/lib/mockData';
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
} from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  const job = id ? getJobById(id) : null;
  const [hasApplied, setHasApplied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!job) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Job not found</h1>
          <Button onClick={() => router.push('/dashboard')} className="py-2 px-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleApply = () => {
    setHasApplied(true);
  };

  const handleDelete = () => {
    console.log('Deleting job:', job.id);
    setShowDeleteConfirm(false);
    router.push('/dashboard');
  };

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
            <Button variant="outline" className="py-2 px-4">
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
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-background rounded-lg border border-border p-8 mb-6">
              <h1 className="text-4xl font-bold text-foreground mb-4">{job.title}</h1>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold text-foreground">{job.propertyLocation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold text-foreground">{job.duration}</p>
                  </div>
                </div>
              </div>

              {/* Budget and Applications */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={20} className="text-green-600" />
                    <p className="text-sm text-muted-foreground">Budget</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">${job.budget.toLocaleString()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={20} className="text-blue-600" />
                    <p className="text-sm text-muted-foreground">Applications</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{job.applications}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-background rounded-lg border border-border p-8 mb-6">
              <h2 className="text-2xl font-bold mb-4">About this job</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{job.description}</p>

              {/* Requirements */}
              <h3 className="text-lg font-bold mb-3">Requirements</h3>
              <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
                <Briefcase size={20} className="text-primary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Experience</p>
                  <p className="text-muted-foreground">{job.experience}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-background rounded-lg border border-border p-6 sticky top-8 space-y-4">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    job.status === 'open'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {job.status === 'open' ? 'Open' : 'Closed'}
                </div>
              </div>

              {hasApplied ? (
                <Button disabled className="w-full py-3">
                  ✓ Application Sent
                </Button>
              ) : (
                <Button
                  className="w-full py-3"
                  style={{
                    background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
                    color: '#ffffff',
                  }}
                  onClick={handleApply}
                >
                  Apply Now
                </Button>
              )}

              <Button variant="outline" className="w-full py-3">
                Save Job
              </Button>

              {/* Share */}
              <div className="pt-6 border-t border-border">
                <p className="text-sm font-medium mb-3">Share Job</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 py-2 text-xs">
                    Email
                  </Button>
                  <Button variant="outline" className="flex-1 py-2 text-xs">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-2">Delete Job?</h2>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete {job.title}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 py-2"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 py-2"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
