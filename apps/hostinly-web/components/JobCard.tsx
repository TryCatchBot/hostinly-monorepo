import Link from 'next/link';
import { MapPin, DollarSign, Clock, Users } from 'lucide-react';
import { JobPosting } from '@/lib/mockData';

interface JobCardProps {
  job: JobPosting;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link
      href={`/dashboard/jobs/${job.id}`}
      className="bg-background rounded-lg shadow-medium border border-border p-5 hover:shadow-strong transition-shadow cursor-pointer group block"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-foreground mb-1 hover:text-primary transition-colors">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} />
            <span>{job.propertyLocation}</span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          job.status === 'open'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {job.status === 'open' ? 'Open' : 'Closed'}
        </div>
      </div>

      <p className="text-sm text-foreground mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 py-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Budget</p>
          <div className="flex items-center gap-1 font-bold text-foreground">
            <DollarSign size={16} />
            <span>${job.budget.toLocaleString()}</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Duration</p>
          <div className="flex items-center gap-1 font-medium text-foreground text-sm">
            <Clock size={16} />
            <span>{job.duration}</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Experience</p>
          <p className="font-medium text-foreground text-sm">{job.experience}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Applications</p>
          <div className="flex items-center gap-1 font-medium text-foreground">
            <Users size={16} />
            <span>{job.applications}</span>
          </div>
        </div>
      </div>

      <div
        className="block w-full py-2 rounded-lg text-sm font-medium text-center transition-colors"
        style={{
          background: 'linear-gradient(135deg, hsl(180, 41.50%, 51.80%), hsl(195, 60%, 40%))',
          color: '#ffffff',
        }}
      >
        View & Apply
      </div>
    </Link>
  );
}
