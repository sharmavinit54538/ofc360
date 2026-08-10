import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { Check, Minus, ArrowRight, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, SectionHeader } from "@/components/site/Section";
import { CTA } from "@/components/site/CTA";
import { FAQ } from "@/components/site/FAQ";
import { cn } from "@/lib/utils";
import { buildMeta, buildCanonical } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: buildMeta({
      title: "OFC360 | HRMS Pricing & Plans",
      description:
        "Simple, transparent pricing for OFC360 HRMS. Choose the plan that fits your team. Start with a free trial.",
      url: "/pricing",
    }),
    links: buildCanonical("/pricing"),
  }),
  component: PricingPage,
});

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const ease = [0.25, 0.4, 0.25, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

function AnimateIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={mounted && !inView ? "hidden" : "visible"}
      variants={{ ...fadeUp, visible: { ...fadeUp.visible, transition: { ...fadeUp.visible.transition, delay } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

/**
 * CONFIRM PRICING WITH ME — all dollar amounts, employee limits,
 * and save percentages are placeholders. Do not publish without
 * confirming real numbers.
 */
type Plan = {
  name: string;
  tagline: string;
  monthly: string;
  yearly: string;
  unit: string;
  cta: string;
  ctaLink: string;
  highlight?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Starter",
    tagline: "For small teams getting started with modern HR.",
    monthly: "₹49",
    yearly: "₹39",
    unit: "/employee/month",
    cta: "Start Free Trial",
    ctaLink: "/register",
    features: [
      "Core HR & employee profiles",
      "Up to 25 employees",
      "Basic attendance tracking",
      "Basic payroll processing",
      "Employee self-service portal",
      "Community support",
    ],
  },
  {
    name: "Growth",
    tagline: "For growing teams that need full HR automation.",
    monthly: "₹99",
    yearly: "₹79",
    unit: "/employee/month",
    cta: "Start Free Trial",
    ctaLink: "/register",
    highlight: true,
    features: [
      "Everything in Starter",
      "Unlimited employees",
      "Recruitment module",
      "Performance management",
      "Advanced attendance & shifts",
      "Manager self-service portal",
      "Reports & analytics",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    tagline: "For large organizations with advanced needs.",
    monthly: "Custom",
    yearly: "Custom",
    unit: "",
    cta: "Contact Sales",
    ctaLink: "/contact",
    features: [
      "Everything in Growth",
      "Full AI Hub (70+ agents)",
      "Custom integrations",
      "Dedicated account manager",
      "SLA & uptime guarantees",
      "Custom compliance setup",
      "SSO / SCIM provisioning",
      "24/7 premium support",
    ],
  },
];

/**
 * Feature comparison table — all features map to real ofc360 AI modules.
 * Use ✓ for included, "—" for not included, and descriptive text for partial.
 */
type ComparisonRow = {
  feature: string;
  starter: string;
  growth: string;
  enterprise: string;
};

const comparison: ComparisonRow[] = [
  { feature: "Core HR & Profiles", starter: "✓", growth: "✓", enterprise: "✓" },
  { feature: "Employee Self-Service", starter: "✓", growth: "✓", enterprise: "✓" },
  { feature: "Manager Self-Service", starter: "—", growth: "✓", enterprise: "✓" },
  { feature: "Recruitment Module", starter: "—", growth: "✓", enterprise: "✓" },
  { feature: "Attendance & Shifts", starter: "Basic", growth: "Advanced", enterprise: "Advanced" },
  { feature: "Payroll Processing", starter: "Basic", growth: "Full", enterprise: "Full + Custom" },
  { feature: "Leaves Management", starter: "✓", growth: "✓", enterprise: "✓" },
  { feature: "Performance Management", starter: "—", growth: "✓", enterprise: "✓" },
  { feature: "AI Hub Agents", starter: "—", growth: "—", enterprise: "70+ Agents" },
  { feature: "Documents & Letters", starter: "Basic", growth: "Full", enterprise: "Full + Custom" },
  { feature: "Reports & Analytics", starter: "Basic", growth: "Advanced", enterprise: "Executive" },
  { feature: "Onboarding / Offboarding", starter: "✓", growth: "✓", enterprise: "✓" },
  { feature: "Asset Management", starter: "—", growth: "✓", enterprise: "✓" },
  { feature: "Travel & Expenses", starter: "—", growth: "✓", enterprise: "✓" },
  { feature: "SSO / SCIM", starter: "—", growth: "—", enterprise: "✓" },
  { feature: "Audit Logs", starter: "—", growth: "✓", enterprise: "✓" },
  { feature: "Support", starter: "Community", growth: "Priority", enterprise: "24/7 Premium" },
];

/**
 * DRAFT — review these FAQ questions and answers before publishing.
 * Adjust wording, add specifics, or remove as needed.
 */
const pricingFaqs = [
  {
    q: "What's included in each plan?",
    a: "Each plan builds on the previous one. Starter includes core HR, basic attendance, and basic payroll. Growth adds recruitment, performance management, advanced reporting, and manager self-service. Enterprise unlocks the full AI Hub with 70+ agents, custom integrations, SSO/SCIM, and dedicated support. [DRAFT — adjust details after confirming final feature sets]",
  },
  {
    q: "Can I switch plans mid-contract?",
    a: "Yes — you can upgrade or downgrade at any time. Changes are pro-rated automatically, so you only pay for what you use. [DRAFT — confirm pro-rating policy]",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. All paid plans come with a free trial period so you can evaluate the full feature set before committing. No credit card required to start. [DRAFT — confirm trial length]",
  },
  {
    q: "How does per-employee pricing work?",
    a: "You're billed based on the number of active employees in your organization. Inactive or offboarded employees are not counted toward your billing. [DRAFT — confirm billing model details]",
  },
  {
    q: "Do you offer discounts for NGOs or educational institutions?",
    a: "Yes — we offer special pricing for verified nonprofits, NGOs, and educational institutions. Contact our sales team to learn more. [DRAFT — confirm discount policy and percentage]",
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */
function PricingPage() {
  const [yearly, setYearly] = useState(true);

  return (
    <SiteLayout>
      {/* ===================== HEADER ===================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <Section className="relative">
          <AnimateIn>
            <SectionHeader
              eyebrow="Pricing"
              title="Simple pricing that grows with your team"
              subtitle="Start with a free trial. Upgrade when you're ready. No surprises."
            />
          </AnimateIn>

          {/* Billing toggle */}
          <AnimateIn delay={0.1}>
            <div className="mt-10 flex justify-center">
              <div className="glass rounded-full p-1 inline-flex text-sm">
                <button
                  onClick={() => setYearly(false)}
                  className={cn(
                    "px-5 py-2 rounded-full transition-colors",
                    !yearly && "bg-foreground text-background"
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setYearly(true)}
                  className={cn(
                    "px-5 py-2 rounded-full transition-colors inline-flex items-center gap-2",
                    yearly && "bg-foreground text-background"
                  )}
                >
                  Yearly{" "}
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-brand text-brand-foreground">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </AnimateIn>

          {/* ===================== TIER CARDS ===================== */}
          <div className="mt-12 grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {plans.map((p, i) => {
              const price = yearly ? p.yearly : p.monthly;
              return (
                <AnimateIn key={p.name} delay={i * 0.1}>
                  <div
                    className={cn(
                      "relative rounded-3xl p-7 flex flex-col h-full",
                      p.highlight
                        ? "bg-gradient-brand text-brand-foreground shadow-glow"
                        : "glass"
                    )}
                  >
                    {p.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background text-foreground text-xs font-medium border border-border">
                        Most popular
                      </div>
                    )}

                    <h3 className="font-display text-xl font-bold">{p.name}</h3>
                    <p className={cn("text-sm mt-1", p.highlight ? "opacity-80" : "text-muted-foreground")}>
                      {p.tagline}
                    </p>

                    <div className="mt-6 mb-2">
                      {price === "Custom" ? (
                        <div className="font-display text-4xl font-bold">Custom</div>
                      ) : (
                        <>
                          <span className="font-display text-5xl font-bold">{price}</span>
                          <span className={cn("ml-1 text-sm", p.highlight ? "opacity-80" : "text-muted-foreground")}>
                            {p.unit}
                          </span>
                        </>
                      )}
                    </div>

                    <Link
                      to={p.ctaLink}
                      className={cn(
                        "mt-4 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-opacity text-sm",
                        p.highlight
                          ? "bg-background text-foreground hover:opacity-90"
                          : "bg-foreground text-background hover:opacity-90"
                      )}
                    >
                      {p.cta}
                      {p.name === "Enterprise" && <ArrowRight className="h-3.5 w-3.5" />}
                    </Link>

                    <ul className="mt-7 space-y-3 text-sm flex-1">
                      {p.features.map((f) => (
                        <li key={f} className="flex gap-2.5">
                          <Check className={cn("h-4 w-4 mt-0.5 shrink-0", p.highlight ? "" : "text-brand")} />
                          <span className={p.highlight ? "" : "text-muted-foreground"}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </Section>
      </section>

      {/* ===================== COMPARISON TABLE ===================== */}
      <Section>
        <AnimateIn>
          <SectionHeader eyebrow="Compare" title="Feature comparison across plans" />
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <div className="mt-12 glass rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-5 font-medium w-[40%]">Feature</th>
                    <th className="text-left p-5 font-medium">Starter</th>
                    <th className="text-left p-5 font-medium">
                      <span className="inline-flex items-center gap-1.5">
                        Growth
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gradient-brand text-brand-foreground">
                          Popular
                        </span>
                      </span>
                    </th>
                    <th className="text-left p-5 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr key={row.feature} className={i % 2 ? "bg-secondary/30" : ""}>
                      <td className="p-5 font-medium">{row.feature}</td>
                      <td className="p-5">
                        <CellValue value={row.starter} />
                      </td>
                      <td className="p-5">
                        <CellValue value={row.growth} />
                      </td>
                      <td className="p-5">
                        <CellValue value={row.enterprise} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AnimateIn>
      </Section>

      {/* ===================== ENTERPRISE CTA ===================== */}
      <Section>
        <AnimateIn>
          <div className="relative overflow-hidden rounded-3xl glass p-8 sm:p-12 text-center">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-[400px] bg-gradient-brand blur-3xl opacity-20" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-4">
                <Sparkles className="h-3 w-3" /> Enterprise
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Need a custom solution for your organization?
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Get custom pricing, dedicated onboarding, SLA guarantees, and access to the full AI Hub with 70+ agents. Let's build something tailored for your team.
              </p>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-brand text-brand-foreground font-medium shadow-glow hover:opacity-90 transition-opacity text-sm"
              >
                Contact Sales <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </AnimateIn>
      </Section>

      {/* ===================== FAQ ===================== */}
      {/* DRAFT — review these questions and answers before publishing */}
      <FAQ
        items={pricingFaqs}
        title="Pricing questions"
        subtitle="Common questions about our plans and billing."
        eyebrow="FAQ"
      />

      {/* ===================== FINAL CTA ===================== */}
      <CTA
        title="Ready to modernize your HR?"
        subtitle="Start your free trial today and see how OFC360 can transform your team's operations."
      />
    </SiteLayout>
  );
}

/* ------------------------------------------------------------------ */
/*  Helper: Comparison table cell                                      */
/* ------------------------------------------------------------------ */
function CellValue({ value }: { value: string }) {
  if (value === "✓") {
    return <Check className="h-4 w-4 text-brand" />;
  }
  if (value === "—") {
    return <Minus className="h-4 w-4 text-muted-foreground/40" />;
  }
  return <span className="text-muted-foreground">{value}</span>;
}
