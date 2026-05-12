"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Bed,
  Bath,
  DollarSign,
  Search,
  ArrowLeft,
} from "lucide-react";
import { properties, type Property } from "@/lib/properties";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ITEMS_PER_PAGE = 6;

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [bedroomsFilter, setBedroomsFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [loadedCount, setLoadedCount] = useState(ITEMS_PER_PAGE);
  const [loadMoreRef, setLoadMoreRef] = useState<HTMLDivElement | null>(null);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBedrooms =
        !bedroomsFilter || p.bedrooms >= parseInt(bedroomsFilter);
      const matchesLocation =
        !locationFilter || p.state === locationFilter;
      return matchesSearch && matchesBedrooms && matchesLocation;
    });
  }, [searchQuery, bedroomsFilter, locationFilter]);

  const displayedProperties = useMemo(
    () => filteredProperties.slice(0, loadedCount),
    [filteredProperties, loadedCount]
  );
  const hasMore = displayedProperties.length < filteredProperties.length;

  const loadMore = useCallback(() => {
    setLoadedCount((prev) =>
      Math.min(prev + ITEMS_PER_PAGE, filteredProperties.length)
    );
  }, [filteredProperties.length]);

  useEffect(() => {
    if (!loadMoreRef || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "100px", threshold: 0.1 }
    );
    observer.observe(loadMoreRef);
    return () => observer.disconnect();
  }, [loadMoreRef, hasMore, loadMore]);

  const locations = useMemo(
    () => Array.from(new Set(properties.map((p) => p.state))).sort(),
    []
  );

  return (
    <div className="min-h-screen bg-[#F8FBFD]">
      <Navigation />
      <main className="relative z-10 pt-20 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/#properties"
            className="inline-flex items-center gap-2 text-[hsl(195,60%,25%)] hover:opacity-80 mb-8 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(40,100%,96%)] border border-[hsl(40,80%,88%)] text-[hsl(40,90%,35%)] text-sm font-medium mb-6">
              {filteredProperties.length} properties available
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 text-[hsl(195,60%,22%)] tracking-tight">
              All Properties Looking for Co-Hosts
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mx-auto text-[hsl(195,40%,35%)] leading-relaxed">
              Browse our full catalog of available properties. Use search and
              filters to find your perfect match.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-[hsl(180,25%,88%)] shadow-medium">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(195,20%,45%)]" />
              <input
                type="text"
                placeholder="Search by title, city, or location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setLoadedCount(ITEMS_PER_PAGE);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[hsl(180,20%,90%)] bg-white text-[hsl(195,60%,25%)] placeholder:text-[hsl(195,20%,45%)] focus:outline-none focus:ring-2 focus:ring-[hsl(180,50%,35%)]"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={bedroomsFilter}
                onChange={(e) => {
                  setBedroomsFilter(e.target.value);
                  setLoadedCount(ITEMS_PER_PAGE);
                }}
                className="px-4 py-2.5 rounded-lg border border-[hsl(180,20%,90%)] bg-white text-[hsl(195,60%,25%)] focus:outline-none focus:ring-2 focus:ring-[hsl(180,50%,35%)]"
              >
                <option value="">Any bedrooms</option>
                <option value="1">1+ beds</option>
                <option value="2">2+ beds</option>
                <option value="3">3+ beds</option>
                <option value="4">4+ beds</option>
              </select>
              <select
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setLoadedCount(ITEMS_PER_PAGE);
                }}
                className="px-4 py-2.5 rounded-lg border border-[hsl(180,20%,90%)] bg-white text-[hsl(195,60%,25%)] focus:outline-none focus:ring-2 focus:ring-[hsl(180,50%,35%)]"
              >
                <option value="">All locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-sm text-[hsl(195,20%,45%)] mb-6">
            Showing {displayedProperties.length} of {filteredProperties.length}{" "}
            properties
          </p>

          {displayedProperties.length === 0 ? (
            <div className="text-center py-16 text-[hsl(195,20%,45%)]">
              <p className="text-lg">No properties match your filters.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setBedroomsFilter("");
                  setLocationFilter("");
                  setLoadedCount(ITEMS_PER_PAGE);
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          <div ref={setLoadMoreRef} className="h-20 flex items-center justify-center">
            {hasMore && displayedProperties.length > 0 && (
              <Button
                variant="outline"
                onClick={loadMore}
                className="text-[hsl(195,60%,25%)]"
              >
                Load more properties
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className="overflow-hidden bg-white/95 backdrop-blur-md !border-gray-200 shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-2 rounded-2xl group">
      <Link href={`/properties/${property.id}`}>
        <div className="relative h-56 overflow-hidden rounded-t-2xl">
          <Image
            src={property.image}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-[hsl(195,60%,25%)] px-4 py-1.5 rounded-full text-sm font-semibold shadow-md border border-[hsl(180,20%,90%)]">
            {property.status}
          </div>
        </div>
      </Link>
      <CardContent className="p-6">
        <Link href={`/properties/${property.id}`}>
          <h3 className="text-lg font-semibold mb-2 text-[hsl(195,60%,25%)] hover:underline">
            {property.title}
          </h3>
        </Link>
        <div className="flex items-center text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1 shrink-0" />
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
          <Link href={`/properties/${property.id}`}>
            <Button
              size="sm"
              className="bg-gradient-primary !text-white hover:opacity-95 hover:shadow-md border-0 transition-all"
            >
              Apply Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
