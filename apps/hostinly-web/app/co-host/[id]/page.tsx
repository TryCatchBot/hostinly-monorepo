"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  MapPin,
  Check,
  Mail,
  Phone,
  ArrowLeft,
  Loader2,
  Briefcase,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CoHostProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [cohost, setCohost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCohost = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cohosts/${id}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setCohost(result.data);
        } else {
          setError(result.message || "Co-host not found");
        }
      } catch (err) {
        setError("An error occurred while fetching co-host details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCohost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="flex flex-col items-center justify-center pt-40">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading co-host profile...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !cohost) return notFound();

  const user = cohost.user || {};
  const initials = (user.name || "Anonymous")
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="relative z-10 pt-20 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <Link
            href="/allcohosts"
            className="inline-flex items-center gap-2 text-foreground hover:opacity-80 mb-8 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Co-Hosts
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="p-6 rounded-2xl border border-border bg-card shadow-soft text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-muted flex items-center justify-center border-4 border-background shadow-md">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-primary">{initials}</span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-foreground mb-1">{user.name}</h1>
                  <p className="text-muted-foreground mb-4">{cohost.specialties?.[0] || 'Professional Co-Host'}</p>
                  
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="flex items-center gap-1">
                      <Star size={18} className="fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-foreground">{cohost.rating || '5.0'}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({cohost.totalReviews || 0} reviews)</span>
                  </div>

                  <div className="pt-6 border-t border-border space-y-3 text-left">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin size={18} className="text-primary shrink-0" />
                      <span className="text-sm">{cohost.location || user.city || 'Location not specified'}</span>
                    </div>
                    {cohost.hourlyRate && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Briefcase size={18} className="text-primary shrink-0" />
                        <span className="text-sm font-semibold text-foreground">£{cohost.hourlyRate}/hour</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <ShieldCheck size={18} className="text-primary shrink-0" />
                      <span className="text-sm">Verified Co-Host</span>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <Button className="w-full bg-gradient-primary !text-white hover:opacity-90 border-0">
                      Contact {user.name.split(' ')[0]}
                    </Button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-accent/50 border border-accent shadow-soft">
                  <h3 className="font-bold text-accent-foreground mb-2 flex items-center gap-2">
                    <Globe size={18} />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cohost.languages?.length > 0 ? cohost.languages.map((lang: string) => (
                      <span key={lang} className="text-xs bg-background/50 px-2 py-1 rounded border border-border">
                        {lang}
                      </span>
                    )) : (
                      <span className="text-xs text-muted-foreground italic">English</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Bio and Details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-soft">
                <h2 className="text-xl font-bold text-foreground mb-4">About</h2>
                <p className="text-foreground/90 leading-relaxed text-base sm:text-lg">
                  {cohost.bio || `${user.name} is a dedicated property management professional with a focus on providing exceptional hospitality and maximizing rental returns for property owners.`}
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-soft">
                <h2 className="text-xl font-bold text-foreground mb-6">Specialties & Expertise</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(cohost.specialties?.length > 0 ? cohost.specialties : ['Check-in Management', 'Cleaning Coordination', 'Guest Communication', 'Maintenance Support']).map((s: string) => (
                    <div key={s} className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-soft">
                <h2 className="text-xl font-bold text-foreground mb-6">Experience</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{cohost.experience || 0} Years in Property Management</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        Managing high-performing short-term rentals with a focus on Superhost standards.
                      </p>
                    </div>
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
