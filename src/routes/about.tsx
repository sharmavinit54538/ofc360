import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import {
  Target, Eye, Users, Shield, Sparkles, Brain,
  Heart, Lightbulb, Lock, Rocket,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section, SectionHeader } from "@/components/site/Section";
import { CTA } from "@/components/site/CTA";
import { buildMeta, buildCanonical } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: buildMeta({
      title: "About OFC360 — EquinoxSphere Technologies",
      description:
        "Learn about EquinoxSphere Technologies and the team building OFC360 — the AI-powered HRMS platform for modern organizations.",
      url: "/about",
    }),
    links: buildCanonical("/about"),
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

/**
 * PLACEHOLDER — replace with real team member names, titles, and bios.
 * Do NOT go live with these placeholder entries.
 */
const teamPlaceholders = Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  name: `[Team Member ${i + 1}]`,
  role: "[Title / Designation]",
  bio: "[Brief bio — 1-2 sentences about background and expertise]",
}));

/**
 * PLACEHOLDER — replace with real milestones.
 * These are structural placeholders only.
 */
const timelinePlaceholders = [
  { year: "[Year]", title: "[Milestone Title]", desc: "[Brief description of what happened at this milestone]" },
  { year: "[Year]", title: "[Milestone Title]", desc: "[Brief description of what happened at this milestone]" },
  { year: "[Year]", title: "[Milestone Title]", desc: "[Brief description of what happened at this milestone]" },
  { year: "[Year]", title: "[Milestone Title]", desc: "[Brief description of what happened at this milestone]" },
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
              EquinoxSphere Technologies is on a mission to make HR technology intelligent, accessible, and genuinely helpful — so teams can focus on what matters most: their people.
            </p>
          </AnimateIn>
        </Section>
      </section>

      {/* ===================== MISSION & VISION ===================== */}
      <Section>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              icon: Target,
              title: "Mission",
              text: "Build an intelligent HRMS that turns complex HR workflows into effortless experiences — empowering organizations of every size to manage their people with clarity and confidence.",
            },
            {
              icon: Eye,
              title: "Vision",
              text: "A world where HR technology adapts to people, not the other way around — where AI handles the operational burden so teams can invest in culture, growth, and well-being.",
            },
          ].map((block, i) => (
            <AnimateIn key={block.title} delay={i * 0.1}>
              <div className="glass rounded-3xl p-10 h-full">
                <div className="h-12 w-12 rounded-xl bg-gradient-brand grid place-items-center shadow-glow mb-6">
                  <block.icon className="h-5 w-5 text-brand-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">{block.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{block.text}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </Section>

      {/* ===================== COMPANY STORY ===================== */}
      <Section>
        <AnimateIn>
          <SectionHeader eyebrow="Our story" title="The journey behind OFC360" />
        </AnimateIn>
        <AnimateIn delay={0.1}>
          <div className="mt-12 max-w-3xl mx-auto glass rounded-3xl p-8 sm:p-12">
            {/*
              PLACEHOLDER — insert real company story.
              Replace the paragraphs below with the actual EquinoxSphere Technologies narrative.
              Keep 2-4 paragraphs of professional, concise copy.
            */}
            <div className="space-y-5 text-muted-foreground leading-relaxed text-base sm:text-lg">
              <p className="text-xs uppercase tracking-widest text-brand font-medium">
                PLACEHOLDER — insert real company story below
              </p>
              <p>
                [Insert the founding story of EquinoxSphere Technologies here — when and where the company was started, who the founders are, and what problem they set out to solve in the HR technology space.]
              </p>
              <p>
                [Describe the early product journey — the first version of OFC360, initial customers, key learnings, and the evolution from MVP to the full-featured platform it is today.]
              </p>
              <p>
                [Close with where the company is today — team size, customer base, key achievements, and a forward-looking statement about the future vision.]
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
            subtitle="These principles shape how we build, how we hire, and how we serve our customers."
          />
        </AnimateIn>
        {/* DRAFT COPY — review and edit these values before publishing */}
        <p className="text-center text-[10px] text-muted-foreground/50 uppercase tracking-widest mt-2">
          Draft copy — review and edit before publishing
        </p>
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
            eyebrow="Team"
            title="The people behind OFC360"
            subtitle="We're a small, focused team building something we believe in."
          />
        </AnimateIn>
        {/* PLACEHOLDER — replace with real team member data */}
        <p className="text-center text-[10px] text-muted-foreground/50 uppercase tracking-widest mt-2">
          Placeholder — replace with real team members
        </p>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {teamPlaceholders.map((member, i) => (
            <AnimateIn key={member.id} delay={i * 0.06}>
              <div className="glass rounded-2xl p-6" title="PLACEHOLDER — replace with real team member">
                <div className="h-14 w-14 rounded-full bg-gradient-brand grid place-items-center text-brand-foreground font-display font-bold text-lg mb-4 opacity-50">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-muted-foreground">{member.name}</h3>
                <div className="text-sm text-brand/60 mb-2">{member.role}</div>
                <p className="text-sm text-muted-foreground/60 italic">{member.bio}</p>
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
        {/* PLACEHOLDER — replace with real milestones */}
        <p className="text-center text-[10px] text-muted-foreground/50 uppercase tracking-widest mt-2">
          Placeholder — replace with real milestones
        </p>
        <div className="mt-16 max-w-3xl mx-auto relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand/40 to-transparent" />
          {timelinePlaceholders.map((t, i) => (
            <AnimateIn key={i} delay={i * 0.1}>
              <div
                className={`relative pl-12 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-12 mb-10 ${i % 2 === 0 ? "" : "sm:[&>div:first-child]:order-2"}`}
              >
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-gradient-brand shadow-glow" />
                <div className={i % 2 === 0 ? "sm:text-right sm:pr-8" : "sm:pl-8"}>
                  <div className="text-sm text-brand/60 font-medium">{t.year}</div>
                  <h3 className="font-display text-xl font-bold mt-1 text-muted-foreground">{t.title}</h3>
                  <p className="text-muted-foreground/60 mt-1 italic">{t.desc}</p>
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
