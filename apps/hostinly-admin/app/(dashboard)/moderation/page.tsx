"use client"

import { useState } from "react"
import {
  Shield,
  Search,
  Eye,
  Ban,
  CheckCircle2,
  AlertTriangle,
  Flag,
  MessageSquare,
  Image,
  User,
  Home,
  Clock,
  XCircle,
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
import { mockModerationQueue } from "@/lib/mock-data"
import { formatDate, formatRelativeTime, getStatusColor } from "@/lib/utils"
import type { ModerationItem } from "@/lib/types"

export default function ModerationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject" | "ban" | null>(null)

  const filteredQueue = mockModerationQueue.filter((item) => {
    const matchesSearch =
      item.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter
    return matchesSearch && matchesType && matchesPriority
  })

  const pendingItems = mockModerationQueue.filter((i) => i.status === "pending").length
  const highPriorityItems = mockModerationQueue.filter((i) => i.priority === "high").length
  const resolvedToday = mockModerationQueue.filter(
    (i) =>
      i.status === "resolved" &&
      new Date(i.resolvedAt!).toDateString() === new Date().toDateString()
  ).length
  const avgResponseTime = "2.4h"

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="h-4 w-4" />
      case "property":
        return <Home className="h-4 w-4" />
      case "review":
        return <MessageSquare className="h-4 w-4" />
      case "image":
        return <Image className="h-4 w-4" />
      default:
        return <Flag className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleAction = (action: "approve" | "reject" | "ban") => {
    setSelectedAction(action)
    setActionDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Moderation</h1>
        <p className="text-muted-foreground">
          Review and moderate flagged content and users
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Review"
          value={pendingItems.toString()}
          icon={<Clock className="h-4 w-4" />}
          change={-8}
        />
        <StatCard
          title="High Priority"
          value={highPriorityItems.toString()}
          icon={<AlertTriangle className="h-4 w-4" />}
          change={-2}
        />
        <StatCard
          title="Resolved Today"
          value={resolvedToday.toString()}
          icon={<CheckCircle2 className="h-4 w-4" />}
          change={15}
        />
        <StatCard
          title="Avg Response Time"
          value={avgResponseTime}
          icon={<Clock className="h-4 w-4" />}
          change={12}
        />
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Moderation Queue
          </CardTitle>
          <CardDescription>
            Review reported content, users, and properties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="all">All Items</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
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
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="property">Property</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead className="hidden md:table-cell">Reason</TableHead>
                      <TableHead className="hidden lg:table-cell">Reported By</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Reported</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQueue.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                              {getTypeIcon(item.type)}
                            </div>
                            <span className="capitalize text-sm hidden sm:inline">
                              {item.type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-sm">{item.targetName}</div>
                          <div className="text-xs text-muted-foreground">{item.targetId}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="truncate max-w-[150px] block text-sm">
                            {item.reason}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">
                          {item.reportedBy}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(item.priority) as "default" | "secondary" | "destructive" | "outline"} className="capitalize">
                            {item.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(item.status) as "default" | "secondary" | "destructive" | "outline"}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {formatRelativeTime(item.reportedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedItem(item)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {item.status === "pending" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-emerald-500"
                                onClick={() => {
                                  setSelectedItem(item)
                                  handleAction("approve")
                                }}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQueue
                      .filter((i) => i.type === "user")
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={item.targetAvatar} alt={item.targetName} />
                                <AvatarFallback>
                                  {item.targetName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="font-medium text-sm">{item.targetName}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{item.reason}</TableCell>
                          <TableCell>{item.reportCount} reports</TableCell>
                          <TableCell>
                            <Badge variant={getPriorityColor(item.priority) as "default" | "secondary" | "destructive" | "outline"} className="capitalize">
                              {item.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="text-emerald-500">
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Clear
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500">
                                <Ban className="h-4 w-4 mr-1" />
                                Ban
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Content</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQueue
                      .filter((i) => i.type !== "user")
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                {getTypeIcon(item.type)}
                              </div>
                              <div className="font-medium text-sm">{item.targetName}</div>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize text-sm">{item.type}</TableCell>
                          <TableCell className="text-sm">{item.reason}</TableCell>
                          <TableCell>
                            <Badge variant={getPriorityColor(item.priority) as "default" | "secondary" | "destructive" | "outline"} className="capitalize">
                              {item.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="text-emerald-500">
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Keep
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500">
                                <XCircle className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="resolved" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Resolution</TableHead>
                      <TableHead>Resolved By</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQueue
                      .filter((i) => i.status === "resolved")
                      .map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-sm">{item.targetName}</TableCell>
                          <TableCell className="capitalize text-sm">{item.type}</TableCell>
                          <TableCell>
                            <Badge
                              variant={item.resolution === "approved" ? "default" : "destructive"}
                              className="capitalize"
                            >
                              {item.resolution}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{item.resolvedBy}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(item.resolvedAt!)}
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

      {/* Item Detail Sheet */}
      <Sheet open={!!selectedItem && !actionDialogOpen} onOpenChange={() => setSelectedItem(null)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Review Details</SheetTitle>
            <SheetDescription>
              Review the reported item and take action
            </SheetDescription>
          </SheetHeader>
          {selectedItem && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                  {getTypeIcon(selectedItem.type)}
                </div>
                <div>
                  <div className="font-semibold">{selectedItem.targetName}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getPriorityColor(selectedItem.priority) as "default" | "secondary" | "destructive" | "outline"} className="capitalize">
                      {selectedItem.priority} priority
                    </Badge>
                    <Badge variant={getStatusColor(selectedItem.status) as "default" | "secondary" | "destructive" | "outline"}>
                      {selectedItem.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Reason for Report</div>
                  <div className="mt-1 font-medium">{selectedItem.reason}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Details</div>
                  <div className="mt-1 text-sm rounded-lg bg-muted/50 p-3">
                    {selectedItem.details}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Reported By</div>
                    <div>{selectedItem.reportedBy}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Report Count</div>
                    <div>{selectedItem.reportCount} reports</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Reported At</div>
                  <div>{formatDate(selectedItem.reportedAt)}</div>
                </div>
              </div>

              {selectedItem.status === "pending" && (
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => handleAction("approve")}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button variant="outline" onClick={() => handleAction("reject")}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  {selectedItem.type === "user" && (
                    <Button variant="destructive" onClick={() => handleAction("ban")}>
                      <Ban className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedAction === "approve" && "Approve Item"}
              {selectedAction === "reject" && "Reject Item"}
              {selectedAction === "ban" && "Ban User"}
            </DialogTitle>
            <DialogDescription>
              {selectedAction === "approve" &&
                "This will clear the report and mark the content as approved."}
              {selectedAction === "reject" &&
                "This will remove the reported content from the platform."}
              {selectedAction === "ban" &&
                "This will permanently ban the user from the platform. This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Note (Optional)</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Add a note about this decision..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={selectedAction === "ban" ? "destructive" : "default"}
              onClick={() => {
                setActionDialogOpen(false)
                setSelectedItem(null)
              }}
            >
              Confirm {selectedAction}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
