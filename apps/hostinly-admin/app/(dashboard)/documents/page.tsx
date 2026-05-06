"use client"

import { useState } from "react"
import {
  FileText,
  Search,
  Upload,
  Download,
  Eye,
  Trash2,
  FolderOpen,
  File,
  Image,
  FileSpreadsheet,
  FileCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Plus,
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
import { documents } from "@/lib/mock-data"
import { formatDate, getStatusColor, formatStatus } from "@/lib/utils"
import type { Document } from "@/lib/types"

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.userName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || doc.type === typeFilter
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const totalDocuments = documents.length
  const pendingVerification = documents.filter((d) => d.status === "pending").length
  const verifiedDocuments = documents.filter((d) => d.status === "verified").length
  const expiringSoon = documents.filter((d) => {
    if (!d.expiryDate) return false
    const daysUntilExpiry = Math.ceil(
      (new Date(d.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
  }).length

  const types = [...new Set(documents.map((d) => d.type))]

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "webp":
        return <Image className="h-4 w-4 text-blue-500" />
      case "csv":
      case "xls":
      case "xlsx":
        return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">
          Manage user documents and verifications
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Documents"
          value={totalDocuments.toString()}
          icon={<FileText className="h-4 w-4" />}
          change={18}
        />
        <StatCard
          title="Pending Verification"
          value={pendingVerification.toString()}
          icon={<Clock className="h-4 w-4" />}
          change={-5}
        />
        <StatCard
          title="Verified"
          value={verifiedDocuments.toString()}
          icon={<CheckCircle2 className="h-4 w-4" />}
          change={12}
        />
        <StatCard
          title="Expiring Soon"
          value={expiringSoon.toString()}
          icon={<AlertTriangle className="h-4 w-4" />}
          change={-3}
        />
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>View and verify user documents</CardDescription>
            </div>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="all">All Documents</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="expiring">Expiring</TabsTrigger>
              </TabsList>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {types.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {formatStatus(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead className="hidden md:table-cell">Owner</TableHead>
                      <TableHead className="hidden lg:table-cell">Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Uploaded</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                              {getFileIcon(doc.fileName)}
                            </div>
                            <div>
                              <div className="font-medium text-sm truncate max-w-[150px]">
                                {doc.fileName}
                              </div>
                              <div className="text-xs text-muted-foreground uppercase">
                                {formatStatus(doc.type)}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {doc.userName}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="outline" className="capitalize">
                            {formatStatus(doc.type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {formatDate(doc.uploadedAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedDocument(doc)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead className="w-40">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments
                      .filter((d) => d.status === "pending")
                      .map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                {getFileIcon(doc.fileName)}
                              </div>
                              <div className="font-medium text-sm">{doc.fileName}</div>
                            </div>
                          </TableCell>
                          <TableCell>{doc.userName}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline" className="capitalize">
                              {formatStatus(doc.type)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(doc.uploadedAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="text-emerald-500">
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="expiring" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Days Left</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments
                      .filter((d) => {
                        if (!d.expiryDate) return false
                        const daysUntilExpiry = Math.ceil(
                          (new Date(d.expiryDate).getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                        return daysUntilExpiry <= 30 && daysUntilExpiry > 0
                      })
                      .map((doc) => {
                        const daysLeft = Math.ceil(
                          (new Date(doc.expiryDate!).getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )
                        return (
                          <TableRow key={doc.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                  {getFileIcon(doc.fileName)}
                                </div>
                                <div className="font-medium text-sm">{doc.fileName}</div>
                              </div>
                            </TableCell>
                            <TableCell>{doc.userName}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="outline" className="capitalize">
                                {formatStatus(doc.type)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDate(doc.expiryDate!)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={daysLeft <= 7 ? "destructive" : "secondary"}
                              >
                                {daysLeft} days
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                Notify Owner
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Document Detail Sheet */}
      <Sheet open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Document Details</SheetTitle>
            <SheetDescription>
              View and manage document information
            </SheetDescription>
          </SheetHeader>
          {selectedDocument && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted">
                  {getFileIcon(selectedDocument.fileName)}
                </div>
                <div>
                  <div className="font-semibold">{selectedDocument.fileName}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatStatus(selectedDocument.type)}
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusColor(selectedDocument.status) + " mt-1"}
                  >
                    {selectedDocument.status}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Owner</div>
                  <div className="font-medium">{selectedDocument.userName}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Type</div>
                    <div className="capitalize">{formatStatus(selectedDocument.type)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Uploaded</div>
                    <div>{formatDate(selectedDocument.uploadedAt)}</div>
                  </div>
                </div>

                {selectedDocument.expiryDate && (
                  <div>
                    <div className="text-sm text-muted-foreground">Expiry Date</div>
                    <div>{formatDate(selectedDocument.expiryDate)}</div>
                  </div>
                )}

                {selectedDocument.verifiedBy && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Verified By</div>
                      <div>{selectedDocument.verifiedBy}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Verified At</div>
                      <div>{formatDate(selectedDocument.verifiedAt!)}</div>
                    </div>
                  </div>
                )}

                {selectedDocument.rejectionReason && (
                  <div>
                    <div className="text-sm text-muted-foreground">Rejection Reason</div>
                    <div className="mt-1 text-sm rounded-lg bg-muted/50 p-3">
                      {selectedDocument.rejectionReason}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                {selectedDocument.status === "pending" && (
                  <>
                    <Button variant="outline" className="text-emerald-500">
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="text-red-500">
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
              <div className="mt-4">
                <Button variant="outline">Choose File</Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  or drag and drop your file here
                </p>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                PDF, JPG, PNG up to 10MB
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="identity">Identity Document</SelectItem>
                  <SelectItem value="property">Property Document</SelectItem>
                  <SelectItem value="license">License</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="tax">Tax Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Owner</label>
              <Input placeholder="Enter owner name or ID" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setUploadDialogOpen(false)}>
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteDialogOpen(false)
                setSelectedDocument(null)
              }}
            >
              Delete Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
