"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CoHostsSection() {
  const router = useRouter();
  const [cohosts, setCohosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCohosts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cohosts`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setCohosts(result.data.map((c: any) => ({
            id: c.id,
            name: c.name || 'Anonymous',
            title: (c.specialties && c.specialties[0]) || 'Property Expert',
            rating: c.rating || 5,
            reviews: c.totalReviews || 0,
            image: c.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
            specialties: c.specialties || []
          })));
        } else {
          setError(result.message || "Failed to fetch co-hosts");
        }
      } catch (err) {
        console.error('Failed to fetch cohosts:', err);
        setError("An error occurred while fetching co-hosts");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCohosts();
  }, []);

  return (
    <section id="cohosts" className="py-20 w-full bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Expert Co-Hosts Ready to Help
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-white">
            Connect with top-rated property managers and hospitality experts to optimize your rental income.
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
        ) : cohosts.length === 0 ? (
          <div className="text-center py-20 text-white">
            <p>No co-hosts available at the moment.</p>
          </div>
        ) : (
          <div className="relative mb-12">
            <div className={`flex ${cohosts.length > 3 ? "animate-scroll" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"}`}>
              {(cohosts.length > 3 ? [...cohosts, ...cohosts] : cohosts).map((cohost, idx) => {
                const initials = cohost.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);
                
                const hasImage = cohost.image && !cohost.image.includes('unsplash.com/photo-1494790108377-be9c29b29330');

                return (
                  <div key={`${cohost.id}-${idx}`} className={cohosts.length > 3 ? "w-[350px] flex-shrink-0 px-4" : ""}>
                    <Card
                      className="overflow-hidden bg-white border border-gray-100 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02] cursor-pointer rounded-2xl group h-full"
                      onClick={() => router.push(`/co-host/${cohost.id}`)}
                    >
                        <div className="relative h-48 sm:h-56 overflow-hidden bg-muted flex items-center justify-center">
                          {hasImage ? (
                            <Image
                              src={cohost.image}
                              alt={cohost.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/20 to-primary/10">
                              <span className="text-5xl font-bold text-primary opacity-40 group-hover:scale-110 transition-transform duration-500">
                                {initials}
                              </span>
                            </div>
                          )}
                          <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                            CO-HOST
                          </div>
                        </div>
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-1 text-[hsl(195,60%,25%)]">
                          {cohost.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">{cohost.title}</p>

                        <div className="flex items-center gap-2 mb-6 bg-muted/20 p-2.5 rounded-xl">
                          <div className="flex items-center gap-1">
                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-foreground">{cohost.rating}</span>
                          </div>
                          <span className="text-xs text-[hsl(195,60%,25%)]">({cohost.reviews} reviews)</span>
                        </div>

                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {cohost.specialties.slice(0, 3).map((specialty: string, idx: number) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/5 text-primary text-[10px] font-bold uppercase rounded-lg border border-primary/10"
                              >
                                <Check size={10} />
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Button
                          variant="default"
                          className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-primary text-white shadow-md border-0"
                        >
                          Connect Now
                        </Button>
                      </CardContent>
                  </Card>
                </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center">
          <Link href="/allcohosts">
            <Button variant="outline" size="lg" className="text-white">
              View All Co-Hosts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
