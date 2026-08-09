import { useState } from "react";
import {
  Gauge,
  Target,
  Trophy,
  Award,
  CheckCircle2,
  Clock,
  TrendingUp,
  MessageSquare,
  Sparkles,
  Plus,
  GraduationCap,
  Star,
  PenLine,
  Check,
} from "lucide-react";
import { PageHeader } from "@/components/ofc360/DashboardShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useofc360 } from "@/lib/ofc360-store";

interface EmployeeGoal {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  progress: number;
  status: "in_progress" | "completed" | "pending";
}

const INITIAL_GOALS: EmployeeGoal[] = [
  {
    id: "g1",
    title: "Complete Frontend Role Separation & Onboarding Enhancements",
    category: "Technical Project",
    dueDate: "Jun 30, 2026",
    progress: 100,
    status: "completed",
  },
  {
    id: "g2",
    title: "Optimize API Performance & Query Response Times < 100ms",
    category: "Performance",
    dueDate: "Jul 15, 2026",
    progress: 85,
    status: "in_progress",
  },
  {
    id: "g3",
    title: "Achieve 95%+ Unit & Integration Test Coverage",
    category: "Quality Assurance",
    dueDate: "Aug 01, 2026",
    progress: 60,
    status: "in_progress",
  },
  {
    id: "g4",
    title: "Complete Advanced AI Assistant Agent Certification",
    category: "Skill Development",
    dueDate: "Aug 31, 2026",
    progress: 40,
    status: "in_progress",
  },
];

