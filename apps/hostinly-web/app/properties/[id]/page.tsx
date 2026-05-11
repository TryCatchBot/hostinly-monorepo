export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Bed,
  Bath,
  Users,
  DollarSign,
  ArrowLeft,
  Mail,
  Phone,
} from "lucide-react";
import { getPropertyById } from "@/lib/properties";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PropertyImageCarousel from "@/components/PropertyImageCarousel";

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const propertyId = parseInt(id, 10);
  const property = getPropertyById(propertyId);

  if (!property) notFound();

  const allImages = property.images?.length
    ? property.images
    : [property.image];

  return (
    <div className="min-h-screen bg-[#F8FBFD]">
      <Navigation />
      <main className="relative z-10 pt-20 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-[hsl(195,60%,25%)] hover:opacity-80 mb-8 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Properties
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <div className="relative">
                <PropertyImageCarousel images={allImages} title={property.title} />
                <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-medium">
                  {property.status}
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white/95 backdrop-blur-md border border-[hsl(180,25%,88%)] shadow-soft">
                <h1 className="text-3xl sm:text-4xl font-bold text-[hsl(195,60%,22%)] mb-3 tracking-tight">
                  {property.title}
                </h1>
                <div className="flex items-center text-[hsl(195,20%,45%)] gap-2 mb-6">
                  <MapPin className="h-5 w-5 shrink-0" />
                  <span className="text-lg">{property.location}</span>
                </div>
                <p className="text-[hsl(195,60%,25%)]/90 leading-relaxed text-base sm:text-lg">
                  {property.description}
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white/95 backdrop-blur-md border border-[hsl(180,25%,88%)] shadow-soft">
                <h2 className="text-xl font-semibold text-[hsl(195,60%,22%)] mb-5">
                  Property Details
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(180,30%,96%)] border border-[hsl(180,25%,90%)] hover:border-[hsl(180,40%,85%)] transition-colors">
                    <Bed className="h-5 w-5 text-primary shrink-0" />
                    <span>{property.bedrooms} Bedrooms</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(180,30%,96%)] border border-[hsl(180,25%,90%)] hover:border-[hsl(180,40%,85%)] transition-colors">
                    <Bath className="h-5 w-5 text-primary shrink-0" />
                    <span>{property.bathrooms} Bathrooms</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(180,30%,96%)] border border-[hsl(180,25%,90%)] hover:border-[hsl(180,40%,85%)] transition-colors">
                    <Users className="h-5 w-5 text-primary shrink-0" />
                    <span>Up to {property.maxGuests} guests</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-[hsl(180,30%,96%)] border border-[hsl(180,25%,90%)] hover:border-[hsl(180,40%,85%)] transition-colors">
                    <DollarSign className="h-5 w-5 text-primary shrink-0" />
                    <span>{property.expectedRevenue}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white/95 backdrop-blur-md border border-[hsl(180,25%,88%)] shadow-soft">
                <h2 className="text-xl font-semibold text-[hsl(195,60%,22%)] mb-5">
                  Amenities
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {property.amenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-2 text-[hsl(195,60%,25%)]"
                    >
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-white/95 backdrop-blur-md border border-[hsl(180,25%,88%)] shadow-soft">
                <h2 className="text-xl font-semibold text-[hsl(195,60%,22%)] mb-5">
                  House Rules
                </h2>
                <ul className="space-y-2 text-[hsl(195,60%,25%)]">
                  {property.houseRules.map((rule) => (
                    <li key={rule} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              {property.checkInInstructions && (
                <div className="p-6 sm:p-8 rounded-2xl bg-white/95 backdrop-blur-md border border-[hsl(180,25%,88%)] shadow-soft">
                  <h2 className="text-xl font-semibold text-[hsl(195,60%,22%)] mb-5">
                    Check-in Instructions
                  </h2>
                  <p className="text-[hsl(195,60%,25%)]/90">
                    {property.checkInInstructions}
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="p-6 rounded-2xl border border-[hsl(180,25%,88%)] bg-white/95 backdrop-blur-md shadow-soft">
                  <h3 className="text-lg font-semibold text-[hsl(195,60%,25%)] mb-4">
                    Co-Host in Charge
                  </h3>
                  <div className="space-y-3">
                    <p className="font-medium text-[hsl(195,60%,25%)]">
                      {property.coHost.name}
                    </p>
                    <p className="text-sm text-[hsl(195,20%,45%)]">
                      {property.coHost.bio}
                    </p>
                    <div className="pt-4 space-y-3 border-t border-[hsl(180,20%,90%)]">
                      <a
                        href={`mailto:${property.coHost.email}`}
                        className="flex items-center gap-3 text-[hsl(195,60%,25%)] hover:text-primary transition-colors"
                      >
                        <Mail className="h-5 w-5 shrink-0" />
                        {property.coHost.email}
                      </a>
                      <a
                        href={`tel:${property.coHost.phone.replace(/\s/g, "")}`}
                        className="flex items-center gap-3 text-[hsl(195,60%,25%)] hover:text-primary transition-colors"
                      >
                        <Phone className="h-5 w-5 shrink-0" />
                        {property.coHost.phone}
                      </a>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    <a href={`mailto:${property.coHost.email}`}>
                      <Button className="w-full bg-gradient-primary !text-white hover:opacity-90 border-0">
                        Contact Co-Host
                      </Button>
                    </a>
                    <a href={`tel:${property.coHost.phone.replace(/\s/g, "")}`}>
                      <Button
                        variant="outline"
                        className="w-full text-[hsl(195,60%,25%)]"
                      >
                        Call Co-Host
                      </Button>
                    </a>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-[hsl(40,100%,96%)] to-[hsl(40,90%,92%)] border border-[hsl(40,75%,85%)] shadow-soft">
                  <p className="text-sm text-[hsl(195,60%,25%)]">
                    <strong>Expected revenue:</strong> {property.expectedRevenue}
                    <br />
                    Interested in becoming the co-host for this property? Reach out
                    to the owner&apos;s contact above.
                  </p>
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
