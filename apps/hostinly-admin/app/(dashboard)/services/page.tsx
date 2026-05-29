"use client"

import { useEffect, useState } from "react"
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
  Users,
  Calendar,
  MoreHorizontal,
  DollarSign,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { formatCurrency, formatDate, getStatusColor, BASE_URL } from "@/lib/utils"
import { toast } from "sonner"
import type { ServiceProvider, ServiceRequest } from "@/lib/types"

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [providers, setProviders] = useState<ServiceProvider[]>([])
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [providersRes, requestsRes] = await Promise.all([
          fetch(`${BASE_URL}/services/providers`),
          fetch(`${BASE_URL}/services/requests`),
        ])

        if (!providersRes.ok || !requestsRes.ok) {
          throw new Error("Failed to fetch service data");
        }

        const providersData = await providersRes.json()
        const requestsData = await requestsRes.json()

        if (providersData.success) setProviders(providersData.data)
        else toast.error("Failed to fetch service providers")

        if (requestsData.success) setRequests(requestsData.data)
        else toast.error("Failed to fetch service requests")
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || provider.category === categoryFilter
    const matchesStatus = statusFilter === "all" || provider.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const filteredRequests = requests.filter((request) => {
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

  const totalProviders = providers.length
  const activeProviders = providers.filter((p) => p.status === "active").length
  const pendingRequests = requests.filter((r) => r.status === "pending").length
  const avgRating =
    providers.length > 0
      ? providers.reduce((sum, p) => sum + p.rating, 0) / providers.length
      : 0

  const categories = Array.from(new Set(providers.map((p) => p.category)))

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">Loading services...</p>
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
            <h3 className="font-semibold text-lg">Failed to load services</h3>
            <p className="text-sm text-muted-foreground max-w-[300px]">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Manage service providers and requests
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Provider
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Request
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Providers"
          value={totalProviders}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Active Providers"
          value={activeProviders}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests}
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          title="Avg Rating"
          value={avgRating.toFixed(1)}
          icon={<Star className="h-4 w-4" />}
        />
      </div>

      <Tabs defaultValue="providers" className="w-full">
        <TabsList>
          <TabsTrigger value="providers">Service Providers</TabsTrigger>
          <TabsTrigger value="requests">Service Requests</TabsTrigger>
        </TabsList>

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="providers" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Completed Jobs</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProviders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No providers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProviders.map((provider) => (
                      <TableRow key={provider.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={provider.avatar} alt={provider.name} />
                              <AvatarFallback>
                                {provider.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{provider.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {provider.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{provider.category}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span>{provider.rating.toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{provider.completedJobs}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusColor(provider.status)}
                          >
                            {provider.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-xl border-border/50 bg-background animate-in fade-in zoom-in duration-200">
                              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="my-1" />
                              <DropdownMenuItem onClick={() => setSelectedProvider(provider)} className="rounded-md px-2 py-2 text-sm focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-md px-2 py-2 text-sm focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Provider
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="my-1" />
                              <DropdownMenuItem className="rounded-md px-2 py-2 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors cursor-pointer font-medium">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No service requests found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-mono text-xs">
                          {request.id.slice(0, 8)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {request.serviceName}
                        </TableCell>
                        <TableCell>
                          {request.propertyName ?? request.propertyTitle}
                        </TableCell>
                        <TableCell>{formatDate(request.scheduledAt)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusColor(request.status)}
                          >
                            {request.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-xl border-border/50 bg-background animate-in fade-in zoom-in duration-200">
                              <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="my-1" />
                              <DropdownMenuItem onClick={() => setSelectedRequest(request)} className="rounded-md px-2 py-2 text-sm focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-md px-2 py-2 text-sm focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Request
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="my-1" />
                              <DropdownMenuItem className="rounded-md px-2 py-2 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors cursor-pointer font-medium">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Provider Details Sheet */}
      <Sheet
        open={!!selectedProvider}
        onOpenChange={(open) => !open && setSelectedProvider(null)}
      >
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Provider Details</SheetTitle>
            <SheetDescription>
              Information about the service provider
            </SheetDescription>
          </SheetHeader>
          {selectedProvider && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={selectedProvider.avatar}
                    alt={selectedProvider.name}
                  />
                  <AvatarFallback className="text-xl">
                    {selectedProvider.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedProvider.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className={getStatusColor(selectedProvider.status)}
                  >
                    {selectedProvider.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedProvider.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">
                      {selectedProvider.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium border-b pb-2">Contact Info</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {selectedProvider.email}
                  </div>
                  {selectedProvider.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {selectedProvider.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {selectedProvider.location}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Provider
                </Button>
                <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Request Details Sheet */}
      <Sheet
        open={!!selectedRequest}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
      >
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Request Details</SheetTitle>
            <SheetDescription>
              Information about the service request
            </SheetDescription>
          </SheetHeader>
          {selectedRequest && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedRequest.serviceName}
                </h3>
                <Badge
                  variant="outline"
                  className={getStatusColor(selectedRequest.status)}
                >
                  {selectedRequest.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Property</p>
                  <p className="font-medium">
                    {selectedRequest.propertyName ?? selectedRequest.propertyTitle}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Requested By</p>
                  <p className="font-medium">{selectedRequest.requestedBy}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Scheduled Date</p>
                <div className="flex items-center gap-2 font-medium">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatDate(selectedRequest.scheduledAt)}
                </div>
              </div>

              {selectedRequest.description && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{selectedRequest.description}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Request
                </Button>
                {selectedRequest.status === "pending" && (
                  <Button variant="outline" className="flex-1 text-emerald-500">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              provider and all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
