import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  Sparkles, ArrowRight, Users, Clock, Banknote, Target,
  Brain, BarChart3, Briefcase, Shield, Zap, FileText,
  ChevronRight, Building2, UserCheck, CalendarCheck,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, SectionHeader } from "@/components/site/Section";
import { CTA } from "@/components/site/CTA";
import { buildMeta, buildCanonical, SITE_URL, SITE_NAME } from "@/lib/seo";

const homeJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered HRMS for modern teams. Recruitment, attendance, payroll, performance management, and 70+ AI agents — all in one platform.",
  url: SITE_URL,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
    description: "Free plan available",
  },
  publisher: { "@type": "Organization", name: "EquinoxSphere Technologies" },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: buildMeta({
      title: "OFC360 — AI-Powered HRMS Platform",
      description:
        "AI-powered HRMS for modern teams. Recruitment, attendance, payroll, performance management, and 70+ AI agents — all in one platform.",
      url: "/",
    }),
    links: buildCanonical("/"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(homeJsonLd),
      },
    ],
  }),
  component: HomePage,
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
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
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
const modules = [
  {
    icon: Briefcase,
    title: "Recruitment",
    desc: "AI-powered resume screening, candidate ranking, interview copilot, and offer letter generation — end-to-end hiring.",
    to: "/dashboard/recruitment",
  },
  {
    icon: Clock,
    title: "Attendance & Shifts",
    desc: "Geo-fenced check-ins, shift scheduling, roster management, and holiday calendars with anomaly detection.",
    to: "/dashboard/attendance",
  },
  {
    icon: Banknote,
    title: "Payroll Processing",
    desc: "Salary structuring, tax compliance, reimbursements, advances, and AI-driven error detection before every run.",
    to: "/dashboard/payroll",
  },
  {
    icon: Target,
    title: "Performance Management",
    desc: "OKR/KPI generation, 360° feedback, AI performance coaching, and promotion readiness scoring.",
    to: "/dashboard/performance",
  },
  {
    icon: Brain,
    title: "AI Hub — 70+ Agents",
    desc: "Specialized AI agents across recruitment, compliance, payroll, workforce planning, document generation, and more.",
    to: "/ai",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    desc: "Executive dashboards, attrition prediction, diversity analytics, hiring funnels, and organization health scores.",
    to: "/dashboard/reports",
  },
];

const aiCategories = [
  { icon: Briefcase, label: "Recruitment AI", count: "10 agents" },
  { icon: Users, label: "Employee AI", count: "8 agents" },
  { icon: Target, label: "Workforce AI", count: "8 agents" },
  { icon: Shield, label: "Compliance AI", count: "6 agents" },
  { icon: FileText, label: "Document AI", count: "10 agents" },
];

