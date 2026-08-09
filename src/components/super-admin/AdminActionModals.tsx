import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { superAdminApi, type OrganizationSummary } from "@/api/superAdminApi";
import { AlertTriangle, CheckCircle, ShieldAlert, Sparkles, Clock, Ban, RefreshCw, Zap } from "lucide-react";

interface ModalBaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  org: OrganizationSummary | null;
  onSuccess?: () => void;
}

// ----------------------------------------------------------------------------
// 1. GRANT COMPLIMENTARY ACCESS MODAL
// ----------------------------------------------------------------------------
export function GrantAccessModal({ open, onOpenChange, org, onSuccess }: ModalBaseProps) {
  const [plan, setPlan] = useState("Enterprise");
  const [accessType, setAccessType] = useState("Complimentary");
  const [duration, setDuration] = useState("30 days");
  const [customExpiryDate, setCustomExpiryDate] = useState("");
  const [reason, setReason] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!org) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Reason is required to grant access.");
      return;
    }
    if (!confirmed) {
      toast.error("Please check the confirmation checkbox.");
      return;
    }

    setIsSubmitting(true);
    try {
      await superAdminApi.grantAccess(org.id, {
        plan,
        access_type: accessType,
        duration,
        custom_expiry_date: customExpiryDate || undefined,
        reason,
        internal_note: internalNote || undefined,
        confirm: true,
      });
      toast.success(`Successfully granted ${accessType} access to ${org.name}!`);
      onOpenChange(false);
      setReason("");
      setInternalNote("");
      setConfirmed(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.message || "Failed to grant access");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-background border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            Grant Organization Access
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Override payment requirements and grant complimentary or promotional access to <strong className="text-foreground">{org.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Organization Summary Box */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">{org.name}</span>
              <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 text-[10px]">
                {org.payment_status}
              </Badge>
            </div>
            <p className="text-muted-foreground text-[11px]">Owner: {org.owner?.email || "—"}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Access Type */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Access Type</Label>
              <Select value={accessType} onValueChange={setAccessType}>
                <SelectTrigger className="h-9 bg-background/50 border-border text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Complimentary">Complimentary</SelectItem>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Trial">Trial</SelectItem>
                  <SelectItem value="Promotional">Promotional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Plan */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Subscription Plan</Label>
              <Select value={plan} onValueChange={setPlan}>
                <SelectTrigger className="h-9 bg-background/50 border-border text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic Plan</SelectItem>
                  <SelectItem value="Professional">Professional Plan</SelectItem>
                  <SelectItem value="Enterprise">Enterprise Plan</SelectItem>
                  <SelectItem value="Custom">Custom Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Duration */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-9 bg-background/50 border-border text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7 days">7 Days</SelectItem>
                  <SelectItem value="14 days">14 Days</SelectItem>
                  <SelectItem value="30 days">30 Days</SelectItem>
                  <SelectItem value="90 days">90 Days</SelectItem>
                  <SelectItem value="6 months">6 Months</SelectItem>
                  <SelectItem value="1 year">1 Year</SelectItem>
                  <SelectItem value="Lifetime">Lifetime (Never Expires)</SelectItem>
                  <SelectItem value="Custom">Custom Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Expiry Date */}
            {duration === "Custom" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Custom Expiry Date</Label>
                <Input
                  type="date"
                  value={customExpiryDate}
                  onChange={(e) => setCustomExpiryDate(e.target.value)}
                  className="h-9 bg-background/50 border-border text-xs"
                />
              </div>
            )}
          </div>

          {/* Reason (Required) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Reason for Granting Access *</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Partner demo, VIP customer trial extension, Investor preview..."
              className="h-9 bg-background/50 border-border text-xs"
              required
            />
          </div>

          {/* Internal Note (Optional) */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Internal Admin Note (Optional)</Label>
            <Textarea
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Private notes visible only to Super Admin team"
              className="min-h-[50px] bg-background/50 border-border text-xs"
            />
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs">
            <input
              type="checkbox"
              id="grant-confirm"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 rounded border-border"
            />
            <label htmlFor="grant-confirm" className="text-muted-foreground leading-relaxed cursor-pointer select-none">
              I understand this organization will receive access without a successful payment.
            </label>
          </div>

          <DialogFooter className="pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 text-xs border-border bg-transparent">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !confirmed || !reason.trim()}
              className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium gap-1.5"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              {isSubmitting ? "Granting..." : "Confirm & Grant Access"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------------
// 2. EXTEND ACCESS DURATION MODAL
// ----------------------------------------------------------------------------
export function ExtendAccessModal({ open, onOpenChange, org, onSuccess }: ModalBaseProps) {
  const [days, setDays] = useState(30);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!org) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Reason is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await superAdminApi.extendAccess(org.id, { days, reason });
      toast.success(`Extended access for ${org.name} by ${days} days!`);
      onOpenChange(false);
      setReason("");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.message || "Failed to extend access");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-base font-bold flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            Extend Organization Access
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Extend access expiration date for <strong className="text-foreground">{org.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Extension Duration</Label>
            <Select value={days.toString()} onValueChange={(v) => setDays(parseInt(v))}>
              <SelectTrigger className="h-9 text-xs bg-background/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">+ 7 Days</SelectItem>
                <SelectItem value="14">+ 14 Days</SelectItem>
                <SelectItem value="30">+ 30 Days (1 Month)</SelectItem>
                <SelectItem value="90">+ 90 Days (3 Months)</SelectItem>
                <SelectItem value="180">+ 180 Days (6 Months)</SelectItem>
                <SelectItem value="365">+ 365 Days (1 Year)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Extension Reason *</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Requested additional testing period..."
              className="h-9 text-xs bg-background/50 border-border"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !reason.trim()} className="h-9 text-xs bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? "Extending..." : "Extend Access"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------------
