"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DataTable } from "@/components/dashboard/data-table";
import type { User } from "@/lib/types"; // Assuming User type is updated to match backend
import {
  formatDate,
  formatCurrency,
  getStatusColor,
  formatStatus,
  getInitials,
  API_URL,
} from "@/lib/utils";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  Trash2,
  Plus,
  Mail,
  Phone,
  Calendar,
  Home,
  DollarSign,
} from "lucide-react";

const columns = [
  {
    key: "name",
    header: "User",
    sortable: true,
    cell: (user: User) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: "userType",
    header: "Role",
    sortable: true,
    cell: (user: User) => (
      <Badge variant="outline">{formatStatus(user.userType)}</Badge>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    cell: (user: User) => (
      <Badge variant="outline" className={getStatusColor(user.status)}>
        {formatStatus(user.status)}
      </Badge>
    ),
  },
  {
    key: "verificationStatus",
    header: "Verification",
    sortable: true,
    cell: (user: User) => (
      <Badge variant="outline" className={getStatusColor(user.verificationStatus)}>
        {formatStatus(user.verificationStatus)}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    header: "Joined",
    sortable: true,
    cell: (user: User) => (
      <span className="text-muted-foreground">{formatDate(user.createdAt)}</span>
    ),
  },
  {
    key: "actions",
    header: "",
    cell: (user: User) => <UserActions user={user} />,
  },
];

function UserActions({ user }: { user: User }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
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
          <DropdownMenuItem onClick={() => setSheetOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Edit User
          </DropdownMenuItem>
          {user.verificationStatus !== "VERIFIED" && (
            <DropdownMenuItem>
              <CheckCircle className="mr-2 h-4 w-4" />
              Verify User
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {user.status === "ACTIVE" ? (
            <DropdownMenuItem className="text-orange-500">
              <Ban className="mr-2 h-4 w-4" />
              Suspend User
            </DropdownMenuItem>
          ) : user.status === "SUSPENDED" ? (
            <DropdownMenuItem className="text-emerald-500">
              <CheckCircle className="mr-2 h-4 w-4" />
              Restore User
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>User Details</SheetTitle>
            <SheetDescription>
              Complete information about this user
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {/* Profile */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <Badge variant="outline">{formatStatus(user.userType)}</Badge>
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline" className={getStatusColor(user.status)}>
                  {formatStatus(user.status)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verification</p>
                <Badge
                  variant="outline"
                  className={getStatusColor(user.verificationStatus)}
                >
                  {formatStatus(user.verificationStatus)}
                </Badge>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="font-medium">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {user.email}
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {user.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Joined {formatDate(user.createdAt)}
                </div>
              </div>
            </div>

            {/* Stats */}
            {(user.properties !== undefined || user.bookings !== undefined || user.revenue !== undefined) && (
              <div className="space-y-3">
                <h4 className="font-medium">Activity</h4>
                <div className="grid grid-cols-3 gap-4">
                  {user.properties !== undefined && (
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <Home className="h-5 w-5 mx-auto text-muted-foreground" />
                      <p className="text-lg font-semibold mt-1">{user.properties}</p>
                      <p className="text-xs text-muted-foreground">Properties</p>
                    </div>
                  )}
                  {user.bookings !== undefined && (
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <Calendar className="h-5 w-5 mx-auto text-muted-foreground" />
                      <p className="text-lg font-semibold mt-1">{user.bookings}</p>
                      <p className="text-xs text-muted-foreground">Bookings</p>
                    </div>
                  )}
                  {user.revenue !== undefined && (
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <DollarSign className="h-5 w-5 mx-auto text-muted-foreground" />
                      <p className="text-lg font-semibold mt-1">
                        {formatCurrency(user.revenue)}
                      </p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button className="flex-1">
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </Button>
              <Button variant="outline" className="flex-1">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

const filters = [
  {
    key: "userType",
    label: "Role",
    options: [
      { value: "HOST", label: "Host" },
      { value: "COHOST", label: "Co-host" },
      { value: "CLEANER", label: "Cleaner" },
      { value: "SUPER_ADMIN", label: "Super Admin" },
      { value: "ADMIN", label: "Admin" },
      { value: "SUPERVISOR", label: "Supervisor" },
      { value: "FACILITY_MANAGER", label: "Facility Manager" },
    ],
  },
  {
    key: "status",
    label: "Status",
    options: [
      { value: "ACTIVE", label: "Active" },
      { value: "INACTIVE", label: "Inactive" },
      { value: "SUSPENDED", label: "Suspended" },
    ],
  },
  {
    key: "verificationStatus",
    label: "Verification",
    options: [
      { value: "VERIFIED", label: "Verified" },
      { value: "PENDING", label: "Pending" },
      { value: "REJECTED", label: "Rejected" },
    ],
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users`);
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          setError(data.message);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage platform users, owners, co-hosts, and guests
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <DataTable
        data={users}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search users by name..."
        searchKey="name"
      />
    </div>
  );
}
