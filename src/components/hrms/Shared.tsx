import { useEffect, useRef, useState, type ReactNode } from "react";
import QRCode from "qrcode";
import { Search, Download, Printer, AlertTriangle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function StatCard({
  label, value, hint, icon: Icon, accent = "brand",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: any;
  accent?: "brand" | "success" | "warning" | "danger" | "muted";
}) {
  const accentClass = {
    brand: "from-violet-500/15 via-indigo-500/10 to-transparent text-foreground",
    success: "from-emerald-500/15 via-teal-500/10 to-transparent text-foreground",
    warning: "from-amber-500/15 via-orange-500/10 to-transparent text-foreground",
    danger: "from-rose-500/15 via-red-500/10 to-transparent text-foreground",
    muted: "from-muted via-muted/50 to-transparent text-foreground",
  }[accent];

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${accentClass} bg-card/80 p-5 backdrop-blur-xl shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">{label}</div>
          <div className="mt-2 font-display text-2xl font-bold tracking-tight text-foreground">{value}</div>
          {hint ? <div className="mt-1.5 text-xs text-muted-foreground">{hint}</div> : null}
        </div>
        {Icon ? (
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-background/80 text-foreground/80 shadow-xs border border-border/50">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function StatusBadge({ status, tone }: { status: string; tone?: "success" | "warning" | "danger" | "info" | "muted" }) {
  const t = tone ?? "muted";
  const cls = {
    success: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20 border border-emerald-500/20",
    warning: "bg-amber-500/15 text-amber-800 dark:text-amber-300 ring-amber-500/20 border border-amber-500/20",
    danger: "bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-rose-500/20 border border-rose-500/20",
    info: "bg-sky-500/15 text-sky-700 dark:text-sky-300 ring-sky-500/20 border border-sky-500/20",
    muted: "bg-muted/80 text-muted-foreground ring-border border border-border/50",
  }[t];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {status.replace(/-/g, " ")}
    </span>
  );
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative w-full sm:w-72">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder ?? "Search…"} className="h-9.5 pl-9 text-sm" />
    </div>
  );
}

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-xl shadow-xs ${className}`}>{children}</div>;
}

export function EmptyState({ title, description, icon: Icon, action }: { title: string; description?: string; icon?: any; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-card/40 p-8 sm:p-12 text-center">
      {Icon ? (
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
          <Icon className="h-6 w-6" />
        </div>
      ) : null}
      <h3 className="font-display text-base font-semibold tracking-tight text-foreground">{title}</h3>
      {description ? <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground leading-relaxed">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ title = "Unable to load data", description = "Please check your connection or try again later.", onRetry }: { title?: string; description?: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
      <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-rose-500/10 text-rose-500">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-xs sm:text-sm text-muted-foreground">{description}</p>
      {onRetry ? (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" size="sm" onClick={onRetry} className="gap-2 border-rose-500/30 text-rose-600 hover:bg-rose-500/10">
            <RefreshCw className="h-3.5 w-3.5" /> Try Again
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function PrintButton({ label = "Export PDF" }: { label?: string }) {
  return (
    <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
      <Printer className="h-4 w-4" /> {label}
    </Button>
  );
}

export function CsvButton<T extends Record<string, any>>({ rows, filename, label = "Export CSV" }: { rows: T[]; filename: string; label?: string }) {
  function onClick() {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <Button variant="outline" size="sm" onClick={onClick} className="gap-2">
      <Download className="h-4 w-4" /> {label}
    </Button>
  );
}

export function QrTile({ value, size = 128, label }: { value: string; size?: number; label?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (ref.current) QRCode.toCanvas(ref.current, value, { width: size, margin: 1 }, () => {});
  }, [value, size]);
  return (
    <div className="inline-flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-3 shadow-xs">
      <canvas ref={ref} />
      <div className="font-mono text-[11px] text-muted-foreground">{label ?? value}</div>
    </div>
  );
}

export function Progress({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: "var(--gradient-brand)" }} />
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted/70 ${className}`} />;
}

export function useDelayedReady(ms = 250) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return ready;
}
