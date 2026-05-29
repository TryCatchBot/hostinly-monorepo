"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Briefcase,
  Clock,
  PoundSterling,
  ArrowLeft,
  Loader2,
  Calendar,
  CheckCircle2,
  User,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Send, CheckCircle } from "lucide-react";

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setJob(result.data);
          
          // Check if user has already applied
          const appliedJobs = JSON.parse(localStorage.getItem('applied_jobs') || '[]');
          if (appliedJobs.includes(id)) {
            setHasApplied(true);
          }
        } else {
          setError(result.message || "Job not found");
        }
      } catch (err) {
        setError("An error occurred while fetching job details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      router.push(`/login?redirect=/jobs/${id}`);
      return;
    }
    if (!id || !job) return;
    
    setIsApplying(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      // Using the same endpoint as property application: POST /interviews
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hostId: job.authorId || '',
          candidateId: user.id,
          notes: `Application for job: ${job.title}`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setHasApplied(true);
        const appliedJobs = JSON.parse(localStorage.getItem('applied_jobs') || '[]');
        localStorage.setItem('applied_jobs', JSON.stringify([...appliedJobs, id]));
        toast.success('Application sent successfully!');
      } else {
        toast.error(result.error || 'Failed to send application');
      }
    } catch (error) {
      console.error('Failed to apply:', error);
      toast.error('An error occurred while sending your application');
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="flex flex-col items-center justify-center pt-40">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading job details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !job) return notFound();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="relative z-10 pt-20 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <Link
            href="/alljobs"
            className="inline-flex items-center gap-2 text-foreground hover:opacity-80 mb-8 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Jobs
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-soft">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Briefcase size={32} />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">
                      {job.title}
                    </h1>
                    <div className="flex items-center gap-3">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {job.status}
                      </span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar size={14} />
                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-foreground mb-4">Job Description</h2>
                <p className="text-foreground/90 leading-relaxed text-base sm:text-lg mb-8 whitespace-pre-wrap">
                  {job.description}
                </p>

                {job.requirements && (
                  <>
                    <h2 className="text-xl font-bold text-foreground mb-4">Requirements</h2>
                    <p className="text-foreground/90 leading-relaxed text-base sm:text-lg mb-8 whitespace-pre-wrap">
                      {job.requirements}
                    </p>
                  </>
                )}

                {job.skills && job.skills.length > 0 && (
                  <>
                    <h2 className="text-xl font-bold text-foreground mb-4">Preferred Skills</h2>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {job.skills.map((skill: string) => (
                        <div key={skill} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border text-sm font-medium text-foreground">
                          <CheckCircle2 size={16} className="text-primary" />
                          {skill}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {job.property && (
                <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-soft">
                  <h2 className="text-xl font-bold text-foreground mb-6">Property Information</h2>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center text-accent-foreground">
                      <Building size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{job.property.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.property.address}, {job.property.city}</p>
                    </div>
                    <Link href={`/properties/${job.property.id}`} className="ml-auto">
                      <Button variant="outline" size="sm">View Property</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="p-6 rounded-2xl border border-border bg-card shadow-soft">
                  <h3 className="text-lg font-bold text-foreground mb-6">Job Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                      <div className="flex items-center gap-3">
                        <PoundSterling size={18} className="text-primary" />
                        <span className="text-sm text-muted-foreground">Budget</span>
                      </div>
                      <span className="text-sm font-bold text-foreground">£{typeof job.budget === 'number' ? job.budget.toLocaleString() : job.budget}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-primary" />
                        <span className="text-sm text-muted-foreground">Location</span>
                      </div>
                      <span className="text-sm font-bold text-foreground">{job.location}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                      <div className="flex items-center gap-3">
                        <Clock size={18} className="text-primary" />
                        <span className="text-sm text-muted-foreground">Duration</span>
                      </div>
                      <span className="text-sm font-bold text-foreground">{job.duration || job.type}</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button 
                      className="w-full bg-gradient-primary !text-white hover:opacity-90 border-0 py-6 text-lg rounded-xl shadow-lg transition-all hover:scale-[1.02]"
                      onClick={handleApply}
                      disabled={isApplying || hasApplied}
                    >
                      {isApplying ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Applying...
                        </div>
                      ) : hasApplied ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle size={20} />
                          Applied
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send size={20} />
                          Apply Now
                        </div>
                      )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-4">
                      {job.applications || 0} applications already received
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
