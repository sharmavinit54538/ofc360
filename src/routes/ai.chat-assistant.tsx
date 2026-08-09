import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, Send, Sparkles, Users, Banknote, BarChart3, FileText, Loader2, AlertTriangle } from "lucide-react";
import { AIHero } from "@/components/ofc360/AIModule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiInstance } from "@/api";

export const Route = createFileRoute("/ai/chat-assistant")({
  head: () => ({ meta: [{ title: "AI Chat Assistant — ofc360" }] }),
  component: Page,
});

const SUGGESTIONS = [
  { icon: Users, q: "Show employees at risk of leaving." },
  { icon: BarChart3, q: "Who has the highest overtime this month?" },
  { icon: FileText, q: "Generate attendance report." },
  { icon: Banknote, q: "What's the projected payroll for next month?" },
];

type Msg = { role: "user" | "ai"; text: string; loading?: boolean; error?: boolean };

function Page() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi 👋 I'm ofc360 AI. Ask me about employees, payroll, attendance, reports or analytics." },
  ]);
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const ask = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    setInput("");

    // Add user message + loading placeholder
    setMsgs((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      { role: "ai", text: "AI is thinking…", loading: true },
    ]);

    try {
      const response = await apiInstance.post("/ai/chat", {
        query: trimmed,
        ...(conversationId ? { conversation_id: conversationId } : {}),
      });

      const resData = response.data;
      if (resData?.success && resData?.data) {
        const data = resData.data;
        const answerText = typeof data === "string"
          ? data
          : (data.answer || data.message || JSON.stringify(data, null, 2));

        // Save conversation ID for continuity
        const newConvId = data.conversationId || data.conversation_id;
        if (newConvId) setConversationId(newConvId);

        // Replace loading message with real answer
        setMsgs((prev) => [
          ...prev.slice(0, -1),
          { role: "ai", text: answerText },
        ]);
      } else {
        throw new Error(resData?.message || "Invalid response from AI service");
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const errorData = err?.response?.data?.detail || err?.response?.data?.error || {};
      let errMessage = "AI service is temporarily unavailable. Please try again.";

      if (status === 422) {
        errMessage = "Please enter a valid question.";
      } else if (status === 504) {
        errMessage = "The AI model took too long to respond. Please try a shorter question.";
      } else if (status === 503) {
        errMessage = "AI service is temporarily unavailable. Please try again in a moment.";
      } else if (typeof errorData === "object" && errorData?.message) {
        errMessage = errorData.message;
      } else if (typeof errorData === "string") {
        errMessage = errorData;
      }

      // Replace loading message with error
      setMsgs((prev) => [
        ...prev.slice(0, -1),
        { role: "ai", text: `⚠️ ${errMessage}`, error: true },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, conversationId]);

  return (
    <div>
      <AIHero icon={MessageSquare} eyebrow="AI Chat Assistant" title="Ask anything about your workforce" description="ChatGPT-style assistant for HR, payroll, employees, reports and analytics — grounded in your data." lastAnalysis="Live" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-3 flex h-[560px] flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
          <div className="flex-1 space-y-3 overflow-y-auto p-5">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-foreground text-background"
                    : m.error
                      ? "bg-destructive/10 text-destructive border border-destructive/20"
                      : m.loading
                        ? "bg-accent text-muted-foreground animate-pulse"
                        : "bg-accent text-foreground"
                }`}>
                  {m.loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      AI is thinking…
                    </span>
                  ) : (
                    <span className="whitespace-pre-wrap">{m.text}</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex items-center gap-2 border-t border-border p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask ofc360 AI… (e.g. show top performers in Sales)"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              disabled={isSubmitting || !input.trim()}
              className="gap-1.5 bg-gradient-brand text-brand-foreground hover:opacity-90"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Send
            </Button>
          </form>
        </div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Sparkles className="h-4 w-4" /> Suggested</div>
            <div className="space-y-2">
              {SUGGESTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <button key={s.q} onClick={() => ask(s.q)} disabled={isSubmitting} className="flex w-full items-start gap-3 rounded-xl border border-border bg-background/40 p-3 text-left text-xs hover:border-foreground/20 hover:bg-accent/60 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Icon className="mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
                    <span>{s.q}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
