import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Brain, Users, Briefcase, Clock, FileText, Gauge, Banknote, Target,
  HeartPulse, BookOpen, FilePlus2, Video, ShieldCheck, MessageSquare,
  LineChart as LineChartIcon, Sparkles, ArrowRight, Star, Play,
  Search, ShieldAlert, Award, FileSignature, Zap, RefreshCw,
  Info, Calendar, ListTodo, CheckCircle2, AlertTriangle, RotateCcw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { apiInstance } from "@/api";

// ----------------------------------------------------
// ROUTE DEFINITION
// ----------------------------------------------------
export const Route = createFileRoute("/ai/")({
  head: () => ({
    meta: [
      { title: "AI Tools Workspace — OFC360" },
      { name: "description", content: "Access all 71 enterprise AI models for human resource workflows, recruitment, compliance, payroll, and analytics." },
    ],
  }),
  component: AIHubDashboard,
});

// ----------------------------------------------------
// TYPES & DATA STRUCTURES
// ----------------------------------------------------
interface AITool {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: any;
  defaultPrompt?: string;
  simulatePlaceholder?: string;
}

// ----------------------------------------------------
// AI DOMAIN CATEGORIES (10 CATEGORIES)
// ----------------------------------------------------
const AI_CATEGORIES = [
  { id: "recruitment", label: "Recruitment AI", icon: Briefcase },
  { id: "employee", label: "Employee AI", icon: Users },
  { id: "workforce", label: "Workforce AI", icon: Target },
  { id: "performance", label: "Performance AI", icon: Gauge },
  { id: "payroll", label: "Payroll AI", icon: Banknote },
  { id: "compliance", label: "Compliance AI", icon: ShieldCheck },
  { id: "document", label: "Document AI", icon: FilePlus2 },
  { id: "meeting", label: "Meeting Intelligence", icon: Video },
  { id: "analytics", label: "Analytics AI", icon: LineChartIcon },
  { id: "knowledge", label: "Knowledge AI (RAG)", icon: BookOpen },
];

