"use client"

import { useState } from "react"
import {
  Headphones,
  Search,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Eye,
  Send,
  Phone,
  Mail,
  Tag,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { StatCard } from "@/components/dashboard/stat-card"
import { supportTickets } from "@/lib/mock-data"
import { formatDate, formatRelativeTime, getStatusColor } from "@/lib/utils"
import type { SupportTicket } from "@/lib/types"

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [replyText, setReplyText] = useState("")

  const filteredTickets = supportTickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  const openTickets = supportTickets.filter((t) => t.status === "open").length
  const inProgressTickets = supportTickets.filter((t) => t.status === "in_progress").length
  const resolvedToday = supportTickets.filter(
    (t) =>
      t.status === "resolved" &&
      new Date(t.resolvedAt!).toDateString() === new Date().toDateString()
  ).length
  const avgResponseTime = "1.8h"

  const categories = [...new Set(supportTickets.map((t) => t.category))]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
      case "high":
        return <ArrowUp className="h-3 w-3" />
      case "low":
        return <ArrowDown className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Support</h1>
        <p className="text-muted-foreground">
          Manage customer support tickets and inquiries
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Open Tickets"
          value={openTickets.toString()}
          icon={<MessageSquare className="h-4 w-4" />}
          change={-5}
        />
        <StatCard
          title="In Progress"
          value={inProgressTickets.toString()}
          icon={<Clock className="h-4 w-4" />}
          change={3}
        />
        <StatCard
          title="Resolved Today"
          value={resolvedToday.toString()}
          icon={<CheckCircle2 className="h-4 w-4" />}
          change={12}
        />
        <StatCard
          title="Avg Response Time"
          value={avgResponseTime}
          icon={<Clock className="h-4 w-4" />}
          change={15}
        />
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            Support Tickets
          </CardTitle>
          <CardDescription>
            View and manage customer support requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="all">All Tickets</TabsTrigger>
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="my">My Tickets</TabsTrigger>
              </TabsList>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="capitalize">
                        {cat.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket</TableHead>
                      <TableHead className="hidden md:table-cell">User</TableHead>
                      <TableHead className="hidden lg:table-cell">Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Updated</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-sm">{ticket.subject}</div>
                            <div className="text-xs text-muted-foreground">{ticket.id}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={ticket.userAvatar} alt={ticket.userName} />
                              <AvatarFallback className="text-xs">
                                {ticket.userName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{ticket.userName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="outline" className="capitalize">
                            <Tag className="h-3 w-3 mr-1" />
                            {ticket.category.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getPriorityColor(ticket.priority) as "default" | "secondary" | "destructive" | "outline"}
                            className="capitalize"
                          >
                            {getPriorityIcon(ticket.priority)}
                            {ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(ticket.status) as "default" | "secondary" | "destructive" | "outline"}>
                            {ticket.status.replace(/_/g, " ")}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {formatRelativeTime(ticket.updatedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedTicket(ticket)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-xl border-border/50 bg-background animate-in fade-in zoom-in duration-200">
                                <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="my-1" />
                                <DropdownMenuItem className="rounded-md px-2 py-2 text-sm focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                                  Assign to me
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-md px-2 py-2 text-sm focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                                  Change priority
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-md px-2 py-2 text-sm focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                                  Add tag
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1" />
                                <DropdownMenuItem className="rounded-md px-2 py-2 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors cursor-pointer font-medium">
                                  Close ticket
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="open" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-32">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets
                      .filter((t) => t.status === "open")
                      .map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell>
                            <div className="font-medium text-sm">{ticket.subject}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage src={ticket.userAvatar} alt={ticket.userName} />
                                <AvatarFallback className="text-xs">
                                  {ticket.userName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{ticket.userName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getPriorityColor(ticket.priority) as "default" | "secondary" | "destructive" | "outline"}
                              className="capitalize"
                            >
                              {ticket.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatRelativeTime(ticket.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => setSelectedTicket(ticket)}>
                              Respond
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="my" className="space-y-4">
              <div className="flex items-center justify-center py-12 text-center">
                <div>
                  <Headphones className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Assigned Tickets</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You don&apos;t have any tickets assigned to you yet.
                  </p>
                  <Button className="mt-4" variant="outline">
                    View Open Tickets
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Ticket Detail Sheet */}
      <Sheet open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <SheetContent className="sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Ticket Details</SheetTitle>
            <SheetDescription>
              View and respond to support ticket
            </SheetDescription>
          </SheetHeader>
          {selectedTicket && (
            <div className="mt-6 flex flex-col h-[calc(100vh-180px)]">
              {/* Ticket Header */}
              <div className="space-y-4 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedTicket.subject}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{selectedTicket.id}</span>
                      <Badge
                        variant={getPriorityColor(selectedTicket.priority) as "default" | "secondary" | "destructive" | "outline"}
                        className="capitalize text-xs"
                      >
                        {selectedTicket.priority}
                      </Badge>
                      <Badge variant={getStatusColor(selectedTicket.status) as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                        {selectedTicket.status.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-xl border-border/50 bg-background animate-in fade-in zoom-in duration-200">
                      <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="my-1" />
                      <DropdownMenuItem className="rounded-md px-2 py-2 text-sm focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                        Assign to me
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-md px-2 py-2 text-sm focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                        Change priority
                      </DropdownMenuItem>
                      <DropdownMenuItem className="rounded-md px-2 py-2 text-sm focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                        Mark as resolved
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="my-1" />
                      <DropdownMenuItem className="rounded-md px-2 py-2 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors cursor-pointer font-medium">
                        Close ticket
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedTicket.userAvatar} alt={selectedTicket.userName} />
                    <AvatarFallback>
                      {selectedTicket.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{selectedTicket.userName}</div>
                    <div className="text-xs text-muted-foreground">{selectedTicket.userEmail}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Conversation */}
              <ScrollArea className="flex-1 py-4">
                <div className="space-y-4">
                  {selectedTicket.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.sender === "user" ? "" : "flex-row-reverse"
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            message.sender === "user"
                              ? selectedTicket.userAvatar
                              : "/admin-avatar.jpg"
                          }
                        />
                        <AvatarFallback>
                          {message.sender === "user" ? "U" : "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex-1 max-w-[80%] ${
                          message.sender === "user" ? "" : "text-right"
                        }`}
                      >
                        <div
                          className={`inline-block p-3 rounded-lg text-sm ${
                            message.sender === "user"
                              ? "bg-muted text-left"
                              : "bg-primary text-primary-foreground text-left"
                          }`}
                        >
                          {message.content}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatRelativeTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator />

              {/* Reply Input */}
              <div className="pt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1"
                  />
                  <Button disabled={!replyText.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="ghost" size="sm">
                    Use Template
                  </Button>
                  <Button variant="ghost" size="sm">
                    Add Attachment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
