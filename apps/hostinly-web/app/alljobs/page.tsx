"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowLeft, Loader2, Briefcase, MapPin, Clock, PoundSterling, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function AllJobsPage() {
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`);
        const result = await response.json();
        
        if (result.success && result.data && Array.isArray(result.data.jobs)) {
          setAllJobs(result.data.jobs);
        } else {
          setError(result.message || "Failed to fetch jobs");
        }
      } catch (err) {
        setError("An error occurred while fetching jobs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return allJobs.filter((j) => {
      const matchesSearch =
        !searchQuery ||
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [allJobs, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="relative z-10 pt-20 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground hover:opacity-80 mb-8 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/50 border border-accent text-accent-foreground text-sm font-medium mb-6">
              {filteredJobs.length} active opportunities
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-foreground tracking-tight">
              Property Management Jobs
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mx-auto text-muted-foreground leading-relaxed">
              Browse available opportunities for co-hosts and property managers. Grow your portfolio today.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12 p-6 rounded-2xl bg-card border border-border shadow-medium">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading jobs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500">
              <p className="text-lg">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">No jobs match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="overflow-hidden bg-card border border-border shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02] cursor-pointer rounded-2xl group flex flex-col"
                >
                  <Link href={`/jobs/${job.id}`} className="flex flex-col h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Briefcase size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
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
                        <div className="flex items-center text-sm text-muted-foreground bg-muted/20 p-2 rounded-lg">
                          <MapPin size={16} className="mr-2 text-primary shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground bg-muted/20 p-2 rounded-lg">
                          <Clock size={16} className="mr-2 text-primary shrink-0" />
                          <span>{job.duration || job.type}</span>
                        </div>
                        <div className="flex items-center text-sm font-bold text-foreground bg-primary/5 p-2 rounded-lg border border-primary/10">
                          <PoundSterling size={16} className="mr-2 text-primary shrink-0" />
                          <span>{typeof job.budget === 'number' ? `£${job.budget.toLocaleString()}` : job.budget}</span>
                        </div>
                      </div>

                      <Button
                        variant="default"
                        className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-primary text-white shadow-md border-0 mt-auto"
                      >
                        View Details
                        <ChevronRight size={16} className="ml-1" />
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