// 3. SUSPEND ACCESS MODAL
// ----------------------------------------------------------------------------
export function SuspendAccessModal({ open, onOpenChange, org, onSuccess }: ModalBaseProps) {
  const [reason, setReason] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!org) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Suspension reason is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await superAdminApi.suspendAccess(org.id, { reason, internal_note: internalNote });
      toast.warning(`Suspended access for ${org.name}`);
      onOpenChange(false);
      setReason("");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.message || "Failed to suspend access");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-base font-bold text-rose-500 flex items-center gap-2">
            <Ban className="h-5 w-5" />
            Suspend Organization Access
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Temporarily block all users of <strong className="text-foreground">{org.name}</strong> from accessing protected application features. All organization data will be preserved intact.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Suspension Reason *</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Non-payment, terms violation, security risk..."
              className="h-9 text-xs bg-background/50 border-border"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Internal Note (Optional)</Label>
            <Textarea
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Internal tracking notes"
              className="min-h-[50px] text-xs bg-background/50 border-border"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !reason.trim()} className="h-9 text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium">
              {isSubmitting ? "Suspending..." : "Suspend Organization"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------------
// 4. CANCEL ACCESS MODAL
// ----------------------------------------------------------------------------
export function CancelAccessModal({ open, onOpenChange, org, onSuccess }: ModalBaseProps) {
  const [cancelType, setCancelType] = useState("immediate");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!org) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Cancellation reason is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await superAdminApi.cancelAccess(org.id, { cancel_type: cancelType, reason });
      toast.error(`Cancelled subscription for ${org.name}`);
      onOpenChange(false);
      setReason("");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.message || "Failed to cancel access");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-base font-bold text-rose-500 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            Cancel Subscription Access
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Cancel subscription for <strong className="text-foreground">{org.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Cancellation Type</Label>
            <Select value={cancelType} onValueChange={setCancelType}>
              <SelectTrigger className="h-9 text-xs bg-background/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Cancel Immediately</SelectItem>
                <SelectItem value="at_expiry">Cancel at End of Billing Period</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Cancellation Reason *</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Customer churn request, non-renewal..."
              className="h-9 text-xs bg-background/50 border-border"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !reason.trim()} className="h-9 text-xs bg-rose-600 hover:bg-rose-700 text-white">
              {isSubmitting ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------------
// 5. REACTIVATE ACCESS MODAL
// ----------------------------------------------------------------------------
export function ReactivateAccessModal({ open, onOpenChange, org, onSuccess }: ModalBaseProps) {
  const [plan, setPlan] = useState("Professional");
  const [accessType, setAccessType] = useState("Complimentary");
  const [duration, setDuration] = useState("30 days");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!org) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Reactivation reason is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await superAdminApi.reactivateAccess(org.id, { plan, access_type: accessType, duration, reason });
      toast.success(`Reactivated access for ${org.name}!`);
      onOpenChange(false);
      setReason("");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.message || "Failed to reactivate");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-base font-bold text-emerald-500 flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Reactivate Organization Access
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Restore application access for <strong className="text-foreground">{org.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Access Type</Label>
              <Select value={accessType} onValueChange={setAccessType}>
                <SelectTrigger className="h-9 text-xs bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Complimentary">Complimentary</SelectItem>
                  <SelectItem value="Paid">Paid Subscription</SelectItem>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Trial">Trial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Plan</Label>
              <Select value={plan} onValueChange={setPlan}>
                <SelectTrigger className="h-9 text-xs bg-background/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic Plan</SelectItem>
                  <SelectItem value="Professional">Professional Plan</SelectItem>
                  <SelectItem value="Enterprise">Enterprise Plan</SelectItem>
                  <SelectItem value="Custom">Custom Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Reactivation Reason *</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Payment resolved, complimentary extension approved..."
              className="h-9 text-xs bg-background/50 border-border"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !reason.trim()} className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
              {isSubmitting ? "Reactivating..." : "Reactivate Access"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------------
// 6. CHANGE PLAN MODAL
// ----------------------------------------------------------------------------
export function ChangePlanModal({ open, onOpenChange, org, onSuccess }: ModalBaseProps) {
  const [newPlan, setNewPlan] = useState("Enterprise");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!org) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Reason for plan change is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await superAdminApi.changePlan(org.id, { new_plan: newPlan, reason });
      toast.success(`Updated ${org.name} plan to ${newPlan}`);
      onOpenChange(false);
      setReason("");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || err.message || "Failed to change plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-base font-bold flex items-center gap-2">
            <Zap className="h-5 w-5 text-indigo-500" />
            Change Subscription Plan
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Override plan entitlements for <strong className="text-foreground">{org.name}</strong>. Current: <Badge variant="outline">{org.plan}</Badge>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Select New Plan</Label>
            <Select value={newPlan} onValueChange={setNewPlan}>
              <SelectTrigger className="h-9 text-xs bg-background/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Basic">Basic Plan</SelectItem>
                <SelectItem value="Professional">Professional Plan</SelectItem>
                <SelectItem value="Enterprise">Enterprise Plan</SelectItem>
                <SelectItem value="Custom">Custom Enterprise Plan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Reason for Plan Change *</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Upgrade request, custom SLA tier approved..."
              className="h-9 text-xs bg-background/50 border-border"
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 text-xs">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !reason.trim()} className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
              {isSubmitting ? "Updating..." : "Update Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
