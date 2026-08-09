import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CreditCard, Check, Sparkles, ShieldCheck, Zap, ArrowRight, Receipt, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/ofc360/DashboardShell";
import { processRazorpayCheckout } from "@/services/razorpayService";
import { ofc360, useofc360 } from "@/lib/ofc360-store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/billing")({
  head: () => ({ meta: [{ title: "Billing & Subscriptions — OFC360" }] }),
  component: BillingPage,
});

interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number; // in INR
  yearlyPrice: number; // in INR per month
  popular?: boolean;
  features: string[];
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter Plan",
    tagline: "Ideal for small teams & growing startups.",
    monthlyPrice: 499,
    yearlyPrice: 399,
    features: [
      "Core HR & Employee Database",
      "Up to 25 Active Employees",
      "Attendance & Leave Management",
      "Basic Payroll Processing",
      "Employee Self-Service Portal",
      "Email Support",
    ],
  },
  {
    id: "growth",
    name: "Growth Plan",
    tagline: "Full HR automation & AI recruitment tools.",
    monthlyPrice: 1499,
    yearlyPrice: 1199,
    popular: true,
    features: [
      "Everything in Starter",
      "Up to 100 Active Employees",
      "AI Candidate Screening & ATS",
      "Advanced Attendance & Rosters",
      "Performance Coaching & Reviews",
      "Priority 24/7 Support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    tagline: "Unlimited AI Agents, custom SLAs & dedicated manager.",
    monthlyPrice: 4999,
    yearlyPrice: 3999,
    features: [
      "Everything in Growth",
      "Unlimited Active Employees",
      "Full ofc360 AI Suite (70+ Agents)",
      "Custom Workflows & Integrations",
      "Dedicated Account Manager",
      "99.9% Uptime SLA",
    ],
  },
];

function BillingPage() {
  const ws = useofc360();
  const user = ws.user;
  const company = ws.company;
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    orderId: string;
    paymentId: string;
    planName: string;
    amountPaid: number;
    date: string;
  } | null>(null);

  const handleSubscribe = async (plan: Plan) => {
    const price = billingCycle === "yearly" ? plan.yearlyPrice * 12 : plan.monthlyPrice;
    setLoadingPlan(plan.id);

    try {
      await processRazorpayCheckout({
        amountInRupees: price,
        description: `${plan.name} (${billingCycle.toUpperCase()}) - OFC360 HRMS`,
        planName: plan.name,
        prefill: {
          name: user?.fullName || company?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        onSuccess: (result) => {
          setLoadingPlan(null);
          setPaymentSuccessData({
            orderId: result.orderId,
            paymentId: result.paymentId,
            planName: plan.name,
            amountPaid: price,
            date: new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          });
        },
        onError: (err) => {
          setLoadingPlan(null);
        },
        onDismiss: () => {
          setLoadingPlan(null);
        },
      });
    } catch (e) {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Billing & Subscription"
        description="Manage your subscription plan, payment methods, and invoice receipts."
      />

      {/* Payment Success Alert */}
      {paymentSuccessData && (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-foreground space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-semibold text-lg">
            <CheckCircle2 className="h-6 w-6" />
            <span>Subscription Payment Verified & Active!</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Thank you! Your payment for <strong>{paymentSuccessData.planName}</strong> was processed and verified successfully via Razorpay.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-2 font-mono bg-background/50 p-3 rounded-xl border border-border">
            <div>
              <span className="text-muted-foreground block">Order ID:</span>
              <span className="font-semibold text-foreground">{paymentSuccessData.orderId}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Payment ID:</span>
              <span className="font-semibold text-foreground">{paymentSuccessData.paymentId}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Amount Paid:</span>
              <span className="font-semibold text-foreground">₹{paymentSuccessData.amountPaid.toLocaleString("en-IN")}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Date:</span>
              <span className="font-semibold text-foreground">{paymentSuccessData.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* Current Active Plan summary card */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
              Active Subscription
            </span>
            <span className="text-xs text-muted-foreground">Company ID: {company?.id ? String(company.id).substring(0, 8) : "demo-corp"}</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {paymentSuccessData ? paymentSuccessData.planName : "Starter Plan (Free Trial)"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {paymentSuccessData
              ? "Your paid subscription is verified and active."
              : "You are currently on a 14-day free trial. Upgrade to unlock full features & AI modules."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-muted-foreground">Razorpay Integration</div>
            <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Standard Checkout Ready
            </div>
          </div>
        </div>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex flex-col items-center justify-center space-y-3 pt-4">
        <div className="inline-flex items-center p-1.5 rounded-full bg-muted border border-border text-sm">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2 rounded-full font-medium transition-all ${billingCycle === "monthly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-5 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${billingCycle === "yearly"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <span>Annual Billing</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
        {plans.map((plan) => {
          const displayPrice = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
          const totalPrice = billingCycle === "yearly" ? plan.yearlyPrice * 12 : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 border flex flex-col justify-between transition-all duration-200 ${plan.popular
                  ? "bg-card border-primary ring-2 ring-primary/20 shadow-xl scale-[1.02]"
                  : "bg-card/60 border-border hover:border-border/80 shadow-sm"
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-md flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-foreground">{plan.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{plan.tagline}</p>
                </div>

                <div className="py-2 border-y border-border/60">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-foreground">₹{displayPrice}</span>
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </div>
                  {billingCycle === "yearly" && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                      Billed annually (₹{totalPrice.toLocaleString("en-IN")}/yr)
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 text-xs text-muted-foreground pt-2">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  disabled={loadingPlan === plan.id}
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingPlan === plan.id ? (
                    <span>Opening Razorpay...</span>
                  ) : (
                    <>
                      <span>Pay ₹{totalPrice.toLocaleString("en-IN")} via Razorpay</span>
                      <CreditCard className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Razorpay Trust & Security Note */}
      <div className="p-6 rounded-2xl bg-muted/40 border border-border text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Secured by Razorpay Standard Checkout
        </div>
        <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
          All major Credit & Debit cards, UPI (GPay, PhonePe, Paytm), Net Banking, and Wallets supported. Transactions are 256-bit SSL encrypted.
        </p>
      </div>
    </div>
  );
}
