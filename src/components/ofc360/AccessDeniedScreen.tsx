import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Ban, Clock, Mail, Lock } from "lucide-react";

interface AccessDeniedScreenProps {
  accessStatus?: "EXPIRED" | "SUSPENDED" | "CANCELLED" | "PAYMENT_REQUIRED" | string;
  expiryDate?: string | null;
  companyName?: string;
  onContactAdmin?: () => void;
}

export function AccessDeniedScreen({
  accessStatus = "EXPIRED",
  expiryDate,
  companyName = "Your Organization",
  onContactAdmin,
}: AccessDeniedScreenProps) {
  const isSuspended = accessStatus === "SUSPENDED";
  const isCancelled = accessStatus === "CANCELLED";

  const title = isSuspended
    ? "Your organization's access is currently suspended."
    : isCancelled
    ? "Your organization's subscription has been cancelled."
    : "Your organization's access has expired.";

  const description = isSuspended
    ? "An administrator has suspended application access for your organization. All company records and employee data remain safely preserved."
    : "Your trial or complimentary subscription period has concluded. To continue using OFC HR, please contact your account administrator or platform owner.";

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-rose-500/20 bg-card/80 backdrop-blur-2xl shadow-2xl text-center">
        <CardHeader className="pt-8 pb-4">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
            {isSuspended ? (
              <Ban className="h-7 w-7 text-rose-500" />
            ) : (
              <Lock className="h-7 w-7 text-rose-500" />
            )}
          </div>
          <CardTitle className="font-display text-lg font-bold text-foreground leading-snug">
            {title}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-2 leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pb-8">
          <div className="rounded-xl border border-border bg-muted/20 p-3 text-xs space-y-1.5 text-left">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Organization:</span>
              <span className="font-semibold text-foreground">{companyName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Access Status:</span>
              <span className="font-bold text-rose-400 uppercase">{accessStatus}</span>
            </div>
            {expiryDate && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Expiry Date:</span>
                <span className="font-mono text-foreground">{expiryDate}</span>
              </div>
            )}
          </div>

          <Button
            onClick={onContactAdmin || (() => window.location.href = "mailto:support@ofc360.com")}
            className="w-full h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-2 cursor-pointer"
          >
            <Mail className="h-4 w-4" />
            Contact Administrator
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