// ----------------------------------------------------
// EXACT 71 AI MODELS CATALOG
// ----------------------------------------------------
const AI_TOOLS: AITool[] = [
  // 1. Recruitment AI (10 Models)
  { id: "rec-screen", category: "recruitment", name: "AI Resume Screening", description: "Automated batch ranking of candidate profiles.", icon: Briefcase, defaultPrompt: "Assess compliance scoring of 5 senior engineer resumes.", simulatePlaceholder: "Paste resume markdown..." },
  { id: "rec-rank", category: "recruitment", name: "AI Candidate Ranking", description: "Skill gap matching analytics.", icon: Award },
  { id: "rec-parser", category: "recruitment", name: "AI Resume Parser", description: "Converts PDF resumes into JSON profiles.", icon: FileText },
  { id: "rec-jd", category: "recruitment", name: "AI Job Description Generator", description: "Creates inclusive, brand-aligned job descriptions.", icon: FileEdit, defaultPrompt: "Write a Job Description for Senior React Developer in Bengaluru.", simulatePlaceholder: "Job title and requirements..." },
  { id: "rec-questions", category: "recruitment", name: "AI Interview Question Generator", description: "Custom behavioral & technical interview questions.", icon: MessageSquare },
  { id: "rec-copilot", category: "recruitment", name: "AI Interview Copilot", description: "Live question prompts and answers logger.", icon: Brain },
  { id: "rec-match", category: "recruitment", name: "AI Candidate Match Score", description: "Calculates match percentage against dynamic JDs.", icon: Target },
  { id: "rec-offer", category: "recruitment", name: "AI Offer Letter Generator", description: "Creates custom tailored salary and perk offers.", icon: FilePlus2 },
  { id: "rec-summary", category: "recruitment", name: "AI Candidate Summary", description: "Outputs highlights and areas of concern.", icon: Info },
  { id: "rec-skill", category: "recruitment", name: "AI Skill Gap Analysis", description: "Analyzes skills tests against requirements.", icon: Target },

  // 2. Employee AI (8 Models)
  { id: "emp-hr-chat", category: "employee", name: "AI HR Chat Assistant", description: "Answers employees' HR policy queries in real-time.", icon: MessageSquare, defaultPrompt: "What is the maternity leave policy for India branches?", simulatePlaceholder: "Ask policy question..." },
  { id: "emp-assistant", category: "employee", name: "AI Employee Assistant", description: "Productivity bot for task tracking and calendar scheduling.", icon: Users },
  { id: "emp-career", category: "employee", name: "AI Career Advisor", description: "Career growth pathing matching capabilities.", icon: Award },
  { id: "emp-learning", category: "employee", name: "AI Learning Recommendations", description: "Suggests courses from Udemy/Coursera.", icon: BookOpen },
  { id: "emp-promotion", category: "employee", name: "AI Promotion Suggestions", description: "Identifies employees ready for grade increases.", icon: Zap },
  { id: "emp-sentiment", category: "employee", name: "AI Employee Sentiment Analysis", description: "Processes Slack logs/feedback for sentiment scores.", icon: HeartPulse },
  { id: "emp-summary", category: "employee", name: "AI Employee Summary", description: "Generates performance & history brief dashboards.", icon: Info },
  { id: "emp-profile", category: "employee", name: "AI Employee Profile Generator", description: "Autofills profile files from resumes.", icon: Users },

  // 3. Workforce AI (8 Models)
  { id: "wf-planning", category: "workforce", name: "Workforce Planning", description: "Identifies staffing models & team allocations.", icon: Target },
  { id: "wf-headcount", category: "workforce", name: "Headcount Forecast", description: "Predictive headcount targets by department.", icon: LineChartIcon },
  { id: "wf-shift", category: "workforce", name: "Shift Optimization", description: "Schedules shifts based on load forecasts.", icon: Clock },
  { id: "wf-anomaly", category: "workforce", name: "Attendance Anomaly Detection", description: "Flags unusual clock-in and absence streaks.", icon: ShieldAlert },
  { id: "wf-leave", category: "workforce", name: "Leave Pattern Analysis", description: "Predicts leave requests using historical trends.", icon: Calendar },
  { id: "wf-overtime", category: "workforce", name: "Overtime Analysis", description: "Tracks burnout risks from overtime tracking.", icon: Clock },
  { id: "wf-productivity", category: "workforce", name: "Productivity Insights", description: "Compares engineering sprint releases to HR files.", icon: Zap },
  { id: "wf-cost", category: "workforce", name: "Workforce Cost Prediction", description: "Forecasts budget costs.", icon: Banknote },

  // 4. Performance AI (7 Models)
  { id: "perf-coach", category: "performance", name: "AI Performance Coach", description: "Provides personalized advice for managers.", icon: Gauge },
  { id: "perf-kpi", category: "performance", name: "AI KPI Generator", description: "Creates SMART metrics based on designations.", icon: Target },
  { id: "perf-okr", category: "performance", name: "AI OKR Generator", description: "Drafts alignment plans for engineering targets.", icon: Target },
  { id: "perf-review", category: "performance", name: "AI Review Writer", description: "Helps structure annual appraisal feedback drafts.", icon: FileEdit },
  { id: "perf-360", category: "performance", name: "AI 360 Feedback Analyzer", description: "Extracts key insights from peer review logs.", icon: Brain },
  { id: "perf-high", category: "performance", name: "AI High Performer Detection", description: "Flags top 5% talent based on OKR rates.", icon: Award },
  { id: "perf-promo-rec", category: "performance", name: "AI Promotion Recommendation", description: "Evaluates candidates against senior criteria.", icon: Zap },

  // 5. Payroll AI (5 Models)
  { id: "pay-insights", category: "payroll", name: "Payroll Insights", description: "Flags payment variations month over month.", icon: Banknote },
  { id: "pay-bench", category: "payroll", name: "Salary Benchmarking", description: "Matches payroll values to local market rates.", icon: LineChartIcon },
  { id: "pay-error", category: "payroll", name: "Payroll Error Detection", description: "Pre-audit verification scanner for taxes & deductions.", icon: ShieldAlert },
  { id: "pay-forecast", category: "payroll", name: "Payroll Forecast", description: "Predicts salary totals for upcoming quarters.", icon: Banknote },
  { id: "pay-comp", category: "payroll", name: "Compensation Recommendation", description: "Suggests pay raise brackets to retain talent.", icon: Zap },

  // 6. Compliance AI (6 Models)
  { id: "comp-monitor", category: "compliance", name: "Compliance Monitor", description: "Scans statutory declarations and audit gaps.", icon: ShieldCheck },
  { id: "comp-policy", category: "compliance", name: "HR Policy Assistant", description: "Audits contract drafts against current handbooks.", icon: BookOpen },
  { id: "comp-law", category: "compliance", name: "Labour Law Assistant", description: "Checks regulations across 5 states of operations.", icon: ShieldCheck },
  { id: "comp-doc", category: "compliance", name: "Document Compliance Checker", description: "Checks for valid BGV and passport signatures.", icon: FileText },
  { id: "comp-audit", category: "compliance", name: "Audit Assistant", description: "Logs compliance scores for internal SOC-2 checkups.", icon: ShieldCheck },
  { id: "comp-risk", category: "compliance", name: "Risk Detection", description: "Identifies compliance violation patterns.", icon: ShieldAlert },

  // 7. Document AI (10 Models)
  { id: "doc-gen", category: "document", name: "Document Generator", description: "Custom letter wizard with smart placeholders.", icon: FilePlus2 },
  { id: "doc-offer", category: "document", name: "Offer Letter Generator", description: "Drafts official job offers.", icon: FileSignature },
  { id: "doc-appointment", category: "document", name: "Appointment Letter Generator", description: "Drafts joining contracts.", icon: FileSignature },
  { id: "doc-exp", category: "document", name: "Experience Letter Generator", description: "Drafts experience certifications.", icon: FileText },
  { id: "doc-relieving", category: "document", name: "Relieving Letter Generator", description: "Drafts offboarding approvals.", icon: FileText },
  { id: "doc-warning", category: "document", name: "Warning Letter Generator", description: "Drafts disciplinary warnings.", icon: ShieldAlert },
  { id: "doc-promo", category: "document", name: "Promotion Letter Generator", description: "Drafts title promotion updates.", icon: Zap },
  { id: "doc-policy-gen", category: "document", name: "HR Policy Generator", description: "Drafts handbook templates.", icon: BookOpen },
  { id: "doc-nda", category: "document", name: "NDA Generator", description: "Creates custom non-disclosure agreements.", icon: ShieldCheck },
  { id: "doc-contract", category: "document", name: "Contract Generator", description: "Drafts commercial terms.", icon: FileSignature },

  // 8. Meeting Intelligence (5 Models)
  { id: "meet-summary", category: "meeting", name: "Meeting Summary", description: "Extracts bulleted meeting summaries from video calls.", icon: Video },
  { id: "meet-actions", category: "meeting", name: "Action Items", description: "Auto-assigns checklist steps to team members.", icon: ListTodo },
  { id: "meet-decisions", category: "meeting", name: "Decision Extraction", description: "Saves design decisions to the team knowledge base.", icon: Target },
  { id: "meet-transcript", category: "meeting", name: "Transcript Analyzer", description: "Sentiment analysis on live discussion transcripts.", icon: Brain },
  { id: "meet-followup", category: "meeting", name: "Meeting Follow-up Generator", description: "Emails summaries directly to participants.", icon: FileText },

  // 9. Analytics AI (7 Models)
  { id: "an-exec", category: "analytics", name: "Executive Dashboard", description: "Provides summaries for board reviews.", icon: LineChartIcon },
  { id: "an-attrition", category: "analytics", name: "Attrition Prediction", description: "Highlights employees with high departure risk indices.", icon: LineChartIcon },
  { id: "an-div", category: "analytics", name: "Diversity Analytics", description: "Monitors diversity metrics.", icon: Users },
  { id: "an-hiring", category: "analytics", name: "Hiring Analytics", description: "Visualizes hiring pipeline funnels.", icon: Briefcase },
  { id: "an-lifecycle", category: "analytics", name: "Employee Lifecycle Analytics", description: "Tracks lifecycle progression stats.", icon: Target },
  { id: "an-health", category: "analytics", name: "Organization Health Score", description: "Aggregates performance, turnover, and engagement metrics.", icon: HeartPulse },
  { id: "an-insights", category: "analytics", name: "AI Insights Center", description: "Generates custom data summaries.", icon: Brain },

  // 10. Knowledge AI (5 Models)
  { id: "rag-kb", category: "knowledge", name: "AI Knowledge Base (RAG)", description: "Semantic search across shared drive files.", icon: BookOpen },
  { id: "rag-policy", category: "knowledge", name: "Company Policy Q&A", description: "Finds answers from the compliance handbook.", icon: BookOpen },
  { id: "rag-handbook", category: "knowledge", name: "Employee Handbook Assistant", description: "Resolves employee questions.", icon: MessageSquare },
  { id: "rag-sop", category: "knowledge", name: "HR SOP Assistant", description: "Guides operations step by step.", icon: FileText },
  { id: "rag-search", category: "knowledge", name: "Smart Enterprise Search", description: "Google-like query answers from internal files.", icon: Search },
];

