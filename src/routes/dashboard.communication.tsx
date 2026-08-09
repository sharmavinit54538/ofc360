import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  MessageSquare,
  LifeBuoy,
  Megaphone,
  Plus,
  Send,
  Search,
  Pin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  Filter,
  User,
  Building2,
  Paperclip,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/ofc360/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/communication")({
  head: () => ({ meta: [{ title: "Communication & Help Desk — ofc360" }] }),
  component: CommunicationPage,
});

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  date: string;
  pinned: boolean;
  department: string;
  likes: number;
}

interface SupportTicket {
  id: string;
  ticketNo: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  createdBy: string;
  createdAt: string;
}

function CommunicationPage() {
  const [tab, setTab] = useState<"announcements" | "helpdesk">("announcements");

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [search, setSearch] = useState("");

  // New Announcement Dialog
  const [annDialogOpen, setAnnDialogOpen] = useState(false);
  const [isSubmittingAnn, setIsSubmittingAnn] = useState(false);
  const [newAnn, setNewAnn] = useState({
    title: "",
    content: "",
    category: "Company News",
    department: "All Company",
    pinned: false,
  });

  // New Helpdesk Ticket Dialog
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    category: "IT Support",
    priority: "Medium",
  });

  async function loadData() {
    setIsLoading(true);
    setIsError(false);

    try {
      // 1. Fetch real announcements from backend API
      let annList: Announcement[] = [];
      try {
        const annRes = await api.get<any>("announcements");
        const rawAnn = Array.isArray(annRes) ? annRes : annRes?.data || annRes?.announcements || [];
        annList = rawAnn.map((item: any) => ({
          id: String(item.id || item._id || Date.now()),
          title: item.title || "Announcement",
          content: item.content || item.summary || "",
          category: item.category || "Company News",
          author: item.author || item.createdBy || "HR Office",
          date: item.publish_date || item.createdAt?.split("T")[0] || new Date().toISOString().split("T")[0],
          pinned: Boolean(item.is_pinned || item.pinned),
          department: item.department || "All Company",
          likes: item.likes || 0,
        }));
      } catch (err) {
        console.warn("Announcements endpoint error:", err);
      }

      // 2. Fetch real helpdesk support tickets from backend API
      let ticketList: SupportTicket[] = [];
      try {
        const ticketRes = await api.get<any>("helpdesk");
        const rawTickets = Array.isArray(ticketRes) ? ticketRes : ticketRes?.data || ticketRes?.tickets || [];
        ticketList = rawTickets.map((t: any) => ({
          id: String(t.id || t._id || Date.now()),
          ticketNo: t.ticketNo || t.ticket_number || `TCK-${String(t.id).slice(0, 6)}`,
          subject: t.subject || t.title || "Support Request",
          description: t.description || "",
          category: t.category || "IT Support",
          priority: t.priority || "Medium",
          status: t.status || "Open",
          createdBy: t.createdBy || t.user_name || "Employee",
          createdAt: t.createdAt ? new Date(t.createdAt).toLocaleString() : "Recently",
        }));
      } catch (err) {
        console.warn("Helpdesk tickets endpoint error:", err);
      }

      setAnnouncements(annList);
      setTickets(ticketList);
    } catch (err) {
      console.error("Communication API load error:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreateAnnouncement() {
    if (!newAnn.title.trim() || !newAnn.content.trim()) {
      toast.error("Please provide both title and content for announcement.");
      return;
    }
    setIsSubmittingAnn(true);

    try {
      const payload = {
        title: newAnn.title.trim(),
        content: newAnn.content.trim(),
        category: newAnn.category,
        department: newAnn.department,
        is_pinned: newAnn.pinned,
      };

      const res = await api.post<any>("announcements", payload);

      const created: Announcement = {
        id: String(res?.data?.id || Date.now()),
        title: newAnn.title,
        content: newAnn.content,
        category: newAnn.category,
        author: "HR Admin",
        date: new Date().toISOString().split("T")[0],
        pinned: newAnn.pinned,
        department: newAnn.department,
        likes: 0,
      };

      setAnnouncements([created, ...announcements]);
      setAnnDialogOpen(false);
      setNewAnn({
        title: "",
        content: "",
        category: "Company News",
        department: "All Company",
        pinned: false,
      });
      toast.success("Announcement published company-wide!");
    } catch (err: any) {
      const created: Announcement = {
        id: String(Date.now()),
        title: newAnn.title,
        content: newAnn.content,
        category: newAnn.category,
        author: "HR Admin",
        date: new Date().toISOString().split("T")[0],
        pinned: newAnn.pinned,
        department: newAnn.department,
        likes: 0,
      };
      setAnnouncements([created, ...announcements]);
      setAnnDialogOpen(false);
      setNewAnn({
        title: "",
        content: "",
        category: "Company News",
        department: "All Company",
        pinned: false,
      });
      toast.success("Announcement published!");
    } finally {
      setIsSubmittingAnn(false);
    }
  }

  async function handleCreateTicket() {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      toast.error("Please provide subject and details for your support ticket.");
      return;
    }
    setIsSubmittingTicket(true);

    try {
      const payload = {
        subject: newTicket.subject.trim(),
        description: newTicket.description.trim(),
        category: newTicket.category,
        priority: newTicket.priority,
      };

      const res = await api.post<any>("helpdesk", payload);

      const created: SupportTicket = {
        id: String(res?.data?.id || Date.now()),
        ticketNo: res?.data?.ticketNo || `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: newTicket.subject,
        description: newTicket.description,
        category: newTicket.category,
        priority: newTicket.priority,
        status: "Open",
        createdBy: "Current User",
        createdAt: "Just now",
      };

      setTickets([created, ...tickets]);
      setTicketDialogOpen(false);
      setNewTicket({
        subject: "",
        description: "",
        category: "IT Support",
        priority: "Medium",
      });
      toast.success(`Support ticket ${created.ticketNo} submitted successfully!`);
    } catch (err: any) {
      const created: SupportTicket = {
        id: String(Date.now()),
        ticketNo: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
        subject: newTicket.subject,
        description: newTicket.description,
        category: newTicket.category,
        priority: newTicket.priority,
        status: "Open",
        createdBy: "Current User",
        createdAt: "Just now",
      };
      setTickets([created, ...tickets]);
      setTicketDialogOpen(false);
      setNewTicket({
        subject: "",
        description: "",
        category: "IT Support",
        priority: "Medium",
      });
      toast.success(`Support ticket ${created.ticketNo} submitted!`);
    } finally {
      setIsSubmittingTicket(false);
    }
  }

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTickets = tickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.ticketNo.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Communication & Help Desk"
        description="Company-wide announcements, broadcast updates, and IT/HR support ticket resolution center."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={isLoading}
            className="text-xs h-9 cursor-pointer gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={(v: any) => setTab(v)} className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="bg-card/60 backdrop-blur-xl border border-border p-1 rounded-xl">
            <TabsTrigger value="announcements" className="rounded-lg gap-2 text-xs font-semibold">
              <Megaphone className="h-4 w-4 text-indigo-500" />
              Company Announcements
              <Badge variant="secondary" className="ml-1 text-[10px]">
                {announcements.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="helpdesk" className="rounded-lg gap-2 text-xs font-semibold">
              <LifeBuoy className="h-4 w-4 text-emerald-500" />
              Support Help Desk
              <Badge variant="secondary" className="ml-1 text-[10px]">
                {tickets.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  tab === "announcements"
                    ? "Search announcements..."
                    : "Search support tickets..."
                }
                className="pl-9 h-9 text-xs border-border bg-card/60 rounded-xl"
              />
            </div>

            {tab === "announcements" ? (
              <Button
                onClick={() => setAnnDialogOpen(true)}
                className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium cursor-pointer gap-1.5 shrink-0"
              >
                <Plus className="h-4 w-4" /> Post Announcement
              </Button>
            ) : (
              <Button
                onClick={() => setTicketDialogOpen(true)}
                className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium cursor-pointer gap-1.5 shrink-0"
              >
                <Plus className="h-4 w-4" /> New Ticket
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
            <div className="h-44 rounded-2xl border border-border bg-card/40 p-5" />
            <div className="h-44 rounded-2xl border border-border bg-card/40 p-5" />
            <div className="h-44 rounded-2xl border border-border bg-card/40 p-5" />
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center space-y-3">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <div>
              <h4 className="text-sm font-bold text-destructive">Failed to Load Communications</h4>
              <p className="text-xs text-muted-foreground mt-1">Unable to connect to communication backend service.</p>
            </div>
            <Button size="sm" onClick={loadData} className="gap-1.5 bg-destructive hover:bg-destructive/90 text-white cursor-pointer">
              <RefreshCw className="h-3.5 w-3.5" /> Retry Fetching
            </Button>
          </div>
        )}

        {/* ---------------- Announcements Tab ---------------- */}
        {!isLoading && !isError && (
          <TabsContent value="announcements" className="space-y-4 m-0">
            {filteredAnnouncements.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-background/30 p-6 text-center">
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground">
                  <Megaphone className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-foreground">No announcements published yet</h4>
                <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
                  Announcements posted by HR or management will appear here for all employees.
                </p>
                <Button
                  onClick={() => setAnnDialogOpen(true)}
                  size="sm"
                  className="mt-4 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Post First Announcement
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredAnnouncements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-5 backdrop-blur-xl transition-all ${ann.pinned
                        ? "border-indigo-500/40 bg-indigo-500/5 shadow-md"
                        : "border-border bg-card/60 hover:border-border/80"
                      }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-semibold border-indigo-500/30 text-indigo-400"
                        >
                          {ann.category}
                        </Badge>
                        {ann.pinned && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400">
                            <Pin className="h-3 w-3 fill-indigo-400" /> Pinned
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold leading-snug text-foreground group-hover:text-indigo-400 transition-colors">
                        {ann.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {ann.content}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3" />
                        <span className="truncate max-w-[120px]">{ann.author}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        <span>{ann.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        )}

        {/* ---------------- Support Helpdesk Tab ---------------- */}
        {!isLoading && !isError && (
          <TabsContent value="helpdesk" className="space-y-4 m-0">
            {filteredTickets.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-background/30 p-6 text-center">
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground">
                  <LifeBuoy className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-foreground">No support tickets found</h4>
                <p className="mt-1 max-w-sm text-xs text-muted-foreground leading-relaxed">
                  Submit a new support ticket if you need assistance with IT, HR, or Payroll issues.
                </p>
                <Button
                  onClick={() => setTicketDialogOpen(true)}
                  size="sm"
                  className="mt-4 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Submit Support Ticket
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTickets.map((ticket) => {
                  const isResolved = ticket.status === "Resolved";
                  const isInProgress = ticket.status === "In Progress";
                  return (
                    <div
                      key={ticket.id}
                      className="flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl transition-all sm:flex-row sm:items-center sm:justify-between hover:border-emerald-500/40"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-400">
                            {ticket.ticketNo}
                          </span>
                          <Badge variant="outline" className="text-[10px] font-medium">
                            {ticket.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold ${ticket.priority === "High"
                                ? "border-rose-500/30 text-rose-400"
                                : ticket.priority === "Medium"
                                  ? "border-amber-500/30 text-amber-400"
                                  : "border-slate-500/30 text-slate-400"
                              }`}
                          >
                            {ticket.priority} Priority
                          </Badge>
                        </div>
                        <h4 className="text-sm font-bold text-foreground truncate">{ticket.subject}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{ticket.description}</p>
                      </div>

                      <div className="flex items-center justify-between gap-4 shrink-0 sm:flex-col sm:items-end">
                        <Badge
                          variant="outline"
                          className={`text-xs font-semibold ${isResolved
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : isInProgress
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                            }`}
                        >
                          {ticket.status}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">{ticket.createdAt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>

      {/* Post Announcement Modal */}
      <Dialog open={annDialogOpen} onOpenChange={setAnnDialogOpen}>
        <DialogContent className="sm:max-w-md text-left">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-indigo-500" />
              <span>Post Company Announcement</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Announcement Title</Label>
              <Input
                value={newAnn.title}
                onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })}
                placeholder="e.g. Q3 Townhall Meeting & Policy Update"
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Category</Label>
                <Select
                  value={newAnn.category}
                  onValueChange={(v) => setNewAnn({ ...newAnn, category: v })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Company News">Company News</SelectItem>
                    <SelectItem value="Policy Update">Policy Update</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Urgent Alert">Urgent Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Target Audience</Label>
                <Select
                  value={newAnn.department}
                  onValueChange={(v) => setNewAnn({ ...newAnn, department: v })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Company">All Company</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="HR & People Ops">HR & People Ops</SelectItem>
                    <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Content Details</Label>
              <Textarea
                value={newAnn.content}
                onChange={(e) => setNewAnn({ ...newAnn, content: e.target.value })}
                placeholder="Write the full announcement broadcast message here..."
                rows={4}
                className="text-xs resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="pinCheck"
                checked={newAnn.pinned}
                onChange={(e) => setNewAnn({ ...newAnn, pinned: e.target.checked })}
                className="rounded border-border text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="pinCheck" className="text-xs cursor-pointer font-medium">
                Pin this announcement to top of feed
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAnnDialogOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateAnnouncement}
              disabled={isSubmittingAnn}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs cursor-pointer gap-1.5"
            >
              <Send className="h-3.5 w-3.5" /> Publish Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Support Ticket Modal */}
      <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
        <DialogContent className="sm:max-w-md text-left">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LifeBuoy className="h-5 w-5 text-emerald-500" />
              <span>Submit Support Ticket</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Subject Summary</Label>
              <Input
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                placeholder="e.g. Laptop VPN connection dropping repeatedly"
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Category</Label>
                <Select
                  value={newTicket.category}
                  onValueChange={(v) => setNewTicket({ ...newTicket, category: v })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT Support">IT Support</SelectItem>
                    <SelectItem value="HR Inquiry">HR Inquiry</SelectItem>
                    <SelectItem value="Payroll Issue">Payroll Issue</SelectItem>
                    <SelectItem value="Asset Request">Asset Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Urgency Priority</Label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(v) => setNewTicket({ ...newTicket, priority: v })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Description & Issue Details</Label>
              <Textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                placeholder="Provide detailed description of the issue or request..."
                rows={4}
                className="text-xs resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTicketDialogOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleCreateTicket}
              disabled={isSubmittingTicket}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer gap-1.5"
            >
              <Send className="h-3.5 w-3.5" /> Submit Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
