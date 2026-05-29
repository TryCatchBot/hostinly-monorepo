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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { CoHost } from "@/lib/types";
import { formatDate, getStatusColor, formatStatus, BASE_URL } from "@/lib/utils";
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
  XCircle,
} from "lucide-react";

const columns = [
  {
    key: "name",
    header: "Co-Host",
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
        <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-xl border-border/50 bg-background animate-in fade-in zoom-in duration-200">
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1" />
          <DropdownMenuItem className="rounded-md px-2 py-2 text-sm focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-md px-2 py-2 text-sm focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            Edit Co-Host
          </DropdownMenuItem>
          {coHost.status === "pending" && (
            <>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem className="rounded-md px-2 py-2 text-sm text-emerald-500 focus:bg-emerald-50 focus:text-emerald-600 transition-colors cursor-pointer font-medium">
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator className="my-1" />
          {coHost.status === "active" ? (
            <DropdownMenuItem className="rounded-md px-2 py-2 text-sm text-orange-500 focus:bg-orange-50 focus:text-orange-600 transition-colors cursor-pointer font-medium">
              <Ban className="mr-2 h-4 w-4" />
              Suspend
            </DropdownMenuItem>
          ) : coHost.status === "suspended" ? (
            <DropdownMenuItem className="rounded-md px-2 py-2 text-sm text-emerald-500 focus:bg-emerald-50 focus:text-emerald-600 transition-colors cursor-pointer font-medium">
              <CheckCircle className="mr-2 h-4 w-4" />
              Restore
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem className="rounded-md px-2 py-2 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors cursor-pointer font-medium">
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function CoHostsPage() {
  const [coHosts, setCoHosts] = useState<CoHost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoHosts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/cohosts`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          setCoHosts(data.data);
        } else {
          setError(data.message);
          toast.error(data.message || "Failed to fetch co-hosts");
        }
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchCoHosts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">Loading co-hosts...</p>
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
            <h3 className="font-semibold text-lg">Failed to load co-hosts</h3>
            <p className="text-sm text-muted-foreground max-w-[300px]">{error}</p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const totalCoHosts = coHosts.length;
  const activeCoHosts = coHosts.filter((c) => c.status === "active").length;
  const avgRating =
    coHosts.length > 0
      ? coHosts.reduce((sum, c) => sum + c.rating, 0) / coHosts.length
      : 0;
  const totalProperties = coHosts.reduce(
    (sum, c) => sum + c.activeProperties,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Co-Hosts</h1>
          <p className="text-muted-foreground">
            Manage platform co-hosts and their performance
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Co-Host
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Co-Hosts"
          value={totalCoHosts}
          icon={<Users className="h-4 w-4" />}
          change={5}
        />
        <StatCard
          title="Active Co-Hosts"
          value={activeCoHosts}
          icon={<UserCheck className="h-4 w-4" />}
          change={2}
        />
        <StatCard
          title="Average Rating"
          value={avgRating.toFixed(1)}
          icon={<Star className="h-4 w-4" />}
        />
        <StatCard
          title="Managed Properties"
          value={totalProperties}
          icon={<Home className="h-4 w-4" />}
        />
      </div>

      <DataTable
        data={coHosts}
        columns={columns}
        searchPlaceholder="Search co-hosts by name..."
        searchKey="name"
      />
    </div>
  );
}