// Helper icon fallback
function FileEdit(props: any) {
  return <FileText {...props} />;
}

// ----------------------------------------------------
// MAIN WORKSPACE COMPONENT
// ----------------------------------------------------
function AIHubDashboard() {
  const [favorites, setFavorites] = useState<string[]>(["rec-screen", "emp-hr-chat", "rag-policy"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Dynamic Workspace Simulation Dialog
  const [activeTool, setActiveTool] = useState<AITool | null>(null);
  const [simInput, setSimInput] = useState("");
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<{
    success: boolean;
    answer?: string;
    latencyMs?: number;
    statusCode?: number | string;
    errorCode?: string;
    errorMessage?: string;
  } | null>(null);

  // Toggle favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(x => x !== id));
      toast.info("Removed from favorites");
    } else {
      setFavorites([...favorites, id]);
      toast.success("Added to favorites");
    }
  };

  // Run Real AI Inference from Backend
  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simInput.trim()) {
      toast.error("Please enter prompt context for inference.");
      return;
    }
    setSimLoading(true);
    setSimResult(null);
    const startTime = performance.now();

    try {
      // Send valid JSON request payload to FastAPI backend (/api/v1/ai/chat)
      const response = await apiInstance.post("/ai/chat", {
        query: simInput.trim(),
        role: "admin",
      });

      const elapsedMs = Math.round(performance.now() - startTime);
      const resData = response.data;

      if (resData?.success && resData?.data) {
        const data = resData.data;
        const answerText = typeof data === "string" ? data : (data.answer || data.message || JSON.stringify(data, null, 2));

        setSimResult({
          success: true,
          answer: answerText,
          latencyMs: elapsedMs,
          statusCode: 200,
        });
        toast.success(`AI inference complete (${elapsedMs}ms)`);
      } else {
        throw new Error(resData?.message || "Invalid response format from AI service");
      }
    } catch (err: any) {
      const elapsedMs = Math.round(performance.now() - startTime);
      console.error("Backend AI Inference call failed:", err);

      const status = err?.response?.status || 500;
      const errorData = err?.response?.data?.detail || err?.response?.data?.error || {};
      
      let errCode = `HTTP_${status}`;
      let errMessage = err?.message || "AI Inference request failed";

      if (typeof errorData === "object" && errorData !== null) {
        errCode = errorData.code || errCode;
        errMessage = errorData.message || errMessage;
      } else if (typeof errorData === "string") {
        errMessage = errorData;
      }

      setSimResult({
        success: false,
        statusCode: status,
        errorCode: errCode,
        errorMessage: errMessage,
        latencyMs: elapsedMs,
      });

      toast.error(`AI Inference Failed (${errCode})`);
    } finally {
      setSimLoading(false);
    }
  };

  // Filter AI Tools
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return AI_TOOLS;
    const query = searchQuery.toLowerCase();
    return AI_TOOLS.filter(tool =>
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-8 text-left pb-12">
      {/* HEADER SECTION */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-glow">
            <Brain className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              AI Tools Workspace
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Access and run specialized enterprise AI models across recruitment, compliance, payroll, documents, and workforce intelligence.
            </p>
          </div>
        </div>
      </div>



      {/* SEARCH BAR & TOOL GRID */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 71 AI models by name, category, or workflow (e.g. resume screening, payroll, OKR)..."
              className="pl-10 h-11 border-border bg-card/60 rounded-xl text-xs sm:text-sm"
            />
          </div>
          <div className="text-xs text-muted-foreground shrink-0 font-medium">
            Showing <span className="font-bold text-foreground">{filteredTools.length}</span> of {AI_TOOLS.length} AI Models
          </div>
        </div>

        {/* AI TOOL CARDS GRID */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => {
            const Icon = tool.icon || Sparkles;
            const isFav = favorites.includes(tool.id);
            const catLabel = AI_CATEGORIES.find(c => c.id === tool.category)?.label || tool.category;
            return (
              <Card
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool);
                  setSimInput(tool.defaultPrompt || "");
                  setSimResult(null);
                }}
                className="group relative border-border bg-card/40 hover:bg-accent/20 hover:border-indigo-500/40 cursor-pointer transition-all flex flex-col justify-between text-left overflow-hidden rounded-2xl"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex justify-between items-start">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:scale-105 transition-transform">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px] font-medium border-border/60 bg-muted/20">
                        {catLabel}
                      </Badge>
                      <button
                        onClick={(e) => toggleFavorite(tool.id, e)}
                        className="text-muted-foreground hover:text-amber-500 cursor-pointer p-1"
                      >
                        <Star className={`h-4 w-4 ${isFav ? "text-amber-500 fill-amber-500" : ""}`} />
                      </button>
                    </div>
                  </div>
                  <CardTitle className="text-base font-bold mt-4 leading-snug group-hover:text-primary transition-colors">
                    {tool.name}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1.5 leading-relaxed line-clamp-2">
                    {tool.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="p-4 pt-3 border-t border-border/40 bg-muted/10">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full text-xs justify-between group-hover:bg-gradient-brand group-hover:text-brand-foreground cursor-pointer rounded-xl font-medium"
                  >
                    <span>Open Model Sandbox</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------
          INTERACTIVE AI WORKSPACE DIALOG (Simulation Sandbox)
         ---------------------------------------------------- */}
      <Dialog open={!!activeTool} onOpenChange={open => !open && setActiveTool(null)}>
        <DialogContent className="sm:max-w-lg bg-background border-border shadow-2xl">
          <DialogHeader className="text-left">
            <DialogTitle className="font-display font-bold text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500 fill-indigo-500/10" />
              {activeTool?.name} Sandbox
            </DialogTitle>
            <DialogDescription className="text-xs">
              {activeTool?.description}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRunSimulation} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <Label className="text-xs font-semibold text-muted-foreground">AI Input Prompt Context</Label>
              <Textarea
                value={simInput}
                onChange={e => setSimInput(e.target.value)}
                placeholder={activeTool?.simulatePlaceholder || "Enter your prompt context or operational input..."}
                className="min-h-[100px] bg-background/50 border-border text-xs"
              />
            </div>

            {/* Inference Status Bar */}
            <div className="flex justify-between items-center text-[10px] text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border">
              <span>Status: <strong className={simResult ? (simResult.success ? "text-emerald-400 font-semibold" : "text-destructive font-semibold") : "text-emerald-400 font-semibold"}>
                {simResult ? (simResult.success ? "200 OK" : `Error ${simResult.statusCode}`) : "Ready"}
              </strong></span>
              <span>Model Gate: <strong>OFC360 Enterprise AI</strong></span>
            </div>

            {/* Loading view */}
            {simLoading && (
              <div className="space-y-2.5 p-4 rounded-xl border border-border/80 bg-muted/20 animate-pulse">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Executing LLM Inference...</span>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                </div>
                <div className="h-3 bg-muted rounded-full w-full" />
                <div className="h-3 bg-muted rounded-full w-5/6" />
              </div>
            )}

            {/* Success Output view */}
            {simResult && simResult.success && (
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Real LLM Output
                  </Label>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Latency: {simResult.latencyMs}ms
                  </span>
                </div>
                <div className="bg-black/35 rounded-xl border border-emerald-500/20 p-4 text-slate-100 dark:text-slate-100 font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-text max-h-[220px] overflow-y-auto">
                  {simResult.answer}
                </div>
              </div>
            )}

            {/* Error Output view */}
            {simResult && !simResult.success && (
              <div className="p-4 rounded-xl border border-destructive/40 bg-destructive/10 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-destructive font-semibold text-xs">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>AI Inference Failed</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {simResult.latencyMs}ms
                  </span>
                </div>
                <div className="text-[11px] text-destructive/90 font-mono leading-relaxed">
                  <div><strong>Reason:</strong> <code className="bg-destructive/20 px-1 py-0.5 rounded text-[10px]">{simResult.errorCode}</code></div>
                  <div className="mt-1"><strong>Message:</strong> {simResult.errorMessage}</div>
                </div>
              </div>
            )}

            <DialogFooter className="pt-2 border-t border-border/40 flex items-center justify-between">
              <Button type="button" variant="outline" onClick={() => setActiveTool(null)} className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer">
                Close Sandbox
              </Button>
              <div className="flex items-center gap-2">
                {simResult && !simResult.success && (
                  <Button type="submit" disabled={simLoading} variant="secondary" className="h-9 cursor-pointer gap-1.5 text-xs">
                    <RotateCcw className="h-3.5 w-3.5" /> Retry
                  </Button>
                )}
                <Button type="submit" disabled={simLoading} className="h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer gap-1.5">
                  {simLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  Run Model Inference
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
