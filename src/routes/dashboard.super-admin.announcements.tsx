import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { superAdminApi } from "@/api/superAdminApi";
import { Bell, Send, Megaphone, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/super-admin/announcements")({
  head: () => ({ meta: [{ title: "Announcements — Super Admin" }] }),
  component: SuperAdminAnnouncementsPage,
});

function SuperAdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const res = await superAdminApi.getAnnouncements();
      setAnnouncements(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setIsPublishing(true);
    try {
      await superAdminApi.createAnnouncement({ title, content, target_audience: "ALL" });
      setTitle("");
      setContent("");
      await fetchAnnouncements();
      alert("Platform announcement broadcasted to all organizations!");
    } catch (err: any) {
      alert(err.message || "Failed to publish announcement");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-400" />
            Global Platform Broadcasts & Announcements
          </h2>
          <p className="text-xs text-muted-foreground">Broadcast system updates, maintenance windows, and feature releases to tenant admins and users.</p>
        </div>
      </div>

      <Card className="border-border bg-card/40 backdrop-blur-xl p-4">
        <form onSubmit={handlePublish} className="space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Megaphone className="h-4 w-4 text-amber-400" />
            Publish Platform Announcement
          </h3>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Announcement title (e.g., Scheduled Maintenance / Feature Update)"
            className="bg-background/50 h-9 text-xs"
            required
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write announcement body message..."
            className="bg-background/50 text-xs h-24"
            required
          />
          <div className="flex justify-end">
            <Button disabled={isPublishing} type="submit" size="sm" className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5">
              <Send className="h-3.5 w-3.5" />
              {isPublishing ? "Publishing..." : "Broadcast Announcement"}
            </Button>
          </div>
        </form>
      </Card>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground">Recent System Announcements</h3>
        {isLoading ? (
          <div className="text-xs text-muted-foreground animate-pulse">Loading announcements...</div>
        ) : (
          announcements.map((a) => (
            <Card key={a.id} className="border-border bg-card/40 backdrop-blur-xl p-4 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground">{a.title}</h4>
                <Badge variant="outline" className="text-[9px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                  {new Date(a.created_at).toLocaleDateString()}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{a.content}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
