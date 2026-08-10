import { Link } from "@tanstack/react-router";
import { Twitter, Github, Linkedin, Instagram } from "lucide-react";

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/ofc360ai/", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/ofc360/?viewAsMember=true", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com", label: "Twitter" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
];

const cols = [
  {
    title: "Product",
    links: [
      { to: "/features", label: "Features" },
      { to: "/pricing", label: "Pricing" },
      { to: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/blog", label: "Blog" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms & Conditions" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="relative border-t border-border mt-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="OFC360 logo" className="h-8 w-auto object-contain" />
              <span className="font-display text-xl font-bold">OFC360</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              AI-powered HRMS platform for modern organizations. Built by EquinoxSphere Technologies.
            </p>
            <div className="flex gap-2 mt-6">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="h-9 w-9 grid place-items-center rounded-lg border border-border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EquinoxSphere Technologies. All rights reserved.</p>
          <p>Crafted with precision.</p>
        </div>
      </div>
    </footer>
  );
}
