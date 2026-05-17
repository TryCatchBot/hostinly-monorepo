"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DataTable } from "@/components/dashboard/data-table";
import type { Property } from "@/lib/types";
import {
  formatCurrency,
  getStatusColor,
  formatStatus,
  API_URL,
} from "@/lib/utils";
import { toast } from "sonner";
import {
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Trash2,
  Star,
  MapPin,
  Bed,
  Bath,
  Users,
  LayoutGrid,
  List,
} from "lucide-react";
import { ExternalLink } from "lucide-react";

const columns = [
  {
    key: "title",
    header: "Property",
    sortable: true,
    cell: (property: Property) => (
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
          <Image
            src={property.images[0] || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="font-medium truncate">{property.title}</p>
          <p className="text-sm text-muted-foreground truncate">
            {property.city}, {property.country}
          </p>
        </div>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    sortable: true,
    cell: (property: Property) => (
      <Badge variant="outline">{formatStatus(property.type)}</Badge>
    ),
  },
  {
    key: "airbnbLink",
    header: "Airbnb",
    sortable: false,
    cell: (property: Property) => (
      property.airbnbLink ? (
        <a
          href={property.airbnbLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center gap-1 font-medium text-xs"
        >
          <ExternalLink className="h-3 w-3" />
          Link
        </a>
      ) : (
        <span className="text-muted-foreground text-xs">-</span>
      )
    ),
  },
  {
    key: "ownerName",
    header: "Owner",
    sortable: true,
    cell: (property: Property) => (
      <span className="text-muted-foreground">{property.ownerName}</span>
    ),
  },
  {
    key: "price",
    header: "Price/Night",
    sortable: false,
    cell: (property: Property) => (
      <span className="font-medium">
        {formatCurrency(property.price)}
      </span>
    ),
  },
  {
    key: "rating",
    header: "Rating",
    sortable: true,
    cell: (property: Property) =>
      property.rating ? (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span>{property.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({property.reviewCount})</span>
        </div>
      ) : (
        <span className="text-muted-foreground">No reviews</span>
      ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    cell: (property: Property) => (
      <Badge variant="outline" className={getStatusColor(property.status)}>
        {formatStatus(property.status)}
      </Badge>
    ),
  },
  {
    key: "actions",
    header: "",
    cell: (property: Property) => <PropertyActions property={property} />,
  },
];

function PropertyActions({ property }: { property: Property }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-xl border-border/50 bg-background animate-in fade-in zoom-in duration-200">
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem onClick={() => setSheetOpen(true)} className="rounded-md px-2 py-2 text-sm focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-md px-2 py-2 text-sm focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            Edit Property
          </DropdownMenuItem>
          {property.status === "PENDING" && (
            <>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem className="rounded-md px-2 py-2 text-sm text-emerald-500 focus:bg-emerald-50 focus:text-emerald-600 transition-colors cursor-pointer font-medium">
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-md px-2 py-2 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors cursor-pointer font-medium">
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem className="rounded-md px-2 py-2 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors cursor-pointer font-medium">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Property
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Property Details</SheetTitle>
            <SheetDescription>
              Complete information about this property
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {/* Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <Image
                src={property.images[0] || "/placeholder.svg"}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Title and Status */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold">{property.title}</h3>
                <Badge
                  variant="outline"
                  className={getStatusColor(property.status)}
                >
                  {formatStatus(property.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {property.address}, {property.city}
                </span>
              </div>
              {property.airbnbLink && (
                <div className="mt-3">
                  <a
                    href={property.airbnbLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-bold text-sm bg-primary/10 px-3 py-1.5 rounded-lg"
                  >
                    <ExternalLink size={14} />
                    View on Airbnb
                  </a>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <Bed className="h-5 w-5 mx-auto text-muted-foreground" />
                <p className="text-lg font-semibold mt-1">{property.bedrooms}</p>
                <p className="text-xs text-muted-foreground">Beds</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <Bath className="h-5 w-5 mx-auto text-muted-foreground" />
                <p className="text-lg font-semibold mt-1">{property.bathrooms}</p>
                <p className="text-xs text-muted-foreground">Baths</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <Users className="h-5 w-5 mx-auto text-muted-foreground" />
                <p className="text-lg font-semibold mt-1">{property.guests}</p>
                <p className="text-xs text-muted-foreground">Guests</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <Star className="h-5 w-5 mx-auto text-muted-foreground" />
                <p className="text-lg font-semibold mt-1">
                  {property.rating ? property.rating.toFixed(1) : "-"}
                </p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-sm text-muted-foreground">Price per night</p>
              <p className="text-2xl font-bold">
                {formatCurrency(property.price)}
              </p>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-medium mb-2">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Owner */}
            <div>
              <h4 className="font-medium mb-2">Owner</h4>
              <p className="text-sm">{property.ownerName}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">
                <Edit className="mr-2 h-4 w-4" />
                Edit Property
              </Button>
              {property.status === "PENDING" && (
                <Button variant="outline" className="flex-1 text-emerald-500">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function PropertyCard({ property }: { property: Property }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSheetOpen(true)}>
        <div className="relative aspect-[4/3] bg-muted">
          <Image
            src={property.images[0] || "/placeholder.svg"}
            alt={property.title}
            fill
            className="object-cover"
          />
          <Badge
            variant="outline"
            className={`absolute top-2 right-2 ${getStatusColor(property.status)} bg-background/80 backdrop-blur-sm`}
          >
            {formatStatus(property.status)}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold line-clamp-1">{property.title}</h3>
              {property.rating && (
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm">{property.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {property.city}, {property.country}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Bed className="h-3 w-3" /> {property.bedrooms}
              </span>
              <span className="flex items-center gap-1">
                <Bath className="h-3 w-3" /> {property.bathrooms}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {property.guests}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="font-semibold">
                {formatCurrency(property.price)}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / night
                </span>
              </span>
              <Badge variant="outline">{formatStatus(property.type)}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Property Details</SheetTitle>
            <SheetDescription>
              Complete information about this property
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {/* Same content as PropertyActions sheet */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <Image
                src={property.images[0] || "/placeholder.svg"}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-lg font-semibold">{property.title}</h3>
                <Badge
                  variant="outline"
                  className={getStatusColor(property.status)}
                >
                  {formatStatus(property.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                <span>
                  {property.address}, {property.city}
                </span>
              </div>
              {property.airbnbLink && (
                <div className="mt-3">
                  <a
                    href={property.airbnbLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline font-bold text-sm bg-primary/10 px-3 py-1.5 rounded-lg"
                  >
                    <ExternalLink size={14} />
                    View on Airbnb
                  </a>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price per night</p>
              <p className="text-2xl font-bold">
                {formatCurrency(property.price)}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">
                {property.description}
              </p>
            </div>
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">
                <Edit className="mr-2 h-4 w-4" />
                Edit Property
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

const filters = [
  {
    key: "type",
    label: "Type",
    options: [
      { value: "APARTMENT", label: "Apartment" },
      { value: "HOUSE", label: "House" },
      { value: "VILLA", label: "Villa" },
      { value: "CONDO", label: "Condo" },
      { value: "STUDIO", label: "Studio" },
      { value: "PENTHOUSE", label: "Penthouse" },
    ],
  },
  {
    key: "status",
    label: "Status",
    options: [
      { value: "AVAILABLE", label: "Available" },
      { value: "MANAGED", label: "Managed" },
      { value: "INACTIVE", label: "Inactive" },
      { value: "PENDING", label: "Pending" },
    ],
  },
];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_URL}/properties`);
        const data = await response.json();
        if (data.success) {
          setProperties(data.data);
        } else {
          setError(data.message);
          toast.error(data.message || "Failed to fetch properties");
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">Failed to load properties</h3>
            <p className="text-sm text-muted-foreground max-w-[300px]">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage property listings, approvals, and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Properties</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Approval
            <Badge variant="secondary" className="ml-2">
              {properties.filter((p) => p.status === "PENDING").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {viewMode === "table" ? (
            <DataTable
              data={properties}
              columns={columns}
              filters={filters}
              searchPlaceholder="Search properties..."
              searchKey="title"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending">
          {viewMode === "table" ? (
            <DataTable
              data={properties.filter((p) => p.status === "PENDING")}
              columns={columns}
              filters={filters}
              searchPlaceholder="Search properties..."
              searchKey="title"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {properties.filter((p) => p.status === "PENDING").map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="active">
          {viewMode === "table" ? (
            <DataTable
              data={properties.filter((p) => p.status === "AVAILABLE" || p.status === "MANAGED")}
              columns={columns}
              filters={filters}
              searchPlaceholder="Search properties..."
              searchKey="title"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {properties.filter((p) => p.status === "AVAILABLE" || p.status === "MANAGED").map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}