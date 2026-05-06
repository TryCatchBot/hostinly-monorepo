"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/dashboard/data-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { coHosts } from "@/lib/mock-data";
import type { CoHost } from "@/lib/types";
import { formatDate, getStatusColor, formatStatus } from "@/lib/utils";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Trash2,
  Star,
  Clock,
  Home,
  Calendar,
  UserCheck,
  Users,
  UserPlus,
  UserX,
} from "lucide-react";

const columns = [
  {
    key: "name",
    header: "Co-host",
    sortable: true,
    cell: (coHost: CoHost) => (
      <div>
        <p className="font-medium">{coHost.name}</p>
        <p className="text-sm text-muted-foreground">{coHost.email}</p>
      </div>
    ),
  },
  {
    key: "rating",
    header: "Rating",
    sortable: true,
    cell: (coHost: CoHost) =>
      coHost.rating > 0 ? (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span>{coHost.rating.toFixed(1)}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">No rating</span>
      ),
  },
  {
    key: "responseTime",
    header: "Response Time",
    sortable: true,
    cell: (coHost: CoHost) =>
      coHost.responseTime > 0 ? (
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{coHost.responseTime} min</span>
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      ),
  },
  {
    key: "activeProperties",
    header: "Properties",
    sortable: true,
    cell: (coHost: CoHost) => (
      <div className="flex items-center gap-1">
        <Home className="h-4 w-4 text-muted-foreground" />
        <span>{coHost.activeProperties}</span>
      </div>
    ),
  },
  {
    key: "completedBookings",
    header: "Bookings",
    sortable: true,
    cell: (coHost: CoHost) => (
      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>{coHost.completedBookings}</span>
      </div>
    ),
  },
  {
    key: "commissionRate",
    header: "Commission",
    sortable: true,
    cell: (coHost: CoHost) => <span>{coHost.commissionRate}%</span>,
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    cell: (coHost: CoHost) => (
      <Badge variant="outline" className={getStatusColor(coHost.status)}>
        {formatStatus(coHost.status)}
      </Badge>
    ),
  },
  {
    key: "joinedAt",
    header: "Joined",
    sortable: true,
    cell: (coHost: CoHost) => (
      <span className="text-muted-foreground">{formatDate(coHost.joinedAt)}</span>
    ),
  },
  {
    key: "actions",
    header: "",
    cell: (coHost: CoHost) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Edit Co-host
          </DropdownMenuItem>
          {coHost.status === "pending" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-emerald-500">
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          {coHost.status === "active" ? (
            <DropdownMenuItem className="text-orange-500">
              <Ban className="mr-2 h-4 w-4" />
              Suspend
            </DropdownMenuItem>
          ) : coHost.status === "suspended" ? (
            <DropdownMenuItem className="text-emerald-500">
              <CheckCircle className="mr-2 h-4 w-4" />
              Restore
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </DropdownMenuItem>
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
      { value: "active", label: "Active" },
      { value: "pending", label: "Pending" },
      { value: "suspended", label: "Suspended" },
      { value: "banned", label: "Banned" },
    ],
  },
];

export default function CoHostsPage() {
  const activeCoHosts = coHosts.filter((c) => c.status === "active");
  const pendingCoHosts = coHosts.filter((c) => c.status === "pending");
  const suspendedCoHosts = coHosts.filter((c) => c.status === "suspended");
  const avgRating =
    activeCoHosts.length > 0
      ? activeCoHosts.reduce((sum, c) => sum + c.rating, 0) / activeCoHosts.length
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Co-hosts</h1>
          <p className="text-muted-foreground">
            Manage co-host applications, performance, and assignments
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Co-host
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Co-hosts"
          value={coHosts.length}
          icon={<Users className="h-4 w-4" />}
        />
        <StatCard
          title="Active"
          value={activeCoHosts.length}
          icon={<UserCheck className="h-4 w-4" />}
        />
        <StatCard
          title="Pending Approval"
          value={pendingCoHosts.length}
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          title="Average Rating"
          value={avgRating.toFixed(1)}
          icon={<Star className="h-4 w-4" />}
        />
      </div>

      {/* Pending Applications */}
      {pendingCoHosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Applications
              <Badge variant="secondary">{pendingCoHosts.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingCoHosts.map((coHost) => (
                <div
                  key={coHost.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div>
                    <p className="font-medium">{coHost.name}</p>
                    <p className="text-sm text-muted-foreground">{coHost.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Applied {formatDate(coHost.joinedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      Review
                    </Button>
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suspended Co-hosts Alert */}
      {suspendedCoHosts.length > 0 && (
        <Card className="border-orange-500/50 bg-orange-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-orange-500">
              <UserX className="h-5 w-5" />
              Suspended Co-hosts
              <Badge variant="outline" className="border-orange-500/50 text-orange-500">
                {suspendedCoHosts.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {suspendedCoHosts.map((coHost) => (
                <Badge key={coHost.id} variant="outline" className="border-orange-500/30">
                  {coHost.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Co-hosts Table */}
      <DataTable
        data={coHosts}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search co-hosts..."
        searchKey="name"
      />
    </div>
  );
}
