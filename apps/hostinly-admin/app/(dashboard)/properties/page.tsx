"use client";

import { useState } from "react";
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
import { properties } from "@/lib/mock-data";
import type { Property } from "@/lib/types";
import {
  formatCurrency,
  getStatusColor,
  formatStatus,
} from "@/lib/utils";
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
            {property.location.city}, {property.location.country}
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
    key: "ownerName",
    header: "Owner",
    sortable: true,
    cell: (property: Property) => (
      <span className="text-muted-foreground">{property.ownerName}</span>
    ),
  },
  {
    key: "pricing",
    header: "Price/Night",
    sortable: false,
    cell: (property: Property) => (
      <span className="font-medium">
        {formatCurrency(property.pricing.nightlyRate)}
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
          <span>{property.rating}</span>
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
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSheetOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Edit Property
          </DropdownMenuItem>
          {property.status === "pending" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-emerald-500">
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
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
                  {property.location.address}, {property.location.city}
                </span>
              </div>
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
                <p className="text-lg font-semibold mt-1">{property.maxGuests}</p>
                <p className="text-xs text-muted-foreground">Guests</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <Star className="h-5 w-5 mx-auto text-muted-foreground" />
                <p className="text-lg font-semibold mt-1">
                  {property.rating || "-"}
                </p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>

            {/* Price */}
            <div>
              <p className="text-sm text-muted-foreground">Price per night</p>
              <p className="text-2xl font-bold">
                {formatCurrency(property.pricing.nightlyRate)}
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
              {property.status === "pending" && (
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
                  <span className="text-sm">{property.rating}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {property.location.city}, {property.location.country}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Bed className="h-3 w-3" /> {property.bedrooms}
              </span>
              <span className="flex items-center gap-1">
                <Bath className="h-3 w-3" /> {property.bathrooms}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {property.maxGuests}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="font-semibold">
                {formatCurrency(property.pricing.nightlyRate)}
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
                  {property.location.address}, {property.location.city}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Price per night</p>
              <p className="text-2xl font-bold">
                {formatCurrency(property.pricing.nightlyRate)}
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
      { value: "apartment", label: "Apartment" },
      { value: "house", label: "House" },
      { value: "villa", label: "Villa" },
      { value: "condo", label: "Condo" },
      { value: "studio", label: "Studio" },
      { value: "penthouse", label: "Penthouse" },
    ],
  },
  {
    key: "status",
    label: "Status",
    options: [
      { value: "active", label: "Active" },
      { value: "pending", label: "Pending" },
      { value: "under_review", label: "Under Review" },
      { value: "rejected", label: "Rejected" },
      { value: "inactive", label: "Inactive" },
    ],
  },
];

export default function PropertiesPage() {
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
              {properties.filter((p) => p.status === "pending").length}
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
              data={properties.filter((p) => p.status === "pending")}
              columns={columns}
              searchPlaceholder="Search pending properties..."
              searchKey="title"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {properties
                .filter((p) => p.status === "pending")
                .map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active">
          {viewMode === "table" ? (
            <DataTable
              data={properties.filter((p) => p.status === "active")}
              columns={columns}
              searchPlaceholder="Search active properties..."
              searchKey="title"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {properties
                .filter((p) => p.status === "active")
                .map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
