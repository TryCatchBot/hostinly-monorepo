"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { mockCoHosts } from "@/lib/provideData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CoHostsSection() {
  const router = useRouter();
  const [cohosts, setCohosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCohosts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cohosts`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setCohosts(result.data.slice(0, 3).map((c: any) => ({
            id: c.id,
            name: c.name || 'Anonymous',
            title: (c.specialties && c.specialties[0]) || 'Property Expert',
            rating: c.rating || 5,
            reviews: c.totalReviews || 0,
            image: c.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
            specialties: c.specialties || []
          })));
        } else {
          setCohosts(mockCoHosts.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch cohosts:', err);
        setCohosts(mockCoHosts.slice(0, 3));
      } finally {
        setIsLoading(false);
      }
    };
    fetchCohosts();
  }, []);

  return (
    <section id="cohosts" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[hsl(195,60%,25%)]">
            Expert Co-Hosts Ready to Help
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-[hsl(195,60%,25%)]">
            Connect with top-rated property managers and hospitality experts to optimize your rental income.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {cohosts.map((cohost) => (
              <Card
                key={cohost.id}
                className="overflow-hidden bg-white border border-gray-100 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02] cursor-pointer rounded-2xl"
                onClick={() => router.push(`/auth/signup?role=host`)}
              >
                  <div className="relative h-48 sm:h-56 overflow-hidden">
                    <Image
                      src={cohost.image}
                      alt={cohost.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-1 text-[hsl(195,60%,25%)]">
                      {cohost.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{cohost.title}</p>

                    <div className="flex items-center gap-2 mb-6">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-foreground">{cohost.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">({cohost.reviews} reviews)</span>
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
                      className="w-full py-2.5 rounded-xl text-sm font-bold bg-gradient-primary text-white shadow-md"
                    >
                      Connect Now
                    </Button>
                  </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/auth/signup?role=host">
            <Button variant="outline" size="lg" className="text-[hsl(195,60%,25%)]">
              View All Co-Hosts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
