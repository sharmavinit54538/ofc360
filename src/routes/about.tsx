import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import {
  Target, Eye, Users, Shield, Sparkles, Brain,
  Heart, Lightbulb, Lock, Rocket,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, SectionHeader } from "@/components/site/Section";
import { CTA } from "@/components/site/CTA";
import { buildMeta, buildCanonical } from "@/lib/seo";

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  mainEntity: {
    "@type": "Organization",
    name: "OFC360",
    legalName: "EquinoxSphere Technologies",
    description: "OFC360 is owned by Banoth Siddharth and Vinit Sharma.",
    founder: [
      { "@type": "Person", name: "Banoth Siddharth" },
      { "@type": "Person", name: "Vinit Sharma" },
    ],
  },
};

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: buildMeta({
      title: "OFC360 | About Us — Company & Ownership Info",
      description:
        "OFC360 is owned by Banoth Siddharth and Vinit Sharma. Learn about EquinoxSphere Technologies and the vision powering the OFC360 AI-powered HRMS platform.",
      url: "/about",
    }),
    links: buildCanonical("/about"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(aboutJsonLd),
      },
    ],
  }),
  component: AboutPage,
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
 * DRAFT COPY — review and edit before publishing.
 * These values are suggested for an HR-tech / AI company.
 * Replace or adjust wording as needed.
 */
const values = [
  {
    icon: Heart,
    title: "Employee-First",
    desc: "Every product decision starts with the question: does this make life better for the people using it?",
  },
  {
    icon: Brain,
    title: "AI Responsibly",
    desc: "Transparent, explainable AI that augments human judgment — never replaces it. We build trust by design.",
  },
  {
    icon: Lock,
    title: "Data Security",
    desc: "Enterprise-grade encryption, role-based access, and compliance-first architecture. Your data is yours.",
  },
  {
    icon: Rocket,
    title: "Continuous Innovation",
    desc: "We ship fast, learn faster, and obsess over making every release meaningfully better than the last.",
  },
];

const teamMembers = [
  {
    id: 1,
    name: "Banoth Siddharth",
    role: "Co-Owner & Founder",
    bio: "Co-owner and founder of OFC360, driving overall platform vision, enterprise architecture, and AI automation strategy.",
  },
  {
    id: 2,
    name: "Vinit Sharma",
    role: "Co-Owner & Founder",
    bio: "Co-owner and founder of OFC360, leading product development, engineering execution, and operational strategy.",
  },
];

