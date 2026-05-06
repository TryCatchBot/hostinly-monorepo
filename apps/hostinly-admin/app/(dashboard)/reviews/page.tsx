"use client"

import { useState } from "react"
import {
  Star,
  Search,
  Filter,
  Eye,
  Flag,
  Trash2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
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
import { reviews } from "@/lib/mock-data"
import { formatDate, getStatusColor, formatStatus } from "@/lib/utils"
import type { Review } from "@/lib/types"

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [flagDialogOpen, setFlagDialogOpen] = useState(false)

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.reviewerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRating =
      ratingFilter === "all" || review.rating === parseInt(ratingFilter)
    const matchesStatus = statusFilter === "all" || review.status === statusFilter
    const matchesType = typeFilter === "all" || review.reviewerType === typeFilter
    return matchesSearch && matchesRating && matchesStatus && matchesType
  })

  const totalReviews = reviews.length
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  const flaggedReviews = reviews.filter((r) => r.status === "flagged").length
  const pendingReviews = reviews.filter((r) => r.status === "pending").length

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-500 text-yellow-500"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground">
          Manage and moderate guest and host reviews
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Reviews"
          value={totalReviews.toString()}
          icon={<MessageSquare className="h-4 w-4" />}
          change={15}
        />
        <StatCard
          title="Average Rating"
          value={avgRating.toFixed(1)}
          icon={<Star className="h-4 w-4" />}
          change={0.3}
        />
        <StatCard
          title="Flagged Reviews"
          value={flaggedReviews.toString()}
          icon={<Flag className="h-4 w-4" />}
          change={-2}
        />
        <StatCard
          title="Pending Moderation"
          value={pendingReviews.toString()}
          icon={<Clock className="h-4 w-4" />}
          change={-5}
        />
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Review Management</CardTitle>
          <CardDescription>View and moderate all platform reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="all">All Reviews</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="flagged">Flagged</TabsTrigger>
              </TabsList>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-full sm:w-28">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                    <SelectItem value="host">Host</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reviewer</TableHead>
                      <TableHead className="hidden md:table-cell">Property/Guest</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="hidden lg:table-cell">Review</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(review.reviewerName)}`}
                                alt={review.reviewerName}
                              />
                              <AvatarFallback>
                                {review.reviewerName
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{review.reviewerName}</div>
                              <div className="text-xs text-muted-foreground capitalize">
                                {formatStatus(review.reviewerType)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="truncate max-w-[150px] block text-sm">
                            {review.propertyTitle}
                          </span>
                        </TableCell>
                        <TableCell>{renderStars(review.rating)}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="truncate max-w-[200px] block text-sm text-muted-foreground">
                            {review.content.substring(0, 60)}...
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(review.status)}>
                            {review.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedReview(review)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedReview(review)
                                setFlagDialogOpen(true)
                              }}
                            >
                              <Flag className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reviewer</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="hidden md:table-cell">Review</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews
                      .filter((r) => r.status === "pending")
                      .map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(review.reviewerName)}`}
                                  alt={review.reviewerName}
                                />
                                <AvatarFallback>
                                  {review.reviewerName
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium text-sm">{review.reviewerName}</div>
                            </div>
                          </TableCell>
                          <TableCell>{renderStars(review.rating)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <span className="truncate max-w-[250px] block text-sm text-muted-foreground">
                              {review.content.substring(0, 80)}...
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="text-emerald-500">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500">
                                <ThumbsDown className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="flagged" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reviewer</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="hidden md:table-cell">Reason</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews
                      .filter((r) => r.status === "flagged")
                      .map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(review.reviewerName)}`}
                                  alt={review.reviewerName}
                                />
                                <AvatarFallback>
                                  {review.reviewerName
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium text-sm">{review.reviewerName}</div>
                            </div>
                          </TableCell>
                          <TableCell>{renderStars(review.rating)}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {review.flagReason || "Reported content"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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

      {/* Review Detail Sheet */}
      <Sheet open={!!selectedReview && !flagDialogOpen} onOpenChange={() => setSelectedReview(null)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Review Details</SheetTitle>
            <SheetDescription>
              View complete review information
            </SheetDescription>
          </SheetHeader>
          {selectedReview && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedReview.reviewerName)}`}
                    alt={selectedReview.reviewerName}
                  />
                  <AvatarFallback className="text-lg">
                    {selectedReview.reviewerName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{selectedReview.reviewerName}</div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {formatStatus(selectedReview.reviewerType)}
                  </div>
                  {renderStars(selectedReview.rating)}
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Property</div>
                  <div className="font-medium">{selectedReview.propertyTitle}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Review</div>
                  <div className="mt-1 text-sm leading-relaxed">{selectedReview.content}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div>{formatDate(selectedReview.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <Badge variant="outline" className={getStatusColor(selectedReview.status)}>
                      {selectedReview.status}
                    </Badge>
                  </div>
                </div>

                {selectedReview.response && (
                  <div>
                    <div className="text-sm text-muted-foreground">Host Response</div>
                    <div className="mt-1 rounded-lg bg-muted/50 p-3 text-sm">
                      {selectedReview.response}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {selectedReview.status === "pending" && (
                  <>
                    <Button className="flex-1">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}
                {selectedReview.status === "published" && (
                  <>
                    <Button variant="outline" className="flex-1" onClick={() => setFlagDialogOpen(true)}>
                      <Flag className="mr-2 h-4 w-4" />
                      Flag Review
                    </Button>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {selectedReview.status === "flagged" && (
                  <>
                    <Button className="flex-1">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Clear Flag
                    </Button>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Flag Dialog */}
      <Dialog open={flagDialogOpen} onOpenChange={setFlagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Flag Review</DialogTitle>
            <DialogDescription>
              Select a reason for flagging this review. Flagged reviews will be hidden
              until reviewed by a moderator.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2">
            <Button variant="outline" className="justify-start" onClick={() => setFlagDialogOpen(false)}>
              <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
              Inappropriate language
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => setFlagDialogOpen(false)}>
              <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
              Fake or misleading
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => setFlagDialogOpen(false)}>
              <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
              Personal information shared
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => setFlagDialogOpen(false)}>
              <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
              Harassment or discrimination
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => setFlagDialogOpen(false)}>
              <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
              Other violation
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFlagDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
