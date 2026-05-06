"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { dashboardStats, revenueChartData, bookings, supportTickets, platformUsers } from "@/lib/mock-data";
import { formatCurrency, formatNumber, formatRelativeTime, getStatusColor, formatStatus, getInitials } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer } from "recharts";
import { Users, Home, Calendar, DollarSign, UserCheck, Clock, Ticket, Percent } from "lucide-react";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(220, 70%, 50%)",
  },
  bookings: {
    label: "Bookings",
    color: "hsl(160, 60%, 45%)",
  },
};

export default function DashboardPage() {
  const recentBookings = bookings.slice(0, 5);
  const recentTickets = supportTickets.filter((t) => t.status !== "closed").slice(0, 4);
  const recentUsers = platformUsers.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here is an overview of your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={formatNumber(dashboardStats.totalUsers)}
          change={dashboardStats.userGrowth}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Total Properties"
          value={formatNumber(dashboardStats.totalProperties)}
          change={dashboardStats.propertyGrowth}
          icon={<Home className="h-4 w-4" />}
        />
        <StatCard
          title="Total Bookings"
          value={formatNumber(dashboardStats.totalBookings)}
          change={dashboardStats.bookingGrowth}
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(dashboardStats.totalRevenue)}
          change={dashboardStats.revenueGrowth}
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Co-hosts"
          value={formatNumber(dashboardStats.activeCoHosts)}
          icon={<UserCheck className="h-4 w-4" />}
        />
        <StatCard
          title="Pending Approvals"
          value={dashboardStats.pendingApprovals}
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          title="Open Tickets"
          value={dashboardStats.openTickets}
          icon={<Ticket className="h-4 w-4" />}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${dashboardStats.occupancyRate}%`}
          icon={<Percent className="h-4 w-4" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue and bookings for the past year</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  fill="url(#fillRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Bookings Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
            <CardDescription>Monthly booking volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="bookings"
                  fill="var(--color-bookings)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Bookings */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{booking.guestName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {booking.propertyTitle}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className={getStatusColor(booking.status)}>
                    {formatStatus(booking.status)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(booking.totalAmount)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Open Tickets */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Open Tickets</CardTitle>
            <CardDescription>Support tickets requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{ticket.subject}</p>
                  <p className="text-xs text-muted-foreground">{ticket.userName}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className={getStatusColor(ticket.priority)}>
                    {formatStatus(ticket.priority)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(ticket.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>New user registrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Badge variant="outline" className={getStatusColor(user.status)}>
                  {formatStatus(user.role)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
