"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DataTable } from "@/components/dashboard/data-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { bookings, revenueChartData } from "@/lib/mock-data";
import type { Booking } from "@/lib/types";
import { formatDate, formatCurrency, getStatusColor, formatStatus } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  MoreHorizontal,
  Eye,
  Edit,
  XCircle,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Percent,
} from "lucide-react";

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "hsl(220, 70%, 50%)",
  },
};

const columns = [
  {
    key: "id",
    header: "Booking ID",
    sortable: true,
    cell: (booking: Booking) => (
      <span className="font-mono text-sm">{booking.id}</span>
    ),
  },
  {
    key: "propertyTitle",
    header: "Property",
    sortable: true,
    cell: (booking: Booking) => (
      <div className="max-w-[200px]">
        <p className="font-medium truncate">{booking.propertyTitle}</p>
      </div>
    ),
  },
  {
    key: "guestName",
    header: "Guest",
    sortable: true,
    cell: (booking: Booking) => (
      <div>
        <p className="font-medium">{booking.guestName}</p>
        {booking.coHostName && (
          <p className="text-xs text-muted-foreground">
            via {booking.coHostName}
          </p>
        )}
      </div>
    ),
  },
  {
    key: "checkIn",
    header: "Check-in",
    sortable: true,
    cell: (booking: Booking) => (
      <span className="text-muted-foreground">{formatDate(booking.checkIn)}</span>
    ),
  },
  {
    key: "checkOut",
    header: "Check-out",
    sortable: true,
    cell: (booking: Booking) => (
      <span className="text-muted-foreground">{formatDate(booking.checkOut)}</span>
    ),
  },
  {
    key: "totalAmount",
    header: "Amount",
    sortable: true,
    cell: (booking: Booking) => (
      <span className="font-medium">{formatCurrency(booking.totalAmount)}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    cell: (booking: Booking) => (
      <Badge variant="outline" className={getStatusColor(booking.status)}>
        {formatStatus(booking.status)}
      </Badge>
    ),
  },
  {
    key: "actions",
    header: "",
    cell: (booking: Booking) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-xl border-border/50 bg-background animate-in fade-in zoom-in duration-200">
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem className="rounded-md px-2 py-2 text-sm focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-md px-2 py-2 text-sm focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            Edit Booking
          </DropdownMenuItem>
          {(booking.status === "confirmed" || booking.status === "pending") && (
            <>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem className="rounded-md px-2 py-2 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors cursor-pointer font-medium">
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Booking
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const filters = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "confirmed", label: "Confirmed" },
      { value: "pending", label: "Pending" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
      { value: "no_show", label: "No Show" },
    ],
  },
];

export default function BookingsPage() {
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const avgBookingValue = totalRevenue / totalBookings;
  
  const occupancyData = revenueChartData.slice(-6);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Track bookings, occupancy, and revenue performance
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          change={8.7}
          icon={<Calendar className="h-4 w-4" />}
        />
        <StatCard
          title="Confirmed"
          value={confirmedBookings.length}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          change={12.3}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          title="Avg. Booking Value"
          value={formatCurrency(avgBookingValue)}
          icon={<Percent className="h-4 w-4" />}
        />
      </div>

      {/* Chart and Summary */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Booking Trends</CardTitle>
            <CardDescription>Monthly booking volume over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={occupancyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                <Bar dataKey="bookings" fill="var(--color-bookings)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
            <CardDescription>Current booking distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { status: "confirmed", count: bookings.filter((b) => b.status === "confirmed").length },
              { status: "pending", count: bookings.filter((b) => b.status === "pending").length },
              { status: "completed", count: bookings.filter((b) => b.status === "completed").length },
              { status: "cancelled", count: bookings.filter((b) => b.status === "cancelled").length },
            ].map(({ status, count }) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getStatusColor(status)}>
                    {formatStatus(status)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{count}</span>
                  <span className="text-muted-foreground text-sm">
                    ({((count / totalBookings) * 100).toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Bookings</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable
            data={bookings}
            columns={columns}
            filters={filters}
            searchPlaceholder="Search bookings..."
            searchKey="guestName"
          />
        </TabsContent>

        <TabsContent value="upcoming">
          <DataTable
            data={bookings.filter(
              (b) => b.status === "confirmed" || b.status === "pending"
            )}
            columns={columns}
            searchPlaceholder="Search upcoming bookings..."
            searchKey="guestName"
          />
        </TabsContent>

        <TabsContent value="completed">
          <DataTable
            data={bookings.filter((b) => b.status === "completed")}
            columns={columns}
            searchPlaceholder="Search completed bookings..."
            searchKey="guestName"
          />
        </TabsContent>

        <TabsContent value="cancelled">
          <DataTable
            data={bookings.filter((b) => b.status === "cancelled")}
            columns={columns}
            searchPlaceholder="Search cancelled bookings..."
            searchKey="guestName"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
