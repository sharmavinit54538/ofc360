import React from 'react';
import { Sparkles, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/shared/context/ThemeContext';

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText?: string;
  footerLinkText?: string;
  footerLinkTo?: string;
  cardMaxWidth?: string;
}

export const AuthShell: React.FC<AuthShellProps> = ({
  children,
  title,
  subtitle,
  footerText = 'New to OFC360?',
  footerLinkText = 'Create a workspace',
  footerLinkTo = '/auth/register',
  cardMaxWidth = 'max-w-[440px]',
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen sm:h-screen w-full flex flex-col justify-between bg-white dark:bg-[#212121] text-gray-900 dark:text-[#ececec] px-4 py-3 sm:px-8 sm:py-4 relative overflow-y-auto transition-colors duration-200">
      {/* Top Header with Logo and Theme Toggle */}
      <header className="w-full flex items-center justify-between shrink-0">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-sm shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-[#ececec] font-sans">
            OFC360
          </span>
        </Link>
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Centered Authentication Card */}
      <main className="w-full flex flex-col items-center justify-center my-auto py-2 sm:py-3 shrink-0">
        <div className={`w-full ${cardMaxWidth} rounded-[24px] border border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-5 sm:p-7 shadow-sm transition-all`}>
          {/* Card Header */}
          <div className="space-y-0.5 mb-4 sm:mb-5">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-[#ececec] tracking-tight leading-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">
              {subtitle}
            </p>
          </div>

          {/* Form Body */}
          <div>{children}</div>
        </div>

        {/* Footer Link below card */}
        {footerText && footerLinkText && footerLinkTo && (
          <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-600 dark:text-zinc-400">
            <span>{footerText} </span>
            <Link
              to={footerLinkTo}
              className="font-bold text-gray-900 dark:text-[#ececec] hover:text-indigo-600 transition-colors inline-block"
            >
              {footerLinkText}
            </Link>
          </div>
        )}
      </main>

      {/* Subtle bottom footer */}
      <footer className="w-full text-center text-[11px] sm:text-xs text-gray-500 dark:text-zinc-500 py-1 shrink-0">
        <span>&copy; {new Date().getFullYear()} OFC360 &bull; Enterprise HRMS & RBAC Suite</span>
      </footer>
    </div>
  );
};
