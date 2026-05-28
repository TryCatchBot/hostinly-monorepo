"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency, formatNumber, getStatusColor, formatStatus, getInitials, API_URL } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, ResponsiveContainer } from "recharts";
import { Users, Home, Calendar, DollarSign, UserCheck, Clock, Ticket, Percent } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [stats, setStats] = useState({
    userCount: 0,
    propertyCount: 0,
    cohostCount: 0,
    bookingCount: 0,
    totalRevenue: 0,
    openTickets: 0,
    jobCount: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, bookingsRes, usersRes, chartRes] = await Promise.all([
          fetch(`${API_URL}/admin/stats`),
          fetch(`${API_URL}/admin/recent-bookings`),
          fetch(`${API_URL}/admin/recent-activity`),
          fetch(`${API_URL}/admin/chart-data`),
        ]);

        if (!statsRes.ok || !bookingsRes.ok || !usersRes.ok || !chartRes.ok) {
          throw new Error("One or more dashboard requests failed");
        }

        const statsData = await statsRes.json();
        const bookingsData = await bookingsRes.json();
        const usersData = await usersRes.json();
        const chartDataData = await chartRes.json();

        if (statsData.success) {
          setStats(statsData.data);
        }
        if (bookingsData.success) {
          // Check if data is an array or an object with data property
          const bookings = Array.isArray(bookingsData.data) ? bookingsData.data : [];
          setRecentBookings(bookings);
        }
        if (usersData.success) {
          // Extract users from the activity data
          const users = usersData.data
            .filter((a: any) => a.type === 'USER_SIGNUP')
            .map((a: any) => a.data);
          setRecentUsers(users);
        }
        if (chartDataData.success) {
          setChartData(chartDataData.data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Mock data for growth (replace with actual backend data if available)
  const mockGrowth = { userGrowth: 12, propertyGrowth: 8, bookingGrowth: 15, revenueGrowth: 10 };

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
          value={formatNumber(stats.userCount)}
          change={mockGrowth.userGrowth}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Total Properties"
          value={formatNumber(stats.propertyCount)}
          change={mockGrowth.propertyGrowth}
          icon={<Home className="h-4 w-4" />}
        />
        <StatCard
          title="Total Bookings"
          value={formatNumber(stats.bookingCount)}
          change={mockGrowth.bookingGrowth}
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          change={mockGrowth.revenueGrowth}
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Co-Hosts"
          value={formatNumber(stats.cohostCount)}
          icon={<UserCheck className="h-4 w-4" />}
        />
        <StatCard
          title="Pending Approvals"
          value={stats.jobCount}
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets}
          icon={<Ticket className="h-4 w-4" />}
        />
        <StatCard
          title="Occupancy Rate"
          value={`0%`}
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
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                    {formatCurrency(booking.amount)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>New Platform Users</CardTitle>
            <CardDescription>Recently registered users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Badge variant="secondary">{user.userType}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Support Tickets */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Open Support Tickets</CardTitle>
            <CardDescription>Recent support requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Assuming you'll have a separate endpoint for recent tickets or filter from a larger set */}
            {/* For now, using a placeholder or filtered mock data if needed */}
            {/* If backend provides this, replace this with actual data */}
            <div className="text-muted-foreground text-sm">No recent tickets to display.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
