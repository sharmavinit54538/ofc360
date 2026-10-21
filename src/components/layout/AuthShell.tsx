import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText?: string;
  footerLinkText?: string;
  footerLinkTo?: string;
}

export const AuthShell: React.FC<AuthShellProps> = ({
  children,
  title,
  subtitle,
  footerText = 'New to OFC360?',
  footerLinkText = 'Create a workspace',
  footerLinkTo = '/auth/register',
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-white text-slate-900 p-6 sm:p-8 relative">
      {/* Top Left Header with Purple Sparkle Badge & OFC360 Logo */}
      <header className="w-full flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-sm shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 font-sans">
            OFC360
          </span>
        </Link>
      </header>

      {/* Centered Authentication Card */}
      <main className="w-full flex flex-col items-center justify-center my-auto py-8">
        <div className="w-full max-w-[440px] rounded-[28px] border border-slate-900/90 bg-white p-8 sm:p-10 shadow-sm transition-all">
          {/* Card Header */}
          <div className="space-y-1 mb-8">
            <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-sm text-slate-500">
              {subtitle}
            </p>
          </div>

          {/* Form Body */}
          <div>{children}</div>
        </div>

        {/* Footer Link below card */}
        {footerText && footerLinkText && footerLinkTo && (
          <div className="mt-8 text-center text-sm text-slate-600">
            <span>{footerText} </span>
            <Link
              to={footerLinkTo}
              className="font-bold text-slate-900 hover:text-indigo-600 transition-colors inline-block"
            >
              {footerLinkText}
            </Link>
          </div>
        )}
      </main>

      {/* Subtle bottom footer spacer */}
      <footer className="w-full text-center text-xs text-slate-400 py-2">
        <span>&copy; {new Date().getFullYear()} OFC360 &bull; Enterprise HRMS & RBAC Suite</span>
      </footer>
    </div>
  );
};