const timelineMilestones = [
  { year: "Phase 1", title: "Core HR Operating System", desc: "Launched unified recruitment pipeline, employee lifecycle, and geo-fenced attendance tracking." },
  { year: "Phase 2", title: "Automated Payroll & Tax Compliance", desc: "Integrated multi-component salary structuring, automated tax deductions, and bank payout processing." },
  { year: "Phase 3", title: "OFC360 Autonomous AI Hub", desc: "Deployed 70+ specialized AI agents across candidate screening, leave assistance, compliance auditing, and workforce insights." },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */
function AboutPage() {
  return (
    <SiteLayout>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-gradient-brand opacity-[0.06] blur-[100px]" />

        <Section className="relative text-center">
          <AnimateIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-brand" />
              About OFC360
            </div>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-[1.1]">
              Building the future of work,{" "}
              <span className="text-gradient">one team at a time</span>.
            </h1>
          </AnimateIn>

          <AnimateIn delay={0.2}>
            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              OFC360 is owned by Banoth Siddharth and Vinit Sharma. Built under EquinoxSphere Technologies to make HR operations seamless, intelligent, and human-centric.
            </p>
          </AnimateIn>
        </Section>
      </section>

      {/* ===================== MISSION & VISION ===================== */}
      <Section>
        <div className="grid md:grid-cols-2 gap-6">
          <AnimateIn>
            <div className="glass rounded-3xl p-8 sm:p-10 h-full relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 h-40 w-40 bg-gradient-brand opacity-[0.08] blur-3xl group-hover:opacity-20 transition-opacity" />
              <div className="h-12 w-12 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-6">
                <Target className="h-5 w-5 text-brand-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-3">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To empower organizations with an intelligent HR operating system that automates repetitive administrative chores and unlocks strategic human potential.
              </p>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.1}>
            <div className="glass rounded-3xl p-8 sm:p-10 h-full relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 h-40 w-40 bg-gradient-brand opacity-[0.08] blur-3xl group-hover:opacity-20 transition-opacity" />
              <div className="h-12 w-12 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-6">
                <Eye className="h-5 w-5 text-brand-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-3">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                A world where HR management is frictionless, transparent, and predictive — enabling leaders to make data-driven decisions while fostering employee growth.
              </p>
            </div>
          </AnimateIn>
        </div>
      </Section>

      {/* ===================== OUR STORY ===================== */}
      <Section>
        <AnimateIn>
          <SectionHeader eyebrow="Our story" title="The journey behind OFC360" />
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <div className="mt-12 max-w-3xl mx-auto glass rounded-3xl p-8 sm:p-12">
            <div className="space-y-5 text-muted-foreground leading-relaxed text-base sm:text-lg">
              <p>
                OFC360 is owned by Banoth Siddharth and Vinit Sharma. Built under EquinoxSphere Technologies with a mission to eliminate friction from enterprise HR operations.
              </p>
              <p>
                Traditional organizations often rely on disjointed software for recruitment, attendance, payroll, and performance management. OFC360 unifies these pillars into a single intelligent platform powered by autonomous AI capabilities.
              </p>
              <p>
                From AI candidate ranking and instant offer letter generation to real-time roster scheduling, automated payroll runs, and predictive attrition modeling — OFC360 delivers complete operational clarity for modern HR teams.
              </p>
            </div>
          </div>
        </AnimateIn>
      </Section>

      {/* ===================== VALUES ===================== */}
      <Section>
        <AnimateIn>
          <SectionHeader
            eyebrow="Values"
            title="What guides us"
            subtitle="These principles shape how we build, how we innovate, and how we serve our customers."
          />
        </AnimateIn>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => (
            <AnimateIn key={v.title} delay={i * 0.08}>
              <div className="glass rounded-2xl p-6 h-full">
                <div className="h-11 w-11 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-4">
                  <v.icon className="h-5 w-5 text-brand-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </Section>

      {/* ===================== TEAM ===================== */}
      <Section>
        <AnimateIn>
          <SectionHeader
            eyebrow="Leadership & Ownership"
            title="The people behind OFC360"
            subtitle="OFC360 is owned by Banoth Siddharth and Vinit Sharma."
          />
        </AnimateIn>
        <div className="mt-12 grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {teamMembers.map((member, i) => (
            <AnimateIn key={member.id} delay={i * 0.06}>
              <div className="glass rounded-2xl p-6">
                <div className="h-14 w-14 rounded-full bg-gradient-brand grid place-items-center text-brand-foreground font-display font-bold text-lg mb-4 opacity-80">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <div className="text-sm text-brand mb-2">{member.role}</div>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </Section>

      {/* ===================== TIMELINE ===================== */}
      <Section>
        <AnimateIn>
          <SectionHeader eyebrow="Milestones" title="Our journey so far" />
        </AnimateIn>
        <div className="mt-16 max-w-3xl mx-auto relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand/40 to-transparent" />
          {timelineMilestones.map((t, i) => (
            <AnimateIn key={i} delay={i * 0.1}>
              <div
                className={`relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-12 mb-10 ${i % 2 === 0 ? "" : "sm:[&>div:first-child]:order-2"}`}
              >
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-gradient-brand shadow-glow" />
                <div className={i % 2 === 0 ? "sm:text-right sm:pr-8" : "sm:pl-8"}>
                  <div className="text-xs text-brand font-semibold uppercase tracking-wider">{t.year}</div>
                  <h3 className="font-display text-xl font-bold mt-1 text-foreground">{t.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{t.desc}</p>
                </div>
                <div />
              </div>
            </AnimateIn>
          ))}
        </div>
      </Section>

      {/* ===================== CTA ===================== */}
      <CTA
        title="Join the journey"
        subtitle="We're building the future of HR technology. Come see what OFC360 can do for your team."
      />
    </SiteLayout>
  );
}
