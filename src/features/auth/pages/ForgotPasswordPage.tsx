import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Loader2, CheckCircle2, ArrowLeft, Mail } from "lucide-react";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/api";
import { toast } from "sonner";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const r = z.string().email().safeParse(email);
    if (!r.success) return setError("Enter a valid email address");
    setError(null);
    setLoading(true);

    try {
      const res = await api.post<{ success?: boolean; message?: string }>("auth/forgot-password", { email });
      if (res?.success !== false) {
        setSubmitted(true);
        toast.success(res?.message || "Password reset email sent.");
      } else {
        toast.error(res?.message || "Failed to process password reset.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send reset email. Check server connection.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="We've sent a password reset link to your inbox."
        footer={
          <Link to="/login" className="inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        }
      >
        <div className="space-y-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-left">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Reset Link Delivered</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                If an account exists for <span className="font-semibold text-foreground">{email}</span>, a password reset link has been sent. Please check your inbox and spam folder.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 text-center text-xs text-muted-foreground">
          Didn't receive the email?{" "}
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="font-medium text-primary hover:underline"
          >
            Try another email address
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email tied to your workspace and we'll send a password reset link."
      footer={
        <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-2 text-left">
          <Label htmlFor="forgot-email">Work email</Label>
          <Input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            aria-invalid={!!error}
            disabled={loading}
          />
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
        <Button type="submit" className="w-full" disabled={loading || !email.trim()}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Send Reset Link
        </Button>
      </form>
    </AuthShell>
  );
}
