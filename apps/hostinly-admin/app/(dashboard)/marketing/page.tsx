"use client"

import { useState } from "react"
import {
  Megaphone,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Play,
  Pause,
  BarChart3,
  Users,
  MousePointer,
  DollarSign,
  Calendar,
  Target,
  Mail,
  Gift,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { mockCampaigns, mockPromotions } from "@/lib/mock-data"
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils"
import type { Campaign, Promotion } from "@/lib/types"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Bar, BarChart } from "recharts"

const performanceData = [
  { date: "Mon", impressions: 12000, clicks: 450, conversions: 23 },
  { date: "Tue", impressions: 15000, clicks: 520, conversions: 31 },
  { date: "Wed", impressions: 18000, clicks: 680, conversions: 42 },
  { date: "Thu", impressions: 14000, clicks: 490, conversions: 28 },
  { date: "Fri", impressions: 21000, clicks: 780, conversions: 52 },
  { date: "Sat", impressions: 25000, clicks: 920, conversions: 67 },
  { date: "Sun", impressions: 22000, clicks: 850, conversions: 58 },
]

export default function MarketingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter
    const matchesType = typeFilter === "all" || campaign.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const filteredPromotions = mockPromotions.filter((promo) => {
    const matchesSearch = promo.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || promo.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const activeCampaigns = mockCampaigns.filter((c) => c.status === "active").length
  const totalReach = mockCampaigns.reduce((sum, c) => sum + c.impressions, 0)
  const totalSpend = mockCampaigns.reduce((sum, c) => sum + c.spend, 0)
  const avgConversionRate = 3.2

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "social":
        return <Users className="h-4 w-4" />
      case "display":
        return <Target className="h-4 w-4" />
      case "referral":
        return <Gift className="h-4 w-4" />
      default:
        return <Megaphone className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Marketing</h1>
        <p className="text-muted-foreground">
          Manage campaigns, promotions, and marketing analytics
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Campaigns"
          value={activeCampaigns.toString()}
          icon={<Megaphone className="h-4 w-4" />}
          change={2}
        />
        <StatCard
          title="Total Reach"
          value={`${(totalReach / 1000).toFixed(1)}K`}
          icon={<Users className="h-4 w-4" />}
          change={18}
        />
        <StatCard
          title="Total Spend"
          value={formatCurrency(totalSpend)}
          icon={<DollarSign className="h-4 w-4" />}
          change={-5}
        />
        <StatCard
          title="Conversion Rate"
          value={`${avgConversionRate}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          change={0.5}
        />
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Campaign Performance
          </CardTitle>
          <CardDescription>Weekly overview of marketing metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              impressions: {
                label: "Impressions",
                color: "hsl(var(--primary))",
              },
              clicks: {
                label: "Clicks",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="impressions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clicks" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Marketing Hub</CardTitle>
              <CardDescription>Manage campaigns and promotions</CardDescription>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="campaigns" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                <TabsTrigger value="promotions">Promotions</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="campaigns" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="hidden lg:table-cell">Impressions</TableHead>
                      <TableHead className="hidden sm:table-cell">Clicks</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                              {getTypeIcon(campaign.type)}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{campaign.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="capitalize">
                            {campaign.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {campaign.impressions.toLocaleString()}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {campaign.clicks.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="font-medium">{formatCurrency(campaign.spend)}</span>
                            <span className="text-muted-foreground">
                              {" / "}
                              {formatCurrency(campaign.budget)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(campaign.status) as "default" | "secondary" | "destructive" | "outline"}>
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedCampaign(campaign)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {campaign.status === "active" ? (
                              <Button variant="ghost" size="icon">
                                <Pause className="h-4 w-4" />
                              </Button>
                            ) : campaign.status === "paused" ? (
                              <Button variant="ghost" size="icon">
                                <Play className="h-4 w-4" />
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="promotions" className="space-y-4">
              <div className="flex justify-end">
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Promo Code
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead className="hidden md:table-cell">Usage</TableHead>
                      <TableHead className="hidden lg:table-cell">Valid Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPromotions.map((promo) => (
                      <TableRow key={promo.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Gift className="h-4 w-4 text-primary" />
                            <span className="font-mono font-medium">{promo.code}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {promo.discountType === "percentage"
                              ? `${promo.discountValue}% OFF`
                              : `${formatCurrency(promo.discountValue)} OFF`}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {promo.usedCount} / {promo.maxUses || "∞"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                          {formatDate(promo.startDate)} - {formatDate(promo.endDate)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(promo.status) as "default" | "secondary" | "destructive" | "outline"}>
                            {promo.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedPromotion(promo)}
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

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Click-Through Rate by Channel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { channel: "Email", ctr: 4.2, color: "bg-blue-500" },
                        { channel: "Social Media", ctr: 2.8, color: "bg-pink-500" },
                        { channel: "Display Ads", ctr: 1.5, color: "bg-yellow-500" },
                        { channel: "Referral", ctr: 6.1, color: "bg-emerald-500" },
                      ].map((item) => (
                        <div key={item.channel} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{item.channel}</span>
                            <span className="font-medium">{item.ctr}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted">
                            <div
                              className={`h-2 rounded-full ${item.color}`}
                              style={{ width: `${(item.ctr / 6.1) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Top Performing Campaigns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockCampaigns
                        .sort((a, b) => b.conversions - a.conversions)
                        .slice(0, 4)
                        .map((campaign, index) => (
                          <div key={campaign.id} className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{campaign.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {campaign.conversions} conversions
                              </div>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {campaign.type}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Campaign Detail Sheet */}
      <Sheet open={!!selectedCampaign} onOpenChange={() => setSelectedCampaign(null)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Campaign Details</SheetTitle>
            <SheetDescription>
              View campaign performance and settings
            </SheetDescription>
          </SheetHeader>
          {selectedCampaign && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                  {getTypeIcon(selectedCampaign.type)}
                </div>
                <div>
                  <div className="font-semibold">{selectedCampaign.name}</div>
                  <Badge
                    variant={getStatusColor(selectedCampaign.status) as "default" | "secondary" | "destructive" | "outline"}
                    className="mt-1"
                  >
                    {selectedCampaign.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {selectedCampaign.impressions.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Impressions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {selectedCampaign.clicks.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Clicks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedCampaign.conversions}</div>
                  <div className="text-xs text-muted-foreground">Conversions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {((selectedCampaign.clicks / selectedCampaign.impressions) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">CTR</div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Type</div>
                    <div className="capitalize font-medium">{selectedCampaign.type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Budget</div>
                    <div className="font-medium">{formatCurrency(selectedCampaign.budget)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Spent</div>
                    <div className="font-medium">{formatCurrency(selectedCampaign.spend)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                    <div className="font-medium">
                      {formatCurrency(selectedCampaign.budget - selectedCampaign.spend)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Start Date</div>
                    <div>{formatDate(selectedCampaign.startDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">End Date</div>
                    <div>{formatDate(selectedCampaign.endDate)}</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Campaign
                </Button>
                {selectedCampaign.status === "active" ? (
                  <Button variant="outline">
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                ) : selectedCampaign.status === "paused" ? (
                  <Button variant="outline">
                    <Play className="mr-2 h-4 w-4" />
                    Resume
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Promotion Detail Sheet */}
      <Sheet open={!!selectedPromotion} onOpenChange={() => setSelectedPromotion(null)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Promotion Details</SheetTitle>
            <SheetDescription>
              View promotion code details and usage
            </SheetDescription>
          </SheetHeader>
          {selectedPromotion && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Gift className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="font-mono text-lg font-bold">{selectedPromotion.code}</div>
                  <Badge
                    variant={getStatusColor(selectedPromotion.status) as "default" | "secondary" | "destructive" | "outline"}
                    className="mt-1"
                  >
                    {selectedPromotion.status}
                  </Badge>
                </div>
              </div>

              <div className="text-center p-6 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold text-primary">
                  {selectedPromotion.discountType === "percentage"
                    ? `${selectedPromotion.discountValue}% OFF`
                    : `${formatCurrency(selectedPromotion.discountValue)} OFF`}
                </div>
                {selectedPromotion.minPurchase && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Min. purchase: {formatCurrency(selectedPromotion.minPurchase)}
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Times Used</div>
                    <div className="text-xl font-bold">{selectedPromotion.usedCount}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Max Uses</div>
                    <div className="text-xl font-bold">{selectedPromotion.maxUses || "Unlimited"}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Start Date</div>
                    <div>{formatDate(selectedPromotion.startDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">End Date</div>
                    <div>{formatDate(selectedPromotion.endDate)}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Total Savings</div>
                  <div className="text-xl font-bold text-emerald-500">
                    {formatCurrency(selectedPromotion.totalSavings)}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Promotion
                </Button>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Create Campaign Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Set up a new marketing campaign
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Name</label>
              <Input placeholder="Enter campaign name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="display">Display Ads</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Budget</label>
                <Input type="number" placeholder="$0.00" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Date</label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="new">New Users</SelectItem>
                  <SelectItem value="returning">Returning Users</SelectItem>
                  <SelectItem value="hosts">Hosts Only</SelectItem>
                  <SelectItem value="guests">Guests Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setCreateDialogOpen(false)}>
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
