"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, PoundSterling, Briefcase, Clock, Loader2, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function JobsSection() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && result.data && Array.isArray(result.data.jobs)) {
          setJobs(result.data.jobs.slice(0, 3));
        } else {
          setError(result.message || "Failed to fetch jobs");
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        setError("An error occurred while fetching jobs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <section id="jobs" className="py-20 w-full bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[hsl(195,60%,25%)]">
            Open Opportunities
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-[hsl(195,60%,25%)]">
            Browse active job postings and find your next co-hosting partnership.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p>{error}</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 text-[hsl(195,20%,45%)]">
            <p>No active job postings at the moment.</p>
          </div>
        ) : (
          <div className="relative mb-12">
            <div className={`flex ${jobs.length > 3 ? "animate-scroll" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"}`}>
              {(jobs.length > 3 ? [...jobs, ...jobs] : jobs).map((job, idx) => (
                <div key={`${job.id}-${idx}`} className={jobs.length > 3 ? "w-[350px] flex-shrink-0 px-4" : ""}>
                  <Card
                    className="overflow-hidden bg-white border border-gray-100 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02] cursor-pointer rounded-2xl group flex flex-col h-full"
                    onClick={() => router.push(`/jobs/${job.id}`)}
                  >
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Briefcase size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-[hsl(195,60%,25%)] truncate group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              {job.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-6 line-clamp-2 flex-1">
                        {job.description}
                      </p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-muted-foreground bg-muted/10 p-2 rounded-lg">
                          <MapPin size={16} className="mr-2 text-primary shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground bg-muted/10 p-2 rounded-lg">
                          <Clock size={16} className="mr-2 text-primary shrink-0" />
                          <span>{job.duration || job.type}</span>
                        </div>
                        <div className="flex items-center text-sm font-bold text-[hsl(195,60%,25%)] bg-primary/5 p-2 rounded-lg border border-primary/10">
                          <PoundSterling size={16} className="mr-2 text-primary shrink-0" />
                          <span>{typeof job.budget === 'number' ? `£${job.budget.toLocaleString()}` : job.budget}</span>
                        </div>
                      </div>

                      <Button
                        variant="default"
                        className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-primary text-white shadow-md border-0 mt-auto"
                      >
                        Apply for Job
                        <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <Link href="/alljobs">
            <Button variant="outline" size="lg" className="text-[hsl(195,60%,25%)]">
              View All Jobs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
