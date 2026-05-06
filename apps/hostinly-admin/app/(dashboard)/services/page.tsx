"use client"

import { useState } from "react"
import {
  Wrench,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from "@/components/dashboard/stat-card"
import { mockServiceProviders, mockServiceRequests } from "@/lib/mock-data"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import type { ServiceProvider, ServiceRequest } from "@/lib/types"

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const filteredProviders = mockServiceProviders.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || provider.category === categoryFilter
    const matchesStatus = statusFilter === "all" || provider.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const filteredRequests = mockServiceRequests.filter((request) => {
    const matchesSearch =
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.propertyName ?? request.propertyTitle)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || (request.category ?? "").toLowerCase() === categoryFilter
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalProviders = mockServiceProviders.length
  const activeProviders = mockServiceProviders.filter((p) => p.status === "active").length
  const pendingRequests = mockServiceRequests.filter((r) => r.status === "pending").length
  const avgRating =
    mockServiceProviders.reduce((sum, p) => sum + p.rating, 0) / mockServiceProviders.length

  const categories = [...new Set(mockServiceProviders.map((p) => p.category))]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
        <p className="text-muted-foreground">
          Manage service providers and service requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Providers"
          value={totalProviders.toString()}
          icon={<Users className="h-4 w-4" />}
          change={8}
        />
        <StatCard
          title="Active Providers"
          value={activeProviders.toString()}
          icon={<CheckCircle2 className="h-4 w-4" />}
          change={5}
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests.toString()}
          icon={<Clock className="h-4 w-4" />}
          change={-12}
        />
        <StatCard
          title="Avg. Rating"
          value={avgRating.toFixed(1)}
          icon={<Star className="h-4 w-4" />}
          change={0.2}
        />
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Service Management</CardTitle>
              <CardDescription>View and manage providers and requests</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Provider
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="providers" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="providers">Providers</TabsTrigger>
                <TabsTrigger value="requests">Requests</TabsTrigger>
              </TabsList>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="capitalize">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="providers" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead className="hidden lg:table-cell">Location</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="hidden sm:table-cell">Jobs</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProviders.map((provider) => (
                      <TableRow key={provider.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={provider.avatar} alt={provider.name} />
                              <AvatarFallback>
                                {provider.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{provider.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {provider.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="capitalize">
                            {provider.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {provider.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium">{provider.rating}</span>
                            <span className="text-xs text-muted-foreground">
                              ({provider.totalReviews})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {provider.completedJobs}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(provider.status) as "default" | "secondary" | "destructive" | "outline"}>
                            {provider.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedProvider(provider)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead className="hidden md:table-cell">Property</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="hidden lg:table-cell">Provider</TableHead>
                      <TableHead className="hidden sm:table-cell">Scheduled</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium text-xs">{request.id}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="truncate max-w-[150px] block">
                            {request.propertyName ?? request.propertyTitle}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {request.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {request.providerName || (
                            <span className="text-muted-foreground italic">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {formatDate(request.scheduledDate ?? request.scheduledAt)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(request.status) as "default" | "secondary" | "destructive" | "outline"}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Provider Detail Sheet */}
      <Sheet open={!!selectedProvider} onOpenChange={() => setSelectedProvider(null)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Provider Details</SheetTitle>
            <SheetDescription>
              View service provider information
            </SheetDescription>
          </SheetHeader>
          {selectedProvider && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedProvider.avatar} alt={selectedProvider.name} />
                  <AvatarFallback className="text-lg">
                    {selectedProvider.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-semibold">{selectedProvider.name}</div>
                  <Badge
                    variant={getStatusColor(selectedProvider.status) as "default" | "secondary" | "destructive" | "outline"}
                    className="mt-1"
                  >
                    {selectedProvider.status}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {selectedProvider.email}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {selectedProvider.phone}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {selectedProvider.location}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedProvider.completedJobs}</div>
                  <div className="text-xs text-muted-foreground">Jobs Done</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    <span className="text-2xl font-bold">{selectedProvider.rating}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedProvider.totalReviews}</div>
                  <div className="text-xs text-muted-foreground">Reviews</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Services Offered</div>
                <div className="flex flex-wrap gap-2">
                  {(selectedProvider.services ?? []).map((service: string) => (
                    <Badge key={service} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Hourly Rate</div>
                <div className="text-xl font-bold text-primary">
                  {selectedProvider.hourlyRate ? `${formatCurrency(selectedProvider.hourlyRate)}/hr` : "—"}
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Edit Provider</Button>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Request Detail Sheet */}
      <Sheet open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Request Details</SheetTitle>
            <SheetDescription>
              View service request information
            </SheetDescription>
          </SheetHeader>
          {selectedRequest && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-sm text-muted-foreground">
                    {selectedRequest.id}
                  </div>
                  <Badge
                    variant={getStatusColor(selectedRequest.status) as "default" | "secondary" | "destructive" | "outline"}
                    className="mt-1"
                  >
                    {selectedRequest.status}
                  </Badge>
                </div>
                <Badge variant="outline" className="capitalize">
                  {selectedRequest.category}
                </Badge>
              </div>

              <div className="grid gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Property</div>
                  <div className="font-medium">{selectedRequest.propertyName ?? selectedRequest.propertyTitle}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Description</div>
                  <div>{selectedRequest.description ?? selectedRequest.notes ?? "—"}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Scheduled Date</div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(selectedRequest.scheduledDate ?? selectedRequest.scheduledAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Estimated Cost</div>
                    <div className="flex items-center gap-1 font-medium">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {selectedRequest.estimatedCost ? formatCurrency(selectedRequest.estimatedCost) : "—"}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Assigned Provider</div>
                  <div className="font-medium">
                    {selectedRequest.providerName || (
                      <span className="text-muted-foreground italic">Not assigned</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {selectedRequest.status === "pending" && (
                  <>
                    <Button className="flex-1">Assign Provider</Button>
                    <Button variant="outline">Reschedule</Button>
                  </>
                )}
                {selectedRequest.status === "in_progress" && (
                  <Button className="flex-1">Mark Complete</Button>
                )}
                {selectedRequest.status === "completed" && (
                  <Button className="flex-1" variant="outline">
                    View Invoice
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Service Provider</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this service provider? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(false)}>
              Remove Provider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
