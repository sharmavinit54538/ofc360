import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
} from "lucide-react";
import { PageHeader } from "@/components/ofc360/DashboardShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/api";
import {
  useGetHistoryQuery,
  useSendChatMessageMutation,
  useClearHistoryMutation,
  type CopilotMessage,
} from "@/services/payrollCopilotApi";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/payroll/copilot")({
  head: () => ({ meta: [{ title: "AI Payroll Copilot — OFC360" }] }),
  component: PayrollCopilotPage,
});

const SUGGESTIONS = [
  "Show me this month's payroll summary and cost breakdown",
  "Calculate net salary from gross 80,000 with standard deductions",
  "Explain TDS tax slabs for FY 2025-26 under the new tax regime",
  "Draft a payslip breakdown email for an employee",
  "What is the total OT and bonus payout this cycle?",
];

function PayrollCopilotPage() {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<CopilotMessage[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSendingLocal, setIsSendingLocal] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 1. RTK Query History
  const { data: historyMessages = [], isLoading: isHistoryLoading } = useGetHistoryQuery();

  // 2. RTK Query Mutations
  const [sendChatMessage, { isLoading: isSendingRtk }] = useSendChatMessageMutation();
  const [clearHistoryMutation, { isLoading: isClearing }] = useClearHistoryMutation();

  const isSending = isSendingRtk || isSendingLocal;

  // Keep local message state in sync with RTK Query history
  useEffect(() => {
    if (historyMessages.length > 0) {
      setLocalMessages(historyMessages);
    }
  }, [historyMessages]);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [localMessages, isSending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function submit(text?: string) {
    const prompt = (text ?? input).trim();
    if (!prompt || isSending) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setLocalMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSendingLocal(true);

    try {
      // 1. Try RTK Query Mutation connected directly to FastAPI backend
      const res = await sendChatMessage({ prompt }).unwrap();

      if (res && res.content) {
        setLocalMessages((prev) => [...prev, res]);
        return;
      }

      // 2. Direct API client call fallback
      const directRes = await api.post<any>("payroll/copilot/chat", { prompt });
      if (directRes.success && directRes.data) {
        setLocalMessages((prev) => [...prev, directRes.data]);
        return;
      }
    } catch (err: any) {
      console.error("Payroll Copilot RTK Query Error, trying direct API:", err);
      try {
        const directRes = await api.post<any>("payroll/copilot/chat", { prompt });
        if (directRes.success && directRes.data) {
          setLocalMessages((prev) => [...prev, directRes.data]);
          return;
        }
      } catch (innerErr) {
        console.error("Direct API Fallback Error:", innerErr);
        toast.error("Failed to connect to backend AI model.");
      }
    } finally {
      setIsSendingLocal(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  async function handleClearHistory() {
    try {
      await clearHistoryMutation().unwrap();
      setLocalMessages([]);
      toast.success("Copilot conversation memory cleared.");
    } catch (err) {
      try {
        await api.post("payroll/copilot/clear");
        setLocalMessages([]);
        toast.success("Conversation cleared.");
      } catch {
        setLocalMessages([]);
      }
    }
  }

  function handleCopy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleFeedback(id: string, type: "like" | "dislike") {
    setLocalMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: m.feedback === type ? undefined : type } : m))
    );
    toast.success(type === "like" ? "Response marked as helpful" : "Feedback recorded");
  }

  function handleRegenerate() {
    const lastUserMsg = [...localMessages].reverse().find((m) => m.role === "user");
    if (lastUserMsg) {
      submit(lastUserMsg.content);
    } else {
      toast.info("No previous user message to regenerate.");
    }
  }

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="AI Payroll Copilot"
        description="Enterprise AI assistant for salary calculations, tax compliance, and payroll intelligence."
        actions={
          localMessages.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearHistory}
              disabled={isClearing}
              className="text-xs h-9 border-border text-muted-foreground hover:text-destructive cursor-pointer gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </Button>
          ) : undefined
        }
      />

      {/* Main Full-Width Chat Box */}
      <div className="flex h-[calc(100vh-220px)] w-full flex-col overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {localMessages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-6">
              <div
                className="mb-4 grid h-14 w-14 place-items-center rounded-2xl text-brand-foreground shadow-glow animate-pulse"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Sparkles className="h-7 w-7" />
              </div>
              <h2 className="font-display text-xl font-bold tracking-tight text-foreground">
                How can I assist with your payroll today?
              </h2>
              <p className="mt-1.5 max-w-md text-sm text-muted-foreground leading-relaxed">
                Ask me to compute net pay, evaluate tax slabs, review overtime, or draft payslips.
              </p>

              <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-2 text-left">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="group flex items-start gap-2.5 rounded-xl border border-border bg-background/50 p-3 text-xs text-muted-foreground transition-all hover:border-indigo-500/40 hover:bg-accent/40 hover:text-foreground cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="leading-snug">{s}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            localMessages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
                  <div
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold ${isUser
                        ? "bg-foreground text-background"
                        : "text-brand-foreground shadow-sm"
                      }`}
                    style={isUser ? undefined : { background: "var(--gradient-brand)" }}
                  >
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>

                  <div
                    className={`relative group max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser
                        ? "bg-foreground text-background"
                        : "bg-accent/70 border border-border/60 text-foreground"
                      }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>

                    {m.metadata?.tableData && (
                      <div className="mt-3 overflow-x-auto rounded-xl border border-border/60 bg-background/50 p-2">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-border/40 text-muted-foreground font-semibold">
                              {m.metadata.tableData.headers.map((h: string, idx: number) => (
                                <th key={idx} className="pb-2 pt-1 px-2.5">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/20">
                            {m.metadata.tableData.rows.map((row: string[], rIdx: number) => (
                              <tr key={rIdx} className="hover:bg-accent/30">
                                {row.map((cell: string, cIdx: number) => (
                                  <td key={cIdx} className="py-2 px-2.5 font-mono text-[11px]">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <div className="mt-2.5 flex items-center justify-between gap-4 border-t border-border/40 pt-2 text-[10px] text-muted-foreground">
                      <span>{m.timestamp || "Just now"}</span>
                      {!isUser && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleFeedback(m.id, "like")}
                            className={`p-1 rounded hover:text-foreground cursor-pointer transition-colors ${m.feedback === "like" ? "text-emerald-500" : ""
                              }`}
                            title="Helpful"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>

                          <button
                            onClick={() => handleFeedback(m.id, "dislike")}
                            className={`p-1 rounded hover:text-foreground cursor-pointer transition-colors ${m.feedback === "dislike" ? "text-rose-500" : ""
                              }`}
                            title="Not helpful"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>

                          <button
                            onClick={() => handleCopy(m.id, m.content)}
                            className="inline-flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors pl-1"
                          >
                            {copiedId === m.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-500" />
                                <span className="text-emerald-500 font-medium">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {isSending && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground animate-pulse pl-2">
              <div
                className="grid h-7 w-7 place-items-center rounded-full text-brand-foreground"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Bot className="h-4 w-4" />
              </div>
              <span>Generating AI response...</span>
            </div>
          )}
        </div>

        {/* Form & Controls */}
        <div className="border-t border-border bg-background/40 p-3.5 backdrop-blur-xl space-y-2">
          {localMessages.length > 0 && (
            <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground">
              <button
                onClick={handleRegenerate}
                disabled={isSending}
                className="flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors"
              >
                <RotateCcw className="h-3 w-3" /> Regenerate Response
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex items-end gap-3"
          >
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Ask the AI Payroll Copilot anything..."
              rows={1}
              className="min-h-[44px] max-h-36 flex-1 resize-none rounded-xl border-border bg-card/60 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-indigo-500"
            />
            <Button
              type="submit"
              disabled={isSending || !input.trim()}
              className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md cursor-pointer gap-1.5 shrink-0"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
