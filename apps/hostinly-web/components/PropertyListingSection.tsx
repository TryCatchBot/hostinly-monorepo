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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {sampleProperties.map((property) => (
            <Card
              key={property.id}
              className="overflow-hidden bg-white border-1 !border-gray-200 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => router.push(`/properties/${property.id}`)}
            >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-medium">
                    {property.status}
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold mb-2 text-[hsl(195,60%,25%)]">
                    {property.title}
                  </h3>

                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      {property.bedrooms} beds
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {property.bathrooms} baths
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center font-semibold shrink-0 text-primary">
                      <DollarSign className="h-4 w-4 shrink-0" />
                      <span>{property.expectedRevenue}</span>
                    </div>
                    <button
                      type="button"
                      className="bg-gradient-primary text-white hover:opacity-90 border-0 inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3"
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
