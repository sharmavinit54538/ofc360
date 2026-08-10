import { useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  fallbackUrl?: string;
  className?: string;
  showText?: boolean;
}

export function BackButton({ fallbackUrl = "/dashboard", className = "", showText = true }: BackButtonProps) {
  const router = useRouter();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Exclude authentication pages
  const isAuthPage =
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  if (isAuthPage) return null;

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      try {
        router.history.back();
      } catch {
        navigate({ to: fallbackUrl as any });
      }
    } else {
      navigate({ to: fallbackUrl as any });
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`group inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground hover:border-border/80 active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shadow-xs ${className}`}
      aria-label="Go back to previous page"
      title="Go back"
    >
      <ArrowLeft className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-x-0.5" />
      {showText && <span>Back</span>}
    </button>
  );
}
