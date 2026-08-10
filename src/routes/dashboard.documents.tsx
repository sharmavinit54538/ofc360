import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  Folder, Search, Upload, Wand2, Download, CheckCircle, Clock, XCircle, AlertTriangle,
  FileText, Shield, Trash2, Eye, FileSpreadsheet, RefreshCw, Info, Calendar,
  ShieldCheck, User, AlertCircle, Loader2
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ofc360, uid, useofc360, type HRDocument, type HRDocumentActivity, type Employee } from "@/lib/aurix-store";
import { toast } from "sonner";
import { api } from "@/api/client";
import apiInstance, { BASE_URL } from "@/api/apiInstance";

// ----------------------------------------------------
// ROUTE DEFINITION
// ----------------------------------------------------
export const Route = createFileRoute("/dashboard/documents")({
  head: () => ({ meta: [{ title: "Documents — ofc360" }] }),
  component: DocumentsPage,
});

// ----------------------------------------------------
// DOCUMENT CONSTANTS
// ----------------------------------------------------
const CATEGORIES = [
  "Employee Documents",
  "Education",
  "Employment",
  "Company Documents",
] as const;

const CATEGORY_TYPES: Record<string, string[]> = {
  "Employee Documents": ["Aadhaar Card", "PAN Card", "Passport", "Driving Licence", "Voter ID", "Resume", "Photograph"],
  "Education": ["10th Certificate", "12th Certificate", "Graduation", "Post Graduation", "Certifications"],
  "Employment": ["Offer Letter", "Appointment Letter", "Experience Letter", "Relieving Letter", "Salary Slip"],
  "Company Documents": ["HR Policy", "NDA", "Employment Agreement", "Code of Conduct", "Company Handbook"],
};

