"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CoHostCard from "@/components/CoHostCard";

export default function AllCoHostsPage() {
  const [allCohosts, setAllCohosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCohosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cohosts`);
        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          const mappedCohosts = result.data.map((c: any) => ({
            id: c.id,
            name: c.name || 'Anonymous',
            title: (c.specialties && c.specialties[0]) || 'Property Expert',
            rating: c.rating || 5,
            reviews: c.totalReviews || 0,
            image: c.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
            specialties: c.specialties || [],
            hourlyRate: c.hourlyRate,
          }));
          setAllCohosts(mappedCohosts);
        } else {
          setError(result.message || "Failed to fetch co-hosts");
        }
      } catch (err) {
        setError("An error occurred while fetching co-hosts");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCohosts();
  }, []);

  const filteredCohosts = useMemo(() => {
    return allCohosts.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.specialties.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [allCohosts, searchQuery]);

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
              {filteredCohosts.length} co-hosts ready to help
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-foreground tracking-tight">
              Expert Co-Hosts
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mx-auto text-muted-foreground leading-relaxed">
              Find the perfect co-host for your property. Browse through our network of experienced hospitality professionals.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12 p-6 rounded-2xl bg-card border border-border shadow-medium">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, title, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading co-hosts...</p>
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
          ) : filteredCohosts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">No co-hosts match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCohosts.map((cohost) => (
                <CoHostCard key={cohost.id} cohost={cohost} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
