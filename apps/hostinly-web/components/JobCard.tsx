import Link from 'next/link';
import { MapPin, PoundSterling, Clock, Users, Briefcase, ChevronRight, Tag } from 'lucide-react';
import { type JobPosting } from '@/lib/provideData';

interface JobCardProps {
  job: JobPosting;
  viewMode?: 'grid' | 'list';
}

export default function JobCard({ job, viewMode = 'grid' }: JobCardProps) {
  const isGrid = viewMode === 'grid';

  if (!isGrid) {
    return (
      <Link
        href={`/dashboard/jobs/${job.id}`}
        className="bg-background rounded-xl shadow-sm border border-border p-4 hover:shadow-md transition-all cursor-pointer group flex items-center gap-6"
      >
        <div className="hidden sm:flex h-12 w-12 rounded-lg bg-primary/10 items-center justify-center text-primary shrink-0">
          <Briefcase size={24} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold text-lg text-foreground truncate group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              job.status === 'open'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {job.status}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
              {job.type}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{job.propertyLocation}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{job.duration || job.type}</span>
            </div>
            <div className="flex items-center gap-1 font-semibold text-foreground">
              <PoundSterling size={14} className="text-primary" />
              <span>{typeof job.budget === 'number' ? `£${job.budget.toLocaleString('en-GB')}` : (job.budget as string).replace('$', '')}</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 px-6 border-l border-border">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Applications</p>
            <div className="flex items-center justify-center gap-1 font-bold text-foreground">
              <Users size={16} className="text-primary" />
              <span>{job.applications}</span>
            </div>
          </div>
          {job.skills && job.skills.length > 0 && (
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Skills</p>
              <div className="flex gap-1">
                {job.skills.slice(0, 2).map((skill, i) => (
                  <span key={i} className="text-[10px] bg-muted px-1.5 py-0.5 rounded">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
            <ChevronRight size={20} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/dashboard/jobs/${job.id}`}
      className="bg-background rounded-2xl shadow-sm border border-border p-6 hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <Briefcase size={24} />
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            job.status === 'open'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {job.status}
          </div>
          <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
            {job.type}
          </div>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {job.title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <MapPin size={16} className="text-primary/60" />
          <span>{job.propertyLocation}</span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {job.skills.map((skill, i) => (
              <span key={i} className="flex items-center gap-1 text-[10px] font-bold bg-muted px-2 py-1 rounded-lg text-muted-foreground">
                <Tag size={10} />
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 rounded-xl">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Budget</p>
          <div className="flex items-center gap-1 font-bold text-lg text-foreground">
            <PoundSterling size={18} className="text-primary" />
            <span>{typeof job.budget === 'number' ? `${job.budget.toLocaleString('en-GB')}` : (job.budget as string).replace('$', '')}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Duration</p>
          <div className="flex items-center gap-1 font-bold text-foreground">
            <Clock size={18} className="text-primary" />
            <span className="text-sm">{job.duration || job.type}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Users size={16} className="text-primary" />
          <span>{job.applications} Applicants</span>
        </div>
        <div className="text-primary font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Details <ChevronRight size={16} />
        </div>
      </div>
    </Link>
  );
}