export function EmployeePerformancePage() {
  const ws = useofc360();
  const [goals, setGoals] = useState<EmployeeGoal[]>(INITIAL_GOALS);
  const [newGoalOpen, setNewGoalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [goalCategory, setGoalCategory] = useState("Technical");
  const [goalDueDate, setGoalDueDate] = useState("31 Jul 2026");

  const [selfReviewOpen, setSelfReviewOpen] = useState(false);
  const [selfReviewText, setSelfReviewText] = useState("");
  const [isSelfReviewSubmitted, setIsSelfReviewSubmitted] = useState(false);

  const employeeName = ws.user?.fullName || "Employee";

  const handleAddGoal = () => {
    if (!goalTitle.trim()) {
      toast.error("Please enter a goal title.");
      return;
    }
    const newG: EmployeeGoal = {
      id: `g_${Date.now()}`,
      title: goalTitle,
      category: goalCategory,
      dueDate: goalDueDate,
      progress: 10,
      status: "in_progress",
    };
    setGoals((prev) => [newG, ...prev]);
    setGoalTitle("");
    setNewGoalOpen(false);
    toast.success("New goal added successfully!");
  };

  const handleToggleComplete = (id: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              progress: g.status === "completed" ? 50 : 100,
              status: g.status === "completed" ? "in_progress" : "completed",
            }
          : g
      )
    );
    toast.success("Goal status updated!");
  };

  const handleSubmitSelfReview = () => {
    if (!selfReviewText.trim()) {
      toast.error("Please write your self-assessment review.");
      return;
    }
    setIsSelfReviewSubmitted(true);
    setSelfReviewOpen(false);
    toast.success("Self-review submitted for Q2 review cycle!");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Performance & Goals"
        description="Track your performance score, quarter OKRs, manager feedback, and skill development."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent p-5 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-indigo-400 font-bold uppercase tracking-wider">
            <span>Overall Rating</span>
            <Gauge className="h-4 w-4" />
          </div>
          <div className="text-3xl font-black text-foreground">4.8 / 5.0</div>
          <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> Exceeds Expectations (+0.3 pts)
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-5 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
            <span>Goal Progress</span>
            <Target className="h-4 w-4" />
          </div>
          <div className="text-3xl font-black text-foreground">
            {goals.filter((g) => g.status === "completed").length} / {goals.length}
          </div>
          <Progress
            value={(goals.filter((g) => g.status === "completed").length / goals.length) * 100}
            className="h-1.5"
          />
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-5 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
            <span>Q2 Self Review</span>
            <PenLine className="h-4 w-4" />
          </div>
          <div className="text-lg font-bold text-foreground">
            {isSelfReviewSubmitted ? (
              <span className="text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="h-5 w-5" /> Submitted
              </span>
            ) : (
              <span className="text-amber-400">Pending Review</span>
            )}
          </div>
          <Button
            onClick={() => setSelfReviewOpen(true)}
            variant="outline"
            size="sm"
            className="w-full text-xs h-7 mt-1 border-amber-500/30"
          >
            {isSelfReviewSubmitted ? "Edit Self Review" : "Complete Self Review"}
          </Button>
        </div>

        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent p-5 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-400 font-bold uppercase tracking-wider">
            <span>Skill Badges</span>
            <Trophy className="h-4 w-4" />
          </div>
          <div className="text-3xl font-black text-foreground">6 Badges</div>
          <p className="text-xs text-muted-foreground">Top Performer • Clean Code Champion</p>
        </div>
      </div>

      {/* Main Section: Goals & OKRs */}
      <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-xl backdrop-blur-2xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-400" /> My Quarterly Goals & OKRs
            </h2>
            <p className="text-xs text-muted-foreground">Track key result milestones and manage your active personal objectives.</p>
          </div>

          <Button
            onClick={() => setNewGoalOpen(true)}
            size="sm"
            className="h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
          >
            <Plus className="h-4 w-4" /> Add Personal Goal
          </Button>
        </div>

        {/* Goals List */}
        <div className="space-y-3">
          {goals.map((g) => (
            <div
              key={g.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/70 bg-background/50 p-4 transition-all hover:border-indigo-500/40"
            >
              <div className="min-w-[240px] flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm">{g.title}</span>
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {g.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-indigo-400" /> Target Date: {g.dueDate}
                  </span>
                  <span className="font-mono font-semibold text-foreground">{g.progress}% Complete</span>
                </div>
                <Progress value={g.progress} className="h-1.5" />
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => handleToggleComplete(g.id)}
                  variant={g.status === "completed" ? "default" : "outline"}
                  size="sm"
                  className={`h-8 gap-1.5 text-xs font-semibold ${
                    g.status === "completed"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "border-border hover:border-emerald-500"
                  }`}
                >
                  {g.status === "completed" ? (
                    <>
                      <Check className="h-3.5 w-3.5" /> Completed
                    </>
                  ) : (
                    "Mark Done"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manager Feedback & Recognitions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Manager Feedback */}
        <div className="rounded-3xl border border-border bg-card/80 p-6 space-y-4 backdrop-blur-2xl">
          <h3 className="font-bold text-foreground text-sm flex items-center gap-2 border-b border-border/80 pb-3">
            <MessageSquare className="h-4 w-4 text-indigo-400" /> Latest Manager Feedback
          </h3>
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-foreground">Q1 2026 Performance Review</span>
              <span className="text-muted-foreground">Reviewed by Engineering Manager</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              "{employeeName} has demonstrated exceptional code ownership, clean architecture practices, and rapid execution. Great initiative in role-based UI separation and system reliability."
            </p>
            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 pt-1">
              <Star className="h-3.5 w-3.5 fill-indigo-400 text-indigo-400" /> Rating: 4.8 / 5.0 — Exceeds Expectations
            </div>
          </div>
        </div>

        {/* Skill Development & Courses */}
        <div className="rounded-3xl border border-border bg-card/80 p-6 space-y-4 backdrop-blur-2xl">
          <h3 className="font-bold text-foreground text-sm flex items-center gap-2 border-b border-border/80 pb-3">
            <GraduationCap className="h-4 w-4 text-purple-400" /> Skill Development & Courses
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3">
              <div>
                <span className="font-bold text-foreground block">Advanced React Query & State Patterns</span>
                <span className="text-muted-foreground text-[11px]">Enrolled Course • 80% Complete</span>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">In Progress</Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3">
              <div>
                <span className="font-bold text-foreground block">Python FastAPI Enterprise Microservices</span>
                <span className="text-muted-foreground text-[11px]">Completed • Certified</span>
              </div>
              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Completed</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-400" /> Add New Personal Goal
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Goal Title *</Label>
              <Input
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g. Complete Docker Deployment Architecture"
                className="mt-1 h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Category</Label>
                <Input
                  value={goalCategory}
                  onChange={(e) => setGoalCategory(e.target.value)}
                  placeholder="Technical / Quality"
                  className="mt-1 h-9"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-muted-foreground">Target Date</Label>
                <Input
                  value={goalDueDate}
                  onChange={(e) => setGoalDueDate(e.target.value)}
                  placeholder="31 Jul 2026"
                  className="mt-1 h-9"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setNewGoalOpen(false)} className="h-9 text-xs">
              Cancel
            </Button>
            <Button onClick={handleAddGoal} size="sm" className="h-9 px-4 bg-indigo-600 text-white font-bold text-xs">
              Add Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Self Review Dialog */}
      <Dialog open={selfReviewOpen} onOpenChange={setSelfReviewOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <PenLine className="h-4 w-4 text-amber-400" /> Complete Q2 Self Review
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <Label className="text-xs font-semibold text-muted-foreground">
              Describe your key achievements, challenges solved, and focus areas for Q2 *
            </Label>
            <textarea
              value={selfReviewText}
              onChange={(e) => setSelfReviewText(e.target.value)}
              rows={5}
              placeholder="In Q2, I successfully led the employee onboarding refactoring, separated admin and employee routes, and improved system reliability..."
              className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelfReviewOpen(false)} className="h-9 text-xs">
              Cancel
            </Button>
            <Button onClick={handleSubmitSelfReview} size="sm" className="h-9 px-4 bg-indigo-600 text-white font-bold text-xs">
              Submit Self Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
