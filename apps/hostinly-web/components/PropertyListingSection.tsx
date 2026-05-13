"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, DollarSign } from "lucide-react";
import Image from "next/image";
import { properties } from "@/lib/properties";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const sampleProperties = properties.slice(0, 3);

export default function PropertyListingSection() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <section id="properties" className="py-20 bg-[hsl(0,0%,100%)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[hsl(195,60%,25%)]">
            Properties Looking for Co-Hosts
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-[hsl(195,60%,25%)]">
            Browse available properties and apply to become a co-host. Grow your
            portfolio with quality listings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {sampleProperties.map((property) => (
            <Card
              key={property.id}
              className="overflow-hidden bg-white border border-gray-100 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-[1.02] cursor-pointer rounded-2xl"
              onClick={() => router.push(`/properties/${property.id}`)}
            >
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {property.status}
                  </div>
                </div>
                <CardContent className="p-5 sm:p-6">
                  <h3 className="text-lg font-bold mb-2 text-[hsl(195,60%,25%)] line-clamp-1">
                    {property.title}
                  </h3>

                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-1.5 text-primary" />
                    <span className="text-sm truncate">{property.location}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground bg-muted/30 p-2.5 rounded-xl">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1.5 text-primary" />
                      <span className="font-medium">{property.bedrooms} beds</span>
                    </div>
                    <div className="flex items-center border-l border-border pl-4">
                      <Bath className="h-4 w-4 mr-1.5 text-primary" />
                      <span className="font-medium">{property.bathrooms} baths</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/50">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Exp. Revenue</span>
                      <div className="flex items-center font-bold text-lg text-primary">
                        <DollarSign className="h-4 w-4 shrink-0" />
                        <span>{property.expectedRevenue}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="bg-gradient-primary text-white hover:opacity-90 shadow-md hover:shadow-lg transition-all border-0 inline-flex items-center justify-center rounded-xl text-sm font-bold h-10 px-5"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (user) {
                          router.push(`/properties/${property.id}`);
                        } else {
                          router.push(`/auth/signup?role=cohost`);
                        }
                      }}
                    >
                      Apply Now
                    </button>
                  </div>
                </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/properties">
            <Button variant="outline" size="lg" className="text-[hsl(195,60%,25%)]">
              View All Properties
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