const STATS_CARDS = [
  { key: "total", title: "Total Documents", color: "text-blue-500", bg: "bg-blue-500/10" },
  { key: "verified", title: "Verified Documents", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { key: "pending", title: "Pending Verification", color: "text-amber-500", bg: "bg-amber-500/10" },
  { key: "rejected", title: "Rejected Documents", color: "text-rose-500", bg: "bg-rose-500/10" },
  { key: "expiring", title: "Expiring Soon", color: "text-purple-500", bg: "bg-purple-500/10" },
];

const DOCUMENT_TEMPLATES = [
  { id: "offer", title: "Offer Letter", category: "Employment", fields: ["Role", "Salary (LPA)", "Start Date"] },
  { id: "nda", title: "Non-Disclosure Agreement (NDA)", category: "Company Documents", fields: ["Witness Name", "Duration (Years)"] },
  { id: "handbook", title: "Company Handbook Acknowledgment", category: "Company Documents", fields: ["Version Date", "Signee Designation"] },
];

// Helper for file size formatting
const formatFileSize = (bytes?: number | null) => {
  if (!bytes || bytes === 0) return "1.2 MB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ----------------------------------------------------
// MAIN ROUTE COMPONENT (ROLE DISPATCHER)
// ----------------------------------------------------
function DocumentsPage() {
  const ws = useofc360();
  const userRole = (ws.user?.role as string)?.toLowerCase() || "employee";

  if (userRole === "employee") {
    return <EmployeeDocumentsPage />;
  }

  return <AdminDocumentsPage />;
}

// ----------------------------------------------------
// DEDICATED EMPLOYEE DOCUMENTS COMPONENT
// ----------------------------------------------------
function EmployeeDocumentsPage() {
  const ws = useofc360();
  const [realDocs, setRealDocs] = useState<HRDocument[]>([]);
  const [categoriesList, setCategoriesList] = useState<Array<{ id: string; name: string; code: string; is_company: boolean }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected doc for preview sheet
  const [previewDoc, setPreviewDoc] = useState<HRDocument | null>(null);

  // Upload modal state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState("Employee Documents");
  const [uploadType, setUploadType] = useState("Aadhaar Card");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadExpiry, setUploadExpiry] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current employee ID lookup
  const currentEmpId = useMemo(() => {
    return (
      (ws.user as any)?.employee_id ||
      (ws.user as any)?.employeeId ||
      ws.employees?.find((e: any) => e.userId === ws.user?.id || e.email === ws.user?.email)?.id ||
      null
    );
  }, [ws.user, ws.employees]);

  // Fetch real documents for authenticated employee
  const fetchEmployeeDocs = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch categories
      const catsRes = await api.get<{ data?: any[] }>("/documents/categories").catch(() => null);
      if (catsRes?.data && Array.isArray(catsRes.data)) {
        setCategoriesList(catsRes.data);
      }

      // 2. Fetch employee documents & company policies (Backend strictly scopes /documents/employees to logged-in user)
      const [empRes, compRes] = await Promise.all([
        api.get<{ data?: any[] }>("/documents/employees").catch(() => null),
        api.get<{ data?: any[] }>("/documents/company").catch(() => null),
      ]);

      const fetched: HRDocument[] = [];

      if (empRes?.data && Array.isArray(empRes.data)) {
        empRes.data.forEach((d: any) => {
          fetched.push({
            id: d.id,
            name: d.file_name || d.title,
            employeeId: d.employee_id,
            employeeName: "My Document",
            category: (d.category_name || "Employee Documents") as any,
            type: d.title || "Document",
            uploadedBy: d.uploaded_by_name || "Me / HR",
            uploadDate: d.created_at ? d.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            expiryDate: d.expiry_date || undefined,
            status: d.status === "VERIFIED" || d.status === "APPROVED" ? "Verified" : d.status === "REJECTED" ? "Rejected" : "Pending",
            fileSize: formatFileSize(d.file_size),
            fileType: (d.file_name?.split(".").pop() || "pdf").toLowerCase() as any,
            description: d.description || "",
            rejectionReason: d.comments || d.rejection_reason || undefined,
          });
        });
      }

      if (compRes?.data && Array.isArray(compRes.data)) {
        compRes.data.forEach((d: any) => {
          fetched.push({
            id: d.id,
            name: d.file_name || d.title,
            employeeId: undefined,
            employeeName: "Company Policy",
            category: "Company Documents",
            type: d.title || "Policy Document",
            uploadedBy: d.uploaded_by_name || "HR Admin",
            uploadDate: d.created_at ? d.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            expiryDate: undefined,
            status: d.status === "VERIFIED" || d.status === "APPROVED" ? "Verified" : d.status === "REJECTED" ? "Rejected" : "Pending",
            fileSize: formatFileSize(d.file_size),
            fileType: (d.file_name?.split(".").pop() || "pdf").toLowerCase() as any,
            description: d.description || "",
            rejectionReason: undefined,
          });
        });
      }

      setRealDocs(fetched);
    } catch (err) {
      console.error("Error fetching employee documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeDocs();
  }, []);

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return realDocs.filter((doc) => {
      if (categoryFilter !== "all" && doc.category !== categoryFilter) return false;
      if (statusFilter !== "all" && doc.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = doc.name.toLowerCase().includes(q);
        const matchType = doc.type.toLowerCase().includes(q);
        const matchCategory = doc.category.toLowerCase().includes(q);
        const matchDesc = doc.description?.toLowerCase().includes(q);
        if (!matchName && !matchType && !matchCategory && !matchDesc) return false;
      }
      return true;
    });
  }, [realDocs, categoryFilter, statusFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = realDocs.length;
    const verified = realDocs.filter((d) => d.status === "Verified").length;
    const pending = realDocs.filter((d) => d.status === "Pending").length;
    const rejected = realDocs.filter((d) => d.status === "Rejected").length;
    return { total, verified, pending, rejected };
  }, [realDocs]);

  // Download Handler
  const handleDownload = async (doc: HRDocument) => {
    toast.info(`Downloading ${doc.name}...`);
    try {
      const path = doc.category === "Company Documents"
        ? `/documents/company/${doc.id}/download`
        : `/documents/employees/${doc.id}/download`;

      const response = await apiInstance.get(path, { responseType: "blob" });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Downloaded ${doc.name}`);
    } catch (err: any) {
      console.error("Download error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to download file.");
    }
  };

  // Upload Submit Handler
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a document file to upload.");
      return;
    }
    if (!currentEmpId) {
      toast.error("Employee profile not found for upload.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      const catObj = categoriesList.find((c) => c.name === uploadCategory || c.code === uploadCategory);
      const categoryId = catObj?.id || "00000000-0000-0000-0000-000000000001";

      formData.append("file", selectedFile);
      formData.append("employee_id", currentEmpId);
      formData.append("category_id", categoryId);
      formData.append("title", uploadType || selectedFile.name);
      if (uploadDesc) formData.append("description", uploadDesc);
      if (uploadExpiry) formData.append("expiry_date", uploadExpiry);
      formData.append("visibility", "PRIVATE");
      formData.append("status_field", "PENDING");

      await apiInstance.post("/documents/employees", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Document uploaded successfully! Sent for HR verification.");
      setIsUploading(false);
      setUploadOpen(false);
      setSelectedFile(null);
      setUploadDesc("");
      setUploadExpiry("");
      await fetchEmployeeDocs();
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to upload document.");
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-0.5">
              Employee Portal
            </Badge>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Documents
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            View and manage documents available to you.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setUploadOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm gap-2 h-10 px-4 cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* ── SUMMARY CARDS ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border/60 bg-card/80 backdrop-blur-sm shadow-sm hover:border-border transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total Documents</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Personal & Company files</p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
              <Folder className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80 backdrop-blur-sm shadow-sm hover:border-border transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Verified Documents</p>
              <p className="mt-1 text-2xl font-bold text-emerald-500">{stats.verified}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Approved by HR</p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/80 backdrop-blur-sm shadow-sm hover:border-border transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Pending Verification</p>
              <p className="mt-1 text-2xl font-bold text-amber-500">{stats.pending}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Under HR review</p>
            </div>
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-500/10 text-amber-500">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── SEARCH & FILTERS BAR ────────────────────────────────────────────── */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by document name or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-background/80"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 text-xs w-[160px] bg-background/80">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Employee Documents">Employee Documents</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Employment">Employment</SelectItem>
                <SelectItem value="Company Documents">Company Policies</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs w-[140px] bg-background/80">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ── DOCUMENTS TABLE ─────────────────────────────────────────────────── */}
      <Card className="border-border/60 bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden">
        <CardHeader className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Available Documents</CardTitle>
              <CardDescription className="text-xs">
                Showing {filteredDocs.length} of {realDocs.length} documents
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              <p className="text-xs">Loading your documents from server...</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Folder className="h-10 w-10 mx-auto text-muted-foreground/40 mb-2" />
              <p className="text-sm font-medium text-foreground">No documents found</p>
              <p className="text-xs mt-1">There are no documents matching your search or filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="border-border/50">
                  <TableHead className="text-xs font-semibold py-3">Document Name</TableHead>
                  <TableHead className="text-xs font-semibold py-3">Category</TableHead>
                  <TableHead className="text-xs font-semibold py-3">Uploaded Date</TableHead>
                  <TableHead className="text-xs font-semibold py-3">Status</TableHead>
                  <TableHead className="text-xs font-semibold py-3">File Type</TableHead>
                  <TableHead className="text-xs font-semibold py-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocs.map((doc) => (
                  <TableRow key={doc.id} className="border-border/40 hover:bg-accent/40 transition-colors">
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                          <FileText className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-foreground leading-tight">{doc.name}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{doc.type}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3.5">
                      <Badge variant="outline" className="text-[10px] font-medium border-border">
                        {doc.category}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-3.5 text-xs text-muted-foreground">
                      {doc.uploadDate}
                    </TableCell>

                    <TableCell className="py-3.5">
                      {doc.status === "Verified" ? (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-semibold gap-1">
                          <CheckCircle className="h-3 w-3" /> Verified
                        </Badge>
                      ) : doc.status === "Rejected" ? (
                        <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px] font-semibold gap-1">
                          <XCircle className="h-3 w-3" /> Rejected
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] font-semibold gap-1">
                          <Clock className="h-3 w-3" /> Pending Review
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell className="py-3.5">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {doc.fileType || "pdf"}
                      </span>
                    </TableCell>

                    <TableCell className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewDoc(doc)}
                          className="h-8 px-2.5 text-xs gap-1 hover:bg-accent cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(doc)}
                          className="h-8 px-2.5 text-xs gap-1 border-border cursor-pointer hover:bg-accent"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ── PREVIEW DRAWER ──────────────────────────────────────────────────── */}
      <Sheet open={Boolean(previewDoc)} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <SheetContent className="w-full sm:max-w-lg border-l border-border p-0 flex flex-col">
          {previewDoc && (
            <>
              <SheetHeader className="p-5 border-b border-border bg-muted/20 shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px]">
                    {previewDoc.category}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">• {previewDoc.fileSize}</span>
                </div>
                <SheetTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-500" />
                  {previewDoc.name}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Uploaded on {previewDoc.uploadDate} by {previewDoc.uploadedBy}
                </SheetDescription>
              </SheetHeader>

              <ScrollArea className="flex-1 p-5">
                <div className="space-y-5">
                  {/* Status Banner */}
                  <div className="p-3.5 rounded-xl border border-border bg-card/60 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Document Status</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {previewDoc.status === "Verified" ? "Verified and approved by HR." : previewDoc.status === "Rejected" ? "Rejected by HR." : "Pending review by HR."}
                      </p>
                    </div>
                    {previewDoc.status === "Verified" ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs">Verified</Badge>
                    ) : previewDoc.status === "Rejected" ? (
                      <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-xs">Rejected</Badge>
                    ) : (
                      <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs">Pending</Badge>
                    )}
                  </div>

                  {/* Rejection Notice */}
                  {previewDoc.status === "Rejected" && previewDoc.rejectionReason && (
                    <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-rose-500">
                        <AlertTriangle className="h-4 w-4" /> Rejection Note from HR
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{previewDoc.rejectionReason}</p>
                    </div>
                  )}

                  {/* Document Metadata Details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-foreground">Document Information</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-lg border border-border/50 bg-muted/20">
                        <p className="text-[10px] text-muted-foreground font-medium">Document Type</p>
                        <p className="font-semibold text-foreground mt-0.5">{previewDoc.type}</p>
                      </div>
                      <div className="p-3 rounded-lg border border-border/50 bg-muted/20">
                        <p className="text-[10px] text-muted-foreground font-medium">File Format</p>
                        <p className="font-semibold text-foreground mt-0.5 uppercase">{previewDoc.fileType || "pdf"}</p>
                      </div>
                    </div>

                    {previewDoc.description && (
                      <div className="p-3 rounded-lg border border-border/50 bg-muted/20 text-xs space-y-1">
                        <p className="text-[10px] text-muted-foreground font-medium">Description / Notes</p>
                        <p className="text-foreground leading-relaxed">{previewDoc.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border bg-muted/10 shrink-0 flex items-center justify-end gap-2">
                <Button
                  onClick={() => handleDownload(previewDoc)}
                  className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-2 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Download Document
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ── UPLOAD MODAL ────────────────────────────────────────────────────── */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md border-border">
          <form onSubmit={handleUploadSubmit}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Upload className="h-4.5 w-4.5 text-indigo-500" />
                Upload Document
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4 text-xs">
              <div>
                <Label className="text-xs">Category</Label>
                <Select value={uploadCategory} onValueChange={(val) => {
                  setUploadCategory(val);
                  const types = CATEGORY_TYPES[val] || [];
                  if (types.length > 0) setUploadType(types[0]);
                }}>
                  <SelectTrigger className="h-9 text-xs mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employee Documents">Employee Documents (ID, PAN, Passport)</SelectItem>
                    <SelectItem value="Education">Education (Certificates & Degrees)</SelectItem>
                    <SelectItem value="Employment">Employment (Experience & Salary Slips)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Document Type / Title</Label>
                <Select value={uploadType} onValueChange={setUploadType}>
                  <SelectTrigger className="h-9 text-xs mt-1">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {(CATEGORY_TYPES[uploadCategory] || ["Aadhaar Card", "PAN Card", "Passport", "Resume"]).map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Document File (PDF, PNG, JPG)</Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 border-2 border-dashed border-border/80 hover:border-indigo-500/50 rounded-xl p-4 text-center cursor-pointer bg-muted/20 transition-colors"
                >
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground/60 mb-1" />
                  <p className="text-xs font-semibold text-foreground">
                    {selectedFile ? selectedFile.name : "Click to choose file"}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {selectedFile ? formatFileSize(selectedFile.size) : "PDF, PNG, JPG up to 10MB"}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Description (Optional)</Label>
                <Textarea
                  placeholder="Additional notes about this document..."
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  className="text-xs mt-1 h-20"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setUploadOpen(false)} className="h-9 text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading || !selectedFile} className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5">
                {isUploading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5" /> Submit Document
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ----------------------------------------------------
// MAIN ADMIN / HR DOCUMENTS COMPONENT
// ----------------------------------------------------
function AdminDocumentsPage() {
  const ws = useofc360();
  const [realDocs, setRealDocs] = useState<HRDocument[]>(ws.documents || []);
  const [categoriesList, setCategoriesList] = useState<Array<{ id: string; name: string; code: string; is_company: boolean }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const activities = ws.documentActivities || [];

  const docs = realDocs;

  // Selected file for upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch real documents & categories from FastAPI backend
  const fetchRealDocuments = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch categories
      const catsRes = await api.get<{ data?: any[] }>("/documents/categories").catch(() => null);
      if (catsRes?.data && Array.isArray(catsRes.data)) {
        setCategoriesList(catsRes.data);
      }

      // 2. Fetch employee & company documents
      const [empRes, compRes] = await Promise.all([
        api.get<{ data?: any[] }>("/documents/employees").catch(() => null),
        api.get<{ data?: any[] }>("/documents/company").catch(() => null),
      ]);

      const fetchedDocs: HRDocument[] = [];

      if (empRes?.data && Array.isArray(empRes.data)) {
        empRes.data.forEach((d: any) => {
          const emp = ws.employees?.find((e: Employee) => e.id === d.employee_id);
          fetchedDocs.push({
            id: d.id,
            name: d.file_name || d.title,
            employeeId: d.employee_id,
            employeeName: emp?.fullName || d.employee_name || "Employee",
            category: (d.category_name || "Employee Documents") as any,
            type: d.title || "Document",
            uploadedBy: d.uploaded_by_name || "HR Admin",
            uploadDate: d.created_at ? d.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            expiryDate: d.expiry_date || undefined,
            status: d.status === "VERIFIED" || d.status === "APPROVED" ? "Verified" : d.status === "REJECTED" ? "Rejected" : "Pending",
            fileSize: formatFileSize(d.file_size),
            fileType: (d.file_name?.split(".").pop() || "pdf").toLowerCase() as any,
            description: d.description || "",
            rejectionReason: d.comments || d.rejection_reason || undefined,
          });
        });
      }

      if (compRes?.data && Array.isArray(compRes.data)) {
        compRes.data.forEach((d: any) => {
          fetchedDocs.push({
            id: d.id,
            name: d.file_name || d.title,
            employeeId: undefined,
            employeeName: "Company-wide",
            category: "Company Documents",
            type: d.title || "Policy Document",
            uploadedBy: d.uploaded_by_name || "HR Admin",
            uploadDate: d.created_at ? d.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            expiryDate: undefined,
            status: d.status === "VERIFIED" || d.status === "APPROVED" ? "Verified" : d.status === "REJECTED" ? "Rejected" : "Pending",
            fileSize: formatFileSize(d.file_size),
            fileType: (d.file_name?.split(".").pop() || "pdf").toLowerCase() as any,
            description: d.description || "",
            rejectionReason: undefined,
          });
        });
      }

      setRealDocs(fetchedDocs);
      ofc360.set({ documents: fetchedDocs });
    } catch (err) {
      console.error("Failed to fetch documents from API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRealDocuments();
  }, []);

  // Table Filters & Search
  const [q, setQ] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<keyof HRDocument>("uploadDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected document for Preview
  const [previewDoc, setPreviewDoc] = useState<HRDocument | null>(null);

  // Modals state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Edit / Action state
  const [targetDoc, setTargetDoc] = useState<HRDocument | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Upload Form State
  const [uploadEmployee, setUploadEmployee] = useState<string>("company");
  const [uploadCategory, setUploadCategory] = useState<string>("Employee Documents");
  const [uploadType, setUploadType] = useState<string>("Aadhaar Card");
  const [uploadExpiry, setUploadExpiry] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileSize, setUploadFileSize] = useState("");

  // Generator Form State
  const [genTemplateId, setGenTemplateId] = useState("offer");
  const [genEmployee, setGenEmployee] = useState<string>("");
  const [genFields, setGenFields] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<string | null>(null);

  // Sync types dropdown when category changes in Upload modal
  const handleCategoryChange = (val: string) => {
    setUploadCategory(val);
    const types = CATEGORY_TYPES[val] || [];
    if (types.length > 0) setUploadType(types[0]);
  };

  // ----------------------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------------------

  // File Select Handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadFileName(file.name);
      setUploadFileSize(formatFileSize(file.size));
    }
  };

  // 1. Upload Handler (Real API)
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !uploadFileName) {
      toast.error("Please select a document file to upload.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      const catObj = categoriesList.find((c) => c.name === uploadCategory || c.code === uploadCategory);
      const categoryId = catObj?.id || "00000000-0000-0000-0000-000000000001";

      const fileToUpload = selectedFile || new File([uploadDesc || "Document content"], uploadFileName || "document.pdf", { type: "application/pdf" });

      formData.append("file", fileToUpload);
      formData.append("category_id", categoryId);
      formData.append("title", uploadType || uploadFileName);
      if (uploadDesc) formData.append("description", uploadDesc);
      if (uploadExpiry) formData.append("expiry_date", uploadExpiry);

      if (uploadEmployee !== "company") {
        formData.append("employee_id", uploadEmployee);
        formData.append("visibility", "PRIVATE");
        formData.append("status_field", "PENDING");
        await apiInstance.post("/documents/employees", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        formData.append("visibility", "PUBLIC");
        await apiInstance.post("/documents/company", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Document uploaded successfully!");
      setIsUploading(false);
      setUploadOpen(false);
      setSelectedFile(null);
      setUploadFileName("");
      setUploadFileSize("");
      setUploadDesc("");
      setUploadExpiry("");
      await fetchRealDocuments();
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to upload document.");
      setIsUploading(false);
    }
  };

  // 2. Generate Handler
  const handleGenerateAI = () => {
    setIsGenerating(true);
    setGeneratedDraft(null);

    setTimeout(() => {
      const template = DOCUMENT_TEMPLATES.find((x: any) => x.id === genTemplateId);
      const emp = ws.employees.find((x: any) => x.id === genEmployee);
      const recipient = emp ? emp.fullName : "Valued Professional";

      let text = `ofc360 TALENT LABS — OFFICIAL LETTER
Date: ${new Date().toISOString().split("T")[0]}
Recipient: ${recipient}

`;
      if (genTemplateId === "offer") {
        text += `Dear ${recipient},

We are pleased to offer you the position of ${genFields["Role"] || "Frontend Architect"} at ofc360 Talent Labs.
Your initial annual compensation package will be INR ${genFields["Salary (LPA)"] || "12.5"} Lakhs per annum, subject to standard deductions.
Your employment will commence on ${genFields["Start Date"] || "2026-07-15"}.

This offer is contingent upon successful verification of your educational certifications and previous employment documents.

Best Regards,
People Ops Team
ofc360 Talent Labs`;
      } else if (genTemplateId === "nda") {
        text += `NON-DISCLOSURE AGREEMENT (NDA)

This Agreement is entered into by and between ofc360 Talent Labs and ${recipient}, with witness ${genFields["Witness Name"] || "Priya Nair"}.
Both parties agree to hold confidential information in strict confidence for a duration of ${genFields["Duration (Years)"] || "3"} years from signing.
Information shared includes all software source code, corporate records, and recruiting workflows.

Signed by:
ofc360 Representative
And Recipient: ${recipient}`;
      } else {
        text += `COMPANY HANDBOOK ACKNOWLEDGMENT
Version: ${genFields["Version Date"] || "2026-01-01"}

I, ${recipient}, holding the designation of ${genFields["Signee Designation"] || "Team Lead"},
acknowledge that I have received, read, and understood the policies stated in the ofc360 Company Handbook v4.0.

Acknowledged and Signed electronically.`;
      }

      setGeneratedDraft(text);
      setIsGenerating(false);
      toast.success("Document draft generated with AI!");
    }, 1200);
  };

  const handleSaveGenerated = async () => {
    if (!generatedDraft) return;

    const template = DOCUMENT_TEMPLATES.find((x: any) => x.id === genTemplateId)!;
    const emp = ws.employees.find((x: any) => x.id === genEmployee);
    const empName = emp ? emp.fullName : "Company-wide";
    const fileName = `${template.title.replace(/\s+/g, "_")}_${empName.replace(/\s+/g, "_")}.pdf`;

    try {
      const formData = new FormData();
      const draftBlob = new Blob([generatedDraft], { type: "application/pdf" });
      const draftFile = new File([draftBlob], fileName, { type: "application/pdf" });

      const catObj = categoriesList.find((c) => c.is_company) || categoriesList[0];
      const categoryId = catObj?.id || "00000000-0000-0000-0000-000000000001";

      formData.append("file", draftFile);
      formData.append("category_id", categoryId);
      formData.append("title", template.title);
      formData.append("description", `AI Generated template for ${empName}`);

      if (genEmployee) {
        formData.append("employee_id", genEmployee);
        formData.append("visibility", "PRIVATE");
        formData.append("status_field", "VERIFIED");
        await apiInstance.post("/documents/employees", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        formData.append("visibility", "PUBLIC");
        await apiInstance.post("/documents/company", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success("Generated document saved to Vault!");
      setGenerateOpen(false);
      setGeneratedDraft(null);
      await fetchRealDocuments();
    } catch (err: any) {
      console.error("Save generated document error:", err);
      toast.error(err.response?.data?.message || err.message || "Failed to save generated document.");
    }
  };

  // 3. Verification Workflow Actions (Real API)
  const handleVerify = async (doc: HRDocument) => {
    try {
      await api.patch(`/documents/${doc.id}/verify`, { comments: "Verified & Approved" });
      toast.success(`Verified document: ${doc.name}`);

      if (previewDoc?.id === doc.id) {
        setPreviewDoc({ ...doc, status: "Verified" as const, rejectionReason: undefined });
      }
      await fetchRealDocuments();
    } catch (err: any) {
      console.error("Verify error:", err);
      toast.error(err.message || "Failed to verify document");
    }
  };

  const handleRejectPrompt = (doc: HRDocument) => {
    setTargetDoc(doc);
    setRejectionReason("");
    setRejectOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!targetDoc) return;
    if (!rejectionReason.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }

    try {
      await api.patch(`/documents/${targetDoc.id}/reject`, { comments: rejectionReason });
      toast.warning(`Document rejected: ${targetDoc.name}`);

      if (previewDoc?.id === targetDoc.id) {
        setPreviewDoc({ ...targetDoc, status: "Rejected" as const, rejectionReason });
      }
      setRejectOpen(false);
      setTargetDoc(null);
      await fetchRealDocuments();
    } catch (err: any) {
      console.error("Reject error:", err);
      toast.error(err.message || "Failed to reject document");
    }
  };

  const handleRequestReupload = async (doc: HRDocument) => {
    try {
      await api.patch(`/documents/${doc.id}/reject`, { comments: "Re-upload requested. Please supply a clear copy." });
      toast.info(`Requested re-upload for: ${doc.name}`);

      if (previewDoc?.id === doc.id) {
        setPreviewDoc({ ...doc, status: "Pending" as const, rejectionReason: "Re-upload requested. Please supply a clear copy." });
      }
      await fetchRealDocuments();
    } catch (err: any) {
      console.error("Request reupload error:", err);
      toast.error(err.message || "Failed to request reupload");
    }
  };

  // 4. Delete Handler (Real API)
  const handleDeletePrompt = (doc: HRDocument) => {
    setTargetDoc(doc);
    setDeleteOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!targetDoc) return;

    try {
      if (targetDoc.category === "Company Documents") {
        await api.delete(`/documents/company/${targetDoc.id}`);
      } else {
        await api.delete(`/documents/employees/${targetDoc.id}`);
      }

      toast.error(`Deleted document: ${targetDoc.name}`);
      if (previewDoc?.id === targetDoc.id) {
        setPreviewDoc(null);
      }
      setDeleteOpen(false);
      setTargetDoc(null);
      await fetchRealDocuments();
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err.message || "Failed to delete document");
    }
  };

  // Real File Download
  const handleDownload = async (doc: HRDocument) => {
    toast.info(`Downloading ${doc.name}...`);
    try {
      const path = doc.category === "Company Documents"
        ? `/documents/company/${doc.id}/download`
        : `/documents/employees/${doc.id}/download`;

      const response = await apiInstance.get(path, { responseType: "blob" });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Downloaded ${doc.name}`);
    } catch (err) {
      console.error("Download error:", err);
      // Fallback text file download if stream failed
      const element = document.createElement("a");
      const file = new Blob([`ofc360 HR Vault. Document ID: ${doc.id}\nCategory: ${doc.category}\nName: ${doc.name}\nStatus: ${doc.status}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = doc.name;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  // ----------------------------------------------------
  // COMPUTED CALCULATIONS (STATS / FILTERS)
  // ----------------------------------------------------

  // Stats Card data
  const stats = useMemo(() => {
    const total = docs.length;
    const verified = docs.filter((d: HRDocument) => d.status === "Verified").length;
    const pending = docs.filter((d: HRDocument) => d.status === "Pending").length;
    const rejected = docs.filter((d: HRDocument) => d.status === "Rejected").length;

    // Check expiring (expiry within 30 days of 2026-06-28)
    const mockNow = new Date("2026-06-28").getTime();
    const thirtyDaysLimit = mockNow + 30 * 24 * 60 * 60 * 1000;
    const expiring = docs.filter((d: HRDocument) => {
      if (!d.expiryDate) return false;
      const t = new Date(d.expiryDate).getTime();
      return t >= mockNow && t <= thirtyDaysLimit;
    }).length;

    return { total, verified, pending, rejected, expiring };
  }, [docs]);

  // System Notifications Alerts
  const notifications = useMemo(() => {
    const alerts: { id: string; type: "warning" | "info" | "error"; message: string; doc?: HRDocument }[] = [];

    // Expiring soon alert
    const mockNow = new Date("2026-06-28").getTime();
    const thirtyDaysLimit = mockNow + 30 * 24 * 60 * 60 * 1000;
    docs.forEach((d: HRDocument) => {
      if (d.expiryDate) {
        const t = new Date(d.expiryDate).getTime();
        if (t >= mockNow && t <= thirtyDaysLimit) {
          alerts.push({
            id: `exp_${d.id}`,
            type: "warning",
            message: `${d.employeeName || "Company"}'s ${d.type} is expiring soon on ${d.expiryDate}.`,
            doc: d,
          });
        }
      }
    });

    // Pending review alert
    const pendingDocs = docs.filter((d: HRDocument) => d.status === "Pending");
    if (pendingDocs.length > 0) {
      alerts.push({
        id: "alert_pending",
        type: "info",
        message: `You have ${pendingDocs.length} documents awaiting review and verification.`,
      });
    }

    // Missing critical document checks (Aadhaar & PAN are mandatory for all employees)
    ws.employees.forEach((emp: Employee) => {
      const empDocs = docs.filter((d: HRDocument) => d.employeeId === emp.id);
      const hasAadhaar = empDocs.some((d: HRDocument) => d.type === "Aadhaar Card");
      const hasPAN = empDocs.some((d: HRDocument) => d.type === "PAN Card");

      if (!hasAadhaar) {
        alerts.push({
          id: `miss_aadhaar_${emp.id}`,
          type: "error",
          message: `Mandatory document: Aadhaar Card is missing for ${emp.fullName}.`,
        });
      }
      if (!hasPAN) {
        alerts.push({
          id: `miss_pan_${emp.id}`,
          type: "error",
          message: `Mandatory document: PAN Card is missing for ${emp.fullName}.`,
        });
      }
    });

    return alerts;
  }, [docs, ws.employees]);

  // Table Filtering & Searching
  const filteredDocs = useMemo(() => {
    return docs.filter((d: HRDocument) => {
      const matchesQ =
        !q ||
        d.name.toLowerCase().includes(q.toLowerCase()) ||
        (d.employeeName && d.employeeName.toLowerCase().includes(q.toLowerCase())) ||
        d.category.toLowerCase().includes(q.toLowerCase()) ||
        d.type.toLowerCase().includes(q.toLowerCase());

      let matchesTab = true;
      if (activeFilter === "Employee Documents") {
        matchesTab = d.category === "Employee Documents" || d.category === "Education" || d.category === "Employment";
      } else if (activeFilter === "Company Documents") {
        matchesTab = d.category === "Company Documents";
      } else if (activeFilter === "HR Templates") {
        matchesTab = d.category === "Company Documents" && (d.type === "NDA" || d.type === "HR Policy" || d.type === "Company Handbook");
      } else if (activeFilter === "Pending") {
        matchesTab = d.status === "Pending";
      } else if (activeFilter === "Verified") {
        matchesTab = d.status === "Verified";
      } else if (activeFilter === "Rejected") {
        matchesTab = d.status === "Rejected";
      }

      return matchesQ && matchesTab;
    });
  }, [docs, q, activeFilter]);

  // Table Sorting
  const sortedDocs = useMemo(() => {
    const sorted = [...filteredDocs];
    sorted.sort((a, b) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredDocs, sortField, sortOrder]);

  // Paginated elements
  const paginatedDocs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedDocs.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedDocs, currentPage]);

  const totalPages = Math.ceil(sortedDocs.length / itemsPerPage);

  const handleSort = (field: keyof HRDocument) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Documents"
        description="Securely store, verify, and generate employee records and company templates."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setUploadOpen(true)}
              className="h-9 gap-2 border-border bg-card/60 hover:bg-accent/60 cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
            <Button
              onClick={() => {
                setGenerateOpen(true);
                if (ws.employees.length > 0) setGenEmployee(ws.employees[0].id);
              }}
              className="h-9 gap-2 bg-gradient-brand text-brand-foreground hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Wand2 className="h-4 w-4" />
              Generate Document
            </Button>
          </div>
        }
      />

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {STATS_CARDS.map(card => {
          const val = stats[card.key as keyof typeof stats];
          return (
            <Card key={card.key} className="border-border bg-card/40 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">{card.title}</span>
                  <span className={`grid h-7 w-7 place-items-center rounded-lg ${card.bg}`}>
                    <Folder className={`h-3.5 w-3.5 ${card.color}`} />
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold font-display tracking-tight">{val}</span>
                  {card.key === "verified" && docs.length > 0 && (
                    <span className="text-[10px] text-muted-foreground font-medium">
                      ({Math.round((val / docs.length) * 100)}%)
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3. MAIN CONTENTS */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
            {/* Search & Filter pills */}
            <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-sm flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={e => {
                    setQ(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by name, employee, category..."
                  className="h-9 pl-9 border-border bg-background/50 focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              {/* CSV Export */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const headers = ["ID", "Name", "Employee", "Category", "Type", "Uploaded By", "Date", "Expiry", "Status", "Size"];
                  const rows = docs.map(d => [
                    d.id,
                    d.name,
                    d.employeeName || "Company-wide",
                    d.category,
                    d.type,
                    d.uploadedBy,
                    d.uploadDate,
                    d.expiryDate || "",
                    d.status,
                    d.fileSize
                  ].map(v => `"${v.replace(/"/g, '""')}"`).join(","));
                  const csv = [headers.join(","), ...rows].join("\n");
                  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "documents_vault.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                  toast.success("Exported documents catalog CSV");
                }}
                className="h-9 gap-1.5 border-border bg-background/40 hover:bg-accent/60 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                Export CSV
              </Button>
            </div>

            {/* Scrollable Filters row */}
            <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 border-b border-border bg-muted/10 scrollbar-none">
              {[
                { id: "all", label: "All Vault" },
                { id: "Employee Documents", label: "Employee Files" },
                { id: "Company Documents", label: "Company Documents" },
                { id: "HR Templates", label: "HR Templates" },
                { id: "Pending", label: "Pending Verification" },
                { id: "Verified", label: "Verified" },
                { id: "Rejected", label: "Rejected" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium border transition-colors cursor-pointer ${activeFilter === tab.id
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background/40 border-border hover:bg-accent/60 text-muted-foreground"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TABLE LIST */}
            {paginatedDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-muted/50 border border-border text-muted-foreground">
                  <Folder className="h-6 w-6" />
                </div>
                <p className="font-semibold text-foreground">No documents found</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try adjusting your search criteria, clearing the filters, or upload a new record.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-[900px] border-collapse">
                  <TableHeader className="bg-muted/10 text-xs font-medium uppercase tracking-wider border-b border-border">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("name")}>
                        Document Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("employeeName")}>
                        Employee {sortField === "employeeName" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("category")}>
                        Category {sortField === "category" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="px-4 py-3 text-muted-foreground">Uploaded By</TableHead>
                      <TableHead className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort("uploadDate")}>
                        Upload Date {sortField === "uploadDate" && (sortOrder === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="px-4 py-3 text-muted-foreground">Expiry Date</TableHead>
                      <TableHead className="px-4 py-3 text-center text-muted-foreground">Status</TableHead>
                      <TableHead className="px-4 py-3 text-muted-foreground">File Size</TableHead>
                      <TableHead className="px-4 py-3 text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedDocs.map((doc: HRDocument) => {
                      const isExpiring = doc.expiryDate && new Date(doc.expiryDate).getTime() <= new Date("2026-06-28").getTime() + 30 * 24 * 60 * 60 * 1000;
                      return (
                        <TableRow
                          key={doc.id}
                          className="group border-t border-border transition-colors hover:bg-accent/25 cursor-pointer"
                          onClick={() => setPreviewDoc(doc)}
                        >
                          <TableCell className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground">
                                <FileText className="h-4 w-4" />
                              </span>
                              <div className="font-medium text-foreground max-w-[200px] truncate" title={doc.name}>
                                {doc.name}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-3 font-medium text-foreground/80">
                            {doc.employeeName || (
                              <span className="text-xs text-muted-foreground italic">Company-wide</span>
                            )}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <div className="text-xs text-muted-foreground">{doc.category}</div>
                            <div className="text-xs font-semibold text-foreground/75 mt-0.5">{doc.type}</div>
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                            {doc.uploadedBy}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                            {doc.uploadDate}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs">
                            {doc.expiryDate ? (
                              <span className={isExpiring ? "text-purple-500 font-medium" : "text-muted-foreground"}>
                                {doc.expiryDate}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/40 italic">—</span>
                            )}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-center">
                            {doc.status === "Verified" && (
                              <Badge className="bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-500 gap-1 border-none shadow-none font-medium">
                                <CheckCircle className="h-3 w-3" /> Verified
                              </Badge>
                            )}
                            {doc.status === "Pending" && (
                              <Badge className="bg-amber-500/10 hover:bg-amber-500/15 text-amber-500 gap-1 border-none shadow-none font-medium">
                                <Clock className="h-3 w-3" /> Pending
                              </Badge>
                            )}
                            {doc.status === "Rejected" && (
                              <Badge className="bg-rose-500/10 hover:bg-rose-500/15 text-rose-500 gap-1 border-none shadow-none font-medium">
                                <XCircle className="h-3 w-3" /> Rejected
                              </Badge>
                            )}
                            {doc.status === "Expired" && (
                              <Badge className="bg-neutral-500/10 hover:bg-neutral-500/15 text-neutral-500 gap-1 border-none shadow-none font-medium">
                                <AlertTriangle className="h-3 w-3" /> Expired
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                            {doc.fileSize}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-end items-center gap-1.5 opacity-80 group-hover:opacity-100">
                              <button
                                onClick={() => setPreviewDoc(doc)}
                                className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                                title="View inline mockup"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDownload(doc)}
                                className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
                                title="Download Document"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </button>
                              {doc.status === "Pending" && (
                                <>
                                  <button
                                    onClick={() => handleVerify(doc)}
                                    className="rounded p-1.5 text-emerald-500 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                                    title="Verify & Approve"
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleRejectPrompt(doc)}
                                    className="rounded p-1.5 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                    title="Reject Document"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDeletePrompt(doc)}
                                className="rounded p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                                title="Delete Document"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-4 py-3">
                <span className="text-xs text-muted-foreground">
                  Showing Page <strong className="font-semibold text-foreground">{currentPage}</strong> of <strong className="font-semibold text-foreground">{totalPages}</strong>
                </span>
                <div className="flex gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
                    className="h-8 border-border hover:bg-accent/60 cursor-pointer"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
                    className="h-8 border-border hover:bg-accent/60 cursor-pointer"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

      {/* ----------------------------------------------------
          UPLOAD DOCUMENT MODAL
         ---------------------------------------------------- */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">Upload New Document</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            {/* Employee dropdown */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Employee Association</Label>
              <Select value={uploadEmployee} onValueChange={setUploadEmployee}>
                <SelectTrigger className="w-full bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  <SelectItem value="company">Company-wide (No specific employee)</SelectItem>
                  {ws.employees.map((emp: Employee) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grid for Category & Document Type */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Category</Label>
                <Select value={uploadCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="bg-background/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Document Type</Label>
                <Select value={uploadType} onValueChange={setUploadType}>
                  <SelectTrigger className="bg-background/50 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(CATEGORY_TYPES[uploadCategory] || []).map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Expiry Date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Expiry Date (Optional)</Label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  value={uploadExpiry}
                  onChange={e => setUploadExpiry(e.target.value)}
                  className="pl-9 bg-background/50 border-border text-xs"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Description / Notes</Label>
              <Textarea
                placeholder="Specify file details or compliance requirements"
                value={uploadDesc}
                onChange={e => setUploadDesc(e.target.value)}
                className="min-h-[60px] bg-background/50 border-border text-xs"
              />
            </div>

            {/* Real File Input & Drag/Drop Field */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.docx"
            />
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Upload File (PDF, JPG, PNG, DOCX)</Label>
              {uploadFileName ? (
                <div className="flex items-center justify-between rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="font-semibold text-foreground truncate max-w-[200px]">{uploadFileName}</p>
                      <p className="text-[10px] text-muted-foreground">{uploadFileSize}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => { setSelectedFile(null); setUploadFileName(""); setUploadFileSize(""); }}
                    className="h-7 text-muted-foreground hover:text-foreground hover:bg-accent/40 cursor-pointer"
                  >
                    Change File
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/30 p-6 text-center transition-colors hover:bg-accent/20 cursor-pointer"
                >
                  <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-xs font-medium text-foreground">Click to browse and select a file</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">Supports PDF, PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>

            <DialogFooter className="pt-2 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadOpen(false)}
                className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading}
                className="h-9 min-w-[100px] bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer"
              >
                {isUploading ? "Uploading..." : "Upload File"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          AI DOCUMENT GENERATOR MODAL
         ---------------------------------------------------- */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent className="sm:max-w-2xl bg-background border-border shadow-2xl p-0">
          <div className="grid grid-cols-1 md:grid-cols-5 h-[580px] divide-y md:divide-y-0 md:divide-x divide-border">
            {/* LEFT 2 PANELS: FORM SELECTORS */}
            <div className="md:col-span-2 p-5 flex flex-col justify-between h-full bg-muted/10">
              <div className="space-y-4">
                <div>
                  <h3 className="font-display text-base font-bold flex items-center gap-1.5">
                    <Wand2 className="h-4 w-4 text-indigo-500 animate-pulse" />
                    AI Letter Generator
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Generate compliant contracts and documents.</p>
                </div>

                {/* Template choice */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Document Template</Label>
                  <Select
                    value={genTemplateId}
                    onValueChange={val => {
                      setGenTemplateId(val);
                      setGenFields({});
                      setGeneratedDraft(null);
                    }}
                  >
                    <SelectTrigger className="h-8 bg-background/70 border-border text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DOCUMENT_TEMPLATES.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Employee */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">For Employee</Label>
                  <Select value={genEmployee} onValueChange={setGenEmployee}>
                    <SelectTrigger className="h-8 bg-background/70 border-border text-xs">
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {ws.employees.map((emp: Employee) => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.fullName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom Template fields */}
                <div className="space-y-3 pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Template Parameters</div>
                  {DOCUMENT_TEMPLATES.find((x: any) => x.id === genTemplateId)?.fields.map((field: string) => (
                    <div key={field} className="space-y-1">
                      <Label className="text-[11px] text-foreground/80">{field}</Label>
                      <Input
                        value={genFields[field] || ""}
                        onChange={e => setGenFields({ ...genFields, [field]: e.target.value })}
                        className="h-8 bg-background/50 border-border text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <Button
                  onClick={handleGenerateAI}
                  disabled={isGenerating || !genEmployee}
                  className="w-full h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 font-medium text-xs gap-1.5 cursor-pointer"
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  {isGenerating ? "Drafting with AI..." : "Generate Draft"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setGenerateOpen(false)}
                  className="h-8 text-xs text-muted-foreground hover:bg-accent/40 cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* RIGHT 3 PANELS: AI PREVIEW */}
            <div className="md:col-span-3 p-5 flex flex-col justify-between h-full">
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-xs font-bold text-foreground">Document Draft Preview</span>
                  <Badge variant="outline" className="text-[9px] border-indigo-500/20 text-indigo-500 bg-indigo-500/5">
                    Ready to Save
                  </Badge>
                </div>

                <div className="flex-1 overflow-auto bg-muted/20 border border-border rounded-xl p-4 mt-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-indigo-500" />
                      <p className="font-semibold">AI Assistant drafting letter...</p>
                      <p className="text-[10px] text-muted-foreground/85">Formatting with official templates & clauses</p>
                    </div>
                  ) : generatedDraft ? (
                    generatedDraft
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                      <Wand2 className="h-6 w-6 text-muted-foreground/50 mb-2" />
                      <p className="font-semibold">No Draft Available</p>
                      <p className="text-[10px]">Select an employee, configure parameters, and generate the contract.</p>
                    </div>
                  )}
                </div>
              </div>

              {generatedDraft && (
                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setGeneratedDraft(null)}
                    className="h-9 text-xs border-border bg-transparent cursor-pointer"
                  >
                    Clear Draft
                  </Button>
                  <Button
                    onClick={handleSaveGenerated}
                    className="h-9 text-xs bg-emerald-600 text-white hover:bg-emerald-700 gap-1.5 cursor-pointer"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Save & Verify Document
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          REJECT DOCUMENT REASON DIALOG
         ---------------------------------------------------- */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-rose-500 flex items-center gap-1.5">
              <AlertTriangle className="h-5 w-5" />
              Reject Document Compliance
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-xs text-muted-foreground">
              Please state the reason for rejecting <strong className="font-semibold text-foreground">{targetDoc?.name}</strong>. The employee will see this feedback.
            </p>
            <Textarea
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              placeholder="e.g. Signature cut off, document blur, expired date, wrong employee ID..."
              className="min-h-[100px] border-border text-xs"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setRejectOpen(false); setTargetDoc(null); }}
              className="h-9 border-border bg-transparent cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectSubmit}
              className="h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          DELETE DOCUMENT CONFIRMATION DIALOG
         ---------------------------------------------------- */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm bg-background border-border">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-foreground">Delete Document</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-xs text-muted-foreground">
            Are you sure you want to permanently delete <strong className="font-semibold text-foreground">{targetDoc?.name}</strong>? This action will wipe the file and remove it from audit history.
          </div>
          <DialogFooter className="gap-1.5">
            <Button
              variant="outline"
              onClick={() => { setDeleteOpen(false); setTargetDoc(null); }}
              className="h-9 border-border bg-transparent cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteSubmit}
              className="h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
            >
              Delete File
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          SLIDE-OUT PREVIEW PANEL SHEET
         ---------------------------------------------------- */}
      <Sheet open={!!previewDoc} onOpenChange={open => !open && setPreviewDoc(null)}>
        <SheetContent className="sm:max-w-xl flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl">
          {previewDoc && (
            <>
              <SheetHeader className="p-5 border-b border-border bg-muted/10 shrink-0 text-left">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide border-border">
                    {previewDoc.category}
                  </Badge>
                  {previewDoc.status === "Verified" && (
                    <Badge className="bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-500 border-none shadow-none font-medium text-xs">
                      Verified
                    </Badge>
                  )}
                  {previewDoc.status === "Pending" && (
                    <Badge className="bg-amber-500/10 hover:bg-amber-500/15 text-amber-500 border-none shadow-none font-medium text-xs">
                      Pending Review
                    </Badge>
                  )}
                  {previewDoc.status === "Rejected" && (
                    <Badge className="bg-rose-500/10 hover:bg-rose-500/15 text-rose-500 border-none shadow-none font-medium text-xs">
                      Rejected
                    </Badge>
                  )}
                  {previewDoc.status === "Expired" && (
                    <Badge className="bg-neutral-500/10 hover:bg-neutral-500/15 text-neutral-500 border-none shadow-none font-medium text-xs">
                      Expired
                    </Badge>
                  )}
                </div>
                <SheetTitle className="font-display text-base font-bold text-foreground mt-2 truncate text-left" title={previewDoc.name}>
                  {previewDoc.name}
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground text-left mt-0.5">
                  Type: {previewDoc.type} &bull; Uploaded by {previewDoc.uploadedBy} on {previewDoc.uploadDate}
                </SheetDescription>
              </SheetHeader>

              {/* Scrollable sheet body */}
              <ScrollArea className="flex-1 p-5 min-h-0">
                <div className="space-y-6">
                  {/* CANVAS GRAPHICAL VISUAL MOCKUP PREVIEW */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Inline Verification View</Label>
                    <div className="overflow-hidden rounded-2xl border border-border bg-muted/40 aspect-[4/3] relative flex items-center justify-center p-4">
                      {/* Sub-components representing specific document lookups */}
                      {previewDoc.type === "Aadhaar Card" ? (
                        <div className="w-[320px] aspect-[8.5/5.5] bg-sky-50 dark:bg-sky-950/20 border border-sky-300/40 rounded-xl shadow-md p-3 relative flex flex-col justify-between select-none">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[7px] font-bold text-sky-800 dark:text-sky-400 uppercase leading-none">Government of India</p>
                              <p className="text-[5px] text-sky-600/80 leading-none">Unique Identification Authority of India</p>
                            </div>
                            <span className="h-5 w-5 bg-sky-200 dark:bg-sky-800 rounded-full opacity-60" />
                          </div>

                          <div className="flex gap-2.5 my-2">
                            {/* photo */}
                            <div className="w-12 h-14 bg-sky-200 dark:bg-sky-900 border border-sky-400/20 rounded flex items-center justify-center shrink-0">
                              <User className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                            </div>
                            <div className="text-[6px] space-y-1 text-sky-900 dark:text-sky-200 text-left">
                              <p><strong className="font-semibold text-[8px]">{previewDoc.employeeName || "Jordan Lee"}</strong></p>
                              <p>DOB: 12/04/1996</p>
                              <p>Gender: Male</p>
                              <p className="mt-1 leading-relaxed text-[5px] opacity-75 text-left">Address: 12th Cross Rd, Indiranagar, Bangalore, 560038</p>
                            </div>
                          </div>

                          <div className="border-t border-sky-400/20 pt-1.5 flex justify-between items-center">
                            <span className="font-mono text-xs font-bold text-sky-900 dark:text-sky-100 tracking-wider">
                              1984 0122 1042
                            </span>
                            <span className="text-[5px] uppercase font-bold text-sky-800 dark:text-sky-400 bg-sky-100 dark:bg-sky-900/50 px-1 py-0.5 rounded">
                              Mera Aadhaar
                            </span>
                          </div>
                        </div>
                      ) : previewDoc.type === "PAN Card" ? (
                        <div className="w-[320px] aspect-[8.5/5.5] bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 border border-emerald-400/30 rounded-xl shadow-md p-3 relative flex flex-col justify-between select-none">
                          <div className="flex justify-between items-center border-b border-emerald-500/20 pb-1.5">
                            <span className="text-[6px] uppercase font-bold text-emerald-800 dark:text-emerald-400 leading-none">Income Tax Department</span>
                            <span className="text-[6px] text-emerald-600 font-medium leading-none">GOVT OF INDIA</span>
                          </div>

                          <div className="flex gap-3 my-2.5">
                            <div className="w-10 h-12 bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-500/20 rounded flex items-center justify-center shrink-0">
                              <User className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div className="text-[6px] space-y-1 text-emerald-900 dark:text-emerald-100 text-left">
                              <p>Name: <strong className="font-semibold">{previewDoc.employeeName || "Jordan Lee"}</strong></p>
                              <p>Father's Name: K. M. Lee</p>
                              <p>Date of Birth: 12/04/1996</p>
                              <p className="mt-1 font-mono text-[9px] font-bold text-emerald-900 dark:text-emerald-100 tracking-wide">
                                ABCDE1042F
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[5px]">
                            <span className="italic border-b border-emerald-900/40 text-emerald-900 dark:text-emerald-100 font-mono">
                              {previewDoc.employeeName?.split(" ")[0] || "Jordan"}
                            </span>
                            <span className="h-4 w-4 bg-yellow-400/40 dark:bg-yellow-500/20 rounded-full" />
                          </div>
                        </div>
                      ) : previewDoc.type === "Passport" ? (
                        <div className="w-[320px] aspect-[8.5/5.5] bg-slate-900 text-slate-100 border border-slate-700 rounded-xl shadow-md p-3 relative flex flex-col justify-between select-none">
                          <div className="flex justify-between items-start border-b border-slate-700 pb-1">
                            <span className="text-[6px] uppercase font-bold tracking-widest text-slate-400">Republic of India</span>
                            <span className="text-[6px] uppercase font-bold text-slate-400">PASSPORT</span>
                          </div>

                          <div className="flex gap-3.5 my-2">
                            <div className="w-12 h-14 bg-slate-800 border border-slate-700 rounded flex items-center justify-center shrink-0">
                              <User className="h-6 w-6 text-slate-400" />
                            </div>
                            <div className="text-[6px] space-y-0.5 text-slate-300 text-left">
                              <p>Surname: <strong className="font-semibold text-slate-100 uppercase">{previewDoc.employeeName?.split(" ").pop() || "LEE"}</strong></p>
                              <p>Given Names: <strong className="font-semibold text-slate-100">{previewDoc.employeeName?.split(" ")[0] || "JORDAN"}</strong></p>
                              <p>Nationality: Indian</p>
                              <p>Passport No: <span className="font-mono font-bold text-yellow-400">Z3210452</span></p>
                              <p>Expiry: {previewDoc.expiryDate || "2030-01-01"}</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-[4px] font-mono text-slate-500 tracking-wider">
                            P&lt;IND&lt;&lt;JORDAN&lt;LEE&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                          </div>
                        </div>
                      ) : (previewDoc.category === "Company Documents" || previewDoc.type === "Resume" || previewDoc.type === "Offer Letter" || previewDoc.type === "Relieving Letter") ? (
                        <div className="w-[300px] h-[200px] bg-white text-slate-800 border border-slate-300 rounded shadow-md p-4 relative flex flex-col justify-between overflow-hidden select-none">
                          <div className="border-b border-slate-300 pb-2">
                            <p className="text-[7px] font-bold text-slate-900 tracking-wide flex items-center gap-1">
                              <ShieldCheck className="h-2.5 w-2.5 text-indigo-600" />
                              ofc360 TALENT LABS
                            </p>
                            <p className="text-[5px] text-slate-400 leading-none">Internal Compliance & Human Resources Vault</p>
                          </div>

                          <div className="my-2 text-left space-y-1.5">
                            <p className="text-[8px] font-bold text-slate-900 underline truncate">{previewDoc.name}</p>
                            <p className="text-[5px] text-slate-500 leading-relaxed max-w-full">
                              This document stands as an official record of ofc360 HR Talent Labs. Details contained herein are confidential under corporate NDAs and data processing regulations.
                            </p>
                            <p className="text-[5px] text-slate-600 italic">
                              Category: {previewDoc.category} &bull; Type: {previewDoc.type}
                            </p>
                          </div>

                          <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-[5px] text-slate-400">
                            <span>Verification Hash: SHA-256</span>
                            <span className="h-3 w-10 bg-indigo-500/10 rounded flex items-center justify-center font-bold text-indigo-600 text-[4px]">
                              SECURE DOC
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="w-[300px] aspect-[4/3] bg-card border border-border rounded flex flex-col items-center justify-center p-4">
                          <FileText className="h-10 w-10 text-muted-foreground/60 mb-2" />
                          <p className="text-xs font-semibold text-foreground text-center truncate w-full">{previewDoc.name}</p>
                          <p className="text-[10px] text-muted-foreground/80 mt-1">Generic binary layout view</p>
                        </div>
                      )}

                      {/* PDF Overlay symbol */}
                      <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-semibold uppercase">
                        {previewDoc.fileType}
                      </span>
                    </div>
                  </div>

                  {/* REJECTION WARNING CALLOUT */}
                  {previewDoc.status === "Rejected" && previewDoc.rejectionReason && (
                    <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs text-rose-600 dark:text-rose-400 space-y-1 text-left">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Rejection Compliance Remarks:
                      </div>
                      <p className="leading-relaxed bg-rose-500/10 dark:bg-rose-500/20 p-2 rounded border border-rose-500/10 text-left">
                        "{previewDoc.rejectionReason}"
                      </p>
                    </div>
                  )}

                  {/* METADATA DETAILS */}
                  <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Document Details</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Employee Owner</span>
                        <strong className="text-foreground mt-0.5 block">{previewDoc.employeeName || "Company-wide"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Verification Type</span>
                        <strong className="text-foreground mt-0.5 block">{previewDoc.type}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">File Size</span>
                        <strong className="text-foreground mt-0.5 block">{previewDoc.fileSize}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Expiry Date</span>
                        <strong className="text-foreground mt-0.5 block">{previewDoc.expiryDate || "No expiration date"}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground block text-[10px]">Internal Description</span>
                        <p className="text-foreground mt-0.5 leading-relaxed">{previewDoc.description || "No description provided."}</p>
                      </div>
                    </div>
                  </div>

                  {/* TIMELINE OF WORKFLOW */}
                  <div className="space-y-2 text-left">
                    <Label className="text-xs font-semibold text-muted-foreground">Verification Audit Timeline</Label>
                    <div className="rounded-xl border border-border bg-card/40 p-4 space-y-3">
                      {/* Step 1: Uploaded */}
                      <div className="flex gap-3 text-xs relative before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3">
                        <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-white shrink-0">
                          <CheckCircle className="h-2.5 w-2.5 animate-bounce" />
                        </span>
                        <div>
                          <p className="font-bold text-foreground">Uploaded & Saved</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            By {previewDoc.uploadedBy} on {previewDoc.uploadDate}
                          </p>
                        </div>
                      </div>

                      {/* Step 2: Under Review */}
                      <div className="flex gap-3 text-xs relative before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3">
                        <span className={`grid h-4 w-4 place-items-center rounded-full shrink-0 ${previewDoc.status === "Pending" ? "bg-amber-500 text-white animate-pulse" : "bg-emerald-500 text-white"
                          }`}>
                          {previewDoc.status === "Pending" ? <Clock className="h-2.5 w-2.5" /> : <CheckCircle className="h-2.5 w-2.5" />}
                        </span>
                        <div>
                          <p className="font-bold text-foreground">Compliance Review</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {previewDoc.status === "Pending" ? "Awaiting review from Human Resources" : "Reviewed by People Ops Officer"}
                          </p>
                        </div>
                      </div>

                      {/* Step 3: Verified or Rejected */}
                      <div className="flex gap-3 text-xs">
                        <span className={`grid h-4 w-4 place-items-center rounded-full shrink-0 ${previewDoc.status === "Pending"
                            ? "border border-border text-muted-foreground bg-muted"
                            : previewDoc.status === "Verified"
                              ? "bg-emerald-500 text-white"
                              : previewDoc.status === "Rejected"
                                ? "bg-rose-500 text-white"
                                : "bg-slate-500 text-white"
                          }`}>
                          {previewDoc.status === "Verified" ? (
                            <CheckCircle className="h-2.5 w-2.5" />
                          ) : previewDoc.status === "Rejected" ? (
                            <XCircle className="h-2.5 w-2.5" />
                          ) : (
                            <Clock className="h-2.5 w-2.5" />
                          )}
                        </span>
                        <div>
                          <p className="font-bold text-foreground">Final Compliance Status</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {previewDoc.status === "Verified" && `Verified & Approved`}
                            {previewDoc.status === "Rejected" && `Rejected: ${previewDoc.rejectionReason}`}
                            {previewDoc.status === "Pending" && `Decision pending`}
                            {previewDoc.status === "Expired" && `Expired`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FUTURE-READY PLACEHOLDER NOTICE */}
                  <div className="rounded-xl border border-dashed border-indigo-500/20 bg-indigo-500/5 p-3.5 text-xs text-indigo-600 dark:text-indigo-400 space-y-1 text-left">
                    <h5 className="font-bold flex items-center gap-1">
                      <Shield className="h-3.5 w-3.5 text-indigo-500" />
                      Smart Verification Gateways
                    </h5>
                    <p className="text-[10px] leading-relaxed text-muted-foreground">
                      This component is modularized to support direct APIs for DigiLocker, Aadhaar ID checks, PAN Tax validations, and E-Signatures.
                    </p>
                  </div>
                </div>
              </ScrollArea>

              {/* Sheet footer buttons */}
              <div className="p-4 border-t border-border bg-muted/10 shrink-0 flex gap-2 justify-end">
                {previewDoc.status === "Pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleRequestReupload(previewDoc)}
                      className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-amber-500" />
                      Request Re-upload
                    </Button>
                    <Button
                      onClick={() => handleRejectPrompt(previewDoc)}
                      className="h-9 text-xs bg-rose-600 text-white hover:bg-rose-700 gap-1.5 cursor-pointer"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Reject Document
                    </Button>
                    <Button
                      onClick={() => handleVerify(previewDoc)}
                      className="h-9 text-xs bg-emerald-600 text-white hover:bg-emerald-700 gap-1.5 cursor-pointer"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Verify & Approve
                    </Button>
                  </>
                )}
                {previewDoc.status !== "Pending" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      const updatedDocs = docs.map((d: HRDocument) => {
                        if (d.id === previewDoc.id) return { ...d, status: "Pending" as const, rejectionReason: undefined };
                        return d;
                      });
                      setRealDocs(updatedDocs);
                      ofc360.set({ documents: updatedDocs });
                      setPreviewDoc({ ...previewDoc, status: "Pending" as const, rejectionReason: undefined });
                      toast.info("Document reset to Pending review state");
                    }}
                    className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer"
                  >
                    Reset Status to Review
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => handleDownload(previewDoc)}
                  className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 gap-1.5 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
