"use client";

import { useMemo, useState } from "react";
import { DollarSign, Download, Eye, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/dashboard/stat-card";
import { transactions } from "@/lib/mock-data";
import { formatCurrency, formatDate, formatStatus, getStatusColor } from "@/lib/utils";
import type { Transaction, TransactionStatus, TransactionType } from "@/lib/types";

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.userName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || t.status === statusFilter;
      const matchesType = typeFilter === "all" || t.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchQuery, statusFilter, typeFilter]);

  const payoutTransactions = useMemo(() => {
    return filteredTransactions.filter((t) => t.type === "payout");
  }, [filteredTransactions]);

  const totals = useMemo(() => {
    const completed = transactions.filter((t) => t.status === "completed");
    const totalProcessed = completed.reduce((sum, t) => sum + t.amount, 0);
    const refunds = completed.filter((t) => t.type === "refund").reduce((sum, t) => sum + t.amount, 0);
    const pendingPayouts = transactions
      .filter((t) => t.type === "payout" && (t.status === "pending" || t.status === "processing"))
      .reduce((sum, t) => sum + t.amount, 0);
    const successRate = (completed.length / Math.max(1, transactions.length)) * 100;

    return { totalProcessed, refunds, pendingPayouts, successRate };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Track transactions, payouts, and refunds</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Processed Volume" value={formatCurrency(totals.totalProcessed)} icon={<DollarSign className="h-4 w-4" />} change={12.5} />
        <StatCard title="Pending Payouts" value={formatCurrency(totals.pendingPayouts)} icon={<DollarSign className="h-4 w-4" />} change={-8} />
        <StatCard title="Refunds" value={formatCurrency(totals.refunds)} icon={<DollarSign className="h-4 w-4" />} change={-2.3} />
        <StatCard title="Success Rate" value={`${totals.successRate.toFixed(1)}%`} icon={<DollarSign className="h-4 w-4" />} change={1.2} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Records</CardTitle>
          <CardDescription>Search and review platform transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="transactions" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="payouts">Payouts</TabsTrigger>
              </TabsList>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, user, description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-72"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as TransactionStatus | "all")}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TransactionType | "all")}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="booking">Booking</SelectItem>
                    <SelectItem value="payout">Payout</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="commission">Commission</SelectItem>
                    <SelectItem value="fee">Fee</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" aria-label="Export">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="transactions" className="space-y-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead className="hidden sm:table-cell">Type</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-mono text-xs truncate max-w-[100px]">{t.id}</TableCell>
                        <TableCell className="capitalize hidden sm:table-cell">{formatStatus(t.type)}</TableCell>
                        <TableCell className="max-w-[150px] sm:max-w-[260px] truncate">{t.userName}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatCurrency(t.amount, t.currency)}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className={getStatusColor(t.status)}>
                            {formatStatus(t.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground whitespace-nowrap">
                          {formatDate(t.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedTransaction(t)} aria-label="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="payouts" className="space-y-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Host</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="hidden md:table-cell">Date</TableHead>
                      <TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payoutTransactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-mono text-xs truncate max-w-[100px]">{t.id}</TableCell>
                        <TableCell className="max-w-[150px] sm:max-w-[260px] truncate">{t.userName}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatCurrency(t.amount, t.currency)}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className={getStatusColor(t.status)}>
                            {formatStatus(t.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground whitespace-nowrap">{formatDate(t.createdAt)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedTransaction(t)} aria-label="View">
                            <Eye className="h-4 w-4" />
                          </Button>
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

      <Sheet open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Transaction Details</SheetTitle>
            <SheetDescription>Review transaction metadata and amounts</SheetDescription>
          </SheetHeader>
          {selectedTransaction && (
            <div className="mt-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Transaction ID</div>
                  <div className="font-mono text-sm">{selectedTransaction.id}</div>
                </div>
                <Badge variant="outline" className={getStatusColor(selectedTransaction.status)}>
                  {formatStatus(selectedTransaction.status)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="font-medium">{formatStatus(selectedTransaction.type)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="font-medium">{formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">User</div>
                <div className="font-medium">{selectedTransaction.userName}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Description</div>
                <div className="text-sm">{selectedTransaction.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Created</div>
                  <div>{formatDate(selectedTransaction.createdAt)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Processed</div>
                  <div>{selectedTransaction.processedAt ? formatDate(selectedTransaction.processedAt) : "—"}</div>
                </div>
              </div>

              {selectedTransaction.bookingId && (
                <div>
                  <div className="text-sm text-muted-foreground">Booking ID</div>
                  <div className="font-mono text-sm">{selectedTransaction.bookingId}</div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
