'use client';

import { useState } from 'react';
import { X, Loader2, Plus, Trash2, Briefcase, MapPin, PoundSterling, Clock, ListChecks, Tag } from 'lucide-react';
import type { JobPosting } from '@/lib/provideData';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPost: (job: JobPosting) => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://hostinly-backend-prod.onrender.com/api";

interface JobForm {
  title: string;
  description: string;
  location: string;
  budget: string;
  duration: string;
  type: string;
  requirements: string;
  skills: string;
}

export default function PostJobModal({ isOpen, onClose, onPost }: PostJobModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState<JobForm[]>([{
    title: '',
    description: '',
    location: '',
    budget: '',
    duration: '',
    type: 'Short-term',
    requirements: '',
    skills: '',
  }]);

  const addJobField = () => {
    setJobs([...jobs, {
      title: '',
      description: '',
      location: '',
      budget: '',
      duration: '',
      type: 'Short-term',
      requirements: '',
      skills: '',
    }]);
  };

  const removeJobField = (index: number) => {
    if (jobs.length > 1) {
      setJobs(jobs.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newJobs = [...jobs];
    newJobs[index] = { ...newJobs[index], [name]: value };
    setJobs(newJobs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate all jobs
    const invalidJob = jobs.find(job => !job.title || !job.description || !job.location || !job.budget);
    if (invalidJob) {
      setError('Please fill in at least Title, Description, Location, and Budget for all jobs');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('hostinly_token');
      
      // Post jobs one by one or in batch if backend supports it
      // For now, we'll post them sequentially to ensure reliability
      const results = [];
      for (const job of jobs) {
        const jobToPost = {
          title: job.title,
          description: job.description,
          budget: `£${job.budget}`,
          location: job.location,
          type: job.type,
          duration: job.duration,
          requirements: job.requirements,
          skills: job.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
          authorId: user?.id,
        };

        const response = await fetch(`${BASE_URL}/jobs`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(jobToPost),
          });

        const result = await response.json();
        if (!result.success) throw new Error(result.error || 'Failed to post a job');
        results.push(result.data);
      }

      // Notify parent about all new jobs
      results.forEach(job => onPost(job));
      
      setJobs([{
        title: '',
        description: '',
        location: '',
        budget: '',
        duration: '',
        type: 'Short-term',
        requirements: '',
        skills: '',
      }]);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while posting the jobs');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full border border-border flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30 rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-black text-foreground">Post New Jobs</h2>
            <p className="text-sm text-muted-foreground">Fill in the details to find the best co-hosts.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold rounded-xl flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            {jobs.map((job, index) => (
              <div key={index} className="relative bg-muted/20 p-8 rounded-3xl border border-border/50 space-y-6">
                {jobs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeJobField(index)}
                    className="absolute -top-3 -right-3 p-2 bg-destructive text-white rounded-full shadow-lg hover:scale-110 transition-transform z-10"
                    title="Remove Job"
                  >
                    <Trash2 size={18} />
                  </button>
                )}

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-black text-sm">
                    {index + 1}
                  </div>
                  <h3 className="font-black text-lg uppercase tracking-wider text-foreground/70">Job Opportunity</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                      <Briefcase size={14} /> Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={job.title}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="e.g. Luxury Villa Management"
                      className="w-full px-5 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                    />
                  </div>

                  {/* Location & Budget */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                      <MapPin size={14} /> Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={job.location}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="City, Country"
                      className="w-full px-5 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                      <PoundSterling size={14} /> Budget (£) *
                    </label>
                    <input
                      type="text"
                      name="budget"
                      value={job.budget}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="e.g. 500 / week"
                      className="w-full px-5 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                    />
                  </div>

                  {/* Type & Duration */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                      <Tag size={14} /> Job Type
                    </label>
                    <select
                      name="type"
                      value={job.type}
                      onChange={(e) => handleChange(index, e)}
                      className="w-full px-5 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                    >
                      <option value="Short-term">Short-term</option>
                      <option value="Long-term">Long-term</option>
                      <option value="One-time">One-time</option>
                      <option value="Seasonal">Seasonal</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                      <Clock size={14} /> Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={job.duration}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="e.g. 3 months"
                      className="w-full px-5 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={job.description}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="What needs to be done?"
                      rows={3}
                      className="w-full px-5 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all font-bold resize-none"
                    />
                  </div>

                  {/* Requirements */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                      <ListChecks size={14} /> Requirements
                    </label>
                    <textarea
                      name="requirements"
                      value={job.requirements}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="What are the must-haves for this job?"
                      rows={2}
                      className="w-full px-5 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all font-bold resize-none"
                    />
                  </div>

                  {/* Skills */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={job.skills}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="e.g. Cleaning, Guest Support, Maintenance"
                      className="w-full px-5 py-3 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addJobField}
              className="w-full py-4 border-2 border-dashed border-primary/30 rounded-3xl text-primary font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary transition-all group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              Add Another Job Listing
            </button>

            <div className="flex gap-4 pt-4 sticky bottom-0 bg-background/80 backdrop-blur-md p-4 -mx-6 rounded-b-2xl border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 py-6 rounded-2xl font-black uppercase tracking-widest border-2"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:scale-[1.01] transition-all"
                style={{ background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))', color: 'white' }}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Posting Opportunities...
                  </div>
                ) : (
                  `Post ${jobs.length} Job${jobs.length > 1 ? 's' : ''} Now`
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
