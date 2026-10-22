import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useToast } from '@/shared/ui/Toast';
import { Badge } from '@/shared/ui/Badge';
import { useTheme } from '@/shared/context/ThemeContext';

interface DashboardShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  sidebar?: React.ReactNode;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  children,
  title,
  subtitle,
  sidebar,
  sidebarCollapsed: _sidebarCollapsed = false,
  onSidebarToggle: _onSidebarToggle,
}) => {
  const { user, activeRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = (name?: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    toast.success('You have been securely signed out', 'Session Terminated');
    navigate('/auth/login');
    setProfileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#212121] text-gray-900 dark:text-[#ececec] flex transition-colors duration-200">
      {/* Sidebar: Rendered full-height on the left when provided */}
      {sidebar && (
        <div className="z-30 transition-all duration-300 ease-in-out shrink-0">
          {sidebar}
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar - Clean & Minimal */}
        <header className="h-16 border-b border-gray-200 dark:border-zinc-800 bg-white/95 dark:bg-[#171717]/95 backdrop-blur sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 gap-4">
          {/* Left: Brand logo only when page has no sidebar */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {!sidebar && (
              <Link to="/" className="flex items-center flex-shrink-0" title="OFC360 Home">
                <img src="/logo.png" alt="OFC360" className="h-8 w-auto object-contain hover:opacity-90 transition-opacity" />
              </Link>
            )}
          </div>

          {/* CENTER-RIGHT: Search, Notifications, User Profile */}
          <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end min-w-0">
            {/* Search */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-[#2f2f2f] border border-gray-200 dark:border-zinc-800 text-xs text-gray-600 dark:text-zinc-400 w-56 md:w-64 flex-shrink-0">
              <Search className="w-3.5 h-3.5 text-gray-600 dark:text-zinc-400" />
              <span className="truncate">Search...</span>
            </div>

            {/* Notifications */}
            <button
              type="button"
              className="p-2 rounded-xl text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-[#ececec] hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition-colors relative flex-shrink-0"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative flex-shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-900/90 dark:bg-neutral-900/90 border border-neutral-800 dark:border-neutral-700 hover:bg-neutral-800 dark:hover:bg-neutral-800 transition-all duration-200"
                aria-expanded={profileMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center font-bold text-sm text-indigo-300">
                  {getInitials(user?.fullName)}
                </div>
                <span className="hidden sm:block text-sm font-medium text-white dark:text-white">
                  {user?.fullName || 'User'}
                </span>
                <ChevronDown className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95">
                  {/* User Info Header */}
                  <div className="px-4 py-4 border-b border-neutral-800">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center font-bold text-lg text-indigo-300">
                        {getInitials(user?.fullName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user?.fullName || 'Authenticated User'}</p>
                        <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="brand" size="sm" className="flex items-center gap-1.5">
                        <Shield className="w-3 h-3" />
                        {activeRole}
                      </Badge>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-400 hover:bg-neutral-900/50 hover:text-white transition-colors rounded-lg mx-2"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <hr className="my-2 border-neutral-800" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors rounded-lg mx-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 dark:bg-[#212121]">
          {/* Page Header - Only render when title is provided */}
          {title && (
            <div className="h-16 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-[#171717]/80 backdrop-blur sticky top-16 z-30 px-6 flex items-center">
              <div className="max-w-7xl mx-auto w-full">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-[#ececec]">{title}</h1>
                {subtitle && <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400 mt-1">{subtitle}</p>}
              </div>
            </div>
          )}

          {/* Content Body */}
          <div className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export const getInitials = (name?: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};