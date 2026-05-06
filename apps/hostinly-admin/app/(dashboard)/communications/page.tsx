"use client"

import { useState } from "react"
import {
  MessageSquare,
  Search,
  Send,
  Mail,
  Bell,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Trash2,
  Plus,
  Filter,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from "@/components/dashboard/stat-card"
import { communications, notificationTemplates } from "@/lib/mock-data"
import { formatDate, formatRelativeTime, getStatusColor, formatStatus } from "@/lib/utils"
import type { Communication, NotificationTemplate } from "@/lib/types"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function CommunicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null)

  const filteredCommunications = communications.filter((comm) => {
    const matchesSearch =
      comm.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.targetAudience.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || comm.type === typeFilter
    const matchesStatus = statusFilter === "all" || comm.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const totalMessages = communications.length
  const sentToday = communications.filter(
    (c) =>
      c.status === "sent" &&
      c.sentAt &&
      new Date(c.sentAt).toDateString() === new Date().toDateString()
  ).length
  const pendingMessages = communications.filter((c) => c.status === "scheduled").length
  const failedMessages = communications.filter((c) => c.status === "failed").length

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "sms":
        return <MessageSquare className="h-4 w-4" />
      case "push":
        return <Bell className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Communications</h1>
        <p className="text-muted-foreground">
          Manage messages, notifications, and templates
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Messages"
          value={totalMessages.toString()}
          icon={<MessageSquare className="h-4 w-4" />}
          change={23}
        />
        <StatCard
          title="Sent Today"
          value={sentToday.toString()}
          icon={<Send className="h-4 w-4" />}
          change={12}
        />
        <StatCard
          title="Pending"
          value={pendingMessages.toString()}
          icon={<Clock className="h-4 w-4" />}
          change={-3}
        />
        <StatCard
          title="Failed"
          value={failedMessages.toString()}
          icon={<AlertTriangle className="h-4 w-4" />}
          change={-1}
        />
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Communication Center</CardTitle>
              <CardDescription>View all messages and manage templates</CardDescription>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Message
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="messages" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
              </TabsList>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-28">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="push">Push</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="messages" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Audience</TableHead>
                      <TableHead className="hidden md:table-cell">Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">When</TableHead>
                      <TableHead className="w-12">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCommunications.map((comm) => (
                      <TableRow key={comm.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                              {getTypeIcon(comm.type)}
                            </div>
                            <span className="capitalize text-sm hidden sm:inline">
                              {comm.type}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{comm.targetAudience}</div>
                            <div className="text-xs text-muted-foreground">
                              {comm.recipients.toLocaleString()} recipients
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="truncate max-w-[200px] block text-sm">
                            {comm.subject}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(comm.status)}>
                            {comm.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {formatRelativeTime(comm.sentAt ?? comm.scheduledAt ?? comm.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedCommunication(comm)}
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

            <TabsContent value="templates" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {notificationTemplates.map((template: NotificationTemplate) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {formatStatus(template.type)}
                        </Badge>
                        <Badge
                          variant={template.active ? "default" : "secondary"}
                        >
                          {template.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <CardTitle className="text-base mt-2">{template.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        Last updated: {formatDate(template.updatedAt)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="broadcast" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Send Broadcast Message</CardTitle>
                  <CardDescription>
                    Send a message to multiple users at once
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Recipient Group</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select recipients" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all_users">All Users</SelectItem>
                          <SelectItem value="all_hosts">All Hosts</SelectItem>
                          <SelectItem value="all_guests">All Guests</SelectItem>
                          <SelectItem value="active_bookings">Active Bookings</SelectItem>
                          <SelectItem value="verified_users">Verified Users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Channel</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="push">Push Notification</SelectItem>
                          <SelectItem value="all">All Channels</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input placeholder="Enter message subject" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <textarea
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your message..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Save Draft</Button>
                    <Button>
                      <Send className="mr-2 h-4 w-4" />
                      Send Broadcast
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Communication Detail Sheet */}
      <Sheet open={!!selectedCommunication} onOpenChange={() => setSelectedCommunication(null)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Message Details</SheetTitle>
            <SheetDescription>
              View complete message information
            </SheetDescription>
          </SheetHeader>
          {selectedCommunication && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  {getTypeIcon(selectedCommunication.type)}
                </div>
                <div>
                  <div className="font-semibold capitalize">{selectedCommunication.type}</div>
                  <Badge variant="outline" className={getStatusColor(selectedCommunication.status)}>
                    {selectedCommunication.status}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Audience</div>
                  <div className="mt-1">
                    <div className="font-medium">{selectedCommunication.targetAudience}</div>
                    <div className="text-xs text-muted-foreground">
                      {selectedCommunication.recipients.toLocaleString()} recipients
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Subject</div>
                  <div className="font-medium mt-1">{selectedCommunication.subject}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Message</div>
                  <div className="mt-1 text-sm leading-relaxed rounded-lg bg-muted/50 p-3">
                    {selectedCommunication.content}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {selectedCommunication.status === "scheduled" ? "Scheduled At" : "Sent At"}
                    </div>
                    <div>
                      {formatDate(
                        selectedCommunication.sentAt ??
                          selectedCommunication.scheduledAt ??
                          selectedCommunication.createdAt
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Created</div>
                    <div>{formatDate(selectedCommunication.createdAt)}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  Resend
                </Button>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Template Detail Sheet */}
      <Sheet open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Template Details</SheetTitle>
            <SheetDescription>
              View and edit notification template
            </SheetDescription>
          </SheetHeader>
          {selectedTemplate && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="capitalize">
                  {selectedTemplate.type}
                </Badge>
                <Badge variant={selectedTemplate.active ? "default" : "secondary"}>
                  {selectedTemplate.active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Template Name</div>
                  <div className="font-medium mt-1">{selectedTemplate.name}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Description</div>
                  <div className="mt-1 text-sm">{selectedTemplate.description}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Subject</div>
                  <div className="mt-1 font-medium">{selectedTemplate.subject}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Content</div>
                  <div className="mt-1 text-sm leading-relaxed rounded-lg bg-muted/50 p-3 whitespace-pre-wrap">
                    {selectedTemplate.content}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-2">Variables</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable) => (
                      <Badge key={variable} variant="secondary" className="font-mono text-xs">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">Edit Template</Button>
                <Button variant="outline">
                  {selectedTemplate.active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