const steps = [
  { num: "01", title: "Set Up Your Organization", desc: "Define your company structure, departments, roles, and policies in minutes." },
  { num: "02", title: "Onboard Your Team", desc: "Digital onboarding checklists, document collection, and automated welcome workflows." },
  { num: "03", title: "Automate with AI", desc: "Let 70+ AI agents handle recruitment screening, payroll validation, compliance checks, and more." },
  { num: "04", title: "Gain Real-Time Insights", desc: "Executive dashboards, attrition prediction, and organization health scores — always up to date." },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */
function HomePage() {
  return (
    <SiteLayout>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        {/* subtle decorative orbs */}
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-brand opacity-[0.07] blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-gradient-brand opacity-[0.05] blur-[100px]" />

        <Section className="relative text-center">
          <AnimateIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-6">
              <Sparkles className="h-3 w-3" /> OFC360 — AI-Powered HRMS
            </div>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.1]">
              The intelligent HRMS that works as hard as{" "}
              <span className="text-gradient">your people</span>.
            </h1>
          </AnimateIn>

          <AnimateIn delay={0.2}>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Recruitment, attendance, payroll, performance, and 70+ specialized AI agents — unified in one platform built for modern HR teams.
            </p>
          </AnimateIn>

          <AnimateIn delay={0.3}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-brand text-brand-foreground font-medium shadow-glow hover:opacity-90 transition-opacity text-sm"
              >
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl glass font-medium hover:bg-secondary transition-colors text-sm"
              >
                Book a Demo
              </Link>
            </div>
          </AnimateIn>

          {/* Product mockup — Interactive CSS-rendered dashboard demo */}
          <AnimateIn delay={0.45}>
            <HeroInteractiveMockup />
          </AnimateIn>
        </Section>
      </section>

      {/* ===================== TRUSTED HR CAPABILITIES ===================== */}
      <Section>
        <AnimateIn>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Built for modern organizations seeking intelligent, end-to-end HR automation
            </p>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-center max-w-3xl mx-auto">
              {[
                "AI Recruitment & Screening",
                "Geo-Fenced Attendance",
                "Compliant Payroll Run",
                "360° Performance & OKRs",
              ].map((capability) => (
                <div
                  key={capability}
                  className="px-4 py-3 rounded-xl glass border border-border/60 text-xs font-semibold text-foreground/90 shadow-sm"
                >
                  {capability}
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      </Section>

      {/* ===================== FEATURE HIGHLIGHTS ===================== */}
      <Section>
        <AnimateIn>
          <SectionHeader
            eyebrow="Platform"
            title="Everything your HR team needs — in one place"
            subtitle="From hiring to retiring, ofc360 AI covers the full employee lifecycle with intelligent automation."
          />
        </AnimateIn>
        <div className="mt-16 grid md:grid-cols-2 gap-5">
          {modules.map((m, i) => (
            <AnimateIn key={m.title} delay={i * 0.08}>
              <div className="group glass rounded-3xl p-8 hover:shadow-elegant transition-all relative overflow-hidden h-full">
                <div className="absolute -top-20 -right-20 h-40 w-40 bg-gradient-brand opacity-[0.06] blur-3xl group-hover:opacity-20 transition-opacity" />
                <div className="h-12 w-12 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-5">
                  <m.icon className="h-5 w-5 text-brand-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{m.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{m.desc}</p>
                <Link
                  to={m.to}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
                >
                  Learn more <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </AnimateIn>
          ))}
        </div>
      </Section>

      {/* ===================== AI HUB SPOTLIGHT ===================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <Section className="relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimateIn>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-5">
                  <Brain className="h-3 w-3" /> AI Hub
                </div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                  70+ specialized AI agents,{" "}
                  <span className="text-gradient">one command center</span>.
                </h2>
                <p className="mt-5 text-muted-foreground leading-relaxed">
                  From resume screening to compliance monitoring, payroll validation to performance coaching — OFC360's AI Hub gives your HR team superhuman capabilities across every workflow.
                </p>
                <Link
                  to="/features"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
                >
                  Explore all AI agents <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.15}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiCategories.map((cat) => (
                  <div
                    key={cat.label}
                    className="glass rounded-2xl p-5 hover:shadow-elegant transition-all group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-3 group-hover:scale-105 transition-transform">
                      <cat.icon className="h-4 w-4 text-brand-foreground" />
                    </div>
                    <div className="font-semibold text-sm">{cat.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{cat.count}</div>
                  </div>
                ))}
                {/* Summary card */}
                <div className="glass rounded-2xl p-5 flex flex-col justify-center items-center text-center sm:col-span-2 lg:col-span-1">
                  <div className="font-display text-3xl font-bold text-gradient">70+</div>
                  <div className="text-xs text-muted-foreground mt-1">Total AI Agents</div>
                  <div className="text-xs text-muted-foreground">across 10 categories</div>
                </div>
              </div>
            </AnimateIn>
          </div>
        </Section>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <Section>
        <AnimateIn>
          <SectionHeader
            eyebrow="How it works"
            title="Up and running in four steps"
            subtitle="From setup to insights, OFC360 gets your HR operations running smoothly — fast."
          />
        </AnimateIn>

        <div className="mt-16 grid md:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <AnimateIn key={step.num} delay={i * 0.1}>
              <div className="relative glass rounded-2xl p-6 h-full">
                {/* Connector line on desktop */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-3 w-6 h-px bg-gradient-to-r from-border to-transparent" />
                )}
                <div className="font-display text-3xl font-bold text-gradient mb-4">{step.num}</div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </Section>

      {/* ===================== FINAL CTA ===================== */}
      <CTA
        title="Ready to transform your HR operations?"
        subtitle="Join forward-thinking organizations using OFC360 to hire smarter, manage better, and grow faster."
      />
    </SiteLayout>
  );
}

function HeroInteractiveMockup() {
  const [activeTab, setActiveTab] = useState<
    "Dashboard" | "Recruitment" | "Attendance" | "Payroll" | "Performance" | "AI Hub" | "Reports"
  >("Dashboard");

  const tabs = [
    { label: "Dashboard", icon: BarChart3 },
    { label: "Recruitment", icon: Briefcase },
    { label: "Attendance", icon: Clock },
    { label: "Payroll", icon: Banknote },
    { label: "Performance", icon: Target },
    { label: "AI Hub", icon: Brain },
    { label: "Reports", icon: FileText },
  ];

  return (
    <div className="mt-16 relative">
      <div className="absolute -inset-4 bg-gradient-brand opacity-20 blur-3xl rounded-3xl" />
      <div className="relative glass rounded-3xl p-2 shadow-elegant text-left">
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          {/* Mobile Horizontal Scrollable Tab Strip */}
          <div className="md:hidden flex items-center gap-1 overflow-x-auto p-2 border-b border-border bg-secondary/30 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.label as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors ${
                  activeTab === tab.label
                    ? "bg-gradient-brand text-brand-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-3 w-3" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-12 min-h-[400px] sm:min-h-[440px]">
            {/* Desktop Interactive Sidebar */}
            <div className="col-span-3 border-r border-border p-3 sm:p-4 hidden md:flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-4 px-2">
                <img src="/logo.png" alt="OFC360 HRMS dashboard logo" className="h-6 w-auto object-contain" width="24" height="24" />
                <span className="text-sm font-semibold">OFC360</span>
              </div>
              <div className="text-[10px] uppercase font-semibold text-muted-foreground px-2 mb-1 tracking-wider">
                Live Demo Preview
              </div>
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    activeTab === tab.label
                      ? "bg-gradient-brand text-brand-foreground shadow-glow"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Display Area */}
            <div className="col-span-12 md:col-span-9 p-4 sm:p-6 flex flex-col justify-between">
              {activeTab === "Dashboard" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Overview</div>
                      <h3 className="font-display text-lg sm:text-xl font-bold">HR Dashboard</h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-foreground font-medium">
                      Live Preview
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: "Total Employees", value: "248" },
                      { label: "Open Positions", value: "12" },
                      { label: "Attendance Rate", value: "96%" },
                      { label: "AI Tasks Today", value: "34" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-border p-3 glass">
                        <div className="text-[10px] text-muted-foreground">{s.label}</div>
                        <div className="text-lg font-bold mt-0.5">{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border p-4 glass">
                      <div className="text-xs font-medium mb-3">Hiring Pipeline</div>
                      <div className="flex items-end gap-1.5 h-16">
                        {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                          <div key={i} className="flex-1 rounded-sm bg-gradient-brand opacity-70" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border p-4 glass">
                      <div className="text-xs font-medium mb-3">Department Distribution</div>
                      <div className="flex items-end gap-1.5 h-16">
                        {[
                          { h: 80, color: "bg-chart-1" },
                          { h: 60, color: "bg-chart-2" },
                          { h: 45, color: "bg-chart-3" },
                          { h: 70, color: "bg-chart-4" },
                          { h: 35, color: "bg-chart-5" },
                        ].map((bar, i) => (
                          <div key={i} className={`flex-1 rounded-sm ${bar.color} opacity-80`} style={{ height: `${bar.h}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Recruitment" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Recruitment Module</div>
                      <h3 className="font-display text-lg sm:text-xl font-bold">AI Candidate Pipeline</h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-brand text-brand-foreground font-medium">
                      12 Active Jobs
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: "Active Jobs", value: "12" },
                      { label: "Applicants", value: "184" },
                      { label: "AI Shortlisted", value: "42" },
                      { label: "Offers Sent", value: "3" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-border p-3 glass">
                        <div className="text-[10px] text-muted-foreground">{s.label}</div>
                        <div className="text-lg font-bold mt-0.5">{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-border p-4 glass space-y-2">
                    <div className="text-xs font-medium mb-1">Top Match Candidate</div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50 text-xs">
                      <div>
                        <div className="font-semibold text-foreground">Vikramaditya Sharma</div>
                        <div className="text-muted-foreground text-[11px]">Senior Frontend Lead • 6 yrs exp</div>
                      </div>
                      <span className="px-2 py-1 rounded-md bg-gradient-brand text-brand-foreground font-bold text-[11px]">
                        98% AI Match
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Attendance" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Attendance & Roster</div>
                      <h3 className="font-display text-lg sm:text-xl font-bold">Live Check-in Status</h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                      Geo-Fencing Active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: "Present Today", value: "238" },
                      { label: "Remote Check-ins", value: "8" },
                      { label: "On Approved Leave", value: "2" },
                      { label: "On-Time Rate", value: "99.2%" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-border p-3 glass">
                        <div className="text-[10px] text-muted-foreground">{s.label}</div>
                        <div className="text-lg font-bold mt-0.5">{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-border p-4 glass">
                    <div className="text-xs font-medium mb-2">Shift Roster Summary</div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-secondary/50">
                        <div className="text-muted-foreground text-[10px]">Morning Shift</div>
                        <div className="font-bold text-foreground">140 Members</div>
                      </div>
                      <div className="p-2 rounded-lg bg-secondary/50">
                        <div className="text-muted-foreground text-[10px]">General Shift</div>
                        <div className="font-bold text-foreground">90 Members</div>
                      </div>
                      <div className="p-2 rounded-lg bg-secondary/50">
                        <div className="text-muted-foreground text-[10px]">Night Shift</div>
                        <div className="font-bold text-foreground">18 Members</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Payroll" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Payroll & Structuring</div>
                      <h3 className="font-display text-lg sm:text-xl font-bold">Salary Processing</h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                      Cycle Ready
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: "Monthly Payroll", value: "₹24.8L" },
                      { label: "TDS / Tax Ded.", value: "₹1.8L" },
                      { label: "Reimbursements", value: "₹42,000" },
                      { label: "Audit Anomalies", value: "0 Errors" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-border p-3 glass">
                        <div className="text-[10px] text-muted-foreground">{s.label}</div>
                        <div className="text-lg font-bold mt-0.5">{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-border p-4 glass">
                    <div className="text-xs font-medium mb-2">Salary Component Breakdown</div>
                    <div className="h-4 rounded-full bg-secondary overflow-hidden flex">
                      <div className="h-full bg-chart-1" style={{ width: "70%" }} title="Basic Salary (70%)" />
                      <div className="h-full bg-chart-2" style={{ width: "20%" }} title="HRA & Allowances (20%)" />
                      <div className="h-full bg-chart-3" style={{ width: "10%" }} title="Bonus (10%)" />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                      <span>Basic (70%)</span>
                      <span>HRA & Allowances (20%)</span>
                      <span>Performance Bonus (10%)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Performance" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Performance & Growth</div>
                      <h3 className="font-display text-lg sm:text-xl font-bold">OKRs & 360° Feedback</h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-brand text-brand-foreground font-medium">
                      Q3 Cycle Active
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: "Active OKRs", value: "48" },
                      { label: "Reviews Complete", value: "88%" },
                      { label: "High Performers", value: "16" },
                      { label: "AI Coach Advice", value: "Ready" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-border p-3 glass">
                        <div className="text-[10px] text-muted-foreground">{s.label}</div>
                        <div className="text-lg font-bold mt-0.5">{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-border p-4 glass">
                    <div className="text-xs font-medium mb-2">AI Performance Coach Snippet</div>
                    <div className="text-xs text-muted-foreground italic bg-secondary/40 p-3 rounded-lg border border-border/50">
                      "Engineering team exceeded Q3 velocity goals by 14%. Recommended promotion readiness assessment for 3 senior contributors."
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "AI Hub" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Autonomous AI Agents</div>
                      <h3 className="font-display text-lg sm:text-xl font-bold">OFC360 AI Hub</h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-brand text-brand-foreground font-medium">
                      70+ AI Agents
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: "Autonomous Agents", value: "70+" },
                      { label: "Tasks / Day", value: "1,420" },
                      { label: "Time Saved", value: "120 hrs/wk" },
                      { label: "Precision", value: "99.4%" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-border p-3 glass">
                        <div className="text-[10px] text-muted-foreground">{s.label}</div>
                        <div className="text-lg font-bold mt-0.5">{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl border border-border glass flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-brand shrink-0" />
                      <div>
                        <div className="font-semibold">Resume Screener AI</div>
                        <div className="text-[10px] text-muted-foreground">Rank candidates in seconds</div>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl border border-border glass flex items-center gap-2">
                      <Banknote className="h-4 w-4 text-brand shrink-0" />
                      <div>
                        <div className="font-semibold">Payroll Auditor AI</div>
                        <div className="text-[10px] text-muted-foreground">Detect tax & salary anomalies</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "Reports" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">Executive Analytics</div>
                      <h3 className="font-display text-lg sm:text-xl font-bold">Attrition & Growth Reports</h3>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                      Org Score: 94/100
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                      { label: "Org Health Score", value: "94/100" },
                      { label: "Attrition Risk", value: "2.1% (Low)" },
                      { label: "Gender Diversity", value: "48 / 52" },
                      { label: "Salary Benchmark", value: "Optimal" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-border p-3 glass">
                        <div className="text-[10px] text-muted-foreground">{s.label}</div>
                        <div className="text-lg font-bold mt-0.5">{s.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-border p-4 glass">
                    <div className="text-xs font-medium mb-2">Predictive Attrition Risk Curve</div>
                    <div className="flex items-end gap-2 h-14">
                      {[15, 12, 10, 8, 6, 5, 4, 3, 2, 2, 2, 2].map((v, i) => (
                        <div key={i} className="flex-1 rounded-sm bg-emerald-400 opacity-80" style={{ height: `${v * 6}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Action Footer for Mockup */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <div className="text-xs text-muted-foreground hidden sm:block">
                  Currently previewing: <span className="font-semibold text-foreground">{activeTab} Module</span>
                </div>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-brand text-brand-foreground text-xs font-medium shadow-glow hover:opacity-90 transition-opacity ml-auto"
                >
                  Explore {activeTab} in App <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
